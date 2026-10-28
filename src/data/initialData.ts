import { BusinessConfig, ServiceCategory, Service, StaffMember, Room, Appointment, AuditLog, RewardOffer, CustomerRewardsProfile, CustomerProfile } from '../types';

export const initialBusinessConfig: BusinessConfig = {
  salonName: {
    ar: 'فنة | مركز تجميل مغربي',
    en: 'FINAH BEAUTY | Moroccan Beauty House'
  },
  tagline: {
    ar: 'طقوس الجمال المغربي، بروح فنة الأصيلة في دبي',
    en: 'Authentic Moroccan beauty rituals, crafted with the Finah spirit in Dubai'
  },
  bookingMode: 'request', // Default to request mode until owner confirms full live POS integration
  timezone: 'Asia/Dubai',
  address: {
    ar: 'دبي، الإمارات العربية المتحدة (الموقع التفصيلي سيتم اعتماده قريباً)',
    en: 'Dubai, United Arab Emirates (Exact boutique location to be confirmed by owner)',
    status: 'draft',
    city: 'Dubai',
    country: 'United Arab Emirates'
  },
  phone: {
    display: '+971 4 000 0000',
    raw: '+97140000000',
    status: 'draft' // Clearly noted as draft pending owner configuration
  },
  whatsapp: {
    display: '+971 50 000 0000',
    link: 'https://wa.me/971500000000',
    status: 'draft'
  },
  email: {
    address: 'contact@finahbeauty.com',
    status: 'draft'
  },
  instagram: {
    handle: '@finahbeauty',
    url: 'https://www.instagram.com/finahbeauty/'
  },
  businessHours: {
    openTime: '10:00',
    closeTime: '21:00',
    daysOpen: [0, 1, 2, 3, 4, 5, 6] // Open daily 10:00 AM - 9:00 PM GST
  },
  policies: {
    depositPercentage: 20, // 20% deposit when live mode is engaged
    cancellationWindowHours: 24, // 24h cancellation notice
    minimumNoticeHours: 2,
    maxBookingHorizonDays: 45
  }
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hammam',
    slug: 'moroccan-hammam',
    name: {
      ar: 'الحمام المغربي الأصيل',
      en: 'Moroccan Hammam'
    },
    description: {
      ar: 'طقوس حمام مغربي تقليدية بالصابون البلدي الطبيعي، الكيس المغربي، والغاسول المعطر بالأعشاب والورد.',
      en: 'Traditional Moroccan hammam rituals with natural black soap, kessa glove exfoliation, and botanical ghassoul clay.'
    },
    highlightServiceId: 'hammam-royal-finah',
    iconName: 'Sparkles'
  },
  {
    id: 'bridal',
    slug: 'bridal-rituals',
    name: {
      ar: 'طقوس العروس الملكية',
      en: 'Bridal Rituals'
    },
    description: {
      ar: 'عناية متكاملة للعروس تستحضر تقاليد الأعراس المغربية الأصيلة من النقاء والبياض والنعومة.',
      en: 'Comprehensive bridal ceremonies drawing from authentic Moroccan celebration traditions of radiance and softness.'
    },
    highlightServiceId: 'bridal-signature-ceremony',
    iconName: 'Crown'
  },
  {
    id: 'hair',
    slug: 'hair-care-styling',
    name: {
      ar: 'العناية بالشعر والتصفيف',
      en: 'Hair Care & Styling'
    },
    description: {
      ar: 'علاجات مغذية بزيت الأركان العضوي وخلاصات إكليل الجبل المغربي مع تصفيف راقٍ.',
      en: 'Nourishing therapies using organic Moroccan argan oil and wild atlas herbs paired with refined styling.'
    },
    highlightServiceId: 'hair-argan-elixir',
    iconName: 'Scissors'
  },
  {
    id: 'facial',
    slug: 'facial-care',
    name: {
      ar: 'العناية بالبشرة والوجه',
      en: 'Facial Care'
    },
    description: {
      ar: 'نضارة طبيعية بماء الورد المقطر في قلعة مكونة وزيت التين الشوكي الثمين.',
      en: 'Natural radiance with distilled Kelaat M\'gouna rosewater and precious Moroccan prickly pear seed elixir.'
    },
    highlightServiceId: 'facial-rose-radiance',
    iconName: 'Smile'
  },
  {
    id: 'body',
    slug: 'body-care-massage',
    name: {
      ar: 'العناية بالجسم والمساج',
      en: 'Body Care & Massage'
    },
    description: {
      ar: 'تدليك استرخائي عميق بالزيوت الطبيعية المعطرة بزهر البرتقال والعنبر المغربي.',
      en: 'Deep restorative massage with warm botanical oils infused with neroli orange blossom and warm amber.'
    },
    highlightServiceId: 'body-argan-orange-blossom',
    iconName: 'Heart'
  }
];

export const initialServices: Service[] = [
  // Hammam Category
  {
    id: 'hammam-traditional-authentic',
    slug: 'traditional-moroccan-hammam',
    categoryId: 'hammam',
    name: {
      ar: 'الحمام المغربي التقليدي',
      en: 'Traditional Moroccan Hammam'
    },
    shortIntro: {
      ar: 'جلسة تنقية كلاسيكية بالصابون الأسود والكيس المغربي لإزالة الخلايا الميتة وتجديد حيوية البشرة.',
      en: 'A classic purification ritual with black olive soap and kessa glove exfoliation to revitalize the skin.'
    },
    description: {
      ar: 'تبدأ الجلسة بالاسترخاء في غرفة البخار الدافئة لفتح المسام، تليها تغطية الجسم بالصابون البلدي الطبيعي بزيت الزيتون المعصور على البارد. بعد الاستراحة، تقوم المتخصصة بالتقشير الدقيق بالكيس المغربي الأصيل، يعقبه غسل منعش وترطيب خفيف بماء الزهر.',
      en: 'Begins with gentle warm steam to open the pores, followed by an application of cold-pressed Moroccan black olive soap. Our specialist performs a thorough kessa glove exfoliation to shed dull skin, concluded with a refreshing rinse and light orange blossom water mist.'
    },
    inclusions: {
      ar: [
        'جلسة بخار مغربي دافئ (15 دقيقة)',
        'تطبيق الصابون البلدي الطبيعي بزيت الزيتون',
        'تقشير كامل للجسم بالكيس المغربي الشخصي',
        'شطف منعش وترطيب بماء الورد المغربي'
      ],
      en: [
        'Warm Moroccan steam chamber relaxation (15 mins)',
        'Application of natural cold-pressed black soap',
        'Full body kessa glove deep exfoliation',
        'Refreshing floral water rinse and light hydration'
      ]
    },
    durationMinutes: 60,
    bufferMinutes: 20,
    priceAed: 380,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: true,
    requiredRoomType: 'hammam_suite',
    eligibleStaffIds: ['staff-kenza', 'staff-fatima'],
    preparationNotes: {
      ar: 'يُفضل الحضور قبل 15 دقيقة من الموعد. تجنبي إزالة الشعر بالشمع أو الحلاقة قبل الجلسة بـ 24 ساعة.',
      en: 'Please arrive 15 minutes before your ritual. We advise refraining from waxing or shaving for 24 hours prior.'
    },
    tags: ['hammam', 'traditional', 'exfoliation', 'detox']
  },
  {
    id: 'hammam-royal-finah',
    slug: 'finah-royal-amber-rose-hammam',
    categoryId: 'hammam',
    name: {
      ar: 'حمام فنة الملكي بالعنبر والورد',
      en: 'Finah Royal Amber & Rose Hammam'
    },
    shortIntro: {
      ar: 'تجربة الحمام المغربي الأرقى، تجمع بين التقشير الملكي، قناع الغاسول المعطر بالأعشاب السبعة، ومساج الرأس.',
      en: 'Our pinnacle hammam ritual combining royal exfoliation, seven-herb scented ghassoul mask, and nourishing scalp care.'
    },
    description: {
      ar: 'رحلة استرخاء عميقة تستحضر تقاليد القصور المغربية. تتضمن دهن الجسم بالصابون الأسود الملكي الممزوج بزيت الأركان، تقشير كيس دقيق، قناع غاسول الأطلس الطبيعي المعطر بالورد الدمشقي والأعشاب، وغسيل الشعر مع مساج مهدئ لفروة الرأس.',
      en: 'A deeply restorative journey evoking Moroccan palace rituals. Features royal black soap enriched with argan oil, thorough kessa exfoliation, an Atlas mineral ghassoul body mask infused with Damask rose and 7 botanical herbs, and a relaxing scalp massage.'
    },
    inclusions: {
      ar: [
        'بخار الأوكالبتوس العطري (20 دقيقة)',
        'صابون بلدي ملكي غني بالأركان وخلاصة الورد',
        'تقشير كيس مغربي دقيق ومنعّم',
        'قناع غاسول الأطلس المغربي المعطر بالأعشاب الطبيعية',
        'غسيل الشعر ومساج فروة الرأس',
        'كوب شاي مغربي بالنعناع الطازج في ركن الاسترخاء'
      ],
      en: [
        'Aromatic eucalyptus steam chamber (20 mins)',
        'Royal black soap enriched with argan & rose essences',
        'Precision Moroccan kessa exfoliation',
        'Atlas mountain ghassoul clay mask infused with herbs',
        'Hair wash and botanical scalp massage',
        'Fresh Moroccan mint tea service in our lounge'
      ]
    },
    durationMinutes: 90,
    bufferMinutes: 20,
    priceAed: 580,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: true,
    requiredRoomType: 'hammam_suite',
    eligibleStaffIds: ['staff-kenza', 'staff-fatima'],
    preparationNotes: {
      ar: 'يرجى إبلاغ المعالجة بأي حساسية تجاه الروائح العطرية أو الأعشاب الطبيعية.',
      en: 'Please inform your therapist of any fragrance or herbal sensitivities prior to treatment.'
    },
    tags: ['hammam', 'signature', 'royal', 'ghassoul', 'rose']
  },

  // Bridal Category
  {
    id: 'bridal-signature-ceremony',
    slug: 'finah-signature-bridal-journey',
    categoryId: 'bridal',
    name: {
      ar: 'طقوس العروس الملكية المتكاملة',
      en: 'Finah Royal Bridal Signature Journey'
    },
    shortIntro: {
      ar: 'باقة مخصصة للعروس تشمل الحمام الملكي، تفتيح وترطيب الجسم، وعناية النضارة الفائقة للوجه.',
      en: 'A bespoke multi-hour bridal sanctuary journey with royal hammam, body radiance, and luminous facial care.'
    },
    description: {
      ar: 'طقوس مغربية عريقة مصممة لتمنح العروس هدوءاً ونعومة ونضارة استثنائية. يتم ترتيب التجربة بجلسة استشارية مسبقة، وتتضمن حماماً ملكياً خاصاً، تقشير حريري، قناع العكر الفاسي وماء الورد للنضارة، تدليك مهدئ للأعصاب، وتصفيف للشعر.',
      en: 'An ancient ceremonial journey designed to gift the bride peace, velvety softness, and deep radiance. The experience includes a private royal hammam, silk scrub, Aker Fassi and rose petal radiance mask, restorative tension-release massage, and hair nourishment.'
    },
    inclusions: {
      ar: [
        'استقبال خاص وشاي الأعشاب المغربية المهدئة',
        'حمام ملكي كامل بالأركان والعنبر',
        'قناع تفتيح ونعومة طبيعي بالعكر الفاسي والغاسول الأبيض',
        'جلسة تدليك استرخائي لكامل الجسم (50 دقيقة)',
        'جلسة نضارة للوجه بماء الورد وزيت التين الشوكي',
        'هدية العروس التذكارية من فنة'
      ],
      en: [
        'Private reception welcome with calming herbal infusion',
        'Complete royal hammam with amber and argan',
        'Natural brightening body mask with Aker Fassi & white clay',
        'Full body relaxation massage (50 mins)',
        'Luminous facial treatment with prickly pear nectar',
        'Finah commemorative bridal keepsake'
      ]
    },
    durationMinutes: 180,
    bufferMinutes: 30,
    priceAed: 1450,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: false, // In accordance with requirement: bridal requests require consultation
    requiredRoomType: 'hammam_suite',
    eligibleStaffIds: ['staff-kenza', 'staff-fatima', 'staff-amina'],
    preparationNotes: {
      ar: 'يوصى بحجز هذه الجلسة قبل موعد حفل الزفاف بـ 3 إلى 5 أيام لضمان أفضل نضارة.',
      en: 'We recommend scheduling this journey 3 to 5 days before the wedding celebration for optimal skin calmness.'
    },
    tags: ['bridal', 'ceremony', 'luxury', 'complete-package']
  },

  // Hair Care Category
  {
    id: 'hair-argan-elixir',
    slug: 'moroccan-organic-argan-hair-therapy',
    categoryId: 'hair',
    name: {
      ar: 'علاج الأركان المغربي لترميم وتغذية الشعر',
      en: 'Moroccan Organic Argan Restorative Hair Therapy'
    },
    shortIntro: {
      ar: 'جلسة تغذية عميقة للشعر الجاف والمتعب بزيت الأركان البكر المعصور على البارد وبخار الأعشاب.',
      en: 'Deep nourishing therapy for tired hair utilizing cold-pressed virgin argan oil and botanical steam.'
    },
    description: {
      ar: 'علاج مخصص لإعادة اللمعان والحيوية لألياف الشعر. يتم تدليك فروة الرأس بمزيج دافئ من زيت الأركان العضوي وخلاصة إكليل الجبل البري، مع تعريض خفيف للبخار لتسهيل تغلغل الزيوت، ثم غسيل متوازن وتصفيف احترافي ناعم.',
      en: 'Tailored therapy restoring vitality and shine. Warm certified Moroccan argan oil blended with wild rosemary is massaged into the scalp and lengths under gentle steam infusion, followed by balancing botanical wash and sleek blow-dry.'
    },
    inclusions: {
      ar: [
        'تشخيص طبيعة الشعر واختيار الزيوت المناسبة',
        'مساج دافئ لفروة الرأس والشعر بالزيت العضوي',
        'جلسة بخار معتدل لتغلغل المغذيات (20 دقيقة)',
        'غسيل لطيف بشامبو خالٍ من الكبريتات وتصفيف ناعم'
      ],
      en: [
        'Hair texture consultation & oil blend customization',
        'Warm scalp and lengths massage with pure organic argan',
        'Gentle micro-steam nutrient infusion (20 mins)',
        'Sulfate-free botanical wash and signature blowout'
      ]
    },
    durationMinutes: 75,
    bufferMinutes: 15,
    priceAed: 420,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: true,
    requiredRoomType: 'hair_station',
    eligibleStaffIds: ['staff-amina'],
    preparationNotes: {
      ar: 'لا يتطلب أي تحضير مسبق. يُرجى تجنب استخدام مثبتات الشعر القوية قبل الموعد.',
      en: 'No advance preparation needed. Please arrive with dry hair free of heavy holding sprays.'
    },
    tags: ['hair', 'argan', 'nourishing', 'blowout']
  },

  // Facial Care Category
  {
    id: 'facial-rose-radiance',
    slug: 'damask-rose-ghassoul-radiance-facial',
    categoryId: 'facial',
    name: {
      ar: 'جلسة النضارة بماء الورد الدمشقي والغاسول الأبيض',
      en: 'Damask Rose & White Ghassoul Radiance Facial'
    },
    shortIntro: {
      ar: 'عناية مهدئة تعيد التوازن والإشراق للبشرة بمستخلصات زهرية مغربية نقية وخالية من المواد الكيميائية.',
      en: 'Calming facial restoring balance and luminous glow using pure Moroccan floral extracts.'
    },
    description: {
      ar: 'تنظيف لطيف للبشرة مع تقشير ناعم بمسحوق اللوز المغربي، يليه قناع من الغاسول الأبيض المهدئ المخلوط بماء الورد الدمشقي الأصلي المقطر يدوياً، وتدليك وجه تصريفي بحجر الكوارتز الوردي وزيت التين الشوكي المغربي الثمين.',
      en: 'Gentle facial cleanse followed by a soft almond powder micro-polish, white clay mask infused with distilled Moroccan Damask rosewater, and a lymphatic drainage face massage using organic prickly pear seed oil.'
    },
    inclusions: {
      ar: [
        'تنظيف مزدوج بزيوت نباتية لطيفة',
        'تقشير دقيق بمسحوق اللوز المغربي',
        'قناع الغاسول الأبيض وماء الورد النقي',
        'تدليك نحت وتصريف الوجه بأحجار الكوارتز وزيت التين الشوكي'
      ],
      en: [
        'Double cleanse with gentle botanical oils',
        'Moroccan sweet almond micro-polish',
        'Pure Damask rosewater & white ghassoul soothing mask',
        'Lymphatic face massage with cold-pressed prickly pear seed oil'
      ]
    },
    durationMinutes: 60,
    bufferMinutes: 15,
    priceAed: 450,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: true,
    requiredRoomType: 'facial_room',
    eligibleStaffIds: ['staff-salma'],
    preparationNotes: {
      ar: 'يفضل عدم استخدام أحماض التقشير الكيميائي القوية أو الرتينول لمدة 48 ساعة قبل الجلسة.',
      en: 'Kindly discontinue active retinol or strong exfoliating acids 48 hours prior to your facial.'
    },
    tags: ['facial', 'radiance', 'rosewater', 'prickly-pear']
  },

  // Body Care Category
  {
    id: 'body-argan-orange-blossom',
    slug: 'warm-argan-orange-blossom-massage',
    categoryId: 'body',
    name: {
      ar: 'تدليك الاسترخاء بزيت الأركان وزهر البرتقال',
      en: 'Warm Argan & Neroli Orange Blossom Massage'
    },
    shortIntro: {
      ar: 'تدليك استرخائي انسيابي لكامل الجسم بالزيوت المغربية الدافئة لتهدئة التوتر واستعادة التناغم.',
      en: 'Flowing full-body relaxation massage with warm botanical oils soothing muscular tension.'
    },
    description: {
      ar: 'تنساب حركات التدليك الإيقاعية مع عبق زهر البرتقال المغربي (الما زهر) الممزوج بزيت الأركان النقي. يركز التدليك على مناطق تجمع التوتر في الظهر والكتفين والقدمين ليمنحك شعوراً بالخفة والسكينة التامة.',
      en: 'Rhythmic, gentle kneading movements melt away tension guided by the soothing scent of Moroccan neroli orange blossom infused into warm argan oil. Eases chronic stress in the back, shoulders, and feet.'
    },
    inclusions: {
      ar: [
        'حمام قدمين دافئ ببتلات الورد وأملاح البحر',
        'تدليك استرخائي كامل للجسم (60 دقيقة)',
        'زيوت طبيعية دافئة معصورة على البارد',
        'استراحة شاي بالنعناع في الردهة الهادئة'
      ],
      en: [
        'Warm rose petal foot soak and mineral sea salt scrub',
        '60-minute full body flowing massage',
        'Warm cold-pressed botanical argan & neroli oil',
        'Mint tea relaxation rest in our quiet lounge'
      ]
    },
    durationMinutes: 60,
    bufferMinutes: 20,
    priceAed: 420,
    pricingStatus: 'approved',
    status: 'approved',
    onlineBookable: true,
    requiredRoomType: 'body_suite',
    eligibleStaffIds: ['staff-salma', 'staff-kenza'],
    preparationNotes: {
      ar: 'يرجى إعلام المعالجة بدرجة الضغط المفضلة (خفيف، متوسط، أو عميق).',
      en: 'Please indicate your preferred pressure level (light, medium, or deep) at the start of your session.'
    },
    tags: ['massage', 'body', 'relaxation', 'orange-blossom']
  }
];

export const initialStaff: StaffMember[] = [
  {
    id: 'staff-kenza',
    name: {
      ar: 'كنزة',
      en: 'Kenza'
    },
    role: 'therapist',
    title: {
      ar: 'كبيرة أخصائيات الحمام المغربي والتدليك',
      en: 'Senior Hammam & Body Ritual Specialist'
    },
    specialties: ['hammam', 'body', 'bridal'],
    workingDays: [0, 1, 2, 3, 5, 6], // Sun, Mon, Tue, Wed, Fri, Sat
    shiftStart: '10:00',
    shiftEnd: '19:00',
    active: true
  },
  {
    id: 'staff-fatima',
    name: {
      ar: 'فاطمة الزهراء',
      en: 'Fatima-Zahra'
    },
    role: 'therapist',
    title: {
      ar: 'أخصائية حمام مغربي تقليدي وطقوس العروس',
      en: 'Traditional Moroccan Hammam & Bridal Specialist'
    },
    specialties: ['hammam', 'bridal'],
    workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    shiftStart: '12:00',
    shiftEnd: '21:00',
    active: true
  },
  {
    id: 'staff-salma',
    name: {
      ar: 'سلمى',
      en: 'Salma'
    },
    role: 'therapist',
    title: {
      ar: 'أخصائية العناية بالبشرة والتدليك الطبيعي',
      en: 'Facialist & Holistic Body Practitioner'
    },
    specialties: ['facial', 'body'],
    workingDays: [0, 1, 2, 4, 5, 6],
    shiftStart: '10:00',
    shiftEnd: '19:00',
    active: true
  },
  {
    id: 'staff-amina',
    name: {
      ar: 'أمينة',
      en: 'Amina'
    },
    role: 'therapist',
    title: {
      ar: 'أخصائية علاجات الشعر والتصفيف التراثي',
      en: 'Botanical Hair & Styling Specialist'
    },
    specialties: ['hair', 'bridal'],
    workingDays: [0, 2, 3, 4, 5, 6],
    shiftStart: '11:00',
    shiftEnd: '20:00',
    active: true
  }
];

export const initialRooms: Room[] = [
  {
    id: 'room-fes',
    name: {
      ar: 'جناح فاس (حمام مغربي ملكي)',
      en: 'Fez Royal Hammam Suite'
    },
    type: 'hammam_suite',
    capacity: 1,
    active: true
  },
  {
    id: 'room-marrakech',
    name: {
      ar: 'جناح مراكش (حمام مغربي كلاسيكي)',
      en: 'Marrakech Hammam Suite'
    },
    type: 'hammam_suite',
    capacity: 1,
    active: true
  },
  {
    id: 'room-casablanca',
    name: {
      ar: 'غرفة الدار البيضاء (العناية بالبشرة)',
      en: 'Casablanca Facial Sanctuary'
    },
    type: 'facial_room',
    capacity: 1,
    active: true
  },
  {
    id: 'room-rabat',
    name: {
      ar: 'استوديو الرباط (تصفيف وعناية بالشعر)',
      en: 'Rabat Styling Atelier'
    },
    type: 'hair_station',
    capacity: 2,
    active: true
  },
  {
    id: 'room-atlas',
    name: {
      ar: 'جناح الأطلس (تدليك واسترخاء)',
      en: 'Atlas Body & Massage Suite'
    },
    type: 'body_suite',
    capacity: 1,
    active: true
  }
];

// Sample demo appointments (both upcoming and past) with realistic staff and payment summaries
export const initialDemoAppointments: Appointment[] = [
  // Upcoming Appointment for Mariam
  {
    id: 'apt-demo-1',
    referenceCode: 'FIN-2026-1042',
    serviceId: 'hammam-royal-finah',
    serviceName: {
      ar: 'حمام فنة الملكي بالعنبر والورد',
      en: 'Finah Royal Amber & Rose Hammam'
    },
    staffId: 'staff-kenza',
    staffName: 'Kenza (كبيرة أخصائيات الحمام المغربي)',
    roomId: 'room-fes',
    date: '2026-10-28',
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    customerName: 'مريم المنصوري',
    customerPhone: '+971501234567',
    customerEmail: 'mariam@example.com',
    status: 'confirmed',
    paymentStatus: 'deposit_paid',
    priceAed: 580,
    depositPaidAed: 116,
    remainingBalanceAed: 464,
    mode: 'demo',
    createdAt: '2026-10-25T08:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z'
  },
  // Past Appointment 1 for Mariam (completed ritual)
  {
    id: 'apt-demo-past-1',
    referenceCode: 'FIN-2026-0914',
    serviceId: 'hammam-traditional-authentic',
    serviceName: {
      ar: 'الحمام المغربي التقليدي',
      en: 'Traditional Moroccan Hammam'
    },
    staffId: 'staff-kenza',
    staffName: 'Kenza (كبيرة أخصائيات الحمام المغربي)',
    roomId: 'room-fes',
    date: '2026-10-12',
    startTime: '11:00',
    endTime: '12:00',
    durationMinutes: 60,
    customerName: 'مريم المنصوري',
    customerPhone: '+971501234567',
    customerEmail: 'mariam@example.com',
    status: 'completed',
    paymentStatus: 'paid_in_full',
    priceAed: 380,
    depositPaidAed: 380,
    remainingBalanceAed: 0,
    mode: 'demo',
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-12T12:00:00Z'
  },
  // Past Appointment 2 for Mariam (completed ritual)
  {
    id: 'apt-demo-past-2',
    referenceCode: 'FIN-2026-0820',
    serviceId: 'body-argan-orange-blossom',
    serviceName: {
      ar: 'تدليك الاسترخاء بزيت الأركان وزهر البرتقال',
      en: 'Warm Argan & Neroli Orange Blossom Massage'
    },
    staffId: 'staff-salma',
    staffName: 'Salma (أخصائية التدليك والعناية بالبشرة)',
    roomId: 'room-atlas',
    date: '2026-09-18',
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    customerName: 'مريم المنصوري',
    customerPhone: '+971501234567',
    customerEmail: 'mariam@example.com',
    status: 'completed',
    paymentStatus: 'paid_in_full',
    priceAed: 420,
    depositPaidAed: 420,
    remainingBalanceAed: 0,
    mode: 'demo',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-18T17:00:00Z'
  },
  // Upcoming Appointment for Noura
  {
    id: 'apt-demo-2',
    referenceCode: 'FIN-2026-1088',
    serviceId: 'facial-rose-radiance',
    serviceName: {
      ar: 'جلسة النضارة بماء الورد الدمشقي والغاسول الأبيض',
      en: 'Damask Rose & White Ghassoul Radiance Facial'
    },
    staffId: 'staff-salma',
    staffName: 'Salma (أخصائية التدليك والعناية بالبشرة)',
    roomId: 'room-casablanca',
    date: '2026-10-29',
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    customerName: 'نورة الكعبي',
    customerPhone: '+971529876543',
    customerEmail: 'noura@example.com',
    status: 'confirmed',
    paymentStatus: 'deposit_paid',
    priceAed: 450,
    depositPaidAed: 90,
    remainingBalanceAed: 360,
    mode: 'demo',
    createdAt: '2026-10-25T08:20:00Z',
    updatedAt: '2026-10-25T08:20:00Z'
  },
  // Past Appointment for Noura
  {
    id: 'apt-demo-past-3',
    referenceCode: 'FIN-2026-0740',
    serviceId: 'hair-argan-therapy',
    serviceName: {
      ar: 'علاج الأركان المغربي للشعر وفروة الرأس',
      en: 'Moroccan Organic Argan Hair & Scalp Therapy'
    },
    staffId: 'staff-amina',
    staffName: 'Amina (خبيرة العناية بالشعر والأركان المغربي)',
    roomId: 'room-rabat',
    date: '2026-09-25',
    startTime: '15:00',
    endTime: '16:15',
    durationMinutes: 75,
    customerName: 'نورة الكعبي',
    customerPhone: '+971529876543',
    customerEmail: 'noura@example.com',
    status: 'completed',
    paymentStatus: 'paid_in_full',
    priceAed: 420,
    depositPaidAed: 420,
    remainingBalanceAed: 0,
    mode: 'demo',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-25T16:15:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-25 08:30 GST',
    actor: 'Admin / System',
    role: 'owner',
    action: 'INITIALIZE_CATALOG',
    details: 'Catalog initialized in Request & Demo mode. Authentic Moroccan services registered with verified inclusions.'
  }
];

export const initialRewardOffers: RewardOffer[] = [
  {
    id: 'reward-disc-10pct',
    name: {
      ar: 'خصم تقديري 10% على أي طقس',
      en: '10% Courtesy Privilege on Any Ritual'
    },
    description: {
      ar: 'يمكن تطبيق هذا الخصم على أي جلسة حمام، مساج، أو عناية بالبشرة.',
      en: 'Applicable toward any hammam, body massage, or facial treatment.'
    },
    pointsCost: 250,
    rewardType: 'discount_percentage',
    discountPercentage: 10
  },
  {
    id: 'reward-free-scalp-wrap',
    name: {
      ar: 'جلسة إضافية مجانية: علاج فروة الرأس بماء الورد والغاسول',
      en: 'Complimentary Rose & Mineral Scalp Therapy'
    },
    description: {
      ar: 'طقس إضافي مغذٍ يضاف إلى زيارتك بالورد الدمشقي وغاسول جبال الأطلس.',
      en: 'Complimentary add-on treatment infused with Damask rose & Atlas clay.'
    },
    pointsCost: 450,
    rewardType: 'exclusive_treatment',
    exclusiveTreatmentName: {
      ar: 'طقس تنقية الفروة بالورد وغاسول الأطلس',
      en: 'Atlas Ghassoul & Rose Scalp Rejuvenation'
    }
  },
  {
    id: 'reward-disc-100aed',
    name: {
      ar: 'رصيد 100 درهم إماراتي',
      en: '100 AED Sanctuary Courtesy Credit'
    },
    description: {
      ar: 'يُخصم مباشرة من قيمة زيارتك القادمة في فنة.',
      en: 'Deducted directly from the balance of your next sanctuary booking.'
    },
    pointsCost: 750,
    rewardType: 'discount_fixed',
    discountAed: 100
  },
  {
    id: 'reward-free-hammam',
    name: {
      ar: 'جلسة حمام مغربي تقليدي مجانية بالكامل (60 دقيقة)',
      en: 'Complimentary Traditional Moroccan Hammam (60 mins)'
    },
    description: {
      ar: 'جلسة كاملة مجانية بالصابون الأسود والكيس المغربي والبخار (قيمة 380 درهم).',
      en: 'Full complimentary hammam with black olive soap and kessa exfoliation (380 AED value).'
    },
    pointsCost: 1200,
    rewardType: 'exclusive_treatment',
    exclusiveTreatmentName: {
      ar: 'الحمام المغربي التقليدي الكامل',
      en: 'Full Traditional Moroccan Hammam Ritual'
    }
  }
];

export const initialCustomerRewards: Record<string, CustomerRewardsProfile> = {
  '+971501234567': {
    phone: '+971501234567',
    customerName: 'مريم المنصوري',
    tier: 'amber',
    totalPoints: 630,
    lifetimePointsEarned: 630,
    transactions: [
      {
        id: 'tx-1',
        timestamp: '2026-10-25 08:00 GST',
        type: 'earned',
        points: 580,
        description: {
          ar: 'نقاط حجز حمام فنة الملكي بالعنبر والورد',
          en: 'Points earned for Finah Royal Hammam reservation'
        },
        referenceCode: 'FIN-2026-1042'
      },
      {
        id: 'tx-2',
        timestamp: '2026-10-25 08:00 GST',
        type: 'bonus',
        points: 50,
        description: {
          ar: 'مكافأة ترحيبية في عضوية فنة',
          en: 'Finah Sanctuary Welcome Privilege'
        }
      }
    ]
  },
  '+971529876543': {
    phone: '+971529876543',
    customerName: 'نورة الكعبي',
    tier: 'zellige',
    totalPoints: 250,
    lifetimePointsEarned: 250,
    transactions: [
      {
        id: 'tx-3',
        timestamp: '2026-10-25 08:20 GST',
        type: 'earned',
        points: 200,
        description: {
          ar: 'نقاط طلب جلسة نضارة الوجه بماء الورد',
          en: 'Points earned for Rose Facial request'
        },
        referenceCode: 'FIN-2026-1088'
      },
      {
        id: 'tx-4',
        timestamp: '2026-10-25 08:20 GST',
        type: 'bonus',
        points: 50,
        description: {
          ar: 'مكافأة ترحيبية في عضوية فنة',
          en: 'Finah Sanctuary Welcome Privilege'
        }
      }
    ]
  }
};

export const initialCustomerProfiles: Record<string, CustomerProfile> = {
  '+971501234567': {
    id: 'cust-mariam',
    fullName: 'مريم المنصوري',
    phone: '+971501234567',
    email: 'mariam@example.com',
    preferredLanguage: 'ar',
    preferredStaffId: 'staff-kenza',
    wellnessGoals: ['تقشير وتنعيم البشرة', 'الاسترخاء العضلي العميق', 'العناية بالبشرة بالغاسول والورد'],
    allergiesOrSensitivities: 'لا توجد أي حساسية جلدية معروفة، تفضل الضغط المتوسط المريح في جلسات التدليك',
    notes: 'تفضل شاي النعناع المغربي الأصيل بالرغوة الوفيرة في الردهة الهادئة بعد الانتهاء من الطقس',
    communicationPreferences: {
      whatsappReminders: true,
      smsAlerts: true,
      emailItineraries: false,
      botanicalTips: true
    },
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z'
  },
  '+971529876543': {
    id: 'cust-noura',
    fullName: 'نورة الكعبي',
    phone: '+971529876543',
    email: 'noura@example.com',
    preferredLanguage: 'ar',
    preferredStaffId: 'staff-salma',
    wellnessGoals: ['نضارة وترطيب البشرة', 'عناية الشعر العضوي بالأركان'],
    allergiesOrSensitivities: 'بشرة حساسة، تجنب استخدام الزيوت العطرية المركزة على الوجه والرقبة',
    notes: 'تحب الهدوء التام وتفضل جلسات الصباح الهادئة مع ماء الورد البارد المقطر',
    communicationPreferences: {
      whatsappReminders: true,
      smsAlerts: false,
      emailItineraries: true,
      botanicalTips: true
    },
    createdAt: '2026-09-01T14:30:00Z',
    updatedAt: '2026-10-25T08:20:00Z'
  }
};

