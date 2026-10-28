export interface ArticleSection {
  heading: { ar: string; en: string };
  body: { ar: string; en: string };
}

export interface WellnessArticle {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  category: 'rituals' | 'skincare' | 'wellness' | 'bridal';
  categoryLabel: { ar: string; en: string };
  readTime: { ar: string; en: string };
  date: { ar: string; en: string };
  author: {
    name: { ar: string; en: string };
    role: { ar: string; en: string };
  };
  summary: { ar: string; en: string };
  quote: { ar: string; en: string };
  sections: ArticleSection[];
  keyTakeaways: { ar: string; en: string }[];
  companionServiceId: string;
  companionServiceName: { ar: string; en: string };
}

export const WELLNESS_ARTICLES: WellnessArticle[] = [
  {
    id: 'art-1',
    slug: 'moroccan-hammam-secrets',
    title: {
      ar: 'أسرار الحمام المغربي التقليدي: فلسفة البخار والتنقية العميقة',
      en: 'The Sacred Architecture of the Moroccan Hammam: Steam, Stillness & Deep Purification'
    },
    subtitle: {
      ar: 'كيف يحول البخار والصابون الأسود البلدي العناية بالبشرة إلى طقس شفائي متوارث',
      en: 'How ancient steam chambers and black olive paste transform self-care into a restorative ancestral rite'
    },
    category: 'rituals',
    categoryLabel: { ar: 'طقوس وتراث', en: 'Rituals & Heritage' },
    readTime: { ar: '٥ دقائق قراءة', en: '5 min read' },
    date: { ar: '٢٤ أكتوبر ٢٠٢٦', en: 'Oct 24, 2026' },
    author: {
      name: { ar: 'ليلى بنونة', en: 'Laila Bennouna' },
      role: { ar: 'خبيرة الطقوس الأطلسية في فنة', en: 'Atlas Ritual Master at Finah' }
    },
    summary: {
      ar: 'في التراث المغربي، الحمام ليس مجرد استحمام، بل هو انتقال متدرج من صخب العالم الخارجي إلى سكون الجسد والروح عبر درجات حرارة محسوبة ومكونات عضوية حية.',
      en: 'In Moroccan heritage, the hammam is not merely bathing—it is a measured transition from outer noise to inner quietude through calibrated warmth and living botanical treasures.'
    },
    quote: {
      ar: 'الحمام المغربي ليس مجرد تقشير للخلايا الميتة، بل هو مساحة للتنفس والتخلص من كل ثقل نفسي حملته طوال الأسبوع.',
      en: 'The Moroccan hammam is never just cellular exfoliation; it is sacred space to exhale and dissolve the emotional weight accumulated over the week.'
    },
    sections: [
      {
        heading: {
          ar: '١. التدرج الحراري: تهيئة المسام دون إجهاد',
          en: '1. Thermal Gradation: Opening Pores with Serene Intent'
        },
        body: {
          ar: 'يبدأ الطقس في الغرفة الدافئة (البيت السخون) حيث ينساب بخار ماء الأوكالبتوس بلطف ليرخي أوتار العضلات المشدودة. يتيح هذا الدفء للمسام أن تتفتح طبيعياً دون حرارة مفرطة، مما يحفز الدورة الدموية اللمفاوية ويهيئ سطح الجلد للمرحلة التالية.',
          en: 'The ritual commences in the warm chamber where gentle eucalyptus vapors loosen rigid muscular tensions. This balanced warmth prompts pores to breathe open naturally, stimulating lymphatic flow and priming skin tissue for renewal.'
        }
      },
      {
        heading: {
          ar: '٢. الصابون الأسود البلدي: ذهب الزيتون المعجون',
          en: '2. Authentic Black Olive Paste: The Gentle Emollient'
        },
        body: {
          ar: 'يُصنع الصابون المغربي الأصيل من زيت الزيتون البكر ومسحوق حبات الزيتون الأسود المتبلور بغناه بفيتامين E. يُدهن على الجسم بالكامل ويُترك لبضع دقائق؛ وظيفته ليست التنظيف العادي بل تليين الطبقة الكيراتينية الخارجية لتصبح جاهزة للفرك الخفيف.',
          en: 'Pure Moroccan black soap is crafted from cold-pressed virgin olive oil and crushed black olive macerates rich in vitamin E. Applied gently across the skin and allowed to rest, its purpose is to soften hardened surface keratin.'
        }
      },
      {
        heading: {
          ar: '٣. مهارة الكيس المغربي والختام بالغاسول',
          en: '3. The Artisan Kessa Glove & Mineral Ghassoul Seal'
        },
        body: {
          ar: 'تأتي حركة الكيس المغربي الفردي المعقم بحركات طولية متأنية تتبع مسارات الدورة الدموية، مزيلة كافة الشوائب المتراكمة. يعقب ذلك تغطية الجسم بغاسول جبال الأطلس الممزوج بماء الورد المقطر لشد المسام وإعادة المعادن النادرة للبشرة.',
          en: 'The personalized, sterilized kessa glove is guided in deliberate, rhythmic strokes following venous circulation. Next, Atlas mineral clay infused with chilled rose hydrosol coats the body, re-mineralizing the lipid mantle and restoring suppleness.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'التدرج بين البخار الدافئ والماء الفاتر يحفظ مرونة الأوعية الدموية ويهدئ الأعصاب.',
        en: 'Gradual thermal shifts between steam and temperate water protect vascular elasticity.'
      },
      {
        ar: 'استخدام كيس مغربي فردي معقم ضروري لمنع تهيج البشرة والحفاظ على نقائها.',
        en: 'A sterilized, personal kessa glove prevents micro-tears and guarantees gentle exfoliation.'
      },
      {
        ar: 'قناع الغاسول في نهاية الجلسة يغلق المسام ويحبس المعادن الأساسية داخل الجلد.',
        en: 'The final mineral ghassoul wrap tightens pores and locks in essential oligoelements.'
      }
    ],
    companionServiceId: 'hammam-royal',
    companionServiceName: {
      ar: 'حمام فنة الملكي بالأعشاب والورد',
      en: 'Finah Royal Herbal & Rose Hammam'
    }
  },
  {
    id: 'art-2',
    slug: 'pure-virgin-argan-guide',
    title: {
      ar: 'ذهب سوس السائل: كيف تختارين زيت الأركان البكر النقي وتدمجينه في روتينكِ؟',
      en: 'Liquid Gold of the Souss: Selecting Pure Virgin Argan Oil & Daily Skincare Rituals'
    },
    subtitle: {
      ar: 'الدليل العملي لتمييز الزيت المعصور على البارد وحماية البشرة والشعر في مناخ الخليج',
      en: 'A practical guide to identifying cold-pressed virgin argan and shielding hair & skin in arid Gulf climates'
    },
    category: 'skincare',
    categoryLabel: { ar: 'عناية ومكونات', en: 'Skincare & Botanicals' },
    readTime: { ar: '٤ دقائق قراءة', en: '4 min read' },
    date: { ar: '٢٠ أكتوبر ٢٠٢٦', en: 'Oct 20, 2026' },
    author: {
      name: { ar: 'د. أمينة الفاسي', en: 'Dr. Amina El Fassi' },
      role: { ar: 'باحثة في التراث النباتي المغربي', en: 'Moroccan Botanical Heritage Researcher' }
    },
    summary: {
      ar: 'تنتج شجرة الأركان النادرة في سهول سوس المغربية زيتاً فريداً بخصائصه المضادة للأكسدة. نكشف لكِ أسرار تمييز الزيت الأصلي وكيفية استخدامه لحبس الرطوبة ومقاومة جفاف التكييف.',
      en: 'Endemic to Morocco\'s southwestern biosphere, the argan tree yields a lipid profile unmatched in botanical science. Learn how to verify authentic cold-pressed oils and seal cellular hydration against drying air conditioning.'
    },
    quote: {
      ar: 'زيت الأركان الحقيقي لا يترك أي طبقة دهنية لزجة، بل يتشربه الجلد في ثوانٍ ليمنحه ملمساً حريراً غير لامع.',
      en: 'Authentic cosmetic argan leaves no greasy residue; the skin absorbs it in seconds, revealing velvety matte radiance.'
    },
    sections: [
      {
        heading: {
          ar: 'التمييز بين زيت التجميل وزيت الطهي',
          en: 'Distinguishing Cosmetic Argan from Culinary Blends'
        },
        body: {
          ar: 'يُعصر زيت الأركان التجميلي من اللوز النيء غير المحمص عبر ضغط ميكانيكي بارد يحافظ على الفيتامينات والأحماض الدهنية. لونه ذهبي فاتح ورائحته خفيفة جداً، بينما زيت الطهي يعصر بعد التحميص وله رائحة بندق قوية ولون داكن.',
          en: 'Cosmetic argan is extracted from raw, unroasted kernels through mechanical cold-pressing, safeguarding bioactive tocopherols. Its hue is pale translucent amber with a subtle earthen note, unlike darker roasted culinary oils.'
        }
      },
      {
        heading: {
          ar: 'طريقة الطبقات المغربية لحبس الرطوبة',
          en: 'The Moroccan Hydration Sandwich Technique'
        },
        body: {
          ar: 'الخطأ الشائع هو وضع الزيت على بشرة جافة تماماً. الطريقة المغربية الصحيحة تعتمد على رش ماء الورد الدمشقي أولاً حتى تترطب البشرة مائياً، ثم تدليك قطرتين إلى ثلاث من زيت الأركان لحبس ذلك الماء داخل الطبقات السطحية.',
          en: 'A frequent misstep is applying oil onto bone-dry skin. The ancestral technique mists pure Damask rose hydrosol first, followed immediately by pressing two to three drops of virgin argan to lock in moisture.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'زيت الأركان النقي يُحفظ دائماً في زجاجات داكنة لحمايته من أكسدة الضوء.',
        en: 'Pure virgin argan must always be stored in tinted amber glass to prevent photo-oxidation.'
      },
      {
        ar: 'مثالي لتدليك أطراف الشعر وفروة الرأس قبل النوم لمنع التقصف والنفشة.',
        en: 'Ideal for bedtime scalp massage and sealing split ends to counteract Gulf humidity changes.'
      }
    ],
    companionServiceId: 'hair-argan-treatment',
    companionServiceName: {
      ar: 'علاج الأركان وإكليل الجبل المركز للشعر',
      en: 'Atlas Rosemary & Argan Scalp Therapy'
    }
  },
  {
    id: 'art-3',
    slug: 'aker-fassi-white-ghassoul-radiance',
    title: {
      ar: 'العكر الفاسي والغاسول الأبيض: أسرار التوريد الملكي وصفاء البشرة',
      en: 'Aker Fassi & White Ghassoul: The Ancestral Moroccan Secret to Natural Petal Radiance'
    },
    subtitle: {
      ar: 'شقائق النعمان المجففة وطمي جبال فاس: لمسة الجمال الفاسي الأصيل دون أي مواد صناعية',
      en: 'Sun-dried poppy blossoms and pure Fez white clay: the non-toxic Moroccan path to luminous flushed cheeks'
    },
    category: 'skincare',
    categoryLabel: { ar: 'عناية ومكونات', en: 'Skincare & Botanicals' },
    readTime: { ar: '٦ دقائق قراءة', en: '6 min read' },
    date: { ar: '١٥ أكتوبر ٢٠٢٦', en: 'Oct 15, 2026' },
    author: {
      name: { ar: 'شريفة التازي', en: 'Sharifa Tazi' },
      role: { ar: 'مستشارة العناية الطبيعية في فنة', en: 'Natural Skincare Consultant at Finah' }
    },
    summary: {
      ar: 'من أسواق فاس العتيقة إلى أجنحة فنة الفاخرة، يظل العكر الفاسي المستخلص من بتلات شقائق النعمان الطبيعية رمزاً للنضارة والتوريد الصحي الخالي من الملونات المصنعة.',
      en: 'From the ancient Medina apothecaries of Fez to the private suites of Finah, Aker Fassi remains the premier botanical secret for flushed, healthy cheek and lip luminance without synthetic pigments.'
    },
    quote: {
      ar: 'ذرة واحدة من العكر الفاسي الأصلي مع قطرات ماء الزهر كافية لتمنح وجهك إشراقة وردية تدوم طوال اليوم.',
      en: 'A microscopic pinch of genuine Aker Fassi with chilled orange blossom mist yields a natural rose blush that lasts the entire day.'
    },
    sections: [
      {
        heading: {
          ar: 'ما هو العكر الفاسي الحقيقي؟',
          en: 'What Truly Defines Authentic Aker Fassi?'
        },
        body: {
          ar: 'العكر الفاسي الأصيل هو مسحوق بتلات زهرة شقائق النعمان الممزوجة بقشور الرمان المجففة تحت شمس الأطلس. يتميز بلونه القرمزي المائل للبني في حالته الجافة، والذي يتحول إلى لون وردي ياقوتي ساحر بمجرد ملامسته للماء أو الزيت.',
          en: 'Genuine Aker Fassi is powdered wild poppy petals and dried pomegranate rinds baked under the Atlas sun. It presents a terracotta-bronze sheen when dry, instantly shifting into vivid ruby-rose upon contact with liquid.'
        }
      },
      {
        heading: {
          ar: 'الغاسول الأبيض للبشرة الحساسة والرقيقة',
          en: 'White Ghassoul: The Gentle Clarifier for Delicate Skin'
        },
        body: {
          ar: 'بينما يُستخدم الغاسول الرمادي الداكن للجسم، فإن الغاسول الأبيض المستخرج من رواسب نقية مخصص للوجه. ينقي المسام بلطف دون أن يسلب البشرة زيوتها الطبيعية، وعند مزجه مع العكر الفاسي يمنح الوجه نعومة وتوريداً فورياً.',
          en: 'While deeper mineral clay is utilized for the body, white ghassoul clay is harvested from rare strata specifically for the face. It lifts impurities without compromising the lipid barrier, leaving a matte porcelain finish.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'العكر الفاسي غني بمركبات الأنثوسيانين والفلافونويد التي تكافح الشوارد الحرة وعلامات الإجهاد.',
        en: 'Aker Fassi is naturally rich in anthocyanins that protect skin cells from environmental oxidants.'
      },
      {
        ar: 'يُفضل دائماً استخدامه مع ماء الورد الطبيعي المقطر لتعزيز تهدئة البشرة الحساسة.',
        en: 'Pairing it with artisan distilled rose water enhances skin calming and redness reduction.'
      }
    ],
    companionServiceId: 'facial-damask-rose',
    companionServiceName: {
      ar: 'نضارة الورد الدمشقي وتدليك الكوارتز',
      en: 'Damask Rose Quartz Facial Ritual'
    }
  },
  {
    id: 'art-4',
    slug: 'moroccan-tea-and-mindful-stillness',
    title: {
      ar: 'شاي النعناع والسكينة الذهنية: طقس العافية اليومي لاستعادة التوازن والهدوء',
      en: 'The Moroccan Tea Ceremony & Mindful Stillness: Daily Rituals for Inner Equilibrium'
    },
    subtitle: {
      ar: 'كيف يتحول تحضير الشاي الأخضر والنعناع الطازج إلى تمرين يومي لتنظيم التنفس والراحة العصبية',
      en: 'How the art of brewing green tea and fresh spearmint becomes a mindful grounding practice'
    },
    category: 'wellness',
    categoryLabel: { ar: 'عافية وسكينة', en: 'Holistic Wellness' },
    readTime: { ar: '٣ دقائق قراءة', en: '3 min read' },
    date: { ar: '١٠ أكتوبر ٢٠٢٦', en: 'Oct 10, 2026' },
    author: {
      name: { ar: 'فريق فنة للضيافة والسكينة', en: 'Finah Sanctuary Team' },
      role: { ar: 'إشراف التراث والضيافة المغربية', en: 'Heritage & Hospitality Curators' }
    },
    summary: {
      ar: 'في الثقافة المغربية، صب الشاي من علو (الرزة) ليس مجرد استعراض جمالي، بل وسيلة لتهوية الشاي وتكوين الرغوة المخملية، وإشارة للحواس لتبطيء الإيقاع واستحضار اللحظة.',
      en: 'In Moroccan hospitality, pouring tea from an elegant height is an intentional ritual: it aerates the infusion, forms the crowned foam (reza), and invites the mind to pause and ground itself.'
    },
    quote: {
      ar: 'الضيافة في فنة تبدأ بكوب شاي مغربي دافئ، لأن استرخاء الجسد يبدأ حين يهدأ الفكر أولاً.',
      en: 'Sanctuary care at Finah begins with freshly brewed mint tea because the body only truly unwinds once the mind slows down.'
    },
    sections: [
      {
        heading: {
          ar: 'علم النباتات المهدئة: النعناع والشاي البارود',
          en: 'Botanical Calm: Gunpowder Green Tea & Spearmint'
        },
        body: {
          ar: 'يجمع الشاي المغربي بين حبوب الشاي الأخضر المجفف (البارود) الغني بمضادات الأكسدة والنعناع الطازج الذي يحتوي على المنثول الطبيعي. يساعد هذا المزيج على تهدئة الجهاز الهضمي وتحفيز اليقظة الهادئة دون توتر الكافيين المعتاد.',
          en: 'Moroccan tea blends antioxidant-dense gunpowder green tea leaves with crisp spearmint rich in naturally calming menthol. This combination soothes digestive tension while instilling alert, centered calm.'
        }
      },
      {
        heading: {
          ar: 'طقس التقديم بعد جلسات الحمام والبخار',
          en: 'Post-Steam Hydration Harmony'
        },
        body: {
          ar: 'بعد الخروج من حرارة البخار، يحتاج الجسم إلى ترطيب دافئ يعيد التوازن الداخلي. تناول الشاي المغربي ببطء في ردهة الاسترخاء يساعد القلب على العودة لإيقاعه الهادئ ويطيل أثر الجلسة لساعات.',
          en: 'Emerging from the thermal warmth of the hammam, the body craves warm restorative hydration. Savoring tea slowly in the lounge allows cardiac cadence to ease gently, prolonging relaxation for hours.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'الترطيب الدافئ بعد الحمام أفضل بكثير للجهاز العصبي من المشروبات المثلجة.',
        en: 'Warm restorative hydration post-steam is far gentler on the nervous system than iced drinks.'
      },
      {
        ar: 'تخصيص 10 دقائق هادئة بعد أي موعد تجميلي يضاعف فوائد الاسترخاء الجسدي.',
        en: 'Allocating 10 mindful minutes post-ritual doubles the restorative benefits of any treatment.'
      }
    ],
    companionServiceId: 'hammam-traditional',
    companionServiceName: {
      ar: 'حمام فنة التطهيري بالصابون الأسود',
      en: 'Traditional Purifying Black Soap Hammam'
    }
  },
  {
    id: 'art-5',
    slug: 'bridal-wellness-countdown',
    title: {
      ar: 'جدول العناية المتكاملة للعروس: ٦ أسابيع من الطمأنينة والإشراق قبل الزفاف',
      en: 'The Radiant Bride Countdown: A 6-Week Holistic Preparation Guide'
    },
    subtitle: {
      ar: 'دليل زمني دقيق لجدولة جلسات الحمام، أقنعة التوريد، وعلاج الشعر لتفادي إجهاد البشرة',
      en: 'A step-by-step sanctuary itinerary for booking hammams, glow masks, and hair rituals stress-free'
    },
    category: 'bridal',
    categoryLabel: { ar: 'دليل العروس', en: 'Bridal Guides' },
    readTime: { ar: '٧ دقائق قراءة', en: '7 min read' },
    date: { ar: '٥ أكتوبر ٢٠٢٦', en: 'Oct 5, 2026' },
    author: {
      name: { ar: 'فريق طقوس العروس في فنة', en: 'Finah Bridal Concierge' },
      role: { ar: 'استشارات الأعراس والطقوس الحصرية', en: 'Bespoke Ceremonies & Bridal Care' }
    },
    summary: {
      ar: 'تحضيرات العروس لا يجب أن تكون مصدراً للقلق والتوتر. نضع بين يديكِ الخطة الزمنية الاحترافية التي نتبعها في فنة لضمان بشرة متألقة وروح هادئة في يومك الكبير.',
      en: 'Bridal preparations should never become a source of overwhelm. We share the measured calendar we use at Finah to guarantee calm radiance on your momentous wedding day.'
    },
    quote: {
      ar: 'العروس الأكثر جمالاً هي العروس الأكثر هدوءاً وراحة. الجمال الحقيقي يبدأ بالسكينة الداخلية.',
      en: 'The most radiant bride is the calmest bride. Authentic luminance flows from peace within.'
    },
    sections: [
      {
        heading: {
          ar: 'الأسابيع ٦ و ٥: التهيئة وإصلاح الشعر',
          en: 'Weeks 6 & 5: Deep Conditioning & Scalp Repair'
        },
        body: {
          ar: 'البدء مبكراً بعلاجات الزيوت الأطلسية المركزة للشعر يمنح بصيلات الشعر وقتاً كافياً لامتصاص المغذيات واكتساب اللمعان الطبيعي قبل تسريحات الزفاف وتثبيتها.',
          en: 'Commencing botanical hair therapy 6 weeks out provides follicles the time needed to absorb vital fatty acids and display deep natural sheen before wedding styling.'
        }
      },
      {
        heading: {
          ar: 'الأسابيع ٤ و ٣: تجديد البشرة والتقشير العميق',
          en: 'Weeks 4 & 3: Deep Skin Renewal & Purification'
        },
        body: {
          ar: 'هذا هو التوقيت المثالي لجلسة حمام مغربي شاملة مع تقشير الكيس العميق لإزالة الشوائب، يليه ترطيب مكثف بزبدة الشيا وزيت الأركان النقي لتوحيد لون البشرة.',
          en: 'This window is ideal for an extensive purifying hammam session with deep kessa exfoliation, followed by restorative shea and argan wraps to balance skin tone.'
        }
      },
      {
        heading: {
          ar: 'الأسبوع الأخير (قبل ٧٢ إلى ٤٨ ساعة): حمام العروس الملكي الهادئ',
          en: 'Final 72 Hours: Gentle Rose Hammam & Silk Radiance'
        },
        body: {
          ar: 'قبل يومين من الزفاف، يُحظر التقشير الخشن أو القوي لتجنب أي احمرار. تقتصر الجلسة على بخار خفيف، صابون ملكي معطر بالورد، قناع العكر الفاسي للتوريد، وتدليك لطيف بالزيوت.',
          en: 'Within 72 hours of the ceremony, intense exfoliation is avoided. Care focuses on velvet steam, rose-infused white clay, subtle Aker Fassi petal glow, and lymphatic relaxation.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'لا تجري أي تقشير عميق قبل أقل من 4 أيام من موعد زفافك منعاً لأي تحسس.',
        en: 'Never perform abrasive body exfoliation less than 4 days before the wedding ceremony.'
      },
      {
        ar: 'احرصي على شرب ماء الورد المخفف بالماء البارد يومياً لتعزيز النضارة من الداخل.',
        en: 'Sip cold water scented with rose water daily to promote deep cellular hydration from within.'
      }
    ],
    companionServiceId: 'bridal-royal-package',
    companionServiceName: {
      ar: 'طقوس العروس المغربية الملكية',
      en: 'Imperial Moroccan Bridal Sanctuary'
    }
  },
  {
    id: 'art-6',
    slug: 'gulf-climate-skin-barrier',
    title: {
      ar: 'حماية حاجز البشرة في مناخ الخليج: نصائح مستلهمة من نساء جبال الأطلس',
      en: 'Shielding the Skin Barrier in Arid Climates: Ancestral Wisdom from the High Atlas'
    },
    subtitle: {
      ar: 'كيفية مواجهة جفاف التكييف والحرارة الخارجية باستخدام المكونات النباتية الطبيعية النقية',
      en: 'How to counteract relentless air conditioning and dry heat using pure cold-pressed lipids'
    },
    category: 'wellness',
    categoryLabel: { ar: 'عافية وسكينة', en: 'Holistic Wellness' },
    readTime: { ar: '٤ دقائق قراءة', en: '4 min read' },
    date: { ar: '٢٨ سبتمبر ٢٠٢٦', en: 'Sep 28, 2026' },
    author: {
      name: { ar: 'د. أمينة الفاسي', en: 'Dr. Amina El Fassi' },
      role: { ar: 'باحثة في التراث النباتي المغربي', en: 'Moroccan Botanical Heritage Researcher' }
    },
    summary: {
      ar: 'تعيش نساء الأطلس في بيئات جافة تتباين بين حرارة النهار وبرودة الليل القارسة، وقد طورن وسائل فطرية للحفاظ على بشرة مرنة ومشرقة عبر الدهون النباتية الذكية.',
      en: 'Atlas women have thrived in high-altitude dry climates with severe temperature shifts, developing natural barrier preservation methods based on intelligent botanical lipids.'
    },
    quote: {
      ar: 'حاجز البشرة هو خط دفاعك الأول؛ لا تهاجميه بالمنظفات القاسية، بل غذّيه بالزيوت النقية.',
      en: 'Your lipid barrier is your first sanctuary of defense; never strip it with harsh cleansers, nourish it with living botanicals.'
    },
    sections: [
      {
        heading: {
          ar: 'تأثير التكييف المستمر على فقدان الماء عبر البشرة',
          en: 'The Impact of Continuous Air Conditioning on TEWL'
        },
        body: {
          ar: 'يتسبب التواجد الطويل في الأماكن المكيفة في تسريع فقدان الماء عبر البشرة (TEWL)، مما يجعل الجلد يبدو باهتاً وتظهر عليه خطوط الجفاف الدقيقة حتى عند شرب كميات كافية من الماء.',
          en: 'Hours spent in modern air-conditioned interiors accelerate trans-epidermal water loss (TEWL), leaving skin dull with dehydration lines regardless of oral water intake.'
        }
      },
      {
        heading: {
          ar: 'حلول الأطلس: دهون نباتية حاجبة وغير مسدودة للمسام',
          en: 'The Atlas Remedy: Breathable Occlusive Lipids'
        },
        body: {
          ar: 'بدلاً من المستحضرات البترولية الثقيلة، استخدمت المغربيات زيت الأركان وزبدة الشيا النقية وزيت التين الشوكي (الصبار). هذه الزيوت تحتوي على دهون ثلاثية مماثلة لإفرازات الجلد الطبيعية، فتحبس الرطوبة وتسمح للمسام بالتنفس.',
          en: 'Rather than petroleum derivatives, Moroccan tradition utilizes pure argan, raw shea, and prickly pear seed oil. These mimic natural skin lipids, creating a breathable protective veil that locks in hydration.'
        }
      }
    ],
    keyTakeaways: [
      {
        ar: 'تجنبي استخدام المنظفات الرغوية القاسية التي تجرد البشرة من حاجزها الوقائي.',
        en: 'Avoid stripping sulfates and foaming cleansers that dissolve the vital lipid shield.'
      },
      {
        ar: 'ضعي رذاذ ماء الورد متبوعاً بزيت الأركان كل مساء قبل النوم في غرفة مكيفة.',
        en: 'Mist pure rose hydrosol followed by argan oil each evening before sleeping in conditioned air.'
      }
    ],
    companionServiceId: 'facial-damask-rose',
    companionServiceName: {
      ar: 'نضارة الورد الدمشقي وتدليك الكوارتز',
      en: 'Damask Rose Quartz Facial Ritual'
    }
  }
];
