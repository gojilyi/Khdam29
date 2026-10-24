/**
 * Comprehensive Algerian Data for Khodam Platform
 * All 58 Wilayas, authentic trades, Algerian phone validator, and price formatters.
 */

export interface Wilaya {
  code: string;
  name: string;
  nameLatin: string;
  communes: string[];
}

export const ALGERIA_WILAYAS: Wilaya[] = [
  { code: '01', name: 'أدرار', nameLatin: 'Adrar', communes: ['أدرار', 'تمنطيط', 'رقان', 'فنوغيل'] },
  { code: '02', name: 'الشلف', nameLatin: 'Chlef', communes: ['الشلف', 'تنس', 'أولاد فارس', 'الشطية'] },
  { code: '03', name: 'الأغواط', nameLatin: 'Laghouat', communes: ['الأغواط', 'أفلو', 'قصر الحيران'] },
  { code: '04', name: 'أم البواقي', nameLatin: 'Oum El Bouaghi', communes: ['أم البواقي', 'عين البيضاء', 'عين مليلة'] },
  { code: '05', name: 'باتنة', nameLatin: 'Batna', communes: ['باتنة', 'بريكة', 'عين التوتة', 'مروانة'] },
  { code: '06', name: 'بجاية', nameLatin: 'Béjaïa', communes: ['بجاية', 'أقبو', 'أميزور', 'سيدي عيش'] },
  { code: '07', name: 'بسكرة', nameLatin: 'Biskra', communes: ['بسكرة', 'طولقة', 'سيدي عقبة', 'الزيبان'] },
  { code: '08', name: 'بشار', nameLatin: 'Béchar', communes: ['بشار', 'القنادسة', 'بني ونيف'] },
  { code: '09', name: 'البليدة', nameLatin: 'Blida', communes: ['البليدة', 'بوفاريك', 'أولاد يعيش', 'العفرون', 'موزاية'] },
  { code: '10', name: 'البويرة', nameLatin: 'Bouira', communes: ['البويرة', 'الأخضرية', 'سور الغزلان', 'عين بسام'] },
  { code: '11', name: 'تمنراست', nameLatin: 'Tamanrasset', communes: ['تمنراست', 'عين أمقل', 'إدلس'] },
  { code: '12', name: 'تبسة', nameLatin: 'Tébessa', communes: ['تبسة', 'بئر العاتر', 'الشريعة', 'الونزة'] },
  { code: '13', name: 'تلمسان', nameLatin: 'Tlemcen', communes: ['تلمسان', 'مغنية', 'المنصورة', 'شتوان', 'سبدو'] },
  { code: '14', name: 'تيارت', nameLatin: 'Tiaret', communes: ['تيارت', 'السوقر', 'فرندة', 'قصر الشلالة'] },
  { code: '15', name: 'تيزي وزو', nameLatin: 'Tizi Ouzou', communes: ['تيزي وزو', 'ذراع بن خدة', 'عزازقة', 'تيزي راشد'] },
  { 
    code: '16', 
    name: 'الجزائر العاصمة', 
    nameLatin: 'Alger', 
    communes: [
      'الأبيار', 'حيدرة', 'حسين داي', 'باب الزوار', 'القبة', 'بئر مراد رايس', 
      'بوزريعة', 'الشراقة', 'درارية', 'براقي', 'زرالدة', 'الرويبة', 'المرادية', 
      'سيدي امحمد', 'باب الوادي', 'باش جراح', 'عين البنيان', 'برج الكيفان'
    ] 
  },
  { code: '17', name: 'الجلفة', nameLatin: 'Djelfa', communes: ['الجلفة', 'مسعد', 'عين وسارة', 'حاسي بحبح'] },
  { code: '18', name: 'جيجل', nameLatin: 'Jijel', communes: ['جيجل', 'الميلية', 'العوانة', 'الطاهير'] },
  { code: '19', name: 'سطيف', nameLatin: 'Sétif', communes: ['سطيف', 'العلمة', 'عين أرنات', 'عين ولمان', 'بوقاعة'] },
  { code: '20', name: 'سعيدة', nameLatin: 'Saïda', communes: ['سعيدة', 'عين الحجر', 'يوب'] },
  { code: '21', name: 'سكيكدة', nameLatin: 'Skikda', communes: ['سكيكدة', 'الحروش', 'القل', 'عزابة'] },
  { code: '22', name: 'سيدي بلعباس', nameLatin: 'Sidi Bel Abbès', communes: ['سيدي بلعباس', 'تلاغ', 'بن باديس', 'سفيزف'] },
  { code: '23', name: 'عنابة', nameLatin: 'Annaba', communes: ['عنابة', 'البوني', 'سيدي عمار', 'الحجار', 'برحال'] },
  { code: '24', name: 'قالمة', nameLatin: 'Guelma', communes: ['قالمة', 'وادي الزناتي', 'بوشقوف', 'هيليوبوليس'] },
  { code: '25', name: 'قسنطينة', nameLatin: 'Constantine', communes: ['قسنطينة', 'الخروب', 'علي منجلي', 'عين سمارة', 'ديدوش مراد', 'حامة بوزيان'] },
  { code: '26', name: 'المدية', nameLatin: 'Médéa', communes: ['المدية', 'البرواقية', 'قصر البخاري', 'بني سليمان'] },
  { code: '27', name: 'مستغانم', nameLatin: 'Mostaganem', communes: ['مستغانم', 'عين تادلس', 'سيدي علي', 'حاسي ماماش'] },
  { code: '28', name: 'المسيلة', nameLatin: 'M’Sila', communes: ['المسيلة', 'بوسعادة', 'مقرة', 'سيدي عيسى'] },
  { code: '29', name: 'معسكر', nameLatin: 'Mascara', communes: ['معسكر', 'سيق', 'تيغنيف', 'المحمدية'] },
  { code: '30', name: 'ورقلة', nameLatin: 'Ouargla', communes: ['ورقلة', 'حاسي مسعود', 'تقرت', 'الرويسات'] },
  { 
    code: '31', 
    name: 'وهران', 
    nameLatin: 'Oran', 
    communes: ['وهران', 'بئر الجير', 'السانية', 'عين الترك', 'بطيوة', 'أرزيو', 'مرسى الكبير', 'القديل'] 
  },
  { code: '32', name: 'البيض', nameLatin: 'El Bayadh', communes: ['البيض', 'الأبيض سيدي الشيخ', 'بريزينة'] },
  { code: '33', name: 'إليزي', nameLatin: 'Illizi', communes: ['إليزي', 'إن أمناس', 'برج عمر إدريس'] },
  { code: '34', name: 'برج بوعريريج', nameLatin: 'Bordj Bou Arreridj', communes: ['برج بوعريريج', 'رأس الوادي', 'المنصورة'] },
  { code: '35', name: 'بومرداس', nameLatin: 'Boumerdès', communes: ['بومرداس', 'الرغاية', 'بودواو', 'دلس', 'برج منايل'] },
  { code: '36', name: 'الطارف', nameLatin: 'El Tarf', communes: ['الطارف', 'القالة', 'بن مهيدي', 'الذرعان'] },
  { code: '37', name: 'تندوف', nameLatin: 'Tindouf', communes: ['تندوف', 'أم العسل'] },
  { code: '38', name: 'تسمسيلت', nameLatin: 'Tissemsilt', communes: ['تسمسيلت', 'ثنية الحد', 'لرجام'] },
  { code: '39', name: 'الوادي', nameLatin: 'El Oued', communes: ['الوادي', 'قمار', 'الدبيلة', 'الرقيبة'] },
  { code: '40', name: 'خنشلة', nameLatin: 'Khenchela', communes: ['خنشلة', 'ششار', 'قايس', 'بوحمامة'] },
  { code: '41', name: 'سوق أهراس', nameLatin: 'Souk Ahras', communes: ['سوق أهراس', 'سدراتة', 'مداوروش', 'تاورة'] },
  { code: '42', name: 'تيبازة', nameLatin: 'Tipaza', communes: ['تيبازة', 'شرشال', 'القليعة', 'بوسماعيل', 'حجوط'] },
  { code: '43', name: 'ميلة', nameLatin: 'Mila', communes: ['ميلة', 'شلغوم العيد', 'تاجنانت', 'فرجيوة'] },
  { code: '44', name: 'عين الدفلى', nameLatin: 'Aïn Defla', communes: ['عين الدفلى', 'خميس مليانة', 'العطاف', 'مليانة'] },
  { code: '45', name: 'النعامة', nameLatin: 'Naâma', communes: ['النعامة', 'المشرية', 'عين الصفراء'] },
  { code: '46', name: 'عين تموشنت', nameLatin: 'Aïn Témouchent', communes: ['عين تموشنت', 'بني صاف', 'حمام بوحجر'] },
  { code: '47', name: 'غرداية', nameLatin: 'Ghardaïa', communes: ['غرداية', 'بني يزقن', 'القرارة', 'بريان', 'متليلي'] },
  { code: '48', name: 'غليزان', nameLatin: 'Relizane', communes: ['غليزان', 'وادي ارهيو', 'مازونة', 'عمي موسى'] },
  { code: '49', name: 'تيميمون', nameLatin: 'Timimoun', communes: ['تيميمون', 'أوقروت', 'شروين'] },
  { code: '50', name: 'برج باجي مختار', nameLatin: 'Bordj Badji Mokhtar', communes: ['برج باجي مختار', 'تيمياوين'] },
  { code: '51', name: 'أولاد جلال', nameLatin: 'Ouled Djellal', communes: ['أولاد جلال', 'سيدي خالد'] },
  { code: '52', name: 'بني عباس', nameLatin: 'Béni Abbès', communes: ['بني عباس', 'كرزاز', 'إقلي'] },
  { code: '53', name: 'عين صالح', nameLatin: 'In Salah', communes: ['عين صالح', 'فقارة الزوى'] },
  { code: '54', name: 'عين قزام', nameLatin: 'In Guezzam', communes: ['عين قزام', 'تين زواتين'] },
  { code: '55', name: 'توقرت', nameLatin: 'Touggourt', communes: ['توقرت', 'النزلة', 'تماسين'] },
  { code: '56', name: 'جانت', nameLatin: 'Djanet', communes: ['جانت', 'برج الحواس'] },
  { code: '57', name: 'المغير', nameLatin: 'El M’Ghair', communes: ['المغير', 'جامعة'] },
  { code: '58', name: 'المنيعة', nameLatin: 'El Menia', communes: ['المنيعة', 'حاسي القارة'] }
];

// The 10 Official Algerian Crafts requested by user
export interface AlgerianTrade {
  id: string;
  name: string;
  description: string;
  iconName: string;
  hourlyRateTypical: number;
  tags: string[];
}

export const ALGERIAN_TRADES: AlgerianTrade[] = [
  {
    id: 'plumber',
    name: 'سبّاك',
    description: 'إصلاح التسربات، تركيب الخلاطات، السخانات وتمديد شبكات المياه',
    iconName: 'Droplets',
    hourlyRateTypical: 1500,
    tags: ['تسرب مياه', 'سخان ماء', 'ترصيص', 'مضخة']
  },
  {
    id: 'electrician',
    name: 'كهربائي',
    description: 'إصلاح الأعطال الكهربائية، لوحات القواطع، الإنارة وتجديد الأسلاك',
    iconName: 'Zap',
    hourlyRateTypical: 1800,
    tags: ['قاطع كهربائي', 'إنارة', 'لوحة قواطع', 'ماس كهربائي']
  },
  {
    id: 'carpenter',
    name: 'نجّار',
    description: 'تفصيل وإصلاح الأبواب والخزائن، تركيب المطابخ وتجميع الأثاث',
    iconName: 'Hammer',
    hourlyRateTypical: 2000,
    tags: ['أبواب خشب', 'مطابخ', 'خزائن', 'تجميع أثاث']
  },
  {
    id: 'painter',
    name: 'دهّان (صباغ)',
    description: 'طلاء الجدران الداخلية والخارجية، الديكور والأسقف المعلقة (BA13)',
    iconName: 'Paintbrush',
    hourlyRateTypical: 1400,
    tags: ['طلاء جدران', 'جبس بورد', 'صباغة', 'ديكور']
  },
  {
    id: 'ac_technician',
    name: 'فني تكييف',
    description: 'تركيب وصيانة المكيفات الهوائية، شحن غاز الفريون وتنظيف الفلاتر',
    iconName: 'Wind',
    hourlyRateTypical: 2200,
    tags: ['مكيف هواء', 'شحن فريون', 'صيانة سنوية', 'تدفئة']
  },
  {
    id: 'mason',
    name: 'بنّاء',
    description: 'بناء وترميم الجدران، التكسير الإنشائي، أشغال الإسمنت والخرسانة',
    iconName: 'BrickWall',
    hourlyRateTypical: 2500,
    tags: ['ترميم', 'بناء جدران', 'إسمنت', 'توسعة']
  },
  {
    id: 'blacksmith',
    name: 'حدّاد',
    description: 'أبواب حديدية، شبابيك الحماية، لحام فني وإصلاح الأقفال المصفحة',
    iconName: 'Flame',
    hourlyRateTypical: 2000,
    tags: ['لحام', 'شبابيك حماية', 'بوابة حديد', 'أقفال']
  },
  {
    id: 'mechanic',
    name: 'ميكانيكي',
    description: 'صيانة السيارات بموقعك، تشخيص الأعطال بالكمبيوتر والمساعدة على الطريق',
    iconName: 'Wrench',
    hourlyRateTypical: 2500,
    tags: ['ميكانيك متنقل', 'فرامل', 'تغيير زيت', 'مساعدة طريق']
  },
  {
    id: 'tiler',
    name: 'تبليط (كارلاج)',
    description: 'تركيب الكارلاج، السيراميك، الفايونس والبورسلان للأرضيات والجدران',
    iconName: 'LayoutGrid',
    hourlyRateTypical: 2200,
    tags: ['سيراميك', 'فايونس', 'بورسلان', 'كارلاج']
  },
  {
    id: 'aluminum_technician',
    name: 'فني ألمنيوم',
    description: 'تصنيع وتركيب شبابيك وأبواب الألمنيوم وPVC، مطابخ الألمنيوم العصرية',
    iconName: 'Box',
    hourlyRateTypical: 2200,
    tags: ['نوافذ ألمنيوم', 'PVC', 'أبواب سحاب', 'مطابخ ألمنيوم']
  }
];

// Helper to format prices strictly in Algerian Dinars (دج)
export const formatDZD = (amount: number | string): string => {
  if (typeof amount === 'string') {
    const numeric = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numeric)) {
      return `${numeric.toLocaleString('fr-DZ')} دج`;
    }
    return `${amount} دج`;
  }
  return `${amount.toLocaleString('fr-DZ')} دج`;
};

// Validate Algerian Phone: 05, 06, 07 followed by 8 digits (10 digits total)
export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

export const validateAlgerianPhone = (phone: string): PhoneValidationResult => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  
  if (!cleaned) {
    return { isValid: false, error: 'يرجى إدخال رقم الهاتف' };
  }
  
  // Accept standard 10 digit local format (05..., 06..., 07...)
  const localRegex = /^(05|06|07)[0-9]{8}$/;
  // Also accept with +213 or 00213 prefix
  const intlRegex = /^(\+213|00213)(5|6|7)[0-9]{8}$/;

  if (localRegex.test(cleaned)) {
    // Format nicely: 0550 12 34 56
    const formatted = `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    return { isValid: true, formatted };
  }

  if (intlRegex.test(cleaned)) {
    const local = '0' + cleaned.replace(/^(\+213|00213)/, '');
    const formatted = `${local.slice(0, 4)} ${local.slice(4, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
    return { isValid: true, formatted };
  }

  return {
    isValid: false,
    error: 'رقم الهاتف غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام (مثال: 0550 12 34 56)'
  };
};
