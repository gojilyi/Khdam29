import { 
  ServiceCategory, 
  Artisan, 
  ProjectQuoteRequest, 
  Review, 
  ChatMessage, 
  Order, 
  WorkPost, 
  VerificationRequest,
  ArtisanSchedule,
  QnAQuestion,
  BenchmarkPriceItem,
  JobSeekerProfile,
  WorkPartnerPost,
  Appointment,
  ClientAccount,
  GameChannelRechargeItem,
  RentalVehicleItem
} from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'home_repair',
    name: 'صيانة وإصلاحات المنازل',
    nameEn: 'Home Repairs & Maintenance',
    nameFr: 'Maintenance & Réparations',
    icon: 'Wrench',
    image: '/src/assets/images/home_plumbing_service_1791156501756.jpg',
    description: 'سباكة، كهرباء، نجارة، دهان، حدادة، أقفال وتركيب الأثاث',
    accentColor: 'amber',
    subServices: [
      { id: 'plumbing', name: 'أعمال السباكة وتسريب المياه', nameEn: 'Plumbing & Leak Repair', nameFr: 'Plomberie & Fuites', description: 'إصلاح التسريبات، تركيب الأحواض والمراحيض والمضخات', estimatedPrice: '2500 - 6000 دج', iconName: 'Droplets', image: '/src/assets/images/home_plumbing_service_1791156501756.jpg' },
      { id: 'electrical', name: 'الكهرباء والتمديدات المنزلية', nameEn: 'Electrical & Wiring', nameFr: 'Électricité Générale', description: 'إصلاح الأعطال، لوحات التوزيع، الإنارة وتجديد الأسلاك', estimatedPrice: '2000 - 8000 دج', iconName: 'Zap', image: '/src/assets/images/electrical_modern_service_1791156512564.jpg' },
      { id: 'carpentry', name: 'النجارة والأبواب الخشبية', nameEn: 'Carpentry & Woodwork', nameFr: 'Menuiserie Bois', description: 'تفصيل وإصلاح الأبواب والخزائن والمطابخ الخشبية', estimatedPrice: '3000 - 12000 دج', iconName: 'Hammer', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80' },
      { id: 'masonry', name: 'البناء والترميمات الإنشائية', nameEn: 'Masonry & Construction', nameFr: 'Maçonnerie & Rénovation', description: 'أعمال التبليط، تكسير وترميم الجدران والأسمنت', estimatedPrice: '4000 - 15000 دج', iconName: 'BrickWall', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80' },
      { id: 'painting_gypsum', name: 'الدهان وأعمال الجبس والديكور', nameEn: 'Painting & Gypsum', nameFr: 'Peinture & Plâtre', description: 'طلاء الجدران الداخلية والخارجية والأسقف المعلقة (BA13)', estimatedPrice: '5000 - 25000 دج', iconName: 'Paintbrush', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
      { id: 'locksmith', name: 'تركيب وصيانة الأقفال والأبواب', nameEn: 'Locksmith & Security', nameFr: 'Serrurerie & Blindage', description: 'فتح الأبواب المغلقة، تركيب كوالين متطورة وأقفال ذكية', estimatedPrice: '2000 - 4500 دج', iconName: 'Key', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80' },
      { id: 'welding', name: 'اللحام والحدادة الفنية', nameEn: 'Welding & Blacksmith', nameFr: 'Soudure & Ferronnerie', description: 'تصنيع وإصلاح الأبواب الحديدية والشبابيك والمظلات', estimatedPrice: '3500 - 14000 دج', iconName: 'Flame', image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80' },
      { id: 'furniture_assembly', name: 'تركيب الأثاث المنزلي والمكتبي', nameEn: 'Furniture Assembly', nameFr: 'Montage Meubles', description: 'تجميع خزانات إيكيا وغرف النوم والمكاتب بدقة وسرعة', estimatedPrice: '2000 - 5000 دج', iconName: 'Armchair', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'cleaning_facility',
    name: 'النظافة والعناية بالمرافق',
    nameEn: 'Cleaning & Facility Care',
    nameFr: 'Nettoyage & Entretien',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    description: 'تنظيف شامل، نقل وترحيل، مناولة، مكافحة الحشرات ومشاريع النظافة',
    accentColor: 'blue',
    subServices: [
      { id: 'deep_cleaning', name: 'خدمات التنظيف الشامل للمنازل', nameEn: 'Deep House Cleaning', nameFr: 'Nettoyage Complet', description: 'تنظيف وتطهير الشقق والفلل والسجاد وتلميع الأرضيات', estimatedPrice: '3000 - 9000 دج', iconName: 'Sparkle', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },
      { id: 'relocation_moving', name: 'النقل والترحيل مع التغليف', nameEn: 'Moving & Relocation', nameFr: 'Déménagement & Transport', description: 'نقل الأثاث بأمان مع فريق تحميل وتنزيل وسيارات مجهزة', estimatedPrice: '8000 - 25000 دج', iconName: 'Truck', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80' },
      { id: 'handling_manual', name: 'المناولة والأعمال اليدوية', nameEn: 'Handling & Labor', nameFr: 'Manutention & Port', description: 'مساعدة في نقل الأغراض الثقيلة وتفريغ الشاحنات والترتيب', estimatedPrice: '2000 - 5000 دج', iconName: 'Package', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80' },
      { id: 'handyman_tasks', name: 'الأشغال الصغيرة والتثبيت السريع', nameEn: 'Handyman Odd Jobs', nameFr: 'Petits Travaux Bricolage', description: 'تثبيت اللوحات، الستائر، الرفوف والمرايا', estimatedPrice: '1500 - 3500 دج', iconName: 'Drill', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80' },
      { id: 'pest_control', name: 'مكافحة الحشرات والقوارض', nameEn: 'Pest & Rodent Control', nameFr: 'Dératisation & Nuisibles', description: 'رش مبيدات آمنة ومعتمدة مع ضمان القضاء على الصراصير والبق', estimatedPrice: '4000 - 10000 دج', iconName: 'ShieldAlert', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80' },
      { id: 'delivery_errands', name: 'توصيل الطلبات والمشاوير الخاصة', nameEn: 'Courier & Errands', nameFr: 'Courses & Livraisons', description: 'توصيل الوثائق والطرود والمشتريات العاجلة بين الأحياء', estimatedPrice: '1000 - 2500 دج', iconName: 'Navigation', image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'agriculture_env',
    name: 'الزراعة والبيئة',
    nameEn: 'Agriculture & Greenery',
    nameFr: 'Agriculture & Espaces Verts',
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
    description: 'بستنة، رعاية الحدائق، طب بيطري، وتزيين الحيوانات الأليفة',
    accentColor: 'emerald',
    subServices: [
      { id: 'gardening', name: 'أعمال البستنة والعناية بالمساحات الخضراء', nameEn: 'Gardening & Landscaping', nameFr: 'Jardinage & Élagage', description: 'تقليم الأشجار، تنسيق الحدائق، تركيب أنظمة الري العصرية', estimatedPrice: '3000 - 10000 دج', iconName: 'Flower2', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80' },
      { id: 'veterinary', name: 'الطب البيطري والرعاية الصحية للحيوانات', nameEn: 'Veterinary Home Visit', nameFr: 'Soins Vétérinaires', description: 'فحص منزلي، تطعيمات، علاج الحيوانات الأليفة والمواشي', estimatedPrice: '3500 - 7000 دج', iconName: 'HeartPulse', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80' },
      { id: 'pet_grooming', name: 'تزيين وعناية بالحيوانات الأليفة', nameEn: 'Pet Grooming', nameFr: 'Toilettage Animaux', description: 'استحمام، قص وتنظيف شعر الحيوانات بمعدات تعقيم احترافية', estimatedPrice: '2500 - 5000 دج', iconName: 'Scissors', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'automotive_roadside',
    name: 'خدمات السيارات والمساعدة',
    nameEn: 'Auto Services & Roadside Help',
    nameFr: 'Automobile & Dépannage',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    description: 'ميكانيك، كهرباء سيارات، مساعدة طريق Dépannage، وتغيير الإطارات',
    accentColor: 'rose',
    subServices: [
      { id: 'auto_mechanic', name: 'ميكانيك السيارات المتنقل', nameEn: 'Mobile Auto Mechanic', nameFr: 'Mécanique Auto', description: 'تشخيص الأعطال بالكمبيوتر، صيانة الفرامل والمحركات بموقعك', estimatedPrice: '3000 - 9000 دج', iconName: 'Gauge', image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
      { id: 'auto_electric', name: 'كهرباء السيارات والبطاريات', nameEn: 'Auto Electrical & Battery', nameFr: 'Électricité Auto', description: 'شحن البطاريات، إصلاح المولدات، السلف وأضواء السيارة', estimatedPrice: '2000 - 6000 دج', iconName: 'BatteryCharging', image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80' },
      { id: 'roadside_depannage', name: 'المساعدة الفورية على الطريق (Dépannage)', nameEn: '24/7 Roadside Assistance', nameFr: 'Dépannage & Remorquage', description: 'قطر السيارات المعطلة ونقلها إلى أقرب ورشة أو وجهتك', estimatedPrice: '4500 - 12000 دج', iconName: 'Siren', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80' },
      { id: 'tire_service', name: 'إصلاح وتبديل الإطارات في الموقع', nameEn: 'Mobile Tire Repair', nameFr: 'Pneumatiques & Crevaisons', description: 'إصلاح البنشر، نفخ وترصيص وتركيب العجلة الاحتياطية', estimatedPrice: '1500 - 4000 دج', iconName: 'Disc', image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80' },
      { id: 'bodywork_paint', name: 'أعمال السمكرة والطلاء للسيارات', nameEn: 'Auto Bodywork & Paint', nameFr: 'Tôlerie & Peinture Auto', description: 'إزالة الخدوش، شفط الصدمات وطلاء احترافي بالفرن', estimatedPrice: '6000 - 30000 دج', iconName: 'Shield', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'health_personal',
    name: 'الرعاية الصحية والشخصية',
    nameEn: 'Health & Personal Care',
    nameFr: 'Santé & Soins Personnels',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    description: 'تمريض منزلي، رعاية كبار السن، إسعاف، حلاقة وتجميل منزلي',
    accentColor: 'indigo',
    subServices: [
      { id: 'home_nursing', name: 'التمريض المنزلي المعتمد', nameEn: 'Certified Home Nursing', nameFr: 'Soins Infirmiers à Domicile', description: 'حقن، تغيير الضمادات، تركيب السيروم، وقياس العلامات الحيوية', estimatedPrice: '2000 - 5000 دج', iconName: 'Stethoscope', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80' },
      { id: 'elder_child_care', name: 'رعاية الأطفال والمرضى وكبار السن', nameEn: 'Caregiving & Companionship', nameFr: 'Aide à la Personne', description: 'مرافقة صحية ورعاية شاملة بالساعة أو باليوم مع كفاءة عالية', estimatedPrice: '3000 - 8000 دج / يوم', iconName: 'Users', image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80' },
      { id: 'medical_ambulance', name: 'خدمات الإسعاف والنقل الطبي السريع', nameEn: 'Ambulance & Medical Transit', nameFr: 'Ambulance & Transport Médical', description: 'سيارات إسعاف مجهزة بأحدث أجهزة التنفس والإنعاش للنقل الآمن', estimatedPrice: '6000 - 18000 دج', iconName: 'Activity', image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop&q=80' },
      { id: 'home_barber', name: 'الحلاقة الرجالية وقص الشعر منزلياً', nameEn: 'Home Barber for Men', nameFr: 'Coiffure Homme à Domicile', description: 'حلاقة شعر ولحية بمعدات معقمة في راحة منزلك', estimatedPrice: '1500 - 3500 دج', iconName: 'Scissors', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80' },
      { id: 'home_beauty', name: 'التجميل والمكياج وتصفيف الشعر', nameEn: 'Home Beauty & Styling', nameFr: 'Esthétique & Maquillage', description: 'مكياج للمناسبات، عناية بالبشرة، تسريحات شعر على يد خبيرات', estimatedPrice: '3500 - 12000 دج', iconName: 'Smile', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' },
      { id: 'tailoring', name: 'تفصيل وتعديل الملابس المنزلية', nameEn: 'Tailoring & Alterations', nameFr: 'Couture & Retouches', description: 'تضييق وتقصير وتعديل الفساتين والبدلات واستلامها من الباب', estimatedPrice: '1500 - 6000 دج', iconName: 'Check', image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'tech_smart_home',
    name: 'التقنية والتركيبات الذكية',
    nameEn: 'Tech & Smart Installations',
    nameFr: 'Technologie & Domotique',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'صيانة الحواسيب، شبكات وكاميرات، كهرومنزلي، أطباق وأتمتة ذكية',
    accentColor: 'cyan',
    subServices: [
      { id: 'phone_pc_repair', name: 'صيانة الهواتف الذكية والحواسيب', nameEn: 'Smartphones & PC Repair', nameFr: 'Réparation PC & Smartphones', description: 'تغيير الشاشات والبطاريات، تنصيب الويندوز وحل المشاكل التقنية', estimatedPrice: '2000 - 7000 دج', iconName: 'Laptop', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&auto=format&fit=crop&q=80' },
      { id: 'cctv_networking', name: 'تمديد الشبكات وتركيب كاميرات المراقبة', nameEn: 'CCTV & Network Cabling', nameFr: 'Caméras & Réseaux', description: 'تركيب كاميرات المراقبة DVR/NVR مع ربطها بالهاتف وتمديد كوابل الفايبر', estimatedPrice: '4000 - 16000 دج', iconName: 'Video', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80' },
      { id: 'appliance_repair', name: 'إصلاح الأجهزة الكهرومنزلية', nameEn: 'Home Appliance Repair', nameFr: 'Réparation Électroménager', description: 'صيانة الثلاجات، الغسالات، أفران الميكروويف ومكيفات الهواء', estimatedPrice: '2500 - 9000 دج', iconName: 'Tv', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' },
      { id: 'satellite_parabole', name: 'تركيب وضبط الأطباق الهوائية (Parabole)', nameEn: 'Satellite Dish Installation', nameFr: 'Installation Parabole & Décodeur', description: 'توجيه الطبق بأحدث الأجهزة لضبط جميع الأقمار والترددات', estimatedPrice: '1500 - 3500 دج', iconName: 'Radio', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80' },
      { id: 'smart_automation', name: 'برمجة أنظمة الأتمتة والمنازل الذكية', nameEn: 'Smart Home & Automation', nameFr: 'Domotique & Objets Connectés', description: 'تحكم ذكي في الإضاءة، التكييف، الأقفال والستائر عبر الهاتف والصوت', estimatedPrice: '8000 - 35000 دج', iconName: 'Wifi', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'food_hospitality',
    name: 'الأطعمة والضيافة',
    nameEn: 'Food & Hospitality',
    nameFr: 'Restauration & Traiteur',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    description: 'طبخ وجبات منزلية، موائد الضيوف، تجهيز حلويات ومقبلات المناسبات',
    accentColor: 'orange',
    subServices: [
      { id: 'home_cooking', name: 'الطبخ وإعداد الوجبات الغذائية والمآدب', nameEn: 'Home Cooking & Catering', nameFr: 'Cuisine & Repas Maison', description: 'إعداد أطباق تقليدية وعصرية للعائلات والعزومات بكميات مخصصة', estimatedPrice: '4000 - 15000 دج', iconName: 'Soup', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
      { id: 'pastry_events', name: 'تجهيز الحلويات لمختلف المناسبات والأعراس', nameEn: 'Pastries & Event Sweets', nameFr: 'Pâtisserie & Gâteaux de Fête', description: 'صواني حلويات تقليدية، كعكات أعياد الميلاد وتارتات فاخرة', estimatedPrice: '3500 - 18000 دج', iconName: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'education_events',
    name: 'التعليم والفعاليات',
    nameEn: 'Education & Events',
    nameFr: 'Éducation & Événements',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    description: 'دروس خصوصية لكافة المستويات، تنظيم وتنسيق المناسبات والحفلات',
    accentColor: 'purple',
    subServices: [
      { id: 'private_tutoring', name: 'تقديم الدروس الخصوصية والدعم المدرسي', nameEn: 'Private Tutoring', nameFr: 'Cours Particuliers', description: 'رياضيات، فيزياء، لغات، مراجعة امتحانات شهادة البكالوريا والتعليم الأساسي', estimatedPrice: '1500 - 3000 دج / حصة', iconName: 'BookOpen', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80' },
      { id: 'event_planning', name: 'تنظيم وتنسيق المناسبات والمعارض', nameEn: 'Event Planning & Coordination', nameFr: 'Organisation Événements', description: 'كراسي، خيام، إضاءة، تصوير احترافي وتنسيق متكامل ليوم لا ينسى', estimatedPrice: '15000 - 70000 دج', iconName: 'PartyPopper', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 'women_crafts',
    name: 'أعمال وحرف النساء والإنتاج المنزلي',
    nameEn: "Women's Crafts & Home Production",
    nameFr: "Métiers Féminins & Artisanat Maison",
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    description: 'خياطة وتفصيل وتصميم أزياء، طبخ منزلي ومأدبات، حلويات ومخبوزات الأعراس، تطريز ومجبود، ورعاية منزلية',
    accentColor: 'rose',
    subServices: [
      { 
        id: 'sewing_tailoring', 
        name: 'خياطة وتفصيل وتصميم الأزياء والقفطان والكراكو', 
        nameEn: 'Couture, Kaftan & Dress Tailoring', 
        nameFr: 'Couture & Confection Traditionnelle', 
        description: 'تفصيل وخياطة الكراكو العاصمي، القفطان الجزائري، فساتين السهرة، وتعديل المقاسات واستلامها من الباب', 
        estimatedPrice: '3000 - 18000 دج', 
        iconName: 'Scissors', 
        image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 'traditional_sweets', 
        name: 'صناعة الحلويات التقليدية والعصرية للأعراس والمناسبات', 
        nameEn: 'Traditional Pastries & Event Sweets', 
        nameFr: 'Gâteaux Traditionnels & Pâtisserie', 
        description: 'بقلاوة بالجوز واللوز، مقروط اللوز، تشاراك العريان والمسكر، كعكات أعياد الميلاد وتارتات فاخرة', 
        estimatedPrice: '3500 - 25000 دج', 
        iconName: 'Cake', 
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 'home_cooking_banquets', 
        name: 'الطبخ المنزلي والمأكولات الجزائرية والولائم العائلية', 
        nameEn: 'Home Algerian Cooking & Banquets', 
        nameFr: 'Cuisine Maison & Plats Traditionnels', 
        description: 'كسكسي الأعراس، شخشوخة بسكرية، رشتة عاصمية، شربة فريك، طواجن ومقبلات منزلية صحية ونظيفة', 
        estimatedPrice: '4000 - 20000 دج', 
        iconName: 'Soup', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 'embroidery_handcrafts', 
        name: 'التطريز اليدوي والطرز بالمجبود والشبيكة والكروشي', 
        nameEn: 'Handmade Embroidery & Majboud Art', 
        nameFr: 'Broderie Traditionnelle & Crochet', 
        description: 'طرز الفتلة والمجبود العاصمي، كروشي يدوي، وسائد ومفارش عرايس مشغولة باليد بحرفية عالية', 
        estimatedPrice: '2500 - 15000 دج', 
        iconName: 'Sparkles', 
        image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 'home_nanny_care', 
        name: 'مجالسة ورعاية الأطفال في المنازل (Nounou)', 
        nameEn: 'Home Babysitting & Child Care', 
        nameFr: 'Garde d\'Enfants & Nounou à Domicile', 
        description: 'مربيات وسيدات ثقة لرعاية الرضع والأطفال بالساعة أو باليوم، تحضير وجبات ومتابعة الواجبات', 
        estimatedPrice: '2000 - 5000 دج / يوم', 
        iconName: 'Heart', 
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80' 
      },
      { 
        id: 'bridal_henna_styling', 
        name: 'تزيين العرائس ونقش الحنة والمكياج المنزلي', 
        nameEn: 'Bridal Henna, Hair & Makeup Styling', 
        nameFr: 'Henné Mariée & Coiffure à Domicile', 
        description: 'نقش حنة خليجي وجزائري فاخر، تسريحات شعر ومكياج سهرة على يد خبيرات تجميل منزلي', 
        estimatedPrice: '3500 - 14000 دج', 
        iconName: 'Smile', 
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' 
      }
    ]
  },
  {
    id: 'gaming_channels_recharge',
    name: 'شحن الألعاب والقنوات والبطاقات الرقمية',
    nameEn: 'Gaming Top-Up & Digital Channels',
    nameFr: 'Recharge Jeux & Abonnements TV',
    icon: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'شحن فوري بالدينار (BaridiMob/CCP) لجواهر فري فاير، شدات ببجي، بطاقات بلايستيشن، واشتراكات IPTV، شاهد ونتفليكس',
    accentColor: 'purple',
    subServices: [
      {
        id: 'freefire_pubg_gaming',
        name: 'شحن جواهر فري فاير وشدات ببجي وروبلوكس',
        nameEn: 'Free Fire, PUBG UC & Roblox Robux Top-up',
        nameFr: 'Recharge Free Fire & PUBG Mobile',
        description: 'شحن فوري بالـ ID والـ BaridiMob خلال 5 دقائق، أسعار موثوقة ومضمونة 100%',
        estimatedPrice: '500 - 9500 دج',
        iconName: 'Gamepad2',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'iptv_streaming_channels',
        name: 'اشتراكات القنوات التلفزيونية وIPTV وbeIN Sports',
        nameEn: 'IPTV Smarters, Lynx & Sports Channels',
        nameFr: 'Abonnements IPTV & Chaînes TV',
        description: 'سيرفرات IPTV ممتازة 4K/FHD بدون تقطيع، بث مباريات، باقات قنوات عربية وأوروبية مع كود تفعيل فوري',
        estimatedPrice: '2500 - 6500 دج',
        iconName: 'Tv',
        image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'digital_store_cards',
        name: 'بطاقات شحن المتاجر (PlayStation, Steam, Google Play)',
        nameEn: 'Gift Cards (PlayStation, Steam, Xbox, iTunes)',
        nameFr: 'Cartes Cadeaux & Magasins Virtuels',
        description: 'أكواد وبطاقات شحن رسمية فورية لمتاجر الألعاب والتطبيقات بالدينار الجزائري',
        estimatedPrice: '1500 - 15000 دج',
        iconName: 'CreditCard',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'vod_streaming_accounts',
        name: 'اشتراكات منصات الأفلام (Netflix, Shahid VIP, TOD)',
        nameEn: 'Netflix, Shahid VIP & Streaming Accounts',
        nameFr: 'Comptes Streaming Netflix & Shahid VIP',
        description: 'حسابات وملفات شخصية رسمية 4K Ultra HD مع ضمان كامل طوال فترة الاشتراك',
        estimatedPrice: '900 - 4500 دج',
        iconName: 'Film',
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'vehicle_truck_rentals',
    name: 'كراء واستئجار السيارات والشاحنات والعربات',
    nameEn: 'Car, Truck & Vehicle Rentals',
    nameFr: 'Location de Voitures, Camions & Remorques',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    description: 'كراء سيارات سياحية عصرية، شاحنات نقل البضائع والأثاث، وعربات السحب Dépannage مع أو بدون سائق في جميع الولايات',
    accentColor: 'blue',
    subServices: [
      {
        id: 'passenger_car_rental',
        name: 'كراء السيارات السياحية والعائلية (يومي وأسبوعي)',
        nameEn: 'Passenger & Family Car Rentals',
        nameFr: 'Location Voitures Tourisme',
        description: 'سيارات حديثة مكيفة ومؤمنة (Stepway, Clio, Accent, Tucson) بعقود كراء نظامية وأسعار تنافسية',
        estimatedPrice: '4500 - 14000 دج / يوم',
        iconName: 'Car',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'cargo_truck_rental',
        name: 'كراء شاحنات نقل البضائع والأثاث مع أو بدون سائق',
        nameEn: 'Cargo Trucks & Pickup Rentals (Kia, Master, Hilux)',
        nameFr: 'Location Camionnettes & Fourgons',
        description: 'شاحنات نقل عفش وبضائع بمختلف الأحجام (صندوق مفتوح، مغلق Fourgon) بين الولايات والمدن',
        estimatedPrice: '6000 - 22000 دج / يوم',
        iconName: 'Truck',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'towing_cart_rental',
        name: 'كراء عربات السحب Dépannage ومقطورات النقل الخاصة',
        nameEn: 'Towing Trailers & Flatbed Recovery',
        nameFr: 'Remorques & Dépannage Auto',
        description: 'عربات سحب السيارات المعطلة، سطحات هيدروليكية، ومقطورات سحب الدراجات والمعدات',
        estimatedPrice: '3500 - 12000 دج / مشوار',
        iconName: 'Wrench',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'luxury_wedding_car_rental',
        name: 'كراء سيارات الأعراس والمناسبات الفاخرة مع سائق أنيق',
        nameEn: 'Wedding & Luxury Car Chauffeur',
        nameFr: 'Voitures de Cérémonie & Mariage',
        description: 'مواكب أعراس متميزة، سيارات فخمة مزينة بالورود مع سائق خاص محترف للمناسبات السعيدة',
        estimatedPrice: '12000 - 35000 دج / يوم',
        iconName: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const mockArtisans: Artisan[] = [
  {
    id: 'art_1',
    name: 'المعلم كمال بلقاسم',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['plumbing', 'handyman_tasks'],
    rating: 4.9,
    reviewCount: 142,
    distanceKm: 0.8,
    isOnline: true,
    hourlyRate: 1500,
    city: 'الجزائر العاصمة',
    neighborhood: 'حيدرة / الأبيار',
    bio: 'حرفي سباكة محترف معتمد مع خبرة 14 سنة في التمديدات المائية وكشف التسريبات بأحدث أجهزة الموجات الصوتية.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0428',
      yearsExperience: 14,
      completedJobsCount: 310
    },
    phoneMasked: '+213 •• •• •• 89',
    trade: 'سباكة وترصيص صحي',
    experienceYears: 14,
    completedJobsCount: 310,
    skills: ['تمديدات صحية', 'كشف تسريبات', 'تركيب خلاطات', 'سخانات مياه'],
    badges: ['هوية موثقة (مستوى 1)', 'دبلوم كفاءة معتمد (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_2',
    name: 'المهندس أمين الشريف',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['electrical', 'smart_automation', 'cctv_networking'],
    rating: 4.95,
    reviewCount: 98,
    distanceKm: 1.2,
    isOnline: true,
    hourlyRate: 1800,
    city: 'الجزائر العاصمة',
    neighborhood: 'المرادية',
    bio: 'كهربائي منازل ومختص بأنظمة السمارت هوم وحماية الشبكات وكاميرات المراقبة. سرعة في الاستجابة وحلول هندسية مضمونة.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0195',
      yearsExperience: 9,
      completedJobsCount: 224
    },
    phoneMasked: '+213 •• •• •• 45',
    trade: 'كهرباء منازل وشبكات ذكية',
    experienceYears: 9,
    completedJobsCount: 224,
    skills: ['كهرباء معمارية', 'كاميرات مراقبة', 'سمارت هوم', 'قواطع كهربائية'],
    badges: ['هوية موثقة (مستوى 1)', 'دبلوم مهندس تقني (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_3',
    name: 'طارق عبد السلام (Dépannage)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    categoryId: 'automotive_roadside',
    subCategoryIds: ['roadside_depannage', 'auto_mechanic', 'tire_service'],
    rating: 4.88,
    reviewCount: 84,
    distanceKm: 2.1,
    isOnline: true,
    hourlyRate: 2000,
    city: 'الجزائر العاصمة',
    neighborhood: 'باب الزوار / الدار البيضاء',
    bio: 'خدمة سريعة للمساعدة على الطريق 24/7 مع شاحنة ديباناج هيدروليكية مجهزة وكهربائي متنقل في ظرف أقل من 20 دقيقة.',
    verification: {
      idVerified: true,
      certVerified: false,
      khodamGuaranteed: true,
      topRated: true,
      level: 1,
      matricule: 'KD-DZ-16-0812',
      yearsExperience: 8,
      completedJobsCount: 195
    },
    phoneMasked: '+213 •• •• •• 12',
    trade: 'ميكانيك وسحب سيارات Dépannage',
    experienceYears: 8,
    completedJobsCount: 195,
    skills: ['سحب ديباناج 24/7', 'شحن بطاريات', 'تصليح إطارات', 'ميكانيك سريع'],
    badges: ['هوية موثقة (مستوى 1)', 'تدخل سريع']
  },
  {
    id: 'art_4',
    name: 'سفيان مرابط - دهان وجبس ديكور',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['painting_gypsum', 'masonry'],
    rating: 4.82,
    reviewCount: 67,
    distanceKm: 3.4,
    isOnline: true,
    hourlyRate: 1600,
    city: 'الجزائر العاصمة',
    neighborhood: 'القبة',
    bio: 'تنفيذ أعمال الدهان العصري والديكورات الجبسية والأسقف المعلقة بدقة وسرعة في التسليم مع تنظيف المكان بالكامل.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: false,
      level: 2,
      matricule: 'KD-DZ-16-0341',
      yearsExperience: 11,
      completedJobsCount: 145
    },
    phoneMasked: '+213 •• •• •• 73',
    trade: 'دهان وديكور وجبس بورد',
    experienceYears: 11,
    completedJobsCount: 145,
    skills: ['طلاء عصري', 'ديكورات جبس', 'أسقف معلقة', 'عزل رطوبة'],
    badges: ['هوية موثقة (مستوى 1)', 'شهادة حرفية معتمدة (مستوى 2)', 'ضمان خدام']
  },
  {
    id: 'art_5',
    name: 'الممرضة صفية قادري',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    categoryId: 'health_personal',
    subCategoryIds: ['home_nursing', 'elder_child_care'],
    rating: 4.97,
    reviewCount: 112,
    distanceKm: 1.5,
    isOnline: true,
    hourlyRate: 1400,
    city: 'الجزائر العاصمة',
    neighborhood: 'بن عكنون',
    bio: 'ممرضة حاصلة على شهادة دولة معتمدة، متخصصة في العناية المنزلية للمرضى وكبار السن والحقن والتضميد الطبي بأقصى درجات التعقيم.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0904',
      yearsExperience: 7,
      completedJobsCount: 260
    },
    phoneMasked: '+213 •• •• •• 33',
    trade: 'تمريض ورعاية صحية منزلية',
    experienceYears: 7,
    completedJobsCount: 260,
    skills: ['حقن وتضميد', 'رعاية مسنين', 'قياس مؤشرات حيوية', 'إسعافات أولية'],
    badges: ['هوية موثقة (مستوى 1)', 'شهادة دولة في التمريض (مستوى 2)', 'أعلى تقييم']
  },
  {
    id: 'art_6',
    name: 'يوسف تقني الأجهزة والأنظمة الذكية',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    categoryId: 'tech_smart_home',
    subCategoryIds: ['appliance_repair', 'satellite_parabole', 'smart_automation'],
    rating: 4.79,
    reviewCount: 75,
    distanceKm: 2.8,
    isOnline: false,
    hourlyRate: 1500,
    city: 'الجزائر العاصمة',
    neighborhood: 'دالي براهيم',
    bio: 'تصليح أجهزة التبريد والغسالات وتركيب الأطباق الهوائية وضبط أنظمة البيوت الذكية مع توفير قطع غيار أصلية بضمان.',
    verification: {
      idVerified: true,
      certVerified: false,
      khodamGuaranteed: false,
      topRated: false,
      level: 1,
      matricule: 'KD-DZ-16-0622',
      yearsExperience: 6,
      completedJobsCount: 130
    },
    phoneMasked: '+213 •• •• •• 90',
    trade: 'تبريد وكهرومنزلي وأنظمة ذكية',
    experienceYears: 6,
    completedJobsCount: 130,
    skills: ['شحن غاز تبريد', 'صيانة غسالات', 'تركيب أطباق', 'برمجة ذكية'],
    badges: ['هوية موثقة (مستوى 1)']
  },
  {
    id: 'art_7',
    name: 'عمي إبراهيم - بستاني ومهندس مساحات خضراء',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'agriculture_env',
    subCategoryIds: ['gardening'],
    rating: 4.91,
    reviewCount: 53,
    distanceKm: 3.9,
    isOnline: true,
    hourlyRate: 1300,
    city: 'الجزائر العاصمة',
    neighborhood: 'الشراقة',
    bio: 'عناية فائقة بالأشجار والنباتات وتنسيق حدائق الفلل وتركيب أنظمة السقي بالتنقيط العصرية للحفاظ على المياه.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0112',
      yearsExperience: 20,
      completedJobsCount: 180
    },
    phoneMasked: '+213 •• •• •• 22',
    trade: 'بستنة وزراعة مساحات خضراء',
    experienceYears: 20,
    completedJobsCount: 180,
    skills: ['تقليم أشجار', 'سقي بالتنقيط', 'تنسيق حدائق', 'أسمدة عضوية'],
    badges: ['هوية موثقة (مستوى 1)', 'دبلوم تقني فلاحي (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_8',
    name: 'سارة لخدمات التنظيف والنقل الشامل',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    categoryId: 'cleaning_facility',
    subCategoryIds: ['deep_cleaning', 'relocation_moving', 'pest_control'],
    rating: 4.86,
    reviewCount: 89,
    distanceKm: 1.7,
    isOnline: true,
    hourlyRate: 1200,
    city: 'الجزائر العاصمة',
    neighborhood: 'بوزريعة',
    bio: 'فريق متخصص في التنظيف العميق للبيوت بعد الترميم، وإدارة عمليات النقل السلس مع تعقيم شامل ومكافحة الحشرات.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0773',
      yearsExperience: 5,
      completedJobsCount: 210
    },
    phoneMasked: '+213 •• •• •• 61',
    trade: 'تنظيف عميق ونقل وترحيل',
    experienceYears: 5,
    completedJobsCount: 210,
    skills: ['تنظيف شامل', 'تغليف ونقل', 'إبادة حشرات', 'تلميع رخام'],
    badges: ['هوية موثقة (مستوى 1)', 'سجل تجاري وشهادة تسيير (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_9',
    name: 'المعلم رابح بلحاج',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['plumbing', 'heating_gas'],
    rating: 4.93,
    reviewCount: 165,
    distanceKm: 1.4,
    isOnline: true,
    hourlyRate: 1600,
    city: 'الجزائر العاصمة',
    neighborhood: 'الرويبة / درقانة',
    bio: 'أستاذ في السباكة والترصيص الصحي وتركيب شوفاج سنترال والمراجل الغازية وإصلاح الانسدادات المستعصية بكاميرات الفحص.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0551',
      yearsExperience: 18,
      completedJobsCount: 380
    },
    phoneMasked: '+213 •• •• •• 77',
    trade: 'سباكة وترصيص صحي وشوفاج',
    experienceYears: 18,
    completedJobsCount: 380,
    skills: ['سباكة نحاسية', 'كشف تسريبات', 'تركيب غلايات', 'تسليك مجاري'],
    badges: ['هوية موثقة (مستوى 1)', 'شهادة ماستر سباكة (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_10',
    name: 'وليد زروقي - كهرباء وإنارة عصرية',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['electrical', 'smart_automation'],
    rating: 4.89,
    reviewCount: 104,
    distanceKm: 2.0,
    isOnline: true,
    hourlyRate: 1700,
    city: 'الجزائر العاصمة',
    neighborhood: 'عين النعجة / كوكو بلاج',
    bio: 'كهرباء معمارية وصناعية، تركيب لوحات القواطع والحماية من الصعق الكهربائي، إضاءة مخفية LED وشبكات التغذية المستقرة.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0922',
      yearsExperience: 8,
      completedJobsCount: 190
    },
    phoneMasked: '+213 •• •• •• 88',
    trade: 'كهرباء شبكات ومنازل وإنارة',
    experienceYears: 8,
    completedJobsCount: 190,
    skills: ['لوحات قواطع', 'إنارة ليد', 'مخططات كهربائية', 'حماية تفاضلية'],
    badges: ['هوية موثقة (مستوى 1)', 'دبلوم تقني كهرباء (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_11',
    name: 'عبد النور تلمساني - نجار أثاث ومطابخ',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['carpentry', 'furniture_assembly'],
    rating: 4.96,
    reviewCount: 120,
    distanceKm: 2.5,
    isOnline: true,
    hourlyRate: 1900,
    city: 'الجزائر العاصمة',
    neighborhood: 'حسين داي / بلوزداد',
    bio: 'نجارة خشب وMDF حسب الطلب، تصليح الأبواب الخشبية، تركيب المطابخ العصرية وخزائن الحائط وغرف النوم بأعلى دقة تشطيب.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0318',
      yearsExperience: 12,
      completedJobsCount: 245
    },
    phoneMasked: '+213 •• •• •• 49',
    trade: 'نجارة خشب وأثاث ومطابخ',
    experienceYears: 12,
    completedJobsCount: 245,
    skills: ['تفصيل مطابخ', 'تركيب أبواب', 'غرف نوم', 'صيانة أثاث'],
    badges: ['هوية موثقة (مستوى 1)', 'دبلوم حرفي معتمد (مستوى 2)', 'ضمان خدام المالي']
  },
  {
    id: 'art_12',
    name: 'مراد شريفي - مفاتيح وأقفال مستعجلة',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['locks_keys', 'handyman_tasks'],
    rating: 4.92,
    reviewCount: 88,
    distanceKm: 0.9,
    isOnline: true,
    hourlyRate: 1400,
    city: 'الجزائر العاصمة',
    neighborhood: 'سيدي يحيى / بئر مراد رايس',
    bio: 'فتح الأبواب المغلقة بدون كسر 24/7، تغيير الكوالين والأقفال المصفحة، استنساخ المفاتيح الذكية وبرمجة ريموتات الكراج.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0174',
      yearsExperience: 10,
      completedJobsCount: 312
    },
    phoneMasked: '+213 •• •• •• 50',
    trade: 'أقفال ومفاتيح وأبواب مصفحة',
    experienceYears: 10,
    completedJobsCount: 312,
    skills: ['فتح أبواب مستعجل', 'تغيير كالون', 'أقفال أمان', 'برمجة ريموت'],
    badges: ['هوية موثقة (مستوى 1)', 'شهادة أمنية وتدريب (مستوى 2)', 'تدخل سريع']
  },
  {
    id: 'art_13',
    name: 'المعلم بوعلام ركاب - بناء وتلبيس وسيراميك',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'home_repair',
    subCategoryIds: ['masonry', 'tiles_ceramics'],
    rating: 4.87,
    reviewCount: 95,
    distanceKm: 3.1,
    isOnline: true,
    hourlyRate: 1750,
    city: 'الجزائر العاصمة',
    neighborhood: 'براقي / بئر توتة',
    bio: 'أشغال البناء والترميم، تركيب البلاط والسيراميك والفاينس للحمامات والمطابخ، تلييس إسمنتي متقن بالميزان الليزري.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0499',
      yearsExperience: 15,
      completedJobsCount: 220
    },
    phoneMasked: '+213 •• •• •• 38',
    trade: 'بناء وسيراميك وترميم',
    experienceYears: 15,
    completedJobsCount: 220,
    skills: ['تركيب سيراميك', 'تلييس إسمنتي', 'ترميم جدران', 'عزل مائي'],
    badges: ['هوية موثقة (مستوى 1)', 'شهادة كفاءة مهنية (مستوى 2)', 'ضمان خدام']
  },
  {
    id: 'art_f1',
    name: 'أم أمين للحلويات الجزائرية الأصيلة',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['traditional_sweets'],
    gender: 'female',
    rating: 4.98,
    reviewCount: 178,
    distanceKm: 1.1,
    isOnline: true,
    hourlyRate: 1600,
    city: 'الجزائر العاصمة',
    neighborhood: 'الأبيار / بن عكنون',
    bio: 'حرفية معتمدة متخصصة في صناعة الحلويات التقليدية والعصرية للأعراس والولائم: بقلاوة الجوز واللوز الملكية، مقروط اللوز، تشاراك، صواني خطوبة وكعكات مناسبات.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0741',
      yearsExperience: 12,
      completedJobsCount: 290
    },
    phoneMasked: '+213 •• •• •• 65',
    trade: 'صناعة الحلويات والمخبوزات للأعراس والمناسبات',
    experienceYears: 12,
    completedJobsCount: 290,
    skills: ['بقلاوة بالجوز واللوز', 'مقروط اللوز العاصمي', 'تشاراك مسكر', 'كعكات تخرج وأعراس'],
    qualificationTitle: 'شهادة كفاءة مهنية في صناعة الحلويات التقليدية (CAP) - غرفة الصناعة التقليدية والحرف',
    diplomaImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    ],
    badges: ['حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'دبلوم صناعة الحلويات (مستوى 2)', 'ضمان إتقان العمل']
  },
  {
    id: 'art_f2',
    name: 'مدام سميرة للخياطة الرفيعة والقفطان والكراكو',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['sewing_tailoring', 'embroidery_handcrafts'],
    gender: 'female',
    rating: 4.95,
    reviewCount: 142,
    distanceKm: 1.8,
    isOnline: true,
    hourlyRate: 1800,
    city: 'الجزائر العاصمة',
    neighborhood: 'حيدرة / دالي براهيم',
    bio: 'تفصيل وخياطة راقية للكراكو العاصمي بالمجبود الأصيل، قفاطين الأعراس، فساتين السهرة، مع أخذ القياسات بالمنزل وخدمة التوصيل وتعديل المقاسات الفوري.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0883',
      yearsExperience: 15,
      completedJobsCount: 230
    },
    phoneMasked: '+213 •• •• •• 21',
    trade: 'خياطة وتفصيل وتصميم الأزياء والقفطان والكراكو',
    experienceYears: 15,
    completedJobsCount: 230,
    skills: ['كراكو عاصمي', 'قفطان جزائري ومغربي', 'تعديل فساتين السهرة', 'خياطة فساتين الأعراس'],
    qualificationTitle: 'دبلوم تقني سامي TS في تصميم الأزياء وتفصيل اللباس التقليدي الجزائري',
    diplomaImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
    ],
    badges: ['حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'دبلوم تصميم أزياء (مستوى 2)', 'أعلى تقييم']
  },
  {
    id: 'art_f3',
    name: 'الحاجة فاطمة الزهراء للطبخ المنزلي والولائم',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['home_cooking_banquets'],
    gender: 'female',
    rating: 5.0,
    reviewCount: 95,
    distanceKm: 2.3,
    isOnline: true,
    hourlyRate: 1500,
    city: 'الجزائر العاصمة',
    neighborhood: 'القبة / بئر خادم',
    bio: 'طبخ منزلي نظيف وأصيل لموائد العائلات والولائم الكبرى: كسكسي أعراس باللحم، شخشوخة بسكرية، رشتة عاصمية بالدجاج البلدي، طواجن وشوربة فريك مع مقبلات وسلطات طازجة.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0155',
      yearsExperience: 18,
      completedJobsCount: 160
    },
    phoneMasked: '+213 •• •• •• 77',
    trade: 'الطبخ المنزلي والمأكولات الجزائرية والولائم العائلية',
    experienceYears: 18,
    completedJobsCount: 160,
    skills: ['كسكسي أعراس باللحم', 'شخشوخة بسكرية حارة', 'رشتة عاصمية بالدجاج', 'طواجن ومقبلات منزلية'],
    qualificationTitle: 'خبرة عائلية 18 سنة في إعداد ولائم ومآدب الأعراس والمناسبات الكبرى ونظافة معتمدة',
    portfolioImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80'
    ],
    badges: ['حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'شهادة صحية ونظافة', 'تقييم 5 نجوم']
  },
  {
    id: 'art_f4',
    name: 'الأستاذة مريم للتطريز الفني والأشغال اليدوية',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['embroidery_handcrafts'],
    gender: 'female',
    rating: 4.91,
    reviewCount: 64,
    distanceKm: 3.1,
    isOnline: true,
    hourlyRate: 1300,
    city: 'الجزائر العاصمة',
    neighborhood: 'البليدة / بوفاريك',
    bio: 'طرز يدوي متقن بخيوط الحرير والفتلة والمجبود، تزيين وسائد ومفارش جهاز العروسة وشبيكة عصرية بأشكال فنية متميزة وتفاصيل دقيقة.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-09-0312',
      yearsExperience: 9,
      completedJobsCount: 110
    },
    phoneMasked: '+213 •• •• •• 44',
    trade: 'التطريز اليدوي والطرز بالمجبود والشبيكة والكروشي',
    experienceYears: 9,
    completedJobsCount: 110,
    skills: ['طرز المجبود', 'الفتلة الجزائرية', 'شبيكة عصرية', 'كروشي يدوي ومفارش عرايس'],
    qualificationTitle: 'شهادة تأهيل حرفي في التطريز التقليدي من دار الحرفيين وغرفة الصناعة التقليدية',
    portfolioImages: [
      'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80'
    ],
    badges: ['حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'دبلوم تطريز تقليدي (مستوى 2)']
  },
  {
    id: 'art_f5',
    name: 'سيدة حليمة لمجالسة ورعاية الأطفال في المنازل (Nounou)',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['home_nanny_care'],
    gender: 'female',
    rating: 4.96,
    reviewCount: 88,
    distanceKm: 1.4,
    isOnline: true,
    hourlyRate: 1100,
    city: 'الجزائر العاصمة',
    neighborhood: 'المرادية / المدنية',
    bio: 'مربية أطفال معتمدة ذات ثقة وأمانة، خبرة 10 سنوات في العناية بالرضع والأطفال الصغار، تحضير وجبات صحية، أنشطة تربوية، ومساعدة في الواجبات المدرسية.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: true,
      level: 2,
      matricule: 'KD-DZ-16-0419',
      yearsExperience: 10,
      completedJobsCount: 195
    },
    phoneMasked: '+213 •• •• •• 92',
    trade: 'مجالسة ورعاية الأطفال في المنازل (Nounou)',
    experienceYears: 10,
    completedJobsCount: 195,
    skills: ['رعاية رضع', 'وجبات صحية للأطفال', 'إسعافات أولية أطفال', 'أنشطة ترفيهية'],
    qualificationTitle: 'شهادة دولة في تربية ورعاية الطفولة المبكرة + فحص طبي شامل وسجل عدلي نظيف',
    badges: ['حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'شهادة تربية طفولة (مستوى 2)', 'أعلى درجات الأمانة']
  },
  {
    id: 'art_job_1',
    name: 'فؤاد بلحاج - تقني صيانة تكييف وتبريد',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    categoryId: 'tech_smart_home',
    subCategoryIds: ['appliance_repair'],
    gender: 'male',
    rating: 4.88,
    reviewCount: 42,
    distanceKm: 2.2,
    isOnline: true,
    hourlyRate: 1400,
    city: 'الجزائر العاصمة',
    neighborhood: 'باب الزوار / برج الكيفان',
    bio: 'تقني تبريد وتكييف هواء مؤهل، أبحث عن مشاريع عمل وورشات: تركيب وصيانة مكيفات سبليت، شحن غاز R410 و R22، تنظيف المكثفات، وكشف الأعطال الكهربائية في أجهزة التبريد.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: false,
      level: 2,
      matricule: 'KD-DZ-16-0951',
      yearsExperience: 5,
      completedJobsCount: 85
    },
    phoneMasked: '+213 •• •• •• 84',
    trade: 'صيانة وتركيب مكيفات الهواء وأجهزة التبريد',
    experienceYears: 5,
    completedJobsCount: 85,
    skills: ['تركيب مكيفات سبليت', 'شحن غاز تبريد', 'كشف أعطال كومبريسور', 'صيانة غسالات وثلاجات'],
    qualificationTitle: 'شهادة تقني تبريد وتكييف الهواء (TS Froid & Climatisation) - مركز التكوين المهني',
    diplomaImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80'
    ],
    availabilityType: 'daily',
    isSeekingWork: true,
    workSeekingDescription: 'متاح للعمل اليومي والأسبوعي في الورشات والمنازل والمحلات بالجزائر العاصمة وضواحيها، معداتي كاملة ومتنقل بسيارة.',
    badges: ['طالب عمل متاح فوراً', 'هوية موثقة (مستوى 1)', 'دبلوم تقني معتمد (مستوى 2)']
  },
  {
    id: 'art_job_2',
    name: 'خديجة بوعزيز - خياطة ومصممة ملابس نسائية',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    categoryId: 'women_crafts',
    subCategoryIds: ['sewing_tailoring'],
    gender: 'female',
    rating: 4.92,
    reviewCount: 38,
    distanceKm: 1.5,
    isOnline: true,
    hourlyRate: 1500,
    city: 'الجزائر العاصمة',
    neighborhood: 'باش جراح / الحراش',
    bio: 'خياطة ماهرة خريجة معهد التكوين المهني تبحث عن زبائن وطلبيات لتفصيل الجبات المنزلية، قفاطين بسيطة، أطقم المطبخ والمفارش، وتصليح وتعديل مقاسات الملابس بأسعار مناسبة جداً.',
    verification: {
      idVerified: true,
      certVerified: true,
      khodamGuaranteed: true,
      topRated: false,
      level: 2,
      matricule: 'KD-DZ-16-0972',
      yearsExperience: 4,
      completedJobsCount: 60
    },
    phoneMasked: '+213 •• •• •• 19',
    trade: 'خياطة وتفصيل وتصميم ملابس نسائية وأطقم منزلية',
    experienceYears: 4,
    completedJobsCount: 60,
    skills: ['خياطة جبات صيفية وشتوية', 'تعديل مقاسات الملابس', 'تفصيل مفارش مطبخ وأسرة', 'خياطة فساتين بنات'],
    qualificationTitle: 'شهادة كفاءة مهنية في الخياطة وتفصيل الملابس الجاهزة (CAP Couture)',
    diplomaImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80'
    ],
    availabilityType: 'full_time',
    isSeekingWork: true,
    workSeekingDescription: 'مستعدة لاستقبال طلبيات الزبائن والمشاغل وورشات الخياطة بالقطعة أو بالشهر، مع إتقان عالي وتسليم في الوقت المحدد.',
    badges: ['طالبة عمل متاحة فوراً', 'حرفية معتمدة (نساء)', 'هوية موثقة (مستوى 1)', 'دبلوم خياطة (مستوى 2)']
  }
];

export const initialActiveOrder: Order = {
  id: 'ord_kh_108',
  clientId: 'client_me',
  clientName: 'هشام بن علي',
  clientPhone: '+213 550 12 34 56',
  clientPhoneVisible: true,
  clientAddressDetails: 'حي البساتين، عمارة 14، الشقة 5، الطابق 2، الأبيار',
  preferredContact: 'direct_call',
  artisanId: 'art_1',
  artisanName: 'المعلم كمال بلقاسم',
  artisanAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
  artisanPhoneMasked: '+213 •• •• •• 89',
  categoryId: 'home_repair',
  subServiceId: 'plumbing',
  subServiceName: 'أعمال السباكة وتسريب المياه',
  type: 'instant',
  address: 'حي البساتين، عمارة 14، الشقة 5، الأبيار',
  city: 'الجزائر العاصمة',
  notes: 'تسريب مائي قوي في أنبوب حوض المطبخ أسفل الحنفية مع رغبة في استبدال الصمام الرئيسي.',
  status: 'on_the_way',
  createdAt: 'اليوم في 14:15',
  updatedAt: 'اليوم في 14:22',
  estimatedCost: 3500,
  ratingGiven: false
};

export const initialActiveOrders: Order[] = [
  initialActiveOrder,
  {
    id: 'ord_kh_109',
    clientId: 'client_me',
    clientName: 'هشام بن علي',
    clientPhone: '+213 550 12 34 56',
    clientPhoneVisible: true,
    clientAddressDetails: 'شارع حسيبة بن بوعلي، رقم 48، الجزائر العاصمة',
    preferredContact: 'whatsapp',
    artisanId: 'art_2',
    artisanName: 'المهندس أمين الشريف',
    artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    artisanPhoneMasked: '+213 •• •• •• 45',
    categoryId: 'home_repair',
    subServiceId: 'electrical',
    subServiceName: 'الكهرباء والتمديدات المنزلية والإنارة',
    type: 'scheduled',
    scheduledDate: '2026-10-07',
    scheduledTime: '10:00 - 12:00',
    address: 'شارع حسيبة بن بوعلي، الجزائر العاصمة',
    city: 'الجزائر العاصمة',
    notes: 'فحص القاطع التفاضلي وتركيب 6 سبوتات ليد ذكية في الممر.',
    status: 'artisan_assigned',
    createdAt: 'اليوم في 11:30',
    updatedAt: 'اليوم في 12:00',
    estimatedCost: 4500,
    ratingGiven: false
  }
];

export const sampleProjectQuotes: ProjectQuoteRequest[] = [
  {
    id: 'quote_req_1',
    clientId: 'client_me',
    clientName: 'هشام بن علي',
    title: 'تجديد دهان شقة F4 كاملة مع تصليح تشققات الجبس',
    category: 'صيانة وإصلاحات المنازل',
    description: 'شقة بمساحة 110 متر مربع تحتاج إلى صنفرة الجدران، معالجة الرطوبة والتشققات، ثم تطبيق طبقتين من طلاء ساتيني عالي الجودة مع ديكور جبسي في الصالون.',
    budgetEstimated: '40000 - 65000 دج',
    city: 'الجزائر العاصمة - حيدرة',
    status: 'open',
    createdAt: 'منذ يومين',
    bids: [
      {
        id: 'bid_1',
        artisanId: 'art_4',
        artisanName: 'سفيان مرابط - دهان وجبس ديكور',
        artisanAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        artisanRating: 4.82,
        artisanVerification: {
          idVerified: true,
          certVerified: true,
          khodamGuaranteed: true,
          topRated: false,
          level: 2,
          matricule: 'KD-DZ-2026-4419',
          yearsExperience: 11,
          completedJobsCount: 145
        },
        bidAmount: 48000,
        estimatedDays: 4,
        proposalText: 'أقترح خطة عمل على 4 أيام: اليوم الأول معالجة التشققات وصنفرة الجدران بالكامل، اليوم الثاني والثالث طلاء بماركة سيجما أو ناشيونال، واليوم الرابع تشطيبات الجبس والتنظيف الشامل.',
        includesMaterials: true,
        submittedAt: 'منذ 5 ساعات',
        status: 'pending'
      },
      {
        id: 'bid_2',
        artisanId: 'art_102',
        artisanName: 'حسين الديكور للمقاولات',
        artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        artisanRating: 4.92,
        artisanVerification: {
          idVerified: true,
          certVerified: true,
          khodamGuaranteed: true,
          topRated: true,
          level: 2,
          matricule: 'KD-DZ-2026-1028',
          yearsExperience: 15,
          completedJobsCount: 280
        },
        bidAmount: 55000,
        estimatedDays: 3,
        proposalText: 'فريق مكون من 3 دهانين محترفين لإنجاز العمل في 3 أيام بدون أي تأخير، يشمل دهان مقاوم للرطوبة والعفن وضمان لمدة سنتين مسجل في عقد خدام.',
        includesMaterials: true,
        submittedAt: 'منذ يوم',
        status: 'pending'
      }
    ]
  }
];

export const sampleReviews: Review[] = [
  {
    id: 'rev_1',
    artisanId: 'art_1',
    clientId: 'cl_44',
    clientName: 'فاروق م.',
    rating: 5,
    punctualityScore: 5,
    qualityScore: 5,
    behaviorScore: 5,
    comment: 'ما شاء الله على المعلم كمال، وصل في الوقت تماماً وحدد مكان التسريب المخفي داخل الحائط بدون تكسير عشوائي. عمل احترافي ومتقن وأنصح به بشدة.',
    serviceName: 'أعمال السباكة وتسريب المياه',
    date: 'منذ 3 أيام',
    verifiedJob: true
  },
  {
    id: 'rev_2',
    artisanId: 'art_1',
    clientId: 'cl_19',
    clientName: 'نسرين ز.',
    rating: 5,
    punctualityScore: 5,
    qualityScore: 4.8,
    behaviorScore: 5,
    comment: 'إنسان أمين ومحترم جداً، الأسعار كانت واضحة من البداية ولم يطلب أي زيادة. بارك الله فيه وفي منصة خدام.',
    serviceName: 'تركيب صمامات ومضخة مياه',
    date: 'منذ أسبوع',
    verifiedJob: true
  },
  {
    id: 'rev_3',
    artisanId: 'art_2',
    clientId: 'cl_82',
    clientName: 'جمال ق.',
    rating: 5,
    punctualityScore: 5,
    qualityScore: 5,
    behaviorScore: 5,
    comment: 'قام بتركيب شبكة كاميرات للمبنى ولوحة قواطع جديدة بجودة عالية جداً وترتيب أسلاك مذهل. يستحق علامة كاملة.',
    serviceName: 'تمديد الشبكات وكاميرات المراقبة',
    date: 'منذ 5 أيام',
    verifiedJob: true
  }
];

export const sampleMessages: ChatMessage[] = [
  // Conversation 1: Kemal Belkacem (Plumber)
  {
    id: 'msg_1',
    conversationId: 'conv_art_1',
    senderId: 'art_1',
    senderName: 'المعلم كمال بلقاسم',
    senderRole: 'artisan',
    text: 'السلام عليكم أخي هشام، تم تأكيد الطلب وأنا في الطريق إليك الآن بالدراجة ومعي حقيبة الأدوات وقطع الغيار المطلوبة.',
    timestamp: '14:23',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg_2',
    conversationId: 'conv_art_1',
    senderId: 'client_me',
    senderName: 'هشام بن علي',
    senderRole: 'client',
    text: 'وعليكم السلام معلم كمال، مرحباً بك. الباب الخارجي للعمارة مفتوح والشقة بالطابق الثاني.',
    timestamp: '14:24',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg_3',
    conversationId: 'conv_art_1',
    senderId: 'art_1',
    senderName: 'المعلم كمال بلقاسم',
    senderRole: 'artisan',
    text: 'ممتاز أخي، مسافة 5 دقائق وأكون أمام الباب بإذن الله.',
    timestamp: '14:26',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg_4',
    conversationId: 'conv_art_1',
    senderId: 'art_1',
    senderName: 'المعلم كمال بلقاسم',
    senderRole: 'artisan',
    text: 'تسجيل صوتي لتأكيد نوعية صمام الأمان المطلوب استبداله',
    timestamp: '14:28',
    isAudio: true,
    audioDuration: '0:18',
    isRead: true,
    status: 'read'
  },
  // Conversation 2: Hamid Ben Ammar (Electrician)
  {
    id: 'msg_h1',
    conversationId: 'conv_art_2',
    senderId: 'client_me',
    senderName: 'هشام بن علي',
    senderRole: 'client',
    text: 'السلام عليكم أخي حميد، لدي انقطاع متكرر في قاطع الكهرباء الرئيسي بعد تشغيل السخان.',
    timestamp: '11:15',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg_h2',
    conversationId: 'conv_art_2',
    senderId: 'art_2',
    senderName: 'حميد بن عمار',
    senderRole: 'artisan',
    text: 'وعليكم السلام، على الأرجح حمولة زائدة أو التماس في مقاومة السخان. سأمر عليك لمعاينة لوحة القواطع وقياس العزل بالميغومتر.',
    timestamp: '11:20',
    isRead: true,
    status: 'read'
  },
  // Conversation 3: Rachid Haddad (Locksmith)
  {
    id: 'msg_r1',
    conversationId: 'conv_art_3',
    senderId: 'client_me',
    senderName: 'هشام بن علي',
    senderRole: 'client',
    text: 'مرحبا أخي رشيد، هل لديك كالون وقفل إيطالي أصلي مضاد للكسر لباب مصفح؟',
    timestamp: 'أمس',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg_r2',
    conversationId: 'conv_art_3',
    senderId: 'art_3',
    senderName: 'رشيد حداد',
    senderRole: 'artisan',
    text: 'نعم متوفر ماركة Cisa الإيطالية مع 5 مفاتيح مشفرة وبطاقة الملكية الأصلية وضمان لمدة عامين.',
    timestamp: 'أمس',
    isRead: true,
    status: 'read'
  }
];

export const sampleAppointments: Appointment[] = [
  {
    id: 'apt_1',
    orderId: 'ord_1',
    clientId: 'client_me',
    clientName: 'هشام بن علي',
    clientPhone: '0550 12 34 56',
    artisanId: 'art_1',
    artisanName: 'المعلم كمال بلقاسم',
    artisanTrade: 'سباكة وترصيص صحي وشوفاج',
    artisanAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    serviceName: 'معاينة وإصلاح تسريب مائي في الحمام',
    date: '2026-10-10',
    timeSlot: '10:00 - 11:30',
    type: 'inspection',
    status: 'confirmed',
    wilaya: 'الجزائر العاصمة',
    address: 'حي البساتين، عمارة 14، الشقة 5 - الأبيار',
    notes: 'يرجى إحضار جهاز كشف التسريبات بالأشعة لعدم كسر البلاط.',
    estimatedPrice: 3500,
    confirmedAt: '2026-10-09 11:30',
    createdAt: '2026-10-09 09:15'
  },
  {
    id: 'apt_2',
    clientId: 'client_me',
    clientName: 'هشام بن علي',
    clientPhone: '0550 12 34 56',
    artisanId: 'art_2',
    artisanName: 'حميد بن عمار',
    artisanTrade: 'كهرباء معمارية وإنارة LED',
    artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceName: 'تجديد لوحة القواطع الكهربائية والتأريض',
    date: '2026-10-12',
    timeSlot: '14:30 - 16:00',
    type: 'execution',
    status: 'pending_confirmation',
    wilaya: 'الجزائر العاصمة',
    address: 'فيلا رقم 8، طريق الساحل - زرالدة',
    notes: 'اللوحة القديمة تفصل كلما شغلنا سخان الماء والمكيف.',
    estimatedPrice: 6000,
    createdAt: '2026-10-09 14:00'
  },
  {
    id: 'apt_3',
    clientId: 'client_3',
    clientName: 'سارة مرابطي',
    clientPhone: '0661 88 99 00',
    artisanId: 'art_1',
    artisanName: 'المعلم كمال بلقاسم',
    artisanTrade: 'سباكة وتدفئة مركزية',
    artisanAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    serviceName: 'تشغيل وتطهير شبكة الرادياتور للشتاء',
    date: '2026-10-14',
    timeSlot: '09:00 - 10:30',
    type: 'inspection',
    status: 'confirmed',
    wilaya: 'البليدة',
    address: 'وسط المدينة، نهج أول نوفمبر',
    notes: 'التدفئة المركزية لم تشتغل منذ الموسم الماضي وتحتاج تنفيس وتنظيف.',
    estimatedPrice: 4500,
    confirmedAt: '2026-10-09 16:20',
    createdAt: '2026-10-09 15:00'
  }
];

export const sampleWorkPosts: WorkPost[] = [
  {
    id: 'post_1',
    authorId: 'art_1',
    authorName: 'المعلم كمال بلقاسم',
    authorAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'سباك وترصيص صحي',
    authorLevel: 2,
    title: 'تجديد شبكة سباكة كاملة وتمديدات PEX لشقة عصرية بالأبيار',
    description: 'تم اليوم بحمد الله الانتهاء من تجديد كامل لشبكة التغذية المائية والصرف الصحي لشقة 120م². استعملنا أنابيب PEX-AL-PEX مع صمامات إيطالية أصلية، وتم إجراء فحص الضغط المائي لمدة 4 ساعات عند 10 بار بدون أي قطرة تسريب. نظافة تامة بعد العمل.',
    image: '/src/assets/images/home_plumbing_service_1791156501756.jpg',
    location: 'الأبيار، الجزائر العاصمة',
    createdAt: 'اليوم في 11:30',
    likesCount: 38,
    hasLiked: false,
    comments: [
      {
        id: 'c_1',
        authorName: 'فاروق م.',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'ما شاء الله تبارك الرحمن، تمديدات مرتبة ونظافة في العمل تستحق الإشادة!',
        date: 'منذ ساعتين'
      },
      {
        id: 'c_2',
        authorName: 'أمين الشريف',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'عمل احترافي من معلم كبير، بالتوفيق يا كمال.',
        date: 'منذ ساعة'
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'art_2',
    authorName: 'المهندس أمين الشريف',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'كهربائي وأنظمة ذكية',
    authorLevel: 2,
    title: 'تركيب لوحة توزيع كهربائية ثلاثية الطور (Triphasé) مع قواطع حماية ذكية',
    description: 'إنجاز تركيب خزانة قواطع شنايدر أصلية مع قواطع تفاضلية 30mA لحماية الأطفال والأجهزة، ونظام تحكم عن بعد عبر الهاتف مع حماية من تذبذب الجهد الكهربائي.',
    image: '/src/assets/images/electrical_modern_service_1791156512564.jpg',
    location: 'المرادية، الجزائر العاصمة',
    createdAt: 'أمس في 16:45',
    likesCount: 54,
    hasLiked: true,
    comments: [
      {
        id: 'c_3',
        authorName: 'رضا بن قاسم',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        text: 'ترتيب الأسلاك هندسي ومتقن جداً، ربي يبارك في رزقك.',
        date: 'أمس'
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'art_4',
    authorName: 'سفيان مرابط - دهان وجبس ديكور',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'دهان وديكورات جبسية',
    authorLevel: 2,
    title: 'تشطيب صالون مغربي عصري مع سقف جبس معلق BA13 وإضاءة ليد مخفية',
    description: 'تم الانتهاء من طلاء صالون بطلاء لؤلؤي معالج ضد الرطوبة مع ديكورات أسقف جبسية متناسقة. تم تسليم العمل في 3 أيام بدون أي تأخير.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    location: 'القبة، الجزائر العاصمة',
    createdAt: 'منذ يومين',
    likesCount: 62,
    hasLiked: false,
    comments: [
      {
        id: 'c_4',
        authorName: 'سارة بوحليفة',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        text: 'الألوان متناسقة وراقية جداً!',
        date: 'منذ يومين'
      }
    ]
  },
  {
    id: 'post_recharge_1',
    authorId: 'art_digital_zone',
    authorName: 'متجر ديجيتال بلادي — شحن ألعاب وقنوات',
    authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'شحن ألعاب وبطاقات واشتراكات قنوات IPTV',
    authorLevel: 2,
    title: '🎮 شحن فوري لجواهر فري فاير، شدات ببجي، واشتراكات IPTV 4K بالـ BaridiMob و CCP',
    description: 'متجرنا معتمد في منصة خدام لتقديم خدمات الشحن الرقمي المباشر. شحن جواهر Free Fire بالأيدي فقط خلال 3 إلى 7 دقائق، شدات PUBG Mobile، بطاقات PlayStation وSteam، واشتراكات سيرفرات IPTV (Smarters & Lynx) لمتابعة جميع المباريات بدون انقطاع، مع حسابات Netflix و Shahid VIP بضمان كامل 100%. الدفع متاح عبر BaridiMob أو CCP مع وصل فوري.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    location: 'الجزائر العاصمة وكافة الولايات (فوري أونلاين)',
    createdAt: 'اليوم في 12:40',
    likesCount: 94,
    hasLiked: true,
    comments: [
      {
        id: 'c_rec_1',
        authorName: 'ياسين بلخير',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'شحنت 1080 UC ببجي ووصلت في 4 دقائق فقط عبر بريدي موب! سرعة وثقة ما شاء الله.',
        date: 'منذ ساعتين'
      },
      {
        id: 'c_rec_2',
        authorName: 'كريم وهراني',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        text: 'اشتراك الـ IPTV شغال 10/10 في ماتشات الشامبيونزليغ بدون أي لاغ، يعطيك الصحة.',
        date: 'منذ 3 ساعات'
      }
    ]
  },
  {
    id: 'post_rental_1',
    authorId: 'art_rentals_agency',
    authorName: 'وكالة الأمانة لكراء السيارات والشاحنات والعربات',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'كراء سيارات سياحية وشاحنات نقل وعربات سحب',
    authorLevel: 2,
    title: '🚗 🚚 أسطول كراء سيارات سياحية حديثة وشاحنات نقل البضائع والعفش وعربات Dépannage',
    description: 'نوفر لزبائننا الكرام خدمات استئجار متكاملة بعقود نظامية وتأمين شامل: سيارات سياحية حديثة ومكيفة (Clio 5, Stepway 2024, Accent, Tucson)، شاحنات نقل عفش وبضائع (Kia K2700 صندوق مفتوح، Renault Master Fourgon مغلق) مع سائقين محترفين أو بدون سائق، وعربات سحب هيدروليكية Dépannage لإنقاذ ونقل المركبات في كافة ولايات الوطن 24/7. تسليم في المطار أو عند باب منزلك.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    location: 'الجزائر العاصمة، وهران، قسنطينة والبليدة',
    createdAt: 'اليوم في 10:15',
    likesCount: 88,
    hasLiked: false,
    comments: [
      {
        id: 'c_rent_1',
        authorName: 'مراد بن عيسى',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'استأجرت شاحنة كيا لنقل أثاث منزلي من القبة إلى بومرداس، سائق محترم ومواعيد مضبوطة بدقة.',
        date: 'اليوم'
      },
      {
        id: 'c_rent_2',
        authorName: 'حمزة سطايفي',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        text: 'السيارة ستيبواي نظيفة جداً كأنها خارجة من لا ميزون، وإجراءات العقد كانت سريعة وسلسة.',
        date: 'أمس'
      }
    ]
  }
];

export const sampleVerificationRequests: VerificationRequest[] = [
  {
    id: 'v_req_1',
    artisanId: 'art_3',
    artisanName: 'طارق عبد السلام (Dépannage)',
    artisanAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    trade: 'خدمات سيارات ومساعدة طريق',
    level: 1,
    idCardImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    selfieImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    submittedAt: 'اليوم في 10:15',
    status: 'pending',
    notes: 'تم تقديم بطاقة الهوية البيومترية وصورة سيلفي مطابقة لطلب التوثيق المستوى 1.'
  },
  {
    id: 'v_req_2',
    artisanId: 'art_6',
    artisanName: 'يوسف تقني الأجهزة والأنظمة الذكية',
    artisanAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    trade: 'تقنية وأجهزة كهرومنزلية',
    level: 2,
    diplomaImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=80',
    diplomaTitle: 'شهادة تقني سامي (BTS) في التبريد والتكييف الصناعي والمنزلي',
    submittedAt: 'منذ يوم',
    status: 'pending',
    notes: 'شهادة رسمية صادرة من المعهد الوطني المتخصص في التكوين المهني.'
  }
];

export const initialArtisanSchedule: ArtisanSchedule = {
  workingDays: {
    sat: true,
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: false // الجمعة عطلة افتراضية
  },
  startHour: '08:00',
  endHour: '18:00',
  breakStart: '12:30',
  breakEnd: '13:30',
  vacationDates: ['2026-10-16'],
  acceptsEmergencyCalls: true,
  timeSlotDurationMinutes: 60
};

export const initialBenchmarkPrices: BenchmarkPriceItem[] = [
  {
    id: 'bp_1',
    title: 'تركيب مكيف سبليت جديد (Split 9000 - 18000 BTU)',
    category: 'التبريد والتكييف والأجهزة',
    categoryIcon: 'Snowflake',
    description: 'تثبيت الوحدة الداخلية والخارجية، حفر الجدار، مد الأنابيب النحاسية حتى 3 أمتار، والتفريغ والتشغيل التجريبي.',
    minPrice: 3500,
    avgPrice: 4200,
    maxPrice: 5500,
    durationEstimate: '60 - 90 دقيقة',
    includesMaterials: false,
    pricingNotes: 'أجرة اليد العاملة فقط. في حال تجاوز طول النحاس 3 أمتار يُحسب المتر الإضافي بسعر السوق.',
    popular: true
  },
  {
    id: 'bp_2',
    title: 'شحن غاز فريون للمكيف (Fréon R410A / R32)',
    category: 'التبريد والتكييف والأجهزة',
    categoryIcon: 'Snowflake',
    description: 'فحص الضغط بجهاز المانومتر، كشف التسريب المحتمل، وإعادة شحن الدائرة بالغاز الأصلي بالوزن المناسب.',
    minPrice: 2500,
    avgPrice: 3500,
    maxPrice: 4500,
    durationEstimate: '30 - 45 دقيقة',
    includesMaterials: true,
    pricingNotes: 'يشمل ثمن الغاز المعبأ وفحص سلامة الصمامات.',
    popular: true
  },
  {
    id: 'bp_3',
    title: 'تغيير قلب قفل باب مدخل (Cylindre / Barillet)',
    category: 'النجارة والأقفال',
    categoryIcon: 'Key',
    description: 'فك قلب القفل القديم العاطل، تنظيف التجويف، وتركيب قلب أمان جديد مع تسليم المفاتيح الأصلية.',
    minPrice: 1500,
    avgPrice: 2000,
    maxPrice: 2800,
    durationEstimate: '20 - 30 دقيقة',
    includesMaterials: false,
    pricingNotes: 'يشمل التركيب وضبط الإغلاق السلس. يُشترى قلب القفل حسب اختيار العميل (عادي أو مصفح).',
    popular: true
  },
  {
    id: 'bp_4',
    title: 'تصليح تسريب حنفية مياه وتغيير جلدة/جوان',
    category: 'السباكة والترصيص الصحي',
    categoryIcon: 'Droplets',
    description: 'فك رأس الحنفية، معالجة التكلس، استبدال الجوان أو قلب السيراميك التالف لمنع تنقيط المياه نهائياً.',
    minPrice: 1200,
    avgPrice: 1800,
    maxPrice: 2500,
    durationEstimate: '25 - 40 دقيقة',
    includesMaterials: true,
    pricingNotes: 'يشمل الجلود والسيليكون وشريط التفلون الأساسي.',
    popular: true
  },
  {
    id: 'bp_5',
    title: 'تركيب سخان ماء غازي أو كهربائي (Chauffe-eau)',
    category: 'السباكة والترصيص الصحي',
    categoryIcon: 'Flame',
    description: 'تثبيت السخان على الجدار، توصيل مدخل الماء البارد والساخن مع صمام الأمان وتوصيل الغاز أو الكهرباء وتجربة الاشتعال.',
    minPrice: 3500,
    avgPrice: 4500,
    maxPrice: 6000,
    durationEstimate: '45 - 75 دقيقة',
    includesMaterials: false,
    pricingNotes: 'أجرة التركيب وفحص الأمان والتهوية. الخراطيم المرنة تُوفر بمعرفة العميل أو تحسب إضافياً.',
    popular: true
  },
  {
    id: 'bp_6',
    title: 'تسليك بالوعة مطبخ أو حمام مسدودة',
    category: 'السباكة والترصيص الصحي',
    categoryIcon: 'Wrench',
    description: 'استخدام سلك السوستة الاحترافي أو جهاز الضغط الهوائي لإزالة الرواسب والدهون العالقة وإعادة تدفق المياه بسلاسة.',
    minPrice: 2000,
    avgPrice: 2800,
    maxPrice: 4000,
    durationEstimate: '30 - 60 دقيقة',
    includesMaterials: true,
    pricingNotes: 'السعر يشمل التنظيف وإزالة الانسداد. لا يُطلب أي مقابل إن لم يُحل الانسداد.',
    popular: true
  },
  {
    id: 'bp_7',
    title: 'تركيب مأخذ كهربائي (Prise) أو مفتاح إنارة',
    category: 'الكهرباء المنزلية والإنارة',
    categoryIcon: 'Zap',
    description: 'ربط الأسلاك بأمان وتثبيت المأخذ أو المفتاح داخل العلبة الجدارية وفحص الجهد والتأريض.',
    minPrice: 800,
    avgPrice: 1200,
    maxPrice: 1800,
    durationEstimate: '15 - 25 دقيقة',
    includesMaterials: false,
    pricingNotes: 'أجرة تركيب القطعة الواحدة، وينخفض السعر عند تركيب أكثر من 3 قطع في نفس الزيارة.',
    popular: true
  },
  {
    id: 'bp_8',
    title: 'تركيب لوحة قواطع كهربائية وتفاضلي (Tableau)',
    category: 'الكهرباء المنزلية والإنارة',
    categoryIcon: 'Zap',
    description: 'تجميع وترتيب لوحة التوزيع، ربط القواطع الفرعية، تركيب القاطع التفاضلي 30mA وفحص خطوط المنزل بالكامل.',
    minPrice: 4500,
    avgPrice: 6000,
    maxPrice: 8500,
    durationEstimate: '90 - 150 دقيقة',
    includesMaterials: false,
    pricingNotes: 'يشمل الفحص الشامل للأحمال وتوزيع الخطوط لمنع انقطاع التيار المفاجئ.',
    popular: true
  },
  {
    id: 'bp_9',
    title: 'دهان جدران داخلي بالمتر المربع (Peinture)',
    category: 'الدهان والتشطيبات والديكور',
    categoryIcon: 'Paintbrush',
    description: 'تنظيف الجدار، معجون تسوية، سنفرة ناعمة، ثم تطبيق وجهين من طلاء الفينيل أو الساتيني الفاخر.',
    minPrice: 350,
    avgPrice: 450,
    maxPrice: 650,
    durationEstimate: 'حسب مساحة الغرفة',
    includesMaterials: false,
    pricingNotes: 'السعر للمتر المربع الواحد يد عاملة. في حال شمل الطلاء والمعجون يتم احتساب 800 - 1200 دج/م².'
  },
  {
    id: 'bp_10',
    title: 'تركيب سيراميك أرضيات أو فاينس جدران (للمتر)',
    category: 'البناء والترميم والتشطيب',
    categoryIcon: 'Layers',
    description: 'خلط الملاط أو الغراء الإسمنتي، ضبط الميزان بالليزر، تركيب البلاط مع الفواصل وملء الفراغات بالإسمنت الأبيض.',
    minPrice: 900,
    avgPrice: 1200,
    maxPrice: 1600,
    durationEstimate: 'حسب المساحة',
    includesMaterials: false,
    pricingNotes: 'سعر اليد العاملة للمتر المربع الواحد. الأرضيات المستوية تتطلب وقتاً وتكلفة أقل.'
  },
  {
    id: 'bp_11',
    title: 'صيانة غسالة ملابس وتغيير مضخة تصريف أو سير',
    category: 'التبريد والتكييف والأجهزة',
    categoryIcon: 'Cpu',
    description: 'فحص دورة العصر والتصريف، فك المضخة التالفة أو السير المقطوع وتركيب القطعة الأصلية وتجربة الدورة.',
    minPrice: 2500,
    avgPrice: 3500,
    maxPrice: 4500,
    durationEstimate: '45 - 60 دقيقة',
    includesMaterials: false,
    pricingNotes: 'أجرة الفحص والتركيب مع ضمان على التركيب لمدة 3 أشهر.'
  },
  {
    id: 'bp_12',
    title: 'خدمة ديباناج وسحب سيارة معطلة (داخل الولاية)',
    category: 'ميكانيك وسحب السيارات',
    categoryIcon: 'Truck',
    description: 'وصول شاحنة الديباناج المزودة برافعة هيدروليكية، تحميل السيارة بأمان، ونقلها للورشة أو للمنزل.',
    minPrice: 3500,
    avgPrice: 4500,
    maxPrice: 6000,
    durationEstimate: 'حسب مسافة السحب',
    includesMaterials: true,
    pricingNotes: 'تسعيرة السحب داخل النطاق الحضري حتى 15 كم. للمسافات الأطول يُحسب 120 دج لكل كم إضافي.'
  },
  {
    id: 'bp_13',
    title: 'تفصيل وخياطة قفطان أو كراكو عاصمي بالمجبود',
    category: 'أعمال وحرف النساء والإنتاج المنزلي',
    categoryIcon: 'Scissors',
    description: 'أخذ القياسات بالمنزل، قص القماش، تفصيل وخياطة الكراكو أو القفطان الجزائري مع السروال المدور أو الشلقة، وتطريز المجبود.',
    minPrice: 5000,
    avgPrice: 8500,
    maxPrice: 16000,
    durationEstimate: '3 - 7 أيام عمل',
    includesMaterials: false,
    pricingNotes: 'أجرة الخياطة والتفصيل والتطريز، ويقوم الزبون بتوفير القماش أو اختياره مع الخياطة.',
    popular: true
  },
  {
    id: 'bp_14',
    title: 'صينية بقلاوة بالجوز واللوز للأعراس (54 حبة ملكية)',
    category: 'أعمال وحرف النساء والإنتاج المنزلي',
    categoryIcon: 'Cake',
    description: 'صناعة منزلية أصيلة بعسل النحل الطبيعي، مورقة يدوياً بالسمن، محشوة بلوز وجوز طازج مع تزيين ورد السكر وتعبئة بصواني فاخرة.',
    minPrice: 6500,
    avgPrice: 8000,
    maxPrice: 11000,
    durationEstimate: 'حجز مسبق 48 ساعة',
    includesMaterials: true,
    pricingNotes: 'السعر يشمل كافة المكونات والصينية والتغليف الشفاف الآمن مع التسليم بالموعد.',
    popular: true
  },
  {
    id: 'bp_15',
    title: 'إعداد ولائم الكسكسي والشخشوخة العائلية (20-30 شخص)',
    category: 'أعمال وحرف النساء والإنتاج المنزلي',
    categoryIcon: 'Utensils',
    description: 'تحضير مرق الكسكسي بالخضر واللحم أو الشخشوخة البسكرية، تفوير الكسكسي بدهان بلدي حار، وتجهيز الوليمة بأعلى شروط النظافة.',
    minPrice: 7000,
    avgPrice: 9500,
    maxPrice: 14000,
    durationEstimate: 'يوم المناسبة',
    includesMaterials: false,
    pricingNotes: 'أجرة الطبخ والتحضير المنزلي للوليمة، والمواد واللحوم على العميل.',
    popular: true
  },
  {
    id: 'bp_16',
    title: 'مجالسة ورعاية الأطفال في المنزل (دوام يومي 8 ساعات)',
    category: 'أعمال وحرف النساء والإنتاج المنزلي',
    categoryIcon: 'Heart',
    description: 'رعاية الرضع والأطفال في راحة منزلك، إعداد وجبات صحية، أنشطة تربوية ترفيهية، ومتابعة الواجبات المدرسية على يد مربية مؤهلة.',
    minPrice: 2000,
    avgPrice: 2800,
    maxPrice: 4000,
    durationEstimate: 'يوم عمل (8 ساعات)',
    includesMaterials: false,
    pricingNotes: 'سعر اليوم الواحد. عند التعاقد الشهري يتم تطبيق خصم 20% لتخفيف التكلفة على العائلات.'
  }
];

export const initialQnAQuestions: QnAQuestion[] = [
  {
    id: 'qna_1',
    clientId: 'cl_10',
    clientName: 'سفيان بلحاج',
    clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    category: 'السباكة والترصيص الصحي',
    title: 'كيف أتعامل مع تسرب بسيط ومفاجئ في أنبوب نحاسي تحت الحوض مؤقتاً؟',
    content: 'لاحظت اليوم قطرات ماء مستمرة تخرج من ثقب صغير في أنبوب النحاس المتصل بالسخان أسفل حوض المطبخ. أغلقت العداد لكن أحتاج حلاً سريعاً مؤقتاً حتى يأتي السباك غداً صباحاً.',
    createdAt: 'منذ ساعتين',
    viewsCount: 142,
    isResolved: true,
    answers: [
      {
        id: 'ans_1',
        artisanId: 'art_1',
        artisanName: 'المعلم كمال بلقاسم',
        artisanAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        artisanTrade: 'سباك وترصيص صحي معتمد',
        artisanLevel: 2,
        text: 'أولاً أخي سفيان أحسنت بإغلاق المحبس العمومي. للحل المؤقت الفعال: جفف مكان الثقب بقطعة قماش تماماً، ثم اشترِ من أقرب خردوات شريط السيليكون المطاطي ذاتي الالتحام (Ruban auto-vulcanisant) ولفه حول الثقب وهو مشدود بقوة 5 أو 6 دورات، أو استخدم معجون الإيبوكسي (Pâte mastic époxy bi-composant) بعد عجنه بالأصابع ودعه يجف 20 دقيقة. هذا يمسك الضغط ممتاز حتى وصولنا صباحاً لتلحيم الأنبوب بالنحاس.',
        createdAt: 'منذ ساعة ونصف',
        upvotesCount: 28,
        hasUpvoted: true,
        isVerifiedSolution: true
      }
    ]
  },
  {
    id: 'qna_2',
    clientId: 'cl_22',
    clientName: 'منال قاسي',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    category: 'الكهرباء المنزلية والإنارة',
    title: 'القاطع الكهربائي التفاضلي يسقط كلما قمت بتشغيل الفرن والسخان معاً، ما السبب؟',
    content: 'كلما قمت بتشغيل الفرن الكهربائي في المطبخ وكان سخان الحمام مشتعلاً، يسقط القاطع الرئيسي للمنزل وتنقطع الكهرباء تماماً. ما هو التشخيص السليم؟',
    createdAt: 'منذ 5 ساعات',
    viewsCount: 215,
    isResolved: true,
    answers: [
      {
        id: 'ans_2',
        artisanId: 'art_2',
        artisanName: 'المهندس أمين الشريف',
        artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        artisanTrade: 'كهربائي وأنظمة ذكية',
        artisanLevel: 2,
        text: 'أهلاً أختي منال. هناك سببان رئيسيان: 1) إما أن مجموع أمبير الفرن (حوالي 12A) مع السخان (حوالي 9A) يتجاوز سعة القاطع الفرعي المشترك إذا كانا على نفس الخط (عادة 16A)، 2) أو وجود تسرب أرضي طفيف (Défaut d\'isolement) في شمعة السخان أو مقاومة الفرن يستفز القاطع التفاضلي 30mA. الحل هو فصل خط الفرن في قاطع مستقل 20A بسلك 2.5mm²، وفحص مقاومة العزل بجهاز الميغوميتر للتأكد من عدم وجود تسريب خطر.',
        createdAt: 'منذ 3 ساعات',
        upvotesCount: 35,
        hasUpvoted: false,
        isVerifiedSolution: true
      }
    ]
  },
  {
    id: 'qna_3',
    clientId: 'cl_39',
    clientName: 'عبد القادر بن عيسى',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'الدهان والتشطيبات والديكور',
    title: 'ما هي الخطوات الصحيحة لمعالجة رطوبة الجدران قبل إعادة طلاء الغرفة؟',
    content: 'لدي جدار في غرفة النوم يعاني من انتفاخ الطلاء وتقشره وظهور بقع بيضاء كلسية في الأسفل. هل يكفي صنفرته والطلاء فوقه مباشرة؟',
    createdAt: 'أمس',
    viewsCount: 310,
    isResolved: true,
    answers: [
      {
        id: 'ans_3',
        artisanId: 'art_4',
        artisanName: 'سفيان مرابط',
        artisanAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        artisanTrade: 'دهان وديكورات جبسية',
        artisanLevel: 2,
        text: 'تحذير أخي عبد القادر: الطلاء فوق الرطوبة مباشرة سيتقشر مجدداً في أقل من أسبوعين! الخطوات الصحيحة: 1- تقشير الدهان المنتفخ حتى الوصول للطبقة الإسمنتية الصلبة، 2- غسل الجدار بماء ومبيض خفيف لقتل الفطريات، 3- تطبيق طبقة أساس عازلة مائية (Fixateur anti-humidité anti-salpêtre)، 4- استخدام معجون مقاوم للرطوبة (Enduit hydrofuge)، 5- تطبيق طلاء أكريليك مائي مسامي يسمح للجدار بالتنفس. إذا احتجت مساعدة يمكنك طلبي وسأفحص رطوبة الجدار بجهاز القياس.',
        createdAt: 'أمس',
        upvotesCount: 22,
        hasUpvoted: true,
        isVerifiedSolution: true
      }
    ]
  }
];

// -------------------------------------------------------------
// Initial Job Seekers & Freelance Workers List (سجل الباحثين عن عمل والمهنيين)
// -------------------------------------------------------------
export const initialJobSeekers: JobSeekerProfile[] = [
  {
    id: 'job_seeker_1',
    name: 'الأستاذة حنان قادري (خياطة وتصميم أزياء)',
    phone: '0554 12 34 56',
    wilaya: 'الجزائر العاصمة',
    city: 'الأبيار / دالي براهيم',
    trade: 'خياطة وتفصيل وتصميم الأزياء والقفطان والكراكو',
    category: 'women_crafts',
    gender: 'female',
    description: 'أتقن تفصيل وخياطة الكراكو العاصمي بالمجبود الأصيل والفتلة، قفطان الأعراس والخطوبة، فساتين السهرة العصرية، وتعديل وتصغير وتكبير المقاسات بدقة فائقة. أمتلك ماكينة خياطة إلكترونية احترافية وماكينة سورجي، وأستقبل الطلبيات أو أعمل في ورشات أو من البيت.',
    skills: ['كراكو عاصمي بالمجبود', 'قفطان راقي', 'فساتين سهرة', 'تعديل مقاسات', 'طرز الفتلة'],
    experienceYears: 11,
    expectedWage: '3500 دج / يوم أو بالقطعة',
    availabilityType: 'immediate',
    hasOwnTools: true,
    hasOwnTransport: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    certificates: [
      {
        id: 'cert_1',
        title: 'دبلوم تقني سامي (TS) في تصميم الأزياء وصناعة الملابس الجاهزة',
        issuer: 'المعهد الوطني المتخصص في التكوين المهني (INSFP) - بئر خادم',
        year: '2016',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'cert_2',
        title: 'شهادة تأهيل في التطريز التقليدي والمجبود العاصمي',
        issuer: 'غرفة الصناعة التقليدية والحرف (CAM) - الجزائر',
        year: '2019',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    portfolioImages: [
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'منذ ساعتين',
    status: 'available',
    isVerified: true
  },
  {
    id: 'job_seeker_2',
    name: 'ياسين بلخيري (كهربائي معتمد وشبكات)',
    phone: '0661 78 90 12',
    wilaya: 'الجزائر العاصمة',
    city: 'باب الزوار / الرويبة',
    trade: 'كهرباء منازل، ورشات، ولوحات تحكم صناعية',
    category: 'home_repair',
    gender: 'male',
    description: 'تقني كهرباء حاصل على شهادة الكفاءة، خبرة واسعة في التمديدات المعمارية للفلل والعمارات، تركيب لوحات القواطع والحماية التفاضلية، إضاءة مخفية LED، تركيب أنظمة الطاقة الشمسية ومولدات الكهرباء. أمتلك كامل العتاد وسيارة نقل بيك آب ومستعد للانضمام لورشات البناء فوراً.',
    skills: ['لوحات القواطع Schneider', 'إنارة ليد ديكورية', 'تمديدات الفلل', 'طاقة شمسية', 'كاميرات مراقبة'],
    experienceYears: 8,
    expectedWage: '4000 دج / يوم أو بالمتر المربع',
    availabilityType: 'immediate',
    hasOwnTools: true,
    hasOwnTransport: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    certificates: [
      {
        id: 'cert_3',
        title: 'شهادة الكفاءة المهنية (CAP) - كهرباء المباني والتجهيزات',
        issuer: 'مركز التكوين المهني والتمهين (CFPA) - الرويبة',
        year: '2018',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    portfolioImages: [
      '/src/assets/images/electrical_modern_service_1791156512564.jpg',
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'منذ 4 ساعات',
    status: 'available',
    isVerified: true
  },
  {
    id: 'job_seeker_3',
    name: 'السيدة فتيحة العاصمية (حلويات تقليدية وعصرية)',
    phone: '0772 45 67 89',
    wilaya: 'البليدة',
    city: 'بوفاريك / البليدة المركز',
    trade: 'صناعة الحلويات والمخبوزات للأعراس والولائم',
    category: 'women_crafts',
    gender: 'female',
    description: 'أتقن إعداد حلويات الأعراس الفاخرة: بقلاوة الجوز واللوز المورقة على أصولها، مقروط اللوز المعسل، تشاراك العريان والمسكر، قنيدلات، كعيكعات، وصواني الخطوبة والمهيبة. أستقبل طلبيات الأعراس أو العمل مع قاعات الحفلات ومحلات الحلويات.',
    skills: ['بقلاوة ملكية بالجوز واللوز', 'مقروط اللوز العاصمي', 'تشاراك مسكر', 'كعكات الخطوبة', 'حلويات بريستيج'],
    experienceYears: 9,
    expectedWage: 'حسب كمية الصواني أو 3000 دج / يوم',
    availabilityType: 'daily',
    hasOwnTools: true,
    hasOwnTransport: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    certificates: [
      {
        id: 'cert_4',
        title: 'شهادة تأهيل مهني في صناعة الحلويات التقليدية والمرطبات',
        issuer: 'غرفة الصناعة التقليدية والحرف - البليدة',
        year: '2017',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    portfolioImages: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'اليوم',
    status: 'available',
    isVerified: true
  },
  {
    id: 'job_seeker_4',
    name: 'المعلم رفيق مسعودي (سباكة وتدفئة وشوفاج)',
    phone: '0550 33 44 55',
    wilaya: 'وهران',
    city: 'بير الجير / إيسطو',
    trade: 'سباكة وترصيص صحي وتدفئة مركزية وشبكات غاز',
    category: 'home_repair',
    gender: 'male',
    description: 'مرصص صحي محترف متخصص في شبكات السباكة بالـ Multicouche والنحاس وPPR، تركيب المراجل الغازية الشوفاج سنترال، كشف التسريبات بجهاز الضغط والموجات، تركيب المضخات وخزانات المياه. أبحث عن مشاريع مقاولات، بناء فلل، أو ورشات دائمة.',
    skills: ['تركيب شوفاج سنترال', 'سباكة نحاسية وبولي بروبيلين', 'كشف تسريبات', 'مضخات وخزانات', 'تسليك مجاري'],
    experienceYears: 13,
    expectedWage: '4500 دج / يوم أو بالمقاولة',
    availabilityType: 'full_time',
    hasOwnTools: true,
    hasOwnTransport: true,
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    certificates: [
      {
        id: 'cert_5',
        title: 'شهادة تقني في الترصيص الصحي والغاز (Plomberie Sanitaire et Gaz)',
        issuer: 'المعهد الوطني المتخصص - وهران',
        year: '2013',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    portfolioImages: [
      '/src/assets/images/home_plumbing_service_1791156501756.jpg',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'أمس',
    status: 'available',
    isVerified: true
  },
  {
    id: 'job_seeker_5',
    name: 'الشاب سليم زواوي (دهان وديكور وجبس BA13)',
    phone: '0659 11 22 33',
    wilaya: 'سطيف',
    city: 'سطيف المركز / العلمة',
    trade: 'الدهان المعماري والديكورات الحديثة والأسقف المعلقة',
    category: 'home_repair',
    gender: 'male',
    description: 'أتقن جميع أنواع الطلاء الديكوري (ستوكو، بيرلا، سابليه، ساتيني)، وتركيب ألواح الجبس بورد BA13 للأسقف والجدران والفواصل مع الليزر. عمل نظيف ومتقن مع حماية الأثاث والأرضيات وتسليم الورشة نظيفة.',
    skills: ['طلاء سابليه وبيرلا', 'جبس بورد BA13', 'أسقف معلقة ليد', 'معجون وتنعيم الجدران', 'عزل الرطوبة'],
    experienceYears: 6,
    expectedWage: '3500 دج / يوم أو بالمتر',
    availabilityType: 'immediate',
    hasOwnTools: true,
    hasOwnTransport: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    certificates: [
      {
        id: 'cert_6',
        title: 'شهادة تكوين في تقنيات الدهان والديكور الحديث وتركيب الجبس',
        issuer: 'مركز التكوين المهني - سطيف',
        year: '2020',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    portfolioImages: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'منذ يومين',
    status: 'available',
    isVerified: true
  },
  {
    id: 'job_seeker_6',
    name: 'الحاجة عائشة (طبخ ولائم ومأكولات تقليدية)',
    phone: '0552 99 88 77',
    wilaya: 'الجزائر العاصمة',
    city: 'القبة / بئر خادم',
    trade: 'الطبخ وإعداد الوجبات الغذائية والمآدب والولائم',
    category: 'women_crafts',
    gender: 'female',
    description: 'أتقن إعداد وجبات الولائم الكبرى للأعراس والعزائم: شخشوخة بسكرية حارة، كسكسي اللحم والخضار، رشتة عاصمية بالدجاج البلدي، شربة فريك أصيلة بالأعشاب، وطواجن متنوعة (طاجين الحلو، طاجين الزيتون، متوم). نظافة تامة وأمانة في المواد.',
    skills: ['كسكسي الأعراس', 'رشتة عاصمية', 'شخشوخة بسكرية', 'شوربة فريك', 'طواجن جزائرية'],
    experienceYears: 16,
    expectedWage: '4000 دج / للوليمة أو حسب عدد القدور',
    availabilityType: 'project',
    hasOwnTools: true,
    hasOwnTransport: false,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    certificates: [],
    portfolioImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
    ],
    createdAt: 'منذ يومين',
    status: 'available',
    isVerified: true
  }
];

export const initialWorkPartnerPosts: WorkPartnerPost[] = [
  {
    id: 'partner_post_1',
    title: 'مطلوب شريك نجار لفتح ورشة نجارة وأثاث عصري مجهزة بالكامل',
    authorId: 'artisan_p1',
    authorName: 'نذير العاصمي',
    authorAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'نجارة خشب وأثاث عصري',
    authorPhone: '0550 12 34 56',
    authorVerificationLevel: 2,
    partnershipType: 'workshop_sharing',
    wilaya: 'الجزائر العاصمة',
    city: 'الرويبة / المنطقة الصناعية',
    description: 'أملك محلاً ومستودعاً بمساحة 140م² بالرويبة مجهزاً بعدة آلات نجارة أساسية (منشار طاولة صناعي، رابوط، وفارة). أبحث عن شريك نجار خبير ومحترف بأخلاق عالية لتقاسم العمل وتصنيع المطابخ العصرية وخزائن Dressing مع تقسيم الأرباح مناصفة.',
    whatIOffer: 'محل 140م² مع كهرباء 380V، آلات قطع وتنعيم أساسية، سيارة نقل صغيرة لنقل الأخشاب والطلبيات، وشبكة زبائن سابقة.',
    whatISeek: 'شريك نجار محترف ومتقن لبرامج التصميم 3D أو متمكن من الفينيسيون الدقيق، مع الجدية والتفرغ التام للورشة.',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 18,
    hasLiked: false,
    createdAt: 'منذ 3 ساعات',
    status: 'active',
    contactPreference: 'both',
    comments: [
      {
        id: 'p_c_1',
        authorName: 'ياسين بلعباس (نجار متمكن)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorTrade: 'نجارة وديكور MDF',
        authorPhone: '0661 22 33 44',
        text: 'السلام عليكم أخي نذير، أنا مقيم في الرغاية وخبرة 8 سنوات في تصنيع مطابخ الـ High Gloss والـ MDF، هل يمكنني زيارة الورشة اليوم لمعاينة المكان؟',
        createdAt: 'منذ ساعتين',
        isVerified: true
      },
      {
        id: 'p_c_2',
        authorName: 'نذير العاصمي',
        authorAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        authorTrade: 'نجارة خشب وأثاث عصري',
        text: 'وعليكم السلام ورحمة الله أخي ياسين، مرحباً بك في أي وقت بعد صلاة العصر، اتصل بي على الرقم الموجود بالمنشور.',
        createdAt: 'منذ ساعة',
        isVerified: true
      }
    ]
  },
  {
    id: 'partner_post_2',
    title: 'شراكة مقاولة بناء وتشطيب عمارة سكنية R+4 (مطلوب مقاول بناء ومبلط سيراميك)',
    authorId: 'artisan_p2',
    authorName: 'المهندس مقداد الهواري',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'أشغال البناء والهندسة المدنية',
    authorPhone: '0770 45 67 89',
    authorVerificationLevel: 2,
    partnershipType: 'project_partner',
    wilaya: 'وهران',
    city: 'بئر الجير / إيسطو',
    description: 'لدينا صفقة إنجاز وتكميل مشروع عمارة خاصة R+4 بوهران تحتوي على 10 شقق. نبحث عن شريك مقاول يملك فريق بناء معتمد ومبلطين محترفين لأعمال السيراميك والبورسلان، للعمل بنظام الشراكة والنسبة من المستخلصات.',
    whatIOffer: 'عقد قانوني موثق، تمويل ومواد البناء جاهزة وموردة للموقع، مخططات معمارية وتنفيذية دقيقة، ومستخلصات مالية منتظمة.',
    whatISeek: 'شريك ميداني يملك عتاد الشدات والخلاطة، مع فريق عمال جادين ومنضبطين للإنهاء في الآجال المحددة.',
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 27,
    hasLiked: true,
    createdAt: 'منذ 5 ساعات',
    status: 'active',
    contactPreference: 'phone',
    comments: [
      {
        id: 'p_c_3',
        authorName: 'المقاول عبد القادر',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        authorTrade: 'بناء وسيراميك عام',
        authorPhone: '0555 88 99 00',
        text: 'ما شاء الله مشروع ممتاز. فريقي متكون من 6 مبلطين وبنائين جاهزون بعد غد، سنتواصل هاتفياً معكم للتفاصيل.',
        createdAt: 'منذ 3 ساعات',
        isVerified: true
      }
    ]
  },
  {
    id: 'partner_post_3',
    title: 'تقاسم ورشة وعتاد ميكانيك وتشخيص سيارات بالسكانير متطور',
    authorId: 'artisan_p3',
    authorName: 'كمال الميكانيكي',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'ميكانيك وكهرباء السيارات',
    authorPhone: '0663 88 77 66',
    authorVerificationLevel: 2,
    partnershipType: 'capital_equipment',
    wilaya: 'قسنطينة',
    city: 'المدينة الجديدة علي منجلي',
    description: 'أملك أجهزة فحص وتشخيص أعطال متطورة (Launch X431 & Autel MaxiSys) وخبرة في ميكانيك السيارات الحديثة وتصليح علب السرعة الأوتوماتيكية. أبحث عن شريك كهربائي سيارات أو صاحب مرآب متسع بالمدينة الجديدة لتقاسم الإيجار وخدمة الزبائن سوياً.',
    whatIOffer: 'أجهزة سكانير حديثة مع تحديثات أونلاين، رافعة هيدروليكية صغيرة، وخبرة دقيقة في تشخيص أصعب الأعطال.',
    whatISeek: 'تقاسم تكلفة كراء المرآب والتعاون التكاملي في الأعطال الكهربائية والإلكترونية وبرمجة المفاتيح.',
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 15,
    hasLiked: false,
    createdAt: 'منذ يوم',
    status: 'active',
    contactPreference: 'both',
    comments: [
      {
        id: 'p_c_4',
        authorName: 'سفيان سكانير',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorTrade: 'كهربائي وبرمجة أدمغة',
        text: 'عندي مرآب 90م² في الوحدة الجوارية 8 ومعي كهربائي ممتاز، فكرة الشراكة ممتازة وسأكون سعيداً باللقاء معك غداً.',
        createdAt: 'منذ 18 ساعة',
        isVerified: true
      }
    ]
  },
  {
    id: 'partner_post_4',
    title: 'شراكة تصنيع وتركيب ألمنيوم وPVC مع وجود طلبيات وعقود مشاريع جاهزة',
    authorId: 'artisan_p4',
    authorName: 'بلال السطايفي',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'نجارة الألمنيوم والـ PVC',
    authorPhone: '0560 33 22 11',
    authorVerificationLevel: 1,
    partnershipType: 'skill_complementary',
    wilaya: 'سطيف',
    city: 'العلمة / طريق قسنطينة',
    description: 'لدينا طلبيات مستمرة لنوافذ وأبواب ومطابخ ألمنيوم وماركات تركية وجزائرية. أحتاج شريكاً فنياً يتقن الحسابات وتفصيل مقاطع الـ TPR والـ PVC لتسريع وتيرة الإنتاج وتسليم المشاريع في وقت قياسي.',
    whatIOffer: 'تدفق مستمر للطلبيات، ورشة قائمة وممولة بالمواد الأولية، وسمعة طيبة بسوق العلمة.',
    whatISeek: 'شريك فني دقيق في القياسات، يتقن تركيب الستائر الدوارة (Volets roulants) الكهربائية والمحركات.',
    images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 22,
    hasLiked: false,
    createdAt: 'منذ يومين',
    status: 'active',
    contactPreference: 'phone',
    comments: []
  },
  {
    id: 'partner_post_5',
    title: 'تكوين فريق شراكة متكامل لتشطيب الفلل والشقق (دهان عصري، جبس بورد BA13، وسيراميك)',
    authorId: 'artisan_p5',
    authorName: 'رضوان بن دالي',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    authorTrade: 'ديكور وتشطيبات حديثة',
    authorPhone: '0771 99 88 77',
    authorVerificationLevel: 2,
    partnershipType: 'subcontract_team',
    wilaya: 'البليدة',
    city: 'بوفاريك / أولاد يعيش',
    description: 'أنا حرفي متخصص في طلاء الجدران الديكوري (سواحلي، صابلي، ستيكو) ولدي عقود تشطيب فلل راقية بالبليدة وبوسماعيل. أبحث عن شريك محترف في تركيب الأسقف المعلقة بالجبس بورد BA13 مع إنارة ليد مخفية لنشكل فريقاً متكاملاً نعرض خدماتنا معاً للزبائن بأسعار منافسة وجودة فاخرة.',
    whatIOffer: 'زبائن جاهزون ومشاريع فلل مستمرة، سمعة ممتازة، ونظام فوترة واضح مع الزبائن.',
    whatISeek: 'شريك جباس (Plaquiste) محترف ومعه الليزر ومعدات التركيب السريع مع التزام تام بالمواعيد ونظافة الورشة.',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 31,
    hasLiked: true,
    createdAt: 'منذ 3 أيام',
    status: 'active',
    contactPreference: 'both',
    comments: [
      {
        id: 'p_c_5',
        authorName: 'حميد الجباس',
        authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        authorTrade: 'تركيب جبس بورد BA13',
        text: 'أنا متوفر أخي رضوان ولدي معدات ليزر 360 درجة وسقالات، مستعد للعمل معك مباشرة في أول ورشة.',
        createdAt: 'منذ يومين',
        isVerified: true
      }
    ]
  }
];

export const sampleClientAccounts: ClientAccount[] = [
  {
    id: 'client_1',
    name: 'هشام بن علي',
    phone: '0550 12 34 56',
    email: 'hichem.benali@gmail.com',
    city: 'الجزائر العاصمة',
    address: 'حي البساتين، الأبيار، عمارة 14',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-15',
    ordersCount: 4,
    isSuspended: false
  },
  {
    id: 'client_2',
    name: 'سمير دراجي',
    phone: '0661 98 76 54',
    email: 'samir.darradji@yahoo.fr',
    city: 'وهران',
    address: 'حي العقيد لطفي، إقامة النخيل',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    registeredAt: '2026-09-02',
    ordersCount: 2,
    isSuspended: false
  },
  {
    id: 'client_3',
    name: 'فاطمة الزهراء بوزيد',
    phone: '0770 45 67 89',
    email: 'fatima.bouzid@outlook.com',
    city: 'قسنطينة',
    address: 'حي زواغي سليمان، فيلا 22',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    registeredAt: '2026-09-19',
    ordersCount: 1,
    isSuspended: false
  },
  {
    id: 'client_4',
    name: 'كريم بلحاج',
    phone: '0540 88 99 00',
    email: 'karim.belhadj@gmail.com',
    city: 'البليدة',
    address: 'حي أولاد يعيش، عمارة الأمل',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    registeredAt: '2026-10-01',
    ordersCount: 0,
    isSuspended: false
  }
];

// -------------------------------------------------------------
// Catalog: Gaming & Channel Recharge Items (شحن الألعاب والقنوات)
// -------------------------------------------------------------
export const mockRechargeCatalog: GameChannelRechargeItem[] = [
  {
    id: 'rec_freefire',
    category: 'game',
    name: 'Free Fire Diamonds',
    nameAr: 'شحن جواهر فري فاير (Free Fire)',
    tagline: 'شحن رسمي وفوري بالأيدي (ID) لجميع السيرفرات',
    icon: 'Gamepad2',
    badge: 'الأكثر طلباً 🔥',
    inputType: 'player_id',
    inputPlaceholderAr: 'أدخل معرف اللاعب (Player ID) مثلاً: 182746198',
    instructionsAr: 'الشحن يتم عبر السيرفر الرسمي فور تحويل المبلغ عبر BaridiMob أو CCP في أقل من 5 دقائق.',
    options: [
      { id: 'ff_100', label: '100 + 10 Bonus', labelAr: '110 جوهرة فري فاير', priceDzd: 250 },
      { id: 'ff_310', label: '310 + 31 Bonus', labelAr: '341 جوهرة فري فاير', priceDzd: 700 },
      { id: 'ff_520', label: '520 + 52 Bonus', labelAr: '572 جوهرة فري فاير', priceDzd: 1100, popular: true },
      { id: 'ff_1060', label: '1060 + 106 Bonus', labelAr: '1166 جوهرة فري فاير', priceDzd: 2200 },
      { id: 'ff_2180', label: '2180 + 218 Bonus', labelAr: '2398 جوهرة فري فاير', priceDzd: 4400 },
      { id: 'ff_weekly', label: 'Weekly Pass', labelAr: 'اشتراك العضوية الأسبوعية (Pass)', priceDzd: 450 }
    ]
  },
  {
    id: 'rec_pubg',
    category: 'game',
    name: 'PUBG Mobile UC',
    nameAr: 'شحن شدات ببجي موبايل (PUBG UC)',
    tagline: 'شحن فوري بالـ ID والرويال باس بأفضل سعر دينار جزائري',
    icon: 'Gamepad2',
    badge: 'تسليم فوري ⚡',
    inputType: 'player_id',
    inputPlaceholderAr: 'أدخل الآيدي (Player ID) مثلاً: 5129487123',
    instructionsAr: 'الشدات تصل مباشرة لصندوق بريدك داخل اللعبة مع كود إثبات المعاملة.',
    options: [
      { id: 'pubg_60', label: '60 UC', labelAr: '60 شدة ببجي', priceDzd: 220 },
      { id: 'pubg_325', label: '325 UC', labelAr: '325 شدة ببجي', priceDzd: 950 },
      { id: 'pubg_660', label: '660 UC (Royal Pass)', labelAr: '660 شدة (تفعيل الرويال باس)', priceDzd: 1850, popular: true },
      { id: 'pubg_1800', label: '1800 UC', labelAr: '1800 شدة ببجي', priceDzd: 4600 },
      { id: 'pubg_3850', label: '3850 UC', labelAr: '3850 شدة ببجي', priceDzd: 9200 }
    ]
  },
  {
    id: 'rec_roblox',
    category: 'game',
    name: 'Roblox Robux',
    nameAr: 'شحن روبوكس روبلوكس (Robux)',
    tagline: 'أكواد شحن روبلوكس الرسمية لشراء الملابس والسكينات',
    icon: 'Boxes',
    badge: 'أكواد أصلية',
    inputType: 'player_id',
    inputPlaceholderAr: 'أدخل اسم المستخدم (Roblox Username)',
    instructionsAr: 'يتم إرسال كود البطاقة الرقمية مباشرة لشحنها في حسابك.',
    options: [
      { id: 'rbx_400', label: '400 Robux', labelAr: '400 روبوكس', priceDzd: 1100 },
      { id: 'rbx_800', label: '800 Robux', labelAr: '800 روبوكس', priceDzd: 2100, popular: true },
      { id: 'rbx_1700', label: '1,700 Robux', labelAr: '1,700 روبوكس', priceDzd: 4200 }
    ]
  },
  {
    id: 'rec_playstation',
    category: 'card',
    name: 'PlayStation Store Cards',
    nameAr: 'بطاقات بلايستيشن ستور (PSN Gift Cards)',
    tagline: 'بطاقات المتجر الأمريكي والفرنسي والإماراتي لأجهزة PS4 و PS5',
    icon: 'CreditCard',
    badge: 'كود فوري 🎮',
    inputType: 'account_email',
    inputPlaceholderAr: 'أدخل بريدك الإلكتروني أو رقم الواتساب لاستلام الكود',
    instructionsAr: 'تصلك رسالة فورية تحتوي الكود الرسمي المكون من 12 رقماً لتفعيله في جهازك.',
    options: [
      { id: 'psn_10_usd', label: '$10 PSN Card (US)', labelAr: 'بطاقة 10 دولار أمريكي', priceDzd: 2350 },
      { id: 'psn_25_usd', label: '$25 PSN Card (US)', labelAr: 'بطاقة 25 دولار أمريكي', priceDzd: 5600, popular: true },
      { id: 'psn_50_usd', label: '$50 PSN Card (US)', labelAr: 'بطاقة 50 دولار أمريكي', priceDzd: 11200 },
      { id: 'psn_10_eur', label: '10€ PSN Card (FR)', labelAr: 'بطاقة 10 يورو فرنسي', priceDzd: 2450 }
    ]
  },
  {
    id: 'rec_iptv_smarters',
    category: 'channel',
    name: 'IPTV Smarters Pro & Lynx 4K',
    nameAr: 'اشتراك قنوات IPTV وسيرفرات 4K فائقة الجودة',
    tagline: 'باقة قنوات beIN Sports، قنوات عربية، ومكتبة أفلام ومسلسلات ضخمة بدون تقطيع',
    icon: 'Tv',
    badge: 'ضمان كامل 📺',
    inputType: 'phone_number',
    inputPlaceholderAr: 'أدخل رقم هاتفك أو كود جهاز التلفاز Smart TV',
    instructionsAr: 'يتم إرسال كود التفعيل ورابط السيرفر مع شرح طريقة التثبيت على التلفاز أو الهاتف مع تجربة مجانية.',
    options: [
      { id: 'iptv_3m', label: '3 Months 4K', labelAr: 'اشتراك 3 أشهر سيرفر VIP', priceDzd: 1500 },
      { id: 'iptv_6m', label: '6 Months 4K', labelAr: 'اشتراك 6 أشهر سيرفر VIP', priceDzd: 2400 },
      { id: 'iptv_12m', label: '12 Months 4K Ultra', labelAr: 'اشتراك سنة كاملة (12 شهر) + مكتبة أفلام', priceDzd: 3600, popular: true },
      { id: 'iptv_24m', label: '24 Months Premium', labelAr: 'اشتراك سنتين مع جهازين في نفس الوقت', priceDzd: 6200 }
    ]
  },
  {
    id: 'rec_shahid_vip',
    category: 'channel',
    name: 'Shahid VIP Sport',
    nameAr: 'اشتراكات منصة شاهد نت VIP والرياضة',
    tagline: 'متابعة الدوري السعودي، دوري أبطال آسيا وأحدث المسلسلات الحصرية بجودة FHD',
    icon: 'Film',
    badge: 'حساب رسمي ⭐',
    inputType: 'account_email',
    inputPlaceholderAr: 'أدخل بريدك الإلكتروني أو رقم هاتفك لتفعيل الاشتراك',
    instructionsAr: 'حساب بروفايل رسمي محمي برقم سري PIN خاص بك.',
    options: [
      { id: 'shahid_1m', label: '1 Month VIP', labelAr: 'شهر واحد شاهد VIP مسلسلات', priceDzd: 800 },
      { id: 'shahid_1m_sport', label: '1 Month Sport VIP', labelAr: 'شهر واحد شاهد VIP شامل الرياضة', priceDzd: 1300, popular: true },
      { id: 'shahid_3m_sport', label: '3 Months Sport VIP', labelAr: '3 أشهر شامل الرياضة', priceDzd: 3400 },
      { id: 'shahid_12m', label: '1 Year Full VIP', labelAr: 'سنة كاملة VIP للمسلسلات والرياضة', priceDzd: 7800 }
    ]
  },
  {
    id: 'rec_netflix',
    category: 'channel',
    name: 'Netflix Premium 4K UHD',
    nameAr: 'اشتراك نتفليكس بريميوم (Netflix 4K)',
    tagline: 'حساب رسمي 4K Ultra HD يدعم شاشات التلفاز والهاتف بدون انقطاع',
    icon: 'Film',
    badge: 'جودة 4K UHD 🍿',
    inputType: 'account_email',
    inputPlaceholderAr: 'أدخل بريدك الإلكتروني أو الواتساب لاستلام بيانات الدخول',
    instructionsAr: 'ملف شخصي Profile خاص بك مقفل برمز PIN وتعمل على جميع أجهزتك.',
    options: [
      { id: 'nflx_1m', label: '1 Month Profile', labelAr: 'بروفايل شهر واحد 4K رسمي', priceDzd: 950, popular: true },
      { id: 'nflx_3m', label: '3 Months Profile', labelAr: 'بروفايل 3 أشهر 4K رسمي', priceDzd: 2600 },
      { id: 'nflx_account_full', label: '1 Month Full Account', labelAr: 'حساب كامل (4 شاشات) شهر واحد', priceDzd: 3400 }
    ]
  }
];

// -------------------------------------------------------------
// Catalog: Vehicle, Truck & Cart Rentals (كراء السيارات والشاحنات والعربات)
// -------------------------------------------------------------
export const mockRentalVehicles: RentalVehicleItem[] = [
  {
    id: 'veh_stepway_2024',
    title: 'داسيا سانديرو ستيبواي (Dacia Sandero Stepway)',
    type: 'car',
    brandModel: 'Dacia Sandero Stepway Techroad',
    year: 2024,
    wilaya: 'الجزائر العاصمة',
    city: 'الأبيار / حيدرة',
    pricePerDay: 5500,
    withDriver: false,
    transmission: 'manual',
    fuelType: 'essence',
    capacity: '5 ركاب · حقيبتان كبيرتان',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&auto=format&fit=crop&q=80',
    agencyName: 'وكالة النجمة الذهبية لكراء السيارات',
    agencyPhone: '+213 550 44 33 22',
    rating: 4.95,
    reviewCount: 78,
    isAvailable: true,
    features: ['مكيف هواء قوي', 'نظام ملاحة GPS', 'بلوتوث وشاشة لمس', 'تأمين شامل Tous Risques', 'عداد غير محدود فوق 3 أيام']
  },
  {
    id: 'veh_clio5_auto',
    title: 'رينو كليو 5 أوتوماتيك (Renault Clio 5)',
    type: 'car',
    brandModel: 'Renault Clio 5 Intens EDC',
    year: 2023,
    wilaya: 'وهران',
    city: 'العقيد لطفي / وسط المدينة',
    pricePerDay: 6500,
    withDriver: false,
    transmission: 'automatic',
    fuelType: 'essence',
    capacity: '5 ركاب · مقصورة مريحة',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&auto=format&fit=crop&q=80',
    agencyName: 'وكالة الباهية لتأجير السيارات',
    agencyPhone: '+213 661 88 77 66',
    rating: 4.91,
    reviewCount: 64,
    isAvailable: true,
    features: ['علبة سرعات أوتوماتيكية', 'كاميرا خلفية وحساسات ركن', 'تسليم في مطار وهران الدولي', 'تأمين شامل']
  },
  {
    id: 'veh_accent_2023',
    title: 'هيونداي أكسنت (Hyundai Accent Sedan)',
    type: 'car',
    brandModel: 'Hyundai Accent 1.6 GL',
    year: 2023,
    wilaya: 'البليدة',
    city: 'أولاد يعيش / وسط البليدة',
    pricePerDay: 5000,
    withDriver: false,
    transmission: 'automatic',
    fuelType: 'essence',
    capacity: '5 ركاب · صندوق خلفي واسع',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=700&auto=format&fit=crop&q=80',
    agencyName: 'وكالة الورود لكراء السيارات',
    agencyPhone: '+213 770 12 99 88',
    rating: 4.88,
    reviewCount: 52,
    isAvailable: true,
    features: ['صندوق أمتعة كبير للعائلات', 'اقتصادية جداً في الوقود', 'نظافة وتعقيم دوري']
  },
  {
    id: 'veh_kia_k2700',
    title: 'شاحنة كيا ك2700 صندوق مفتوح (Kia K2700)',
    type: 'truck',
    brandModel: 'Kia K2700 Plateau',
    year: 2022,
    wilaya: 'الجزائر العاصمة',
    city: 'رويبة / الدار البيضاء / الحراش',
    pricePerDay: 8000,
    pricePerTrip: 4000,
    withDriver: true,
    transmission: 'manual',
    fuelType: 'diesel',
    capacity: 'حمولة 1.5 طن · طول الصندوق 3.1 متر',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&auto=format&fit=crop&q=80',
    agencyName: 'مؤسسة السريع لنقل البضائع والعفش',
    agencyPhone: '+213 555 33 22 11',
    rating: 4.96,
    reviewCount: 110,
    isAvailable: true,
    features: ['مع سائق متمرس لنقل الأثاث', 'أحزمة تثبيت وأغطية واقية من المطر', 'متاحة لنقل الرحلات بين الولايات', 'سعر خاص للمشاريع والورش']
  },
  {
    id: 'veh_master_fourgon',
    title: 'شاحنة رينو ماستر فورغون مغلق (Renault Master L2H2)',
    type: 'truck',
    brandModel: 'Renault Master Fourgon 13m³',
    year: 2023,
    wilaya: 'سطيف',
    city: 'وسط سطيف / العلمة',
    pricePerDay: 11000,
    pricePerTrip: 6000,
    withDriver: true,
    transmission: 'manual',
    fuelType: 'diesel',
    capacity: 'حجم 13 متر مكعب · حمولة 1.8 طن مغلقة ومحكمة',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&auto=format&fit=crop&q=80',
    agencyName: 'وكالة الهضاب للنقل واللوجستيك',
    agencyPhone: '+213 661 22 33 44',
    rating: 4.93,
    reviewCount: 47,
    isAvailable: true,
    features: ['صندوق مغلق ومحمي 100% من الأمطار والأتربة', 'نقل الأثاث والأجهزة الكهرومنزلية الحساسة', 'إمكانية توفير عمال للمناولة والرفع']
  },
  {
    id: 'veh_hilux_pickup',
    title: 'تويوتا هايلوكس 4x4 بيك آب (Toyota Hilux Double Cabine)',
    type: 'truck',
    brandModel: 'Toyota Hilux 2.4 D-4D 4x4',
    year: 2023,
    wilaya: 'قسنطينة',
    city: 'علي منجلي / الخروب',
    pricePerDay: 12500,
    withDriver: false,
    transmission: 'manual',
    fuelType: 'diesel',
    capacity: 'دفع رباعي 4x4 · 5 ركاب + صندوق خلفي قوي',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&auto=format&fit=crop&q=80',
    agencyName: 'وكالة الصخر العتيق للمركبات',
    agencyPhone: '+213 770 44 55 66',
    rating: 4.97,
    reviewCount: 39,
    isAvailable: true,
    features: ['مخصصة للمناطق الوعرة ومشاريع البناء', 'دفع رباعي قوي مع دبل', 'عقود للشركات والأفراد']
  },
  {
    id: 'veh_depannage_tow',
    title: 'عربة سحب هيدروليكية ديباناج (Remorque Dépannage Auto)',
    type: 'cart_towing',
    brandModel: 'عربة سحب وسطحة هيدروليكية مجهزة',
    year: 2023,
    wilaya: 'الجزائر العاصمة',
    city: 'تدخل سريع في الطريق السريع وجميع البلديات',
    pricePerDay: 14000,
    pricePerTrip: 4500,
    withDriver: true,
    transmission: 'manual',
    fuelType: 'diesel',
    capacity: 'سحب سيارات، مركبات نفعية ودراجات نارية',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&auto=format&fit=crop&q=80',
    agencyName: 'خدمة نجدة الطريق وسحب المركبات 24/7',
    agencyPhone: '+213 550 99 88 77',
    rating: 4.98,
    reviewCount: 140,
    isAvailable: true,
    features: ['تدخل عاجل 24 ساعة / 7 أيام', 'ونش هيدروليكي آمن بدون خدوش', 'نقل للميكانيكي أو المنزل أو الفحص التقني']
  },
  {
    id: 'veh_trailer_cart',
    title: 'مقطورة نقل بضائع ودراجات تسحب بالسيارة (Remorque Bagagère)',
    type: 'cart_towing',
    brandModel: 'Remorque Double Essieu 750kg',
    year: 2023,
    wilaya: 'وهران',
    city: 'بئر الجير / إيسطو',
    pricePerDay: 3000,
    withDriver: false,
    transmission: 'manual',
    fuelType: 'essence',
    capacity: 'حمولة 750 كغ · تتصل بكرة السحب (Attelage) لأي سيارة',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&auto=format&fit=crop&q=80',
    agencyName: 'مؤسسة كراء المقطورات والتجهيزات',
    agencyPhone: '+213 661 33 22 11',
    rating: 4.85,
    reviewCount: 28,
    isAvailable: true,
    features: ['أضواء خلفية قياسية وإشارات', 'غطاء حماية مشدود', 'مثالية للتخييم، نقل الدراجات، أو الأغراض الإضافية']
  }
];


