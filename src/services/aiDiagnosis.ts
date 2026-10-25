/**
 * AI Smart Diagnosis Service for Khodam Platform
 * Handles image compression, speech-to-text fallback, and communications with /api/diagnose
 */

export interface AIDiagnosisResponse {
  problem_title: string;
  profession: string;
  alternative_professions: string[];
  urgency: 'عاجل' | 'عادي' | 'يمكن تأجيله';
  possible_causes: string[];
  quick_tips: string[];
  estimated_price_dzd: {
    min: number;
    max: number;
  };
  safety_warning: string;
  needs_more_info: boolean;
  follow_up_question: string;
}

/**
 * Compress an image file to < 1MB using HTML5 Canvas
 */
export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('الملف المختار ليس صورة صالحة.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة ملف الصورة.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('تعذر تحميل الصورة للمعالجة.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('تعذر إنشاء سياق رسم الصورة.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with specified compression quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = compressedDataUrl.split(',')[1];

        resolve({
          base64: base64Data,
          mimeType: 'image/jpeg'
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Intelligent Local Algerian Heuristic Fallback
 * Used when server/network is offline or unavailable
 */
export function getLocalHeuristicDiagnosis(
  description: string
): AIDiagnosisResponse {
  const text = (description || '').toLowerCase();

  // 1. Plumbing / الترصيص الصحي والسباكة
  if (
    text.includes('ماء') || text.includes('تسرب') || text.includes('يسيل') ||
    text.includes('حنفي') || text.includes('سخان') || text.includes('بلوعة') ||
    text.includes('سيفون') || text.includes('حوض') || text.includes('أنبوب') ||
    text.includes('الما') || text.includes('روبيني') || text.includes('مرحاض')
  ) {
    return {
      problem_title: 'تسرب مياه أو خلل في شبكة السباكة',
      profession: 'سبّاك',
      alternative_professions: ['فني تكييف'],
      urgency: 'عاجل',
      possible_causes: [
        'تآكل أو تشقق في جوان أو حلقات الإحكام',
        'تلف في صمام الحنفية أو خلاط المياه',
        'ضغط مياه مرتفع أدى لانفلات الربط'
      ],
      quick_tips: [
        'أغلق محبس الماء الرئيسي للمنزل فوراً لوقف التدفق.',
        'أبعد أي أجهزة أو أسلاك كهربائية قريبة من مجرى الماء.',
        'جفف المكان لمنع الانزلاق وتضرر الجدران.'
      ],
      estimated_price_dzd: { min: 1500, max: 3500 },
      safety_warning: text.includes('كهرب') ? 'تحذير: لا تلمس الماء إذا كان ملامساً لأسلاك أو مآخذ كهربائية!' : '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 2. Electrical / الكهرباء
  if (
    text.includes('كهرب') || text.includes('ضو') || text.includes('ضوء') ||
    text.includes('قاطع') || text.includes('ديجونكتور') || text.includes('شرار') ||
    text.includes('مأخذ') || text.includes('بريز') || text.includes('شورت') ||
    text.includes('سلك') || text.includes('طاحت') || text.includes('انقطاع')
  ) {
    return {
      problem_title: 'عطل في الشبكة الكهربائية أو القواطع',
      profession: 'كهربائي',
      alternative_professions: ['فني تكييف'],
      urgency: 'عاجل',
      possible_causes: [
        'ماس كهربائي (Court-circuit) ناتج عن تلامس أسلاك',
        'حمولة زائدة على القاطع الرئيسي بسبب تشغيل أجهزة متعددة',
        'تلف في المأخذ الكهربائي أو لوحة التوزيع'
      ],
      quick_tips: [
        'افصل القاطع الرئيسي فوراً وتجنب لمس الأسلاك العارية.',
        'افصل جميع الأجهزة الكهرومنزيلية ذات الاستهلاك العالي.',
        'لا تحاول إعادة تشغيل القاطع بالقوة إذا ارتد تلقائياً.'
      ],
      estimated_price_dzd: { min: 1800, max: 4000 },
      safety_warning: 'خطر صعق كهربائي أو اشتعال! تجنب تماماً لمس الأسلاك بالأيدي أو في وجود رطوبة.',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 3. AC & Refrigeration / فني تكييف وتبريد
  if (
    text.includes('مكيف') || text.includes('كليماتيزور') || text.includes('تبريد') ||
    text.includes('فريون') || text.includes('غاز') || text.includes('يبرد') ||
    text.includes('ما يبردش') || text.includes('ثلج')
  ) {
    return {
      problem_title: 'ضعف التبريد أو تسرب غاز في المكيف',
      profession: 'فني تكييف',
      alternative_professions: ['كهربائي'],
      urgency: 'عادي',
      possible_causes: [
        'نقص شحنة غاز الفريون بسبب تسرب طفيف في الأنابيب',
        'انسداد فلاتر الهواء بالأتربة والغبار',
        'عطل في مروحة الوحدة الخارجية أو مكثف التشغيل (Capacitor)'
      ],
      quick_tips: [
        'نظف الفلاتر الداخلية بلطف واتركها تجف تماماً.',
        'تأكد من عدم وجود عوائق أمام مروحة الوحدة الخارجية.',
        'أوقف تشغيل المكيف إذا لاحظت تجمداً كثيفاً على الأنابيب النحاسية.'
      ],
      estimated_price_dzd: { min: 2500, max: 5000 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 4. Carpentry / نجارة وأبواب
  if (
    text.includes('باب') || text.includes('خشب') || text.includes('قفل') ||
    text.includes('مفتاح') || text.includes('مفصل') || text.includes('مبلوكي') ||
    text.includes('خزانة') || text.includes('مطبخ') || text.includes('طاولة')
  ) {
    return {
      problem_title: 'صعوبة غلق الباب أو عطل في المفصلات والأقفال',
      profession: 'نجّار',
      alternative_professions: ['فني ألمنيوم', 'حدّاد'],
      urgency: 'عادي',
      possible_causes: [
        'ارتخاء أو تآكل في مسامير المفصلات',
        'تأثر الخشب بالرطوبة أو الحرارة مما أدى لتمدده',
        'خلل في قلب القفل (السلندر) أو لسان القفل'
      ],
      quick_tips: [
        'رش كمية قليلة من مادة ملينة (WD-40) في فتحة المفتاح.',
        'تجنب الشد العنيف على المفتاح حتى لا ينكسر داخل الباب.',
        'ارفع الباب قليلاً أثناء محاولة الإغلاق لمعاينة موضع الاحتكاك.'
      ],
      estimated_price_dzd: { min: 1500, max: 3000 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 5. Painting / الدهان والطلاء
  if (
    text.includes('دهان') || text.includes('طلاء') || text.includes('صباغ') ||
    text.includes('تقشر') || text.includes('رطوبة') || text.includes('جدار') ||
    text.includes('حائط') || text.includes('جبس') || text.includes('ba13')
  ) {
    return {
      problem_title: 'تقشر طلاء الجدران أو آثار رطوبة',
      profession: 'دهّان',
      alternative_professions: ['بنّاء', 'سبّاك'],
      urgency: 'يمكن تأجيله',
      possible_causes: [
        'رطوبة متسربة من الجدران أو تسرب ماء قديم',
        'تطبيق طلاء قديم بدون طبقة أساس (Sous-couche)',
        'تصدعات دقيقة في طبقة المعجون'
      ],
      quick_tips: [
        'احرص على تهوية الغرفة جيداً لتجفيف الجدار.',
        'تأكد أولاً من عدم وجود تسرب ماء خلف الحائط قبل إعادة الطلاء.'
      ],
      estimated_price_dzd: { min: 2000, max: 6000 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 6. Tiling / التبليط والكارلاج
  if (
    text.includes('كارلاج') || text.includes('سيراميك') || text.includes('بلاط') ||
    text.includes('فايونس') || text.includes('طار') || text.includes('مكسور')
  ) {
    return {
      problem_title: 'تفكك أو كسر في بلاط الأرضية أو الجدران',
      profession: 'تبليط',
      alternative_professions: ['بنّاء'],
      urgency: 'يمكن تأجيله',
      possible_causes: [
        'فراغات هوائية تحت البلاط أثناء التركيب',
        'تمدد السيراميك بفعل تقلب درجات الحرارة وغياب فواصل التمدد',
        'رطوبة تحت الأرضية أضعفت مادة الإسمنت واللاصق'
      ],
      quick_tips: [
        'ضع علامة على البلاط المفكك لتجنب الضغط المباشر عليه.',
        'احتفظ بقطع البلاط السليمة لإعادة تثبيتها وتوفير تكلفة الشراء.'
      ],
      estimated_price_dzd: { min: 2500, max: 5500 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 7. Cooking & Home Sweets / طبخ وحلويات منزلية
  if (
    text.includes('طبخ') || text.includes('طباخة') || text.includes('وليمة') ||
    text.includes('عرس') || text.includes('حلويات') || text.includes('كسكسي') ||
    text.includes('رشتة') || text.includes('شخشوخة') || text.includes('بقلاوة') ||
    text.includes('تارت') || text.includes('مقروط')
  ) {
    return {
      problem_title: 'طلب إعداد ولائم وأطباق وحلويات منزلية',
      profession: 'طباخة وحلويات منزلية',
      alternative_professions: ['خياطة وتفصيل أزياء', 'تجميل وحلاقة نسائية ونقش حناء'],
      urgency: 'عادي',
      possible_causes: [
        'تحضير لمناسبة عائلية أو عرس أو عزومة ضيوف',
        'الحاجة لأطباق تقليدية متقنة بكميات مخصصة'
      ],
      quick_tips: [
        'حدّد عدد الضيوف ونوع الأطباق أو صواني الحلويات المطلوبة بدقة.',
        'احجز موعد الطباخة قبل المناسبة بأيام كافية لتأمين المكونات الطازجة.'
      ],
      estimated_price_dzd: { min: 3000, max: 15000 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 8. Home Nursing & Healthcare / تمريض ورعاية صحية منزلية
  if (
    text.includes('تمريض') || text.includes('ممرضة') || text.includes('شوكة') ||
    text.includes('حقنة') || text.includes('سيروم') || text.includes('تضميد') ||
    text.includes('ضماد') || text.includes('قرحة') || text.includes('كبار السن') ||
    text.includes('ضغط') || text.includes('سكر') || text.includes('مريض')
  ) {
    return {
      problem_title: 'طلب رعاية صحية وتمريض منزلي',
      profession: 'تمريض ورعاية صحية منزلية',
      alternative_professions: ['رعاية أطفال ومربيات (Nounou)'],
      urgency: text.includes('عاجل') || text.includes('نزيف') ? 'عاجل' : 'عادي',
      possible_causes: [
        'حاجة إلى حقنة علاجية دورية أو محلول وريدي (سيروم)',
        'تغيير وتطهير ضماد جراحي أو متابعة حالة مريض بالمنزل'
      ],
      quick_tips: [
        'تأكد من توفير الوصفة الطبية (Ordonnance) والدواء المطلوب من الصيدلية مسبقاً.',
        'احرص على تهوية غرفة المريض وتجهيز مكان نظيف ومعقم.'
      ],
      estimated_price_dzd: { min: 1500, max: 4000 },
      safety_warning: text.includes('ضيق تنفس') ? 'إذا كان المريض يعاني من صعوبة حادة في التنفس يرجى الاتصال بالإسعاف والحماية المدنية 14 فوراً.' : '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 9. Gaming Recharge / شحن ألعاب وبطاقات رقمية
  if (
    text.includes('شحن') || text.includes('فري فاير') || text.includes('free fire') ||
    text.includes('ببجي') || text.includes('pubg') || text.includes('شدات') ||
    text.includes('جواهر') || text.includes('روبلوكس') || text.includes('بلايستيشن') ||
    text.includes('psn') || text.includes('steam') || text.includes('ألعاب')
  ) {
    return {
      problem_title: 'شحن ألعاب إلكترونية وبطاقات رقمية فوري',
      profession: 'شحن ألعاب وبطاقات رقمية',
      alternative_professions: ['أرصدة إلكترونية وفليكسي', 'اشتراكات قنوات وIPTV'],
      urgency: 'عادي',
      possible_causes: [
        'تفعيل رويال باس أو شحن جواهر فري فاير أو سكنات الألعاب',
        'شراء بطاقة متجر PlayStation أو Steam أو Robux'
      ],
      quick_tips: [
        'تأكد من كتابة معرف اللاعب (ID) بدقة لتفادي أي خطأ في الإرسال.',
        'احتفظ بوصل التحويل عبر BaridiMob أو CCP لتسريع عملية التأكيد.'
      ],
      estimated_price_dzd: { min: 250, max: 4500 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 10. Channels & IPTV / اشتراكات قنوات وIPTV
  if (
    text.includes('iptv') || text.includes('قنوات') || text.includes('بين سبورت') ||
    text.includes('bein') || text.includes('شاهد') || text.includes('نتفليكس') ||
    text.includes('netflix') || text.includes('tod') || text.includes('سيرفر') ||
    text.includes('ماتش') || text.includes('كود تفعيل')
  ) {
    return {
      problem_title: 'اشتراك قنوات تلفزيونية وسيرفرات IPTV وبث',
      profession: 'اشتراكات قنوات وIPTV',
      alternative_professions: ['شحن ألعاب وبطاقات رقمية'],
      urgency: 'عادي',
      possible_causes: [
        'تفعيل سيرفر IPTV لمتابعة مباريات كرة القدم والقنوات المشفرة',
        'تجديد اشتراك منصات البث والأفلام بجودة 4K'
      ],
      quick_tips: [
        'تأكد من استقرار سرعة الإنترنت لديك (4Mbps على الأقل للبث عالي الدقة).',
        'اطلب كود تجريبي (Test) للتأكد من توافق السيرفر مع جهاز التلفاز الخاص بك.'
      ],
      estimated_price_dzd: { min: 1500, max: 4500 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // 11. Electronic Balances & Flexy / أرصدة إلكترونية وفليكسي
  if (
    text.includes('فليكسي') || text.includes('جازي') || text.includes('djezzy') ||
    text.includes('موبيليس') || text.includes('mobilis') || text.includes('أوريدو') ||
    text.includes('ooredoo') || text.includes('بريدي موب') || text.includes('baridimob') ||
    text.includes('بايسيرا') || text.includes('paysera') || text.includes('وايز') ||
    text.includes('رصيد')
  ) {
    return {
      problem_title: 'شحن رصيد الهاتف فليكسي أو تحويلات إلكترونية',
      profession: 'أرصدة إلكترونية وفليكسي',
      alternative_professions: ['شحن ألعاب وبطاقات رقمية'],
      urgency: 'عادي',
      possible_causes: [
        'تعبئة رصيد المكالمات والإنترنت وتفعيل الباقات الشهرية',
        'تحويل رصيد مالي عبر BaridiMob أو شحن بطاقة فيزا إلكترونية'
      ],
      quick_tips: [
        'راجع رقم الهاتف أو رقم الحساب RIP جيداً قبل تأكيد التحويل.',
        'الدفع فوري ومحمي بضمان منصة خدام.'
      ],
      estimated_price_dzd: { min: 500, max: 2000 },
      safety_warning: '',
      needs_more_info: false,
      follow_up_question: ''
    };
  }

  // Generic domestic fallback
  return {
    problem_title: 'عطل منزلي يحتاج لمعاينة فنية متخصصة',
    profession: 'سبّاك',
    alternative_professions: ['كهربائي', 'نجّار'],
    urgency: 'عادي',
    possible_causes: [
      'استهلاك طبيعي لمكونات التركيب',
      'حاجة إلى فحص يدوي بأدوات فنية دقيقة'
    ],
    quick_tips: [
      'دوّن تفاصيل المشكلة ووقت حدوثها لشرحها للحرفي بدقة.',
      'التقط صورة واضحة ومقربة لتسهيل المعاينة عن بعد.'
    ],
    estimated_price_dzd: { min: 1500, max: 3500 },
    safety_warning: '',
    needs_more_info: text.trim().length < 8,
    follow_up_question: 'هل يمكنك توضيح مكان المشكلة بالتحديد (حمام، مطبخ، غرفة) وما الذي تشاهده؟'
  };
}

/**
 * Call server-side /api/diagnose with timeout and fallback
 */
export async function requestAIDiagnosis(params: {
  description: string;
  image?: string;
  mimeType?: string;
}): Promise<AIDiagnosisResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second strict timeout

  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: params.description?.trim() || '',
        image: params.image || undefined,
        mimeType: params.mimeType || 'image/jpeg'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `خطأ في الخادم (${res.status})`);
    }

    const data: AIDiagnosisResponse = await res.json();
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If abort / timeout
    if (err.name === 'AbortError') {
      console.warn('Diagnosis API timed out after 15s, falling back to semantic heuristic:');
      const heuristic = getLocalHeuristicDiagnosis(params.description);
      return heuristic;
    }

    console.warn('Diagnosis request error, attempting heuristic fallback:', err);
    // If server responded with error (e.g. 503 missing API key or 500), return local heuristic
    const heuristic = getLocalHeuristicDiagnosis(params.description);
    return heuristic;
  }
}
