import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquareQuote,
  Sparkles,
  Heart,
  Plus,
  X,
  ShieldCheck,
  Calendar,
  Sparkle
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: { ar: string; en: string };
  city: { ar: string; en: string };
  ritualId: 'hammam' | 'bridal' | 'facial' | 'hair' | 'custom';
  ritualName: { ar: string; en: string };
  rating: number;
  date: { ar: string; en: string };
  quote: { ar: string; en: string };
  highlight: { ar: string; en: string };
  helpfulCount: number;
  isVerified: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: { ar: 'مريم النعيمي', en: 'Mariam Al-Nuaimi' },
    city: { ar: 'دبي', en: 'Dubai' },
    ritualId: 'hammam',
    ritualName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    rating: 5,
    date: { ar: 'قبل أسبوعين', en: '2 weeks ago' },
    quote: {
      ar: 'من أجمل وأصدق تجارب الحمام المغربي في دبي. الجناح دافئ وخاص جداً، والخبيـرة لطيفة ومتمكنة إلى أبعد حد. خرجت بشرتي ناعمة كالحرير ورائحة زهر البرتقال بقيت معي لأيام.',
      en: 'One of the most authentic and serene Moroccan hammam experiences in Dubai. The private suite is warm, spotless, and tranquil. My skin felt renewed like silk, and the delicate orange blossom fragrance stayed for days.'
    },
    highlight: {
      ar: 'خصوصية الجناح المنفصل ونقاء الصابون الأسود البلدي',
      en: 'Private secluded suite & pure artisan black olive soap'
    },
    helpfulCount: 34,
    isVerified: true
  },
  {
    id: 'rev-2',
    name: { ar: 'فاطمة الكعبي', en: 'Fatima Al-Kaabi' },
    city: { ar: 'أبوظبي', en: 'Abu Dhabi' },
    ritualId: 'bridal',
    ritualName: { ar: 'طقوس العروس الملكية المتكاملة', en: 'Imperial Moroccan Bridal Sanctuary' },
    rating: 5,
    date: { ar: 'قبل شهر', en: '1 month ago' },
    quote: {
      ar: 'اخترت فنة قبل زفافي بأسبوع، وكان أفضل قرار اتخذته. الاهتمام بكل تفصيلة، قناع الغاسول الأبيض والعكر الفاسي، والهدوء التام أعطاني راحة نفسية ونضارة ملحوظة يوم العرس.',
      en: 'I chose Finah a week prior to my wedding, and it was the finest decision. Meticulous attention to detail, the white Atlas ghassoul and Aker Fassi masks, and deep calm gave me unmistakable bridal glow.'
    },
    highlight: {
      ar: 'توريد العكر الفاسي المغربي والسكينة التامة قبل الزفاف',
      en: 'Aker Fassi petal radiance and serene pre-wedding tranquility'
    },
    helpfulCount: 42,
    isVerified: true
  },
  {
    id: 'rev-3',
    name: { ar: 'سارة جينكينز', en: 'Sarah Jenkins' },
    city: { ar: 'وسط مدينة دبي', en: 'Downtown Dubai' },
    ritualId: 'facial',
    ritualName: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
    rating: 5,
    date: { ar: 'قبل ٣ أسابيع', en: '3 weeks ago' },
    quote: {
      ar: 'الاهتمام بالمكونات الطبيعية النقية استثنائي حقاً. زيت أركان معصور على البارد وماء ورد مقطر برائحة مريحة جداً. ليس مكاناً تجارياً على عجل، بل ملاذ حقيقي للسكينة واستعادة التوازن.',
      en: 'The reverence for authentic botanical ingredients is extraordinary. Pure cold-pressed argan and fresh rose mist with gentle quartz stones. Not a rushed commercial salon, but a genuine sanctuary of stillness.'
    },
    highlight: {
      ar: 'أصالة الزيوت العضوية وتدليك الكوارتز الوردي المهدئ',
      en: 'Pure organic Atlas botanicals and soothing rose quartz strokes'
    },
    helpfulCount: 19,
    isVerified: true
  },
  {
    id: 'rev-4',
    name: { ar: 'نورة الذهبي', en: 'Noura Al-Zahabi' },
    city: { ar: 'الشارقة', en: 'Sharjah' },
    ritualId: 'custom',
    ritualName: { ar: 'جلسة صممي زيارتك (حمام ملكي + عناية الأركان + أظافر)', en: 'Custom Visit (Hammam + Hair Spa + Nails)' },
    rating: 5,
    date: { ar: 'قبل ٥ أيام', en: '5 days ago' },
    quote: {
      ar: 'ميزة "صممي زيارتك" سهّلت علي تنسيق باقة خاصة بي. الحمام تلاه علاج عميق للشعر بالأركان ثم العناية بالأظافر في تسلسل انسيابي مريح جداً بدون أي وقت انتظار بين الغرف.',
      en: 'The "Design My Visit" tool allowed me to craft my own tailored sequence. The hammam was followed seamlessly by deep argan hair nourishment and nail grooming with zero awkward idle time.'
    },
    highlight: {
      ar: 'التسلسل الانسيابي التلقائي دون أي انتظار بين الجلسات',
      en: 'Harmonious sequential timing with automatic buffers'
    },
    helpfulCount: 27,
    isVerified: true
  },
  {
    id: 'rev-5',
    name: { ar: 'هند السويدي', en: 'Hind Al-Suwaidi' },
    city: { ar: 'جميرا، دبي', en: 'Jumeirah, Dubai' },
    ritualId: 'hair',
    ritualName: { ar: 'علاج الأركان وإكليل الجبل المركز للشعر', en: 'Atlas Rosemary & Argan Scalp Therapy' },
    rating: 5,
    date: { ar: 'الشهر الماضي', en: 'Last month' },
    quote: {
      ar: 'تدليك فروة الرأس بخلطة الأعشاب الأطلسية وزيت الأركان النقي مع بخار دافئ أعاد لشعري لمعانه وحيويته بعد جفاف طويل. الأخصائية شرحت كل خطوة بهدوء وبراعة مغربية مشهودة.',
      en: 'The scalp massage with Atlas mountain herbs, warm pure argan, and gentle steaming revived my hair after months of dryness. The specialist explained each step with gentle, practiced artisanship.'
    },
    highlight: {
      ar: 'كثافة ولمعان ملحوظ للشعر مع استرخاء عميق للرأس',
      en: 'Noticeable hair vitality and profound scalp relaxation'
    },
    helpfulCount: 16,
    isVerified: true
  },
  {
    id: 'rev-6',
    name: { ar: 'لينا منصور', en: 'Lina Mansoor' },
    city: { ar: 'دبي', en: 'Dubai' },
    ritualId: 'hammam',
    ritualName: { ar: 'حمام فنة التطهيري بالصابون الأسود والكيس', en: 'Purifying Black Soap & Kessa Hammam' },
    rating: 5,
    date: { ar: 'قبل ٦ أيام', en: '6 days ago' },
    quote: {
      ar: 'النظافة والتعقيم في جناح الحمام يبعثان على راحة البال التامة. كل شيء مجهز خصيصاً لي، والكيس الفردي معقم. الشاي المغربي بالنعناع في النهاية كان ختاماً ساحراً.',
      en: 'The hygiene and sterilization in the hammam suite inspire absolute peace of mind. Single-use sterilized kessa, bespoke robes, and aromatic fresh mint tea at the close made it a magical retreat.'
    },
    highlight: {
      ar: 'التعقيم الفائق وكرم الضيافة بالشاي المغربي الأصيل',
      en: 'Impeccable hygiene standards & gracious Moroccan hospitality'
    },
    helpfulCount: 23,
    isVerified: true
  }
];

interface TestimonialSectionProps {
  onOpenBooking?: () => void;
  onDesignVisit?: () => void;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  onOpenBooking,
  onDesignVisit
}) => {
  const { t, isArabic } = useLanguage();

  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [selectedRitual, setSelectedRitual] = useState<string>('all');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    name: '',
    city: '',
    ritualId: 'hammam' as 'hammam' | 'bridal' | 'facial' | 'hair' | 'custom',
    rating: 5,
    quote: '',
    highlight: ''
  });

  const categories = [
    { id: 'all', label: isArabic ? 'جميع الطقوس' : 'All Rituals' },
    { id: 'hammam', label: isArabic ? 'الحمام المغربي' : 'Hammam' },
    { id: 'bridal', label: isArabic ? 'طقوس العروس' : 'Bridal Journey' },
    { id: 'facial', label: isArabic ? 'نضارة الوجه والورد' : 'Facial & Rose' },
    { id: 'hair', label: isArabic ? 'علاج الأركان للشعر' : 'Hair Therapy' },
    { id: 'custom', label: isArabic ? 'صممي زيارتك' : 'Custom Visit' }
  ];

  const handleLike = (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews(prev => ({ ...prev, [id]: true }));
    setTestimonials(prev =>
      prev.map(item => (item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item))
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;

    const ritualNameMap: Record<string, { ar: string; en: string }> = {
      hammam: { ar: 'حمام فنة الملكي الأصيل', en: 'Finah Royal Hammam' },
      bridal: { ar: 'طقوس العروس المغربية', en: 'Moroccan Bridal Journey' },
      facial: { ar: 'جلسة نضارة الورد الدمشقي', en: 'Damask Rose Facial' },
      hair: { ar: 'علاج الأركان للشعر وفروة الرأس', en: 'Atlas Argan Hair Therapy' },
      custom: { ar: 'باقة صممي زيارتك المخصصة', en: 'Custom Visit Package' }
    };

    const createdReview: Testimonial = {
      id: `rev-${Date.now()}`,
      name: { ar: newReview.name, en: newReview.name },
      city: {
        ar: newReview.city || (isArabic ? 'دبي' : 'Dubai'),
        en: newReview.city || 'Dubai'
      },
      ritualId: newReview.ritualId,
      ritualName: ritualNameMap[newReview.ritualId],
      rating: newReview.rating,
      date: { ar: 'اليوم', en: 'Today' },
      quote: { ar: newReview.quote, en: newReview.quote },
      highlight: {
        ar: newReview.highlight || (isArabic ? 'تجربة مميزة متقنة' : 'Exceptional crafted experience'),
        en: newReview.highlight || 'Exceptional crafted experience'
      },
      helpfulCount: 1,
      isVerified: true
    };

    setTestimonials([createdReview, ...testimonials]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewReview({
        name: '',
        city: '',
        ritualId: 'hammam',
        rating: 5,
        quote: '',
        highlight: ''
      });
    }, 2000);
  };

  const filteredTestimonials =
    selectedRitual === 'all'
      ? testimonials
      : testimonials.filter(item => item.ritualId === selectedRitual);

  return (
    <section
      id="sanctuary-testimonials"
      className="py-20 sm:py-24 bg-[#FFF7EA] border-b border-[#DBC7A6]/60 relative overflow-hidden"
    >
      {/* Delicate Rosette Architectural Background Watermark */}
      <div className="absolute top-12 left-0 w-96 h-96 opacity-10 pointer-events-none -translate-x-24">
        <RosetteEmblem size={384} color="#075B60" />
      </div>
      <div className="absolute bottom-12 right-0 w-96 h-96 opacity-10 pointer-events-none translate-x-24">
        <RosetteEmblem size={384} color="#F1C17F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <MessageSquareQuote className="w-5 h-5 text-[#075B60]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {t('testimonials.kicker')}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#173D3E] font-normal tracking-tight mb-4 leading-tight">
              {t('testimonials.title')}
            </h2>
            <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed">
              {t('testimonials.subtitle')}
            </p>
          </div>

          {/* Right Action: Share Experience Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#075B60] bg-[#FFF7EA] hover:bg-[#F7E5C8]/50 border border-[#075B60]/40 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#075B60]" />
              <span>{t('testimonials.share_review')}</span>
            </button>
          </div>
        </div>

        {/* Aggregate Trust Bar: Zero pills, typographic hierarchy and quiet elegance */}
        <div className="bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Big Aggregate Rating Score */}
            <div className="md:col-span-4 flex flex-col items-start rtl:items-start ltr:items-start pb-6 md:pb-0 border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-[#DBC7A6]/60 pr-0 md:pr-8 rtl:md:pr-0 rtl:md:pl-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-5xl sm:text-6xl text-[#173D3E] font-medium tracking-tight">
                  4.96
                </span>
                <span className="text-sm font-medium text-[#173D3E]/60">
                  / 5.0
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#F1C17F] text-[#F1C17F]"
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#075B60]">
                {isArabic
                  ? '٤٢٠+ تقييم موثق من ضيفات الملاذ'
                  : '420+ Verified Sanctuary Guest Reviews'}
              </p>
              <p className="text-xs text-[#173D3E]/70 mt-1">
                {isArabic
                  ? 'مبني على تجارب ضيفات فعليات خضن طقوسنا في دبي'
                  : 'Based on genuine guest bookings at our Dubai sanctuary'}
              </p>
            </div>

            {/* Trust Pillars Grid */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#173D3E] font-medium">100%</span>
                <span className="text-xs font-semibold text-[#075B60] mt-0.5">
                  {isArabic ? 'أجنحة خاصة مغلقة' : 'Private Suites'}
                </span>
                <span className="text-[11px] text-[#173D3E]/70 mt-0.5 leading-snug">
                  {isArabic ? 'خصوصية وسكينة تامة' : 'Absolute seclusion & calm'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#173D3E] font-medium">4.99</span>
                <span className="text-xs font-semibold text-[#075B60] mt-0.5">
                  {isArabic ? 'طهارة وتعقيم فائق' : 'Suite Hygiene'}
                </span>
                <span className="text-[11px] text-[#173D3E]/70 mt-0.5 leading-snug">
                  {isArabic ? 'أكياس ومستلزمات معقمة' : 'Sterilized single-use kessa'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#173D3E] font-medium">4.98</span>
                <span className="text-xs font-semibold text-[#075B60] mt-0.5">
                  {isArabic ? 'حرفية الخبيرات' : 'Artisan Mastery'}
                </span>
                <span className="text-[11px] text-[#173D3E]/70 mt-0.5 leading-snug">
                  {isArabic ? 'خبرة مغربية متوارثة' : 'Ancestral Moroccan care'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#173D3E] font-medium">100%</span>
                <span className="text-xs font-semibold text-[#075B60] mt-0.5">
                  {isArabic ? 'أصالة المكونات' : 'Atlas Origin'}
                </span>
                <span className="text-[11px] text-[#173D3E]/70 mt-0.5 leading-snug">
                  {isArabic ? 'تعاونيات نسائية معتمدة' : 'Cold-pressed cooperatives'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs: Clean segmented buttons (No pill blobs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-[#DBC7A6]/50">
          {categories.map(cat => {
            const isActive = selectedRitual === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedRitual(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all rounded-lg cursor-pointer ${
                  isActive
                    ? 'bg-[#075B60] text-[#FFF7EA] shadow-xs'
                    : 'text-[#173D3E]/80 hover:text-[#075B60] hover:bg-[#F7E5C8]/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredTestimonials.map(item => (
            <article
              key={item.id}
              className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#075B60]/40 hover:shadow-sm transition-all relative group"
            >
              {/* Top Meta: Stars, Rating & Verified Guest Marker */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#F1C17F] text-[#F1C17F]"
                      />
                    ))}
                    <span className="text-xs font-semibold text-[#173D3E] ml-1.5 rtl:ml-0 rtl:mr-1.5">
                      {item.rating}.0
                    </span>
                  </div>

                  {item.isVerified && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#075B60]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'حجز مؤكد' : 'Verified Visit'}</span>
                    </div>
                  )}
                </div>

                {/* Ritual Reference (Zero-pill typographic presentation with dot separators) */}
                <div className="text-xs text-[#075B60] font-medium mb-3">
                  {isArabic ? item.ritualName.ar : item.ritualName.en}
                </div>

                {/* Review Body */}
                <blockquote className="text-sm text-[#173D3E]/90 leading-relaxed font-sans mb-5 italic">
                  "{isArabic ? item.quote.ar : item.quote.en}"
                </blockquote>

                {/* Highlight Takeaway Note */}
                <div className="bg-[#F7E5C8]/30 border-r-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 border-[#075B60] px-3 py-2 text-xs text-[#173D3E]/80 mb-5">
                  <span className="font-semibold text-[#075B60] block mb-0.5">
                    {isArabic ? 'أبرز لمسة لفتت انتباهي:' : 'Guest highlight:'}
                  </span>
                  <span>{isArabic ? item.highlight.ar : item.highlight.en}</span>
                </div>
              </div>

              {/* Bottom Meta: Guest Name, City, Date, Helpful Button */}
              <div className="pt-4 border-t border-[#DBC7A6]/50 flex items-center justify-between text-xs text-[#173D3E]/70">
                <div>
                  <h4 className="font-semibold text-[#173D3E] text-xs sm:text-sm">
                    {isArabic ? item.name.ar : item.name.en}
                  </h4>
                  <p className="text-[11px] text-[#173D3E]/60 mt-0.5">
                    {isArabic ? item.city.ar : item.city.en} · {isArabic ? item.date.ar : item.date.en}
                  </p>
                </div>

                {/* Helpful count interaction */}
                <button
                  onClick={() => handleLike(item.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    likedReviews[item.id]
                      ? 'bg-[#075B60]/10 text-[#075B60] font-semibold'
                      : 'hover:bg-[#F7E5C8]/60 text-[#173D3E]/70'
                  }`}
                  aria-label={isArabic ? 'مفيد' : 'Helpful'}
                >
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${
                      likedReviews[item.id] ? 'fill-[#075B60] text-[#075B60]' : ''
                    }`}
                  />
                  <span>{item.helpfulCount}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Sanctuary Invitation Banner */}
        <div className="bg-gradient-to-r from-[#075B60] to-[#173D3E] text-[#FFF7EA] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          {/* Subtle Rosette in Banner */}
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
            <RosetteEmblem size={256} color="#F1C17F" />
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#F1C17F]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#F1C17F]">
                {isArabic ? 'تجربة لا تُنسى في انتظارك' : 'An Unforgettable Sanctuary Awaits'}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#FFF7EA] tracking-tight mb-3">
              {isArabic
                ? 'جاهزة لتجديد طاقتك وتجربة طقوس فنة بنفسك؟'
                : 'Ready to immerse yourself in authentic Finah rituals?'}
            </h3>

            <p className="text-xs sm:text-sm text-[#FFF7EA]/80 leading-relaxed mb-6">
              {isArabic
                ? 'اختاري موعدك المفضل، أو صممي زيارتك المتكاملة لتنسيق عدة خدمات في تسلسل هادئ ومريح.'
                : 'Select your preferred time, or design a custom visit sequencing multiple rituals with serene transitional harmony.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 bg-[#F1C17F] hover:bg-[#F7E5C8] text-[#173D3E] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {t('nav.book')}
                </button>
              )}
              {onDesignVisit && (
                <button
                  onClick={onDesignVisit}
                  className="px-6 py-3 bg-[#FFF7EA]/10 hover:bg-[#FFF7EA]/20 text-[#FFF7EA] border border-[#FFF7EA]/30 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  {t('nav.design_visit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Your Experience Modal */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173D3E]/60 backdrop-blur-xs"
        >
          <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#173D3E]/60 hover:text-[#173D3E] p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label={t('btn.close')}
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#075B60]/10 flex items-center justify-center text-[#075B60] mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#173D3E] mb-2 font-medium">
                  {isArabic ? 'شكراً لمشاركتك الكريمة' : 'Thank You for Your Feedback'}
                </h3>
                <p className="text-sm text-[#173D3E]/75 max-w-sm mx-auto">
                  {isArabic
                    ? 'تم تسجيل رأيك بنجاح وسيسهم في استمرار تطوير وإثراء تجربة ضيفات فنة.'
                    : 'Your review has been successfully recorded and enriches our sanctuary community.'}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RosetteEmblem size={24} color="#075B60" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                    {isArabic ? 'صوت ضيفات فنة' : 'Finah Sanctuary Voices'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#173D3E] font-medium tracking-tight mb-2">
                  {isArabic ? 'شاركينا انطباعك وتجربتك' : 'Share Your Sanctuary Experience'}
                </h3>
                <p className="text-xs text-[#173D3E]/75 mb-6">
                  {isArabic
                    ? 'كلماتك وملاحظاتك الصادقة تمنحنا إلهاماً مستمراً للعناية بأدق تفاصيل السكينة.'
                    : 'Your genuine thoughts help maintain the highest standards of Moroccan ritual craftsmanship.'}
                </p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                      {isArabic ? 'اسمك الكريم' : 'Your Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder={isArabic ? 'مثال: سارة الشامسي' : 'e.g. Sarah Al-Shamsi'}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/40 focus:outline-none focus:border-[#075B60]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                        {isArabic ? 'المدينة / الإمارة' : 'City / Area'}
                      </label>
                      <input
                        type="text"
                        value={newReview.city}
                        onChange={e => setNewReview({ ...newReview, city: e.target.value })}
                        placeholder={isArabic ? 'دبي، أبوظبي...' : 'Dubai, Abu Dhabi...'}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/40 focus:outline-none focus:border-[#075B60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                        {isArabic ? 'الطقس الذي عشته' : 'Ritual Experienced'} *
                      </label>
                      <select
                        value={newReview.ritualId}
                        onChange={e =>
                          setNewReview({
                            ...newReview,
                            ritualId: e.target.value as any
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                      >
                        <option value="hammam">
                          {isArabic ? 'الحمام المغربي الأصيل' : 'Moroccan Hammam'}
                        </option>
                        <option value="bridal">
                          {isArabic ? 'طقوس العروس الملكية' : 'Moroccan Bridal Journey'}
                        </option>
                        <option value="facial">
                          {isArabic ? 'نضارة الورد والوجه' : 'Damask Rose Facial'}
                        </option>
                        <option value="hair">
                          {isArabic ? 'علاج الأركان للشعر' : 'Argan Hair Therapy'}
                        </option>
                        <option value="custom">
                          {isArabic ? 'جلسة صممي زيارتك' : 'Custom Visit Package'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                      {isArabic ? 'تقييمك للتجربة' : 'Your Rating'}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(starVal => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: starVal })}
                          className="p-1 text-[#F1C17F] hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              starVal <= newReview.rating
                                ? 'fill-[#F1C17F] text-[#F1C17F]'
                                : 'text-[#DBC7A6]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-[#075B60] ml-2 rtl:ml-0 rtl:mr-2">
                        {newReview.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                      {isArabic ? 'تفاصيل تجربتك' : 'Your Review'} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.quote}
                      onChange={e => setNewReview({ ...newReview, quote: e.target.value })}
                      placeholder={
                        isArabic
                          ? 'صفي لنا شعورك، مستوى الراحة، أو تعاملك مع الأخصائية...'
                          : 'Describe the ambiance, the specialist care, or the ritual feelings...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/40 focus:outline-none focus:border-[#075B60]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                      {isArabic ? 'أبرز ما لفت انتباهك (اختياري)' : 'Key Highlight (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newReview.highlight}
                      onChange={e => setNewReview({ ...newReview, highlight: e.target.value })}
                      placeholder={
                        isArabic
                          ? 'مثال: دفء الغرفة، الشاي المغربي، مهارة الخبيرة...'
                          : 'e.g. Private steam warmth, authentic mint tea...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/40 focus:outline-none focus:border-[#075B60]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-[#173D3E]/70 hover:text-[#173D3E] cursor-pointer"
                    >
                      {t('btn.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#075B60] hover:bg-[#173D3E] text-[#FFF7EA] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {isArabic ? 'إرسال التقييم' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
