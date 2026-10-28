import { MemberSpotlight, SharedVisitPhoto } from '../types';

export const INITIAL_MEMBER_SPOTLIGHTS: MemberSpotlight[] = [
  {
    id: 'spotlight-mariam',
    name: { ar: 'مريم النعيمي', en: 'Mariam Al-Nuaimi' },
    city: { ar: 'دبي، جميرا', en: 'Jumeirah, Dubai' },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tier: 'royal_jasmine',
    memberSince: { ar: 'عضوة منذ يناير ٢٠٢٥', en: 'Member since Jan 2025' },
    headline: {
      ar: 'إعادة بناء حاجز البشرة الحريري وتجديد الطاقة بعد رحلات عمل متتالية',
      en: 'Restoring a Silk Skin Barrier & Inner Serenity After Desert Flights'
    },
    transformationStory: {
      beforeState: {
        ar: 'جفاف حاد وشحوب في لون البشرة ناتج عن السفر المتواصل وأجواء المكيفات، مع إجهاد عضلي واضح في الظهر والكتفين.',
        en: 'Chronic dehydration, tightness, and jet-lag dullness from continuous regional flights and harsh indoor AC exposure.'
      },
      ritualPath: {
        ar: 'حمام فنة الملكي بالأعشاب والورد مع الصابون الأسود العتيق والتقشير بالكيس المغربي، تلاه قناع الغاسول الأطلسي المعطر بالورد، وجلسة تدليك بأحجار الكوارتز ورذاذ الورد الدمشقي البارد.',
        en: 'Finah Royal Herbal & Rose Hammam using authentic artisan black olive soap and kessa exfoliation, enveloped in 7-herb Atlas ghassoul and cold-distilled Damask rose quartz lymphatic drainage.'
      },
      outcome: {
        ar: 'بشرة ناعمة بملمس حريري ممتلئ، وتورد صحي طبيعي بدون أي مكياج، مع زوال كامل لآلام التوتر وراحة عميقة دامت لأسابيع.',
        en: 'Velvety plump skin with an unmistakable natural blush, complete release of neck tension, and lingering notes of sweet neroli and rose.'
      }
    },
    quote: {
      ar: '«فنة بالنسبة لي ليست مجرد موعد تجميل عابر، بل ملاذ أسبوعي أستعيد فيه توازني وسكينتي. كل تفصيلة، من صب الشاي الساخن برغوة وفيرة إلى بخار الأعشاب، تجعلني أشعر بالامتنان والتقدير الملكي.»',
      en: '“Finah is far more than a salon visit; it is my sanctuary of stillness. From the gentle pour of mint tea to the botanical warmth of the vaulted steam room, every detail honors the guest like royalty.”'
    },
    favoriteRituals: [
      {
        serviceId: 'hammam-royal-finah',
        name: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
        category: 'hammam'
      },
      {
        serviceId: 'facial-rose-radiance',
        name: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
        category: 'facial'
      }
    ],
    favoriteStaffName: { ar: 'كنزة الفاسي (خبيـرة الحمام الأولى)', en: 'Kenza Al-Fassi (Senior Hammam Specialist)' },
    verifiedVisitDate: { ar: '١٢ أكتوبر ٢٠٢٦', en: '12 October 2026' },
    isFeaturedMonth: true,
    photos: [
      {
        id: 'photo-m-1',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'جناح الحمام المغربي الخاص في فنة - دفء الزليج وأواني النحاس المعتقة وضوء الشموع المهدئ.',
          en: 'Our private hammam sanctuary - warm zellige tiles, hand-beaten copper basins, and gentle candlelight.'
        },
        tag: 'hammam'
      },
      {
        id: 'photo-m-2',
        url: 'https://images.unsplash.com/photo-1608248597359-2e06180fc545?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'ماء الورد الدمشقي المقطر يدوياً وزيت التين الشوكي المركز لنضارة فورية قبل جلسة الكوارتز.',
          en: 'Artisan hand-distilled Damask rosewater and cold-pressed prickly pear nectar for quartz therapy.'
        },
        tag: 'facial'
      },
      {
        id: 'photo-m-3',
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'لحظة استرخاء هادئة في ردهة السكينة مع شاي النعناع المغربي بعد انتهاء الحمام الملكي.',
          en: 'Peaceful moments in the sanctuary majlis savoring freshly infused Moroccan mint tea.'
        },
        tag: 'atmosphere'
      }
    ]
  },
  {
    id: 'spotlight-reem',
    name: { ar: 'ريم المنصوري', en: 'Reem Al-Mansouri' },
    city: { ar: 'أبوظبي، الكورنيش', en: 'Corniche, Abu Dhabi' },
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    tier: 'amber',
    memberSince: { ar: 'عضوة منذ مايو ٢٠٢٥', en: 'Member since May 2025' },
    headline: {
      ar: 'ترميم ألياف الشعر التالف بحمام زيت الأركان البكر والبخار العطري',
      en: 'Reviving Heat-Damaged Strands with Pure Cold-Pressed Virgin Argan'
    },
    transformationStory: {
      beforeState: {
        ar: 'تقصف أطراف الشعر، وجفاف متقدم بسبب مجففات الحرارة ومياه المسابح، مع بهتان ملحوظ في اللمعان الطبيعي.',
        en: 'Split ends, brittle texture, and dullness caused by frequent heat styling and pool water minerals.'
      },
      ritualPath: {
        ar: 'جلسة علاج الأركان المغربي مع مساج عميق لفروة الرأس بخلاصة إكليل الجبل البري، مع تعريض خفيف لبخار الأعشاب لتغلغل المغذيات، يليه غسيل متوازن وتصفيف ناعم.',
        en: 'Moroccan Organic Argan Therapy with warm Atlas rosemary scalp massage under gentle micro-steam infusion, followed by botanical sulfate-free wash and smooth blowout.'
      },
      outcome: {
        ar: 'لمعان زجاجي طبيعي وانسيابية حريرية خفيفة بدون أي ثقل دهني، مع حيوية واضحة استعادت رونق الخصلات.',
        en: 'Weightless mirror shine, renewed bounce, and touchable softness that restored my hair’s natural movement.'
      }
    },
    quote: {
      ar: '«الفرق من أول جلسة كان مذهلاً. شعري تنفس من جديد ولمسته أصبحت كالحرير الطبيعي. لم أعد أستغني عن هذه الجلسة الشهرية أبداً.»',
      en: '“The transformation after just one session was undeniable. My hair felt light, resilient, and completely renewed. It has become my essential monthly ritual.”'
    },
    favoriteRituals: [
      {
        serviceId: 'hair-argan-elixir',
        name: { ar: 'علاج الأركان المغربي لترميم وتغذية الشعر', en: 'Moroccan Organic Argan Restorative Hair Therapy' },
        category: 'hair'
      }
    ],
    favoriteStaffName: { ar: 'أمينة التازي (أخصائية العناية بالشعر)', en: 'Amina Al-Tazi (Senior Hair Specialist)' },
    verifiedVisitDate: { ar: '١٨ أكتوبر ٢٠٢٦', en: '18 October 2026' },
    isFeaturedMonth: false,
    photos: [
      {
        id: 'photo-r-1',
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'النتيجة بعد تصفيف فنة الانسيابي - نعومة حريرية ولمعان يعكس إضاءة الفوانيس المغربية.',
          en: 'Silky smooth result following the signature botanical blowout in the salon suite.'
        },
        tag: 'hair'
      },
      {
        id: 'photo-r-2',
        url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'قارورة زيت الأركان العضوي البكر المعصور على البارد من جبال سوس المغربية.',
          en: 'Pure cold-pressed organic argan oil freshly brought from the Sous mountains.'
        },
        tag: 'hair'
      }
    ]
  },
  {
    id: 'spotlight-dana',
    name: { ar: 'دانة الظاهري', en: 'Dana Al-Dhaheri' },
    city: { ar: 'العين، أبوظبي', en: 'Al Ain, Abu Dhabi' },
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tier: 'royal_jasmine',
    memberSince: { ar: 'عضوة منذ سبتمبر ٢٠٢٤', en: 'Member since Sep 2024' },
    headline: {
      ar: 'سكينة ما قبل حفل الزفاف وإشراقة العكر الفاسي وتوريد البشرة المخملي',
      en: 'Pre-Wedding Calm & Radiant Aker Fassi Velvet Bridal Transformation'
    },
    transformationStory: {
      beforeState: {
        ar: 'توتر ذهني وجسدي شديد نتيجة ترتيبات حفل الزفاف، مع اضطراب في النوم وشحوب ملحوظ في ملامح الوجه.',
        en: 'High stress and fatigue from wedding coordination, restless nights, and a tired, stressed complexion.'
      },
      ritualPath: {
        ar: 'طقوس العروس الملكية المتكاملة (٣ ساعات في الجناح المنفصل): تقشير مغربي لطيف، قناع الغاسول الأبيض بالأعشاب، تفتيح وتوريد طبيعي ببتلات العكر الفاسي، وتدليك استرخائي كامل للجسم.',
        en: 'Imperial Moroccan Bridal Sanctuary (3 full hours in private suite): gentle kessa polish, white Atlas clay pack, Aker Fassi petal glow wrap, and 60-min aromatic body massage.'
      },
      outcome: {
        ar: 'سكينة تامة وانتعاش داخلي عميق، مع توريد طبيعي ونضارة لافتة في يوم الزفاف نالت إعجاب وإطراء جميع الحاضرات.',
        en: 'Absolute grounded stillness, serene posture, and an unmistakable bridal radiance that lasted through our entire wedding weekend.'
      }
    },
    quote: {
      ar: '«كانت الساعات الثلاث في الجناح الملكي بمثابة ولادة جديدة لروحي وجسدي قبل العرس. الخبيـرة فاطمة احتضنت توتري بكل هدوء وخبرة لا تُضاهى.»',
      en: '“Those three hours in the private bridal vault felt like a rebirth of my energy before the wedding. Specialist Fatima calmed my mind with unmatched grace and expertise.”'
    },
    favoriteRituals: [
      {
        serviceId: 'bridal-imperial-finah',
        name: { ar: 'طقوس العروس الملكية المتكاملة', en: 'Imperial Moroccan Bridal Sanctuary' },
        category: 'bridal'
      }
    ],
    favoriteStaffName: { ar: 'فاطمة المرابط (كبيرة معالجات طقوس العرائس)', en: 'Fatima Al-Morabit (Head of Bridal Rituals)' },
    verifiedVisitDate: { ar: '٥ أكتوبر ٢٠٢٦', en: '5 October 2026' },
    isFeaturedMonth: false,
    photos: [
      {
        id: 'photo-d-1',
        url: 'https://images.unsplash.com/photo-1512290900672-1f55b9359a60?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'نضارة طبيعية بعد جلسة العروس الملكية - صفاء البشرة وراحة العينين والملامح.',
          en: 'Post-bridal ritual glow - clear, luminous skin and deep rested tranquility.'
        },
        tag: 'bridal'
      },
      {
        id: 'photo-d-2',
        url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'حمام البخار الخاص بالعروس مع بتلات الورد المغربي ورائحة خشب الأرز والمسك.',
          en: 'Private bridal steam suite infused with Damask rose petals and Atlas cedarwood.'
        },
        tag: 'bridal'
      }
    ]
  },
  {
    id: 'spotlight-sarah',
    name: { ar: 'سارة ستيفنز', en: 'Sarah Stevens' },
    city: { ar: 'دبي مارينا', en: 'Dubai Marina' },
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    tier: 'amber',
    memberSince: { ar: 'عضوة منذ مارس ٢٠٢٥', en: 'Member since Mar 2025' },
    headline: {
      ar: 'تهدئة حساسية واحمرار البشرة بإكسير التين الشوكي والورد الجبلي',
      en: 'Soothing Sensitive Flare-ups with Prickly Pear Nectar & Rosewater'
    },
    transformationStory: {
      beforeState: {
        ar: 'بشرة شديدة التحسس مع احمرار دائم في الوجنتين وضعف حاجز الترطيب نتيجة الشمس القوية والمنتجات الكيميائية.',
        en: 'Hypersensitive, reactive skin with persistent cheek redness and compromised lipid barrier from harsh sun.'
      },
      ritualPath: {
        ar: 'جلسة نضارة الورد الدمشقي وتدليك الكوارتز الوردي البارد مع ضغطات مهدئة بزيت بذور التين الشوكي العضوي النقي بدون أي عطور مضافة.',
        en: 'Damask Rose & Quartz Facial with chilled quartz rollers, pure cold-pressed organic prickly pear seed oil, and botanical floral compress.'
      },
      outcome: {
        ar: 'تهدئة كاملة للاحمرار، وتوحيد ملحوظ في لون البشرة مع نعومة مرنة ومظهر نضر وممتلئ.',
        en: 'Immediate soothing of facial heat, evened complexion, and a supple moisture envelope with zero irritation.'
      }
    },
    quote: {
      ar: '«كنت متخوفة جداً بسبب حساسية بشرتي الشديدة، لكن نقاء وأصالة المكونات الطبيعية في فنة كانت بمثابة البلسم الشافي لوجهي.»',
      en: '“Having reactive skin made me cautious, but Finah’s unadulterated botanical ingredients were the purest, most calming antidote I have ever experienced.”'
    },
    favoriteRituals: [
      {
        serviceId: 'facial-rose-radiance',
        name: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
        category: 'facial'
      }
    ],
    favoriteStaffName: { ar: 'كنزة الفاسي (خبيـرة العناية بالبشرة)', en: 'Kenza Al-Fassi (Skincare Specialist)' },
    verifiedVisitDate: { ar: '٢٠ أكتوبر ٢٠٢٦', en: '20 October 2026' },
    isFeaturedMonth: false,
    photos: [
      {
        id: 'photo-s-1',
        url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
        caption: {
          ar: 'أروقة فنة ذات الطراز الأندلسي المغربي - ممرات هادئة تمنحك شعوراً فورياً بالسلام الداخلي.',
          en: 'Moorish vaulted walkways of Finah - secluded passages creating immediate peace of mind.'
        },
        tag: 'atmosphere'
      }
    ]
  }
];

export const INITIAL_SHARED_VISIT_PHOTOS: SharedVisitPhoto[] = [
  {
    id: 'sv-1',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'مريم النعيمي', en: 'Mariam Al-Nuaimi' },
    authorTier: 'royal_jasmine',
    caption: {
      ar: 'دفء الزليج المغربي وأواني النحاس المعتقة في جناحي الخاص قبل بدء الحمام الملكي ✨',
      en: 'Warm Moroccan zellige and hand-beaten copper basins in my private suite before ritual ✨'
    },
    category: 'hammam',
    serviceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    serviceId: 'hammam-royal-finah',
    date: { ar: '١٢ أكتوبر ٢٠٢٦', en: '12 Oct 2026' },
    likesCount: 38,
    featuredStoryId: 'spotlight-mariam'
  },
  {
    id: 'sv-2',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'ريم المنصوري', en: 'Reem Al-Mansouri' },
    authorTier: 'amber',
    caption: {
      ar: 'لمعان شعري وانسيابيته بعد علاج الأركان وبخار الأعشاب مع الخبيـرة أمينة 🤍',
      en: 'Mirror shine and silky movement following the argan therapy with specialist Amina 🤍'
    },
    category: 'hair',
    serviceName: { ar: 'علاج الأركان المغربي لترميم وتغذية الشعر', en: 'Moroccan Organic Argan Restorative Hair Therapy' },
    serviceId: 'hair-argan-elixir',
    date: { ar: '١٨ أكتوبر ٢٠٢٦', en: '18 Oct 2026' },
    likesCount: 29,
    featuredStoryId: 'spotlight-reem'
  },
  {
    id: 'sv-3',
    url: 'https://images.unsplash.com/photo-1608248597359-2e06180fc545?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'سارة ستيفنز', en: 'Sarah Stevens' },
    authorTier: 'amber',
    caption: {
      ar: 'رائحة الورد الدمشقي المقطر وزيت التين الشوكي.. نضارة مذهلة بدون أي احمرار 🌹',
      en: 'Aroma of pure distilled rosewater and prickly pear oil. Calming radiance 🌹'
    },
    category: 'facial',
    serviceName: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
    serviceId: 'facial-rose-radiance',
    date: { ar: '٢٠ أكتوبر ٢٠٢٦', en: '20 Oct 2026' },
    likesCount: 44,
    featuredStoryId: 'spotlight-sarah'
  },
  {
    id: 'sv-4',
    url: 'https://images.unsplash.com/photo-1512290900672-1f55b9359a60?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'دانة الظاهري', en: 'Dana Al-Dhaheri' },
    authorTier: 'royal_jasmine',
    caption: {
      ar: 'إشراقة يوم زفافي بدأت من هنا.. سكينة لا تُنسى في جناح العروس الملكي 👰🏻‍♀️💍',
      en: 'My wedding glow began right here in Finah’s private imperial bridal vault 👰🏻‍♀️💍'
    },
    category: 'bridal',
    serviceName: { ar: 'طقوس العروس الملكية المتكاملة', en: 'Imperial Moroccan Bridal Sanctuary' },
    serviceId: 'bridal-imperial-finah',
    date: { ar: '٥ أكتوبر ٢٠٢٦', en: '5 Oct 2026' },
    likesCount: 56,
    featuredStoryId: 'spotlight-dana'
  },
  {
    id: 'sv-5',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'نورة الكعبي', en: 'Noura Al-Kaabi' },
    authorTier: 'zellige',
    caption: {
      ar: 'شاي النعناع المغربي في ردهة الاسترخاء بعد جلسة الحمام.. راحة بال وسكينة حقيقية 🫖',
      en: 'Fresh Moroccan mint tea in the relaxation lounge after the hammam ritual 🫖'
    },
    category: 'majlis',
    serviceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    serviceId: 'hammam-royal-finah',
    date: { ar: '٢٢ أكتوبر ٢٠٢٦', en: '22 Oct 2026' },
    likesCount: 31
  },
  {
    id: 'sv-6',
    url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'هند القاسمي', en: 'Hind Al-Qasimi' },
    authorTier: 'amber',
    caption: {
      ar: 'أصالة المكونات المغربية الطبيعية: الصابون البلدي بزيت الزيتون والغاسول بالأعشاب 🌿',
      en: 'Pure natural Moroccan ingredients: olive beldi soap and botanical herb clay 🌿'
    },
    category: 'hammam',
    serviceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    serviceId: 'hammam-royal-finah',
    date: { ar: '١٥ أكتوبر ٢٠٢٦', en: '15 Oct 2026' },
    likesCount: 27
  },
  {
    id: 'sv-7',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'ميثاء السويدي', en: 'Maitha Al-Suwaidi' },
    authorTier: 'royal_jasmine',
    caption: {
      ar: 'بخار الأوكالبتوس وبتلات الورد.. الجلسة الشهرية المعتمدة لتجديد الحيوية والاسترخاء 🧖🏻‍♀️',
      en: 'Eucalyptus steam and rose petals.. my essential monthly reset ritual 🧖🏻‍♀️'
    },
    category: 'hammam',
    serviceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    serviceId: 'hammam-royal-finah',
    date: { ar: '٨ أكتوبر ٢٠٢٦', en: '8 Oct 2026' },
    likesCount: 49
  },
  {
    id: 'sv-8',
    url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    authorName: { ar: 'فاطمة الشامسي', en: 'Fatima Al-Shamsi' },
    authorTier: 'amber',
    caption: {
      ar: 'المعمار المغربي والأقواس الهادئة تنقلكِ مباشرة إلى رياض عريق في فاس أو مراكش 🏛️',
      en: 'Moorish vaulted arches transporting you straight to an imperial riad in Fes 🏛️'
    },
    category: 'majlis',
    serviceName: { ar: 'طقوس السكينة المتكاملة', en: 'Complete Sanctuary Journey' },
    date: { ar: '٣ أكتوبر ٢٠٢٦', en: '3 Oct 2026' },
    likesCount: 35
  }
];
