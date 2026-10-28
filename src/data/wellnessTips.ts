export interface WellnessTip {
  id: string;
  category: 'hammam' | 'skincare' | 'haircare' | 'mind_body' | 'botanicals';
  categoryLabel: { ar: string; en: string };
  title: { ar: string; en: string };
  advice: { ar: string; en: string };
  sanctuarySecret: { ar: string; en: string };
  recommendedServiceId?: string;
  recommendedServiceName?: { ar: string; en: string };
  iconName: 'Droplets' | 'Sparkles' | 'Heart' | 'Flame' | 'Moon' | 'Sun' | 'Leaf' | 'Feather';
  ritualTag: string;
}

export const CURATED_WELLNESS_TIPS: WellnessTip[] = [
  {
    id: 'tip-hammam-prep',
    category: 'hammam',
    categoryLabel: { ar: 'طقوس الحمام المغربي', en: 'Hammam Ritual' },
    title: {
      ar: 'قاعدة البخار الذهبية قبل الصابون البلدي',
      en: 'The Golden Steam Rule Before Beldi Soap'
    },
    advice: {
      ar: 'لا تضعي الصابون الأسود على بشرة باردة أو جافة مباشرة. اجلسي في البخار الدافئ لمدة ٨ إلى ١٠ دقائق أولاً حتى تتفتح المسام وتلين طبقات الجلد الميت، ثم وزعي الصابون الأسود ودعيه يتشرب لدقائق معدودة قبل فرك الكيس المغربي.',
      en: 'Never apply Moroccan black soap directly to cool or dry skin. Rest in warm steam for 8 to 10 minutes first so pores relax and dead cells soften. Then apply black soap and allow it to penetrate for 5 minutes before kessa exfoliation.'
    },
    sanctuarySecret: {
      ar: 'فرك الكيس بحركات دائرية هادئة من الأطراف باتجاه القلب يحفز الجهاز اللمفاوي ويمنع تهيج البشرة.',
      en: 'Rhythmic circular kessa strokes moving upward toward the heart stimulate lymphatic drainage.'
    },
    recommendedServiceId: 'hammam-royal-finah',
    recommendedServiceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    iconName: 'Flame',
    ritualTag: 'Hammam'
  },
  {
    id: 'tip-rosewater-hydration',
    category: 'skincare',
    categoryLabel: { ar: 'نضارة البشرة والورد', en: 'Floral Hydration' },
    title: {
      ar: 'رذاذ الورد الدمشقي المبرد لمقاومة جفاف المكيفات',
      en: 'Chilled Damask Rose Mist for Desert Climate'
    },
    advice: {
      ar: 'احتفظي بقارورة ماء الورد الدمشقي المقطر يدوياً في الثلاجة. رشي وجهكِ وعنقكِ برذاذ بارد في منتصف النهار لشد المسام فورياً واستعادة توازن حموضة البشرة المنهكة من المكيفات وأشعة الشمس.',
      en: 'Keep your bottle of artisan distilled Damask rosewater chilled in the refrigerator. A gentle mid-day facial mist tightens pores instantly and neutralizes pH stress caused by continuous indoor AC.'
    },
    sanctuarySecret: {
      ar: 'ربتي بلطف بأطراف أصابعكِ بعد الرش ولا تمسحيه، حتى تتشرب خلاصة البتلات بالكامل.',
      en: 'Press the floral mist into your skin with fingertips rather than wiping, allowing petal essence to absorb.'
    },
    recommendedServiceId: 'facial-rose-radiance',
    recommendedServiceName: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
    iconName: 'Droplets',
    ritualTag: 'Skincare'
  },
  {
    id: 'tip-argan-overnight',
    category: 'haircare',
    categoryLabel: { ar: 'عناية الأركان والشعر', en: 'Argan Hair Care' },
    title: {
      ar: 'مساج فروة الرأس بقطرات الأركان الدافئة قبل النوم',
      en: 'Warm Argan Scalp Massage Before Sleep'
    },
    advice: {
      ar: 'دفئي ملعقة صغيرة من زيت الأركان البكر المعصور على البارد بين راحتي يديكِ، ودلكي بها فروة رأسكِ بحركات دائرية لمدة ٥ دقائق قبل النوم. غطي شعركِ بغطاء حريري لتغذية البصيلات بعمق ومنع تقصف الأطراف.',
      en: 'Warm a teaspoon of cold-pressed virgin argan oil between your palms and massage into the scalp for 5 minutes before bed. Sleep on silk to deeply nourish follicles and shield fragile ends from split-friction.'
    },
    sanctuarySecret: {
      ar: 'زيت الأركان البكر النقي يتميز برائحة جوزية خفيفة ويمتصه الشعر بسرعة بدون ترك أي أثر دهني لزج.',
      en: 'Authentic virgin argan absorbs rapidly without greasy weight, leaving pure botanical elasticity.'
    },
    recommendedServiceId: 'hair-argan-elixir',
    recommendedServiceName: { ar: 'علاج الأركان المغربي لترميم وتغذية الشعر', en: 'Moroccan Organic Argan Restorative Hair Therapy' },
    iconName: 'Sparkles',
    ritualTag: 'Haircare'
  },
  {
    id: 'tip-ghassoul-blending',
    category: 'botanicals',
    categoryLabel: { ar: 'أعشاب الأطلس الطبيعية', en: 'Atlas Botanicals' },
    title: {
      ar: 'سر خلط غاسول الأطلس بماء زهر البرتقال',
      en: 'Blending Atlas Ghassoul with Orange Blossom'
    },
    advice: {
      ar: 'عند تحضير قناع طمي الغاسول المغربي، تجنبي استخدام ماء الصنبور العادي. اخلطيه بماء زهر البرتقال المقطر وبضع قطرات من زيت اللوز الحلو؛ هذا يحافظ على ليونة القناع ويمنعه من جفاف أو شد البشرة بشكل مؤذٍ.',
      en: 'When activating natural Atlas ghassoul clay, avoid ordinary tap water. Blend with pure orange blossom water and a few drops of sweet almond oil to keep the mask supple without over-stripping skin.'
    },
    sanctuarySecret: {
      ar: 'اغسلي الغاسول دائماً وهو شبه رطب، ولا تدعيه يجف تماماً حتى يتشقق على وجهكِ.',
      en: 'Always rinse ghassoul while it remains slightly damp; never allow natural clay to crack dry on the face.'
    },
    recommendedServiceId: 'hammam-royal-finah',
    recommendedServiceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    iconName: 'Leaf',
    ritualTag: 'Botanicals'
  },
  {
    id: 'tip-prickly-pear-eyes',
    category: 'skincare',
    categoryLabel: { ar: 'نضارة البشرة والورد', en: 'Precious Elixirs' },
    title: {
      ar: 'إكسير التين الشوكي لمحيط العينين والهالات',
      en: 'Prickly Pear Nectar for Orbital Recovery'
    },
    advice: {
      ar: 'يحتوي زيت بذور التين الشوكي المغربي على أعلى تركيز طبيعي من فيتامين E في العالم النباتي. قطرة واحدة تكفي لكلا العينين بالتربيت اللطيف بإصبع الخاتم قبل النوم لتقوية الشعيرات الدموية وتفتيح الهالات الداكنة.',
      en: 'Moroccan prickly pear seed oil boasts the highest natural concentration of Vitamin E in the botanical world. One drop tapped gently around the orbital bone before sleep firms tissue and brightens dark circles.'
    },
    sanctuarySecret: {
      ar: 'اضغطي برفق على نقاط الضغط أسفل الحاجبين لتحفيز تصريف السوائل المحتبسة وتقليل انتفاخ الصباح.',
      en: 'Gently press brow-bone acupoints to drain fluid retention and ease morning puffiness.'
    },
    recommendedServiceId: 'facial-rose-radiance',
    recommendedServiceName: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
    iconName: 'Sparkles',
    ritualTag: 'Skincare'
  },
  {
    id: 'tip-orange-blossom-sleep',
    category: 'mind_body',
    categoryLabel: { ar: 'سكينة النفس والنوم', en: 'Sanctuary Stillness' },
    title: {
      ar: 'طقس ماء الزهر المسائي لتهدئة الجهاز العصبي',
      en: 'Evening Neroli Infusion for Deep Sleep'
    },
    advice: {
      ar: 'أضيفي قطرتين إلى ثلاث قطرات من ماء زهر البرتقال العضوي إلى كوب ماء فاتر أو شاي بابونج قبل النوم بساعة. عطر الزهر يرسل إشارات فورية للدماغ لخفض مستويات هرمون الكورتيزول والتمهيد لنوم عميق متصل.',
      en: 'Add two drops of pure organic orange blossom water to a cup of warm chamomile tea one hour before bed. Neroli terpenes calm autonomic stress and foster uninterrupted restorative sleep.'
    },
    sanctuarySecret: {
      ar: 'امسحي صدغيكِ ورسغيكِ ببقايا قطرات الزهر؛ فاستنشاق العطر طوال الليل يقلل من شد الفكين أثناء النوم.',
      en: 'Dab leftover floral drops onto temples and wrists; gentle scent diffusion prevents sleep jaw-clenching.'
    },
    iconName: 'Moon',
    ritualTag: 'Stillness'
  },
  {
    id: 'tip-mint-tea-digestion',
    category: 'mind_body',
    categoryLabel: { ar: 'الضيافة المغربية', en: 'Sanctuary Majlis' },
    title: {
      ar: 'فلسفة صب الشاي المغربي برغوة وفيرة',
      en: 'The Art of Aerated Moroccan Mint Tea'
    },
    advice: {
      ar: 'رفع إبريق الشاي عالياً عند الصب في كؤوس الزجاج ليس مجرد استعراض جمالي، بل هو طريقة هندسية لتهوية الشاي وأكسدته وتكوين "الرزة" أو الرغوة الغنية، مما يجعل المشروب ألطف على المعدة وأسرع امتصاصاً.',
      en: 'Lifting the artisan tea decanter high to create frothy crown bubbles is not purely ornamental. Aerating the green tea oxidizes tannins, making the infusion soothing to digestion and immediately hydrating.'
    },
    sanctuarySecret: {
      ar: 'اشربي كأساً صغيراً من الشاي بعد انتهاء الحمام لموازنة حرارة الجسم تدريجياً قبل الخروج إلى الهواء الخارجي.',
      en: 'Sip a warm glass of aerated mint tea after hammam to stabilize internal core temperature before leaving.'
    },
    iconName: 'Heart',
    ritualTag: 'Hospitality'
  },
  {
    id: 'tip-aker-fassi-blush',
    category: 'botanicals',
    categoryLabel: { ar: 'أعشاب الأطلس الطبيعية', en: 'Aker Fassi Radiance' },
    title: {
      ar: 'تفتيح وتوريد البشرة بمسحوق بتلات شقائق النعمان',
      en: 'Natural Aker Fassi Petal Glow'
    },
    advice: {
      ar: 'العكر الفاسي الأصيل مصنوع من بتلات شقائق النعمان المجففة وقشور الرمان الجبلية. امزجي لمسة خفيفة بطرف عود خشبي مع ملعقة زبادي طازج، ودعيها على وجنتيكِ لمدة ١٠ دقائق لتوريد طبيعي ونضارة مخملية تدوم يومين.',
      en: 'Authentic Moroccan Aker Fassi is made from sun-dried poppy petals and pomegranate bark. Blend a tiny pinch with fresh plain yogurt and apply for 10 minutes for an effortless, petal-soft cheek flush.'
    },
    sanctuarySecret: {
      ar: 'العكر الفاسي الطبيعي لا يترك بقعاً صلبة أو تهيجاً؛ فهو مرطب غني بمضادات الأكسدة الفلافونويدية.',
      en: 'Real botanical poppy extract leaves no harsh stains; it provides bioflavonoid antioxidant protection.'
    },
    recommendedServiceId: 'bridal-imperial-finah',
    recommendedServiceName: { ar: 'طقوس العروس الملكية المتكاملة', en: 'Imperial Moroccan Bridal Sanctuary' },
    iconName: 'Feather',
    ritualTag: 'Botanicals'
  }
];
