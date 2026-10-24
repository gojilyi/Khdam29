import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with 10MB limit for image payloads
  app.use(express.json({ limit: '10mb' }));

  // In-Memory Rate Limiting: 10 requests / minute per client
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000;
  const MAX_REQUESTS = 10;

  app.use('/api/', (req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress) || 'client_ip';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return next();
    }

    if (entry.count >= MAX_REQUESTS) {
      return res.status(429).json({
        error: 'لقد تجاوزت الحد المسموح للتشخيص (10 محاولات في الدقيقة). يرجى الانتظار قليلاً.'
      });
    }

    entry.count += 1;
    next();
  });

  // Schema for structured Gemini AI Diagnostic output
  const diagnosisResponseSchema = {
    type: Type.OBJECT,
    properties: {
      problem_title: {
        type: Type.STRING,
        description: 'عنوان قصير ومباشر للمشكلة بالعربية'
      },
      profession: {
        type: Type.STRING,
        description: 'إحدى الحرف الرسمية: سبّاك | كهربائي | نجّار | دهّان | فني تكييف | بنّاء | حدّاد | ميكانيكي | تبليط | فني ألمنيوم'
      },
      alternative_professions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'حرف بديلة أو تخصصات قد يحتاجها العمل'
      },
      urgency: {
        type: Type.STRING,
        description: 'درجة الاستعجال: عاجل | عادي | يمكن تأجيله'
      },
      possible_causes: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'الأسباب المحتملة للعطل أو المشكلة'
      },
      quick_tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'نصائح وقائية آمنة يمكن للزبون تنفيذها قبل وصول الحرفي'
      },
      estimated_price_dzd: {
        type: Type.OBJECT,
        properties: {
          min: { type: Type.INTEGER, description: 'الحد الأدنى للسعر التقديري بالدينار الجزائري' },
          max: { type: Type.INTEGER, description: 'الحد الأقصى للسعر التقديري بالدينار الجزائري' }
        },
        required: ['min', 'max']
      },
      safety_warning: {
        type: Type.STRING,
        description: 'تحذير أمني إن وُجد خطر (غاز، كهرباء، حريق، انهيار) وإلا نص فارغ'
      },
      needs_more_info: {
        type: Type.BOOLEAN,
        description: 'صحيح إذا كان الوصف غامضاً أو غير كافٍ لتحديد المشكلة بدقة'
      },
      follow_up_question: {
        type: Type.STRING,
        description: 'سؤال توضيحي واحد ومباشر إذا كان الوصف غير كافٍ'
      }
    },
    required: [
      'problem_title',
      'profession',
      'urgency',
      'possible_causes',
      'quick_tips',
      'estimated_price_dzd',
      'safety_warning',
      'needs_more_info'
    ]
  };

  const systemInstruction = `أنت مساعد تشخيص ذكي لمنصة "خدام" في الجزائر، المنصة التي تربط الزبائن بالحرفيين والمهنيين المعتمدين.
مهمتك:
1. تحليل وصف المشكلة المنزلية أو الحرفية (وصورتها إن وُجدت) بدقة.
2. فهم اللهجة والدارجة الجزائرية بعمق (مثل: "الما يسيل"، "الضو راح"، "الكليماتيزور ما يبردش"، "الباب مبلوكي"، "القصعة تسيل"، "روبيني مكسر"، "الكارلاج طار")، بالإضافة للعربية الفصحى والفرنسية الممزوجة.
3. تحديد الحرفة الأنسب حصراً من بين القيم الرسمية التالية:
   - سبّاك
   - كهربائي
   - نجّار
   - دهّان
   - فني تكييف
   - بنّاء
   - حدّاد
   - ميكانيكي
   - تبليط
   - فني ألمنيوم
4. إذا كان الوصف غامضاً جداً أو مجرد كلمات عشوائية، اجعل needs_more_info: true، وضع سؤالاً توضيحياً واحداً ومباشراً في follow_up_question.
5. إذا كان الطلب خارج نطاق الحرف المنزلية والصيانة، أوضح بلطف في problem_title و possible_causes أن خدمة خدام مخصصة للأعمال المنزلية والحرفية.
6. إذا وُجد خطر داهم (تسرب غاز، تماس كهربائي، ماء قريب من الكهرباء، شرخ خطير)، ضع تحذيراً حاسماً في safety_warning (مثلاً: "خطر حريق أو صعق! افصل القاطع الرئيسي فوراً"). وإن لم يوجد خطر فاجعله نصاً فارغاً "".
7. قدّر الأسعار بالدينار الجزائري (دج) بما يتوافق مع السوق الجزائري الحقيقي.
أجب حصراً بـ JSON مطابق للمخطط المحدد.`;

  // Proxy endpoint: POST /api/diagnose
  app.post('/api/diagnose', async (req, res) => {
    try {
      const { description, image, mimeType } = req.body;

      if (!description && !image) {
        return res.status(400).json({ error: 'يرجى تقديم وصف للمشكلة أو صورة لها.' });
      }

      if (description && typeof description === 'string' && description.length > 600) {
        return res.status(400).json({ error: 'الوصف طويل جداً (الحد الأقصى 500 حرف).' });
      }

      // Check image payload size
      if (image && typeof image === 'string') {
        const rawBase64 = image.includes('base64,') ? image.split('base64,')[1] : image;
        const approximateByteSize = (rawBase64.length * 3) / 4;
        if (approximateByteSize > 2 * 1024 * 1024) {
          return res.status(400).json({ error: 'حجم الصورة يتجاوز الحد المسموح (2 ميغابايت).' });
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY environment variable is not set on the server.');
        return res.status(503).json({ 
          error: 'خدمة التشخيص بالذكاء الاصطناعي غير مفعلة حالياً (مفتاح API غير متوفر).' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const parts: any[] = [];

      // Multimodal: Image + Text
      if (image && typeof image === 'string') {
        const cleanData = image.includes('base64,') ? image.split('base64,')[1] : image;
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanData
          }
        });
      }

      const promptText = description
        ? `تحليل مشكلة الزبون: "${description.trim()}"`
        : 'فحص صورة العطل وتحديد المشكلة والحرفي المناسب.';

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: diagnosisResponseSchema,
          temperature: 0.2
        }
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: 'لم يتم استلام رد من نموذج الذكاء الاصطناعي.' });
      }

      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Diagnosis API error:', err);
      return res.status(500).json({ 
        error: err?.message || 'حدث خطأ أثناء تحليل المشكلة، يرجى المحاولة لاحقاً.' 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khodam Applet running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
