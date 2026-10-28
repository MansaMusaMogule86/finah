import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Droplets,
  Flame,
  Crown,
  Heart,
  Calendar,
  Check,
  ShieldCheck,
  Eye,
  ArrowRight,
  ArrowLeft,
  Compass
} from 'lucide-react';

export interface SpaFacility {
  id: string;
  category: 'hammam' | 'bridal' | 'facial' | 'hair' | 'lounge' | 'architecture';
  categoryLabel: { ar: string; en: string };
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  description: { ar: string; en: string };
  imageUrl: string;
  amenities: { ar: string; en: string }[];
  capacity: { ar: string; en: string };
  associatedServiceId?: string;
  associatedServiceName?: { ar: string; en: string };
  architecturalNote: { ar: string; en: string };
}

export const SPA_FACILITIES: SpaFacility[] = [
  {
    id: 'fac-hammam',
    category: 'hammam',
    categoryLabel: { ar: 'أجنحة الحمام المغربي', en: 'Hammam Suites' },
    title: { ar: 'جناح الحمام المغربي الملكي', en: 'The Royal Moroccan Hammam Suite' },
    subtitle: { ar: 'بلاطات رخام أطلسي دافئة وأحواض نحاس معتقة', en: 'Heated Atlas marble slabs & artisan copper basins' },
    description: {
      ar: 'أجنحة خاصة معزولة كلياً ومصممة بأعلى معايير الخصوصية والسكينة. تتميز بقباب أندلسية وجدران من الزليج المغربي الأصيل، ومصاطب رخامية مدفأة لراحة العضلات، مع نظام بخار الأوكالبتوس العطري لتنقية المسام.',
      en: 'Completely private, secluded suites crafted with authentic Moorish domes, hand-cut Fes zellige, and heated marble tables that ease deep muscle tension under aromatic eucalyptus steam.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'جناح خاص ومغلق كلياً', en: '100% Private Secluded Suite' },
      { ar: 'مصطبة رخام مغربي مدفأة', en: 'Heated Moroccan Marble Slab' },
      { ar: 'أحواض نحاس مطروقة يدوياً', en: 'Hand-Hammered Copper Basins' },
      { ar: 'بخار الأوكالبتوس النقي', en: 'Aromatherapeutic Steam Infusion' }
    ],
    capacity: { ar: '١ إلى ٢ ضيفة (خصوصية مطلقة)', en: '1 to 2 Guests (Absolute Privacy)' },
    associatedServiceId: 'hammam-royal-finah',
    associatedServiceName: { ar: 'حمام فنة الملكي بالأعشاب والورد', en: 'Finah Royal Herbal & Rose Hammam' },
    architecturalNote: {
      ar: 'استُورد رخام المصاطب مباشرة من مقالع جبال الأطلس المغربية مع تسخين مائي لطيف تحت السطح.',
      en: 'Sourced directly from Atlas mountain quarries with gentle sub-surface hydronic heating.'
    }
  },
  {
    id: 'fac-bridal',
    category: 'bridal',
    categoryLabel: { ar: 'أجنحة العرائس الملكية', en: 'Bridal Vault' },
    title: { ar: 'جناح العروس الإمبراطوري الخاص', en: 'Imperial Bridal Sanctuary Vault' },
    subtitle: { ar: 'ملاذ متكامل لطقوس ما قبل الزفاف وتوريد العكر الفاسي', en: 'Private sanctuary dedicated to ceremonial bridal glow' },
    description: {
      ar: 'جناح فاخر مخصص لطقوس العرائس الملكية، يضم حمام بخار خاص، ومغطساً مخصصاً لبتلات الورد والزيوت العطرية، وصالون راحة مستقل لتغيير الملابس وضيافة شاي الأعشاب المهدئ للأعصاب.',
      en: 'An expansive imperial suite reserved exclusively for bridal ceremonies, featuring a private steam vault, rose-petal soak basin, secluded dressing salon, and botanical tea hospitality.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'مغطس خاص ببتلات الورد العضوي', en: 'Private Rose Petal Soak Basin' },
      { ar: 'مجلس استراحة ومكياج خاص', en: 'Private Dressing & Vanity Majlis' },
      { ar: 'محطة العكر الفاسي والغاسول الأبيض', en: 'White Ghassoul & Aker Fassi Station' },
      { ar: 'عزل صوتي تام وموسيقى مخصصة', en: 'Dedicated Acoustic Soundscape' }
    ],
    capacity: { ar: 'العروس ومرافقة خاصة', en: 'Bride & 1 Dedicated Companion' },
    associatedServiceId: 'bridal-imperial-finah',
    associatedServiceName: { ar: 'طقوس العروس الملكية المتكاملة', en: 'Imperial Moroccan Bridal Sanctuary' },
    architecturalNote: {
      ar: 'جدران الجناح مطلية بمادة التادلاكت التقليدية المقاومة للرطوبة والتي تحتفظ بحرارة البخار الدافئة.',
      en: 'Hand-buffed waterproof Moroccan tadelakt plaster that maintains optimal ambient warmth.'
    }
  },
  {
    id: 'fac-facial',
    category: 'facial',
    categoryLabel: { ar: 'غرف العناية بالبشرة', en: 'Facial Suites' },
    title: { ar: 'جناح نضارة الورد وتدليك الكوارتز', en: 'Damask Rose & Quartz Therapy Suite' },
    subtitle: { ar: 'أجواء استرخاء خافتة الإضاءة مع تقطير الزيوت العضوية', en: 'Subdued ambient lighting with chilled rose quartz stones' },
    description: {
      ar: 'غرفة هادئة جداً مجهزة بأسرّة معالجة ميموري فوم قابلة للتدفئة، ومعدات متقدمة لحفظ أحجار الكوارتز الوردي مبردة، مع أجهزة تقطير ماء الورد وزيت بذور التين الشوكي المعصور على البارد.',
      en: 'Soundproof tranquil chambers equipped with ergonomic heated memory foam beds, chilled rose quartz lymphatic stones, and artisanal botanical diffusers filled with fresh floral waters.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f55b9359a60?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'أحجار كوارتز وردي مبردة', en: 'Chilled Rose Quartz Face Rollers' },
      { ar: 'أسرّة معالجة مدفأة بتقنية السحابة', en: 'Heated Cloud Treatment Beds' },
      { ar: 'أجهزة ترطيب بماء الورد النقي', en: 'Cold Ultrasonic Rosewater Mist' },
      { ar: 'أغطية من الكتان والحرير الطبيعي', en: 'Pure Organic Silk & Linen Bedding' }
    ],
    capacity: { ar: 'جلسة فردية خاصة', en: 'Individual Sanctuary Session' },
    associatedServiceId: 'facial-rose-radiance',
    associatedServiceName: { ar: 'نضارة الورد الدمشقي وتدليك الكوارتز', en: 'Damask Rose Quartz Facial Ritual' },
    architecturalNote: {
      ar: 'إضاءة خافتة مستوحاة من ثقوب الفوانيس النحاسية تمنح العينين استرخاءً كاملاً من إجهاد الشاشات.',
      en: 'Perforated brass lantern illumination calibrated to relieve ocular tension from digital screens.'
    }
  },
  {
    id: 'fac-hair',
    category: 'hair',
    categoryLabel: { ar: 'صالون سبا الشعر', en: 'Hair Spa Stations' },
    title: { ar: 'محطات سبا الشعر والأركان العضوي', en: 'Moroccan Organic Argan Hair Stations' },
    subtitle: { ar: 'كراسي استلقاء هيدروليكية ومظلات بخار الأعشاب الدقيقة', en: 'Reclining massage chairs & botanical micro-steam hoods' },
    description: {
      ar: 'محطات عناية متكاملة مصممة لجلسات علاج وترميم الشعر بالأركان وخلاصة إكليل الجبل البري، مجهزة بأحواض غسيل مريحة للعنق وخوذات بخار دافئة تساعد الزيوت على التغلغل في جذور وبصيلات الشعر.',
      en: 'Dedicated hair therapy stations featuring neck-cushioned wash basins, micro-steam nutrient hoods, and cold-pressed argan oil cellars for deep strand and scalp rehabilitation.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'كراسي غسيل مريحة مع دعم العنق', en: 'Ergonomic Neck-Supported Recliners' },
      { ar: 'خوذات بخار الأعشاب متناهي الصغر', en: 'Nutrient Micro-Steam Hoods' },
      { ar: 'شامبو وبلسم عضوي خالٍ من السلفات', en: '100% Sulfate-Free Botanical Care' },
      { ar: 'تصفيف انسيابي بأيونات سالبة', en: 'Ionic Silk Blowout Equipment' }
    ],
    capacity: { ar: 'محطات مستقلة بمسافات مريحة', en: 'Spacious Independent Hair Stations' },
    associatedServiceId: 'hair-argan-elixir',
    associatedServiceName: { ar: 'علاج الأركان المغربي لترميم وتغذية الشعر', en: 'Moroccan Organic Argan Restorative Hair Therapy' },
    architecturalNote: {
      ar: 'المحطات مزودة بأنظمة تنقية مياه ثلاثية تزيل الكلور والمعادن الثقيلة لحماية لون ولمعان الشعر.',
      en: 'Equipped with triple-filtered water systems that eliminate chlorine to protect hair vitality.'
    }
  },
  {
    id: 'fac-lounge',
    category: 'lounge',
    categoryLabel: { ar: 'ردهة السكينة والضيافة', en: 'Sanctuary Majlis' },
    title: { ar: 'ردهة السكينة وضيافة الشاي المغربي', en: 'The Sanctuary Majlis & Mint Tea Lounge' },
    subtitle: { ar: 'أقواس أندلسية شاهقة ومقاعد مخملية للاسترخاء بعد الطقوس', en: 'Soaring Moorish arches & plush seating with authentic tea' },
    description: {
      ar: 'قلب فنة النابض بالهدوء؛ ردهة استراحة فسيحة بأقواس أندلسية وطاولات من خشب الأرز الأطلسي المعطر، حيث تستمتع الضيفة بعد انتهاء جلستها بإبريق شاي النعناع الساخن وحلوى اللوز المغربية التقليدية.',
      en: 'The peaceful heart of Finah; an expansive vaulted lounge with cedarwood tables and plush seating where guests gently re-acclimate with fresh mint tea and artisan almond gazelle horns.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'أطقم صواني وبرادات شاي نحاسية', en: 'Handcrafted Brass Tea Trays & Pots' },
      { ar: 'شاي نعناع بلدي برغوة وفيرة', en: 'Fresh Organic Mint Infusions' },
      { ar: 'جلسات مخملية وثيره لراحة الظهر', en: 'Low Velvet Moroccan Sofas' },
      { ar: 'حلوى كعب الغزال باللوز وماء الزهر', en: 'Artisan Almond Gazelle Horn Pastries' }
    ],
    capacity: { ar: 'ردهة ضيافة مفتوحة للضيفات', en: 'Open Sanctuary Guest Lounge' },
    architecturalNote: {
      ar: 'أثاث الردهة نُحت يدوياً بأيدي حِرفيين مغاربة في فاس باستخدام خشب الأرز الطبيعي العطر.',
      en: 'Carved by master artisans in Fes utilizing naturally fragrant Moroccan cedarwood.'
    }
  },
  {
    id: 'fac-architecture',
    category: 'architecture',
    categoryLabel: { ar: 'العمارة والأروقة', en: 'Moorish Portals' },
    title: { ar: 'الأروقة الأندلسية ومساقط المياه الرخامية', en: 'Moorish Vaulted Portals & Water Courtyard' },
    subtitle: { ar: 'ممرات صامتة تعزف سيمفونية من الخرير والظلال الهادئة', en: 'Quiet vaulted corridors with trickling marble fountains' },
    description: {
      ar: 'ممرات وأروقة مستوحاة من عمارة الرياضات الملكية، تفصل بين أجنحة الحمام وغرف المعالجة لتضمن خصوصية تامة وصمتاً مريحاً، مع نافورة رخامية في المنتصف تبعث خريراً مائياً مهدئاً.',
      en: 'Architectural vaulted walkways inspired by imperial riads, insulating treatment suites from outside noise with tranquil marble fountains and subtle botanical incense.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=85',
    amenities: [
      { ar: 'أقواس مغربية مدببة محفورة باليد', en: 'Hand-Plastered Moorish Archways' },
      { ar: 'نافورة ماء رخامية مهدئة', en: 'Centerpiece Marble Trickle Fountain' },
      { ar: 'فوانيس برونزية مثقوبة يدوياً', en: 'Artisan Pierced Bronze Lanterns' },
      { ar: 'بخور العنبر والعود المغربي الخفيف', en: 'Subtle Natural Amber & Oud Bakhoor' }
    ],
    capacity: { ar: 'ممرات استقبال وعبور للخصوصية', en: 'Transition Sanctuary Corridors' },
    architecturalNote: {
      ar: 'صُممت انحناءات الأسقف لامتصاص الصدى وضمان عدم انتقال الأصوات بين الأجنحة المختلفة.',
      en: 'Acoustic vault curvature absorbs ambient sound, maintaining secluded sanctuary silence.'
    }
  }
];

interface SpaFacilitiesGalleryProps {
  onBookService?: (serviceId: string) => void;
  className?: string;
}

export const SpaFacilitiesGallery: React.FC<SpaFacilitiesGalleryProps> = ({
  onBookService,
  className = ''
}) => {
  const { isArabic } = useLanguage();

  // Active Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFacilities = SPA_FACILITIES.filter(f => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  // Current Slide Index in filtered list
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [lightboxFacility, setLightboxFacility] = useState<SpaFacility | null>(null);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay || filteredFacilities.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredFacilities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay, filteredFacilities.length]);

  const handlePrev = () => {
    if (filteredFacilities.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + filteredFacilities.length) % filteredFacilities.length);
  };

  const handleNext = () => {
    if (filteredFacilities.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % filteredFacilities.length);
  };

  const currentFacility = filteredFacilities[currentIndex] || filteredFacilities[0];

  return (
    <div className={`space-y-8 text-right rtl:text-right ltr:text-left ${className}`}>
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DBC7A6]/60">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Compass className="w-4 h-4 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'جولة في ملاذ فنة · مرافق السبا والأجنحة' : 'Finah Sanctuary Tour · Spa Facilities & Suites'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#173D3E] font-medium tracking-tight">
            {isArabic ? 'معرض مرافق السبا والأجنحة الملكية' : 'Interactive Spa Facilities Gallery'}
          </h2>
          <p className="text-xs sm:text-sm text-[#173D3E]/75 mt-1 max-w-2xl leading-relaxed">
            {isArabic
              ? 'استكشفي أجنحة الحمام المغربي الخاصة، وصالونات العرائس المعزولة، وغرف نضارة الكوارتز، وردهة الشاي الأندلسية عبر هذا المعرض التفاعلي.'
              : 'Explore our secluded private hammam suites, imperial bridal vaults, quartz therapy rooms, and tranquil tea majlis through our interactive photo showcase.'}
          </p>
        </div>

        {/* Slides Counter & Autoplay Control */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAutoplay
                ? 'bg-white text-[#075B60] border-[#DBC7A6] shadow-2xs'
                : 'bg-[#075B60]/10 text-[#075B60] border-[#075B60]/30'
            }`}
          >
            {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoplay ? (isArabic ? 'إيقاف مؤقت' : 'Pause Tour') : (isArabic ? 'جولة تلقائية' : 'Autoplay')}</span>
          </button>

          <span className="text-xs font-mono font-semibold text-[#075B60] bg-[#FFF7EA] border border-[#DBC7A6] px-3 py-1.5 rounded-xl">
            {String(currentIndex + 1).padStart(2, '0')} / {String(filteredFacilities.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: isArabic ? 'كافة المرافق' : 'All Facilities' },
          { id: 'hammam', label: isArabic ? 'أجنحة الحمام' : 'Hammam Suites' },
          { id: 'bridal', label: isArabic ? 'جناح العروس' : 'Bridal Vault' },
          { id: 'facial', label: isArabic ? 'غرف العناية بالوجه' : 'Facial Suites' },
          { id: 'hair', label: isArabic ? 'سبا الشعر والأركان' : 'Hair Spa' },
          { id: 'lounge', label: isArabic ? 'ردهة السكينة' : 'Tea Majlis' },
          { id: 'architecture', label: isArabic ? 'العمارة والأروقة' : 'Moorish Portals' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#075B60] text-white shadow-xs font-semibold'
                : 'bg-white hover:bg-[#F7E5C8]/60 text-[#173D3E] border border-[#DBC7A6]/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          MAIN CAROUSEL SHOWCASE STAGE
          ========================================================================= */}
      {currentFacility && (
        <div
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
          className="bg-white border-2 border-[#DBC7A6] rounded-3xl overflow-hidden shadow-sm relative transition-all"
        >
          {/* Main Stage Grid: Large Cinematic Image + Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left 7 Columns (Image Frame) */}
            <div className="lg:col-span-7 relative bg-black/90 min-h-[300px] sm:min-h-[420px] overflow-hidden group">
              <img
                src={currentFacility.imageUrl}
                alt={currentFacility.title[isArabic ? 'ar' : 'en']}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Bar on Image: Category Badge + Lightbox Expand */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-[#173D3E]/80 backdrop-blur-md text-[#FFF7EA] text-xs font-semibold border border-white/20">
                  {currentFacility.categoryLabel[isArabic ? 'ar' : 'en']}
                </span>

                <button
                  onClick={() => setLightboxFacility(currentFacility)}
                  className="pointer-events-auto p-2 rounded-xl bg-white/85 hover:bg-white text-[#173D3E] backdrop-blur-md shadow-md transition-all cursor-pointer"
                  title={isArabic ? 'عرض الصورة بالحجم الكامل' : 'Expand full resolution'}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* In-Image Caption Overlay (Mobile & Tablet highlight) */}
              <div className="absolute bottom-4 inset-x-4 z-10 pointer-events-none">
                <span className="text-[11px] font-mono text-[#F1C17F] block mb-0.5">
                  {currentFacility.capacity[isArabic ? 'ar' : 'en']}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-white drop-shadow-sm leading-snug">
                  {currentFacility.title[isArabic ? 'ar' : 'en']}
                </h3>
              </div>

              {/* On-Image Navigation Chevrons */}
              <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                <button
                  onClick={handlePrev}
                  className="pointer-events-auto p-2.5 rounded-full bg-white/80 hover:bg-white text-[#075B60] backdrop-blur-sm shadow-md transition-all cursor-pointer active:scale-95"
                  aria-label="Previous facility"
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
                </button>
                <button
                  onClick={handleNext}
                  className="pointer-events-auto p-2.5 rounded-full bg-white/80 hover:bg-white text-[#075B60] backdrop-blur-sm shadow-md transition-all cursor-pointer active:scale-95"
                  aria-label="Next facility"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>

            {/* Right 5 Columns (Facility Details & Booking CTA) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#FFF7EA] via-white to-[#F7E5C8]/30">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <RosetteEmblem size={18} color="#075B60" />
                    <span className="text-xs font-semibold text-[#075B60] uppercase tracking-wider">
                      {isArabic ? 'مواصفات المرفق والأجواء' : 'Suite Specifications & Ambiance'}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#173D3E] leading-tight">
                    {currentFacility.title[isArabic ? 'ar' : 'en']}
                  </h3>
                  <p className="text-xs text-[#075B60] font-medium mt-1">
                    {currentFacility.subtitle[isArabic ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-[#173D3E]/80 leading-relaxed">
                  {currentFacility.description[isArabic ? 'ar' : 'en']}
                </p>

                {/* Architectural Secret / Materiality */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DBC7A6] text-xs shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[#075B60] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F1C17F]" />
                    <span>{isArabic ? 'الأصالة الحرفية والمعمار:' : 'Artisan Architecture & Sourcing:'}</span>
                  </div>
                  <p className="text-[#173D3E]/75 leading-relaxed">
                    {currentFacility.architecturalNote[isArabic ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Key Amenities Grid */}
                <div>
                  <span className="text-xs font-semibold text-[#173D3E]/70 block mb-2">
                    {isArabic ? 'أبرز التجهيزات المتوفرة في الجناح:' : 'Highlighted Suite Amenities:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {currentFacility.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-[#DBC7A6]/60 text-[#173D3E]"
                      >
                        <Check className="w-3 h-3 text-[#075B60] shrink-0" />
                        <span className="truncate">{amenity[isArabic ? 'ar' : 'en']}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-6 border-t border-[#DBC7A6]/60 mt-4 flex items-center justify-between gap-3">
                {currentFacility.associatedServiceId && onBookService ? (
                  <button
                    onClick={() => onBookService(currentFacility.associatedServiceId!)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {isArabic ? 'احجزي موعدكِ في هذا الجناح' : 'Book a Session in this Suite'}
                    </span>
                  </button>
                ) : (
                  <div className="text-xs text-[#075B60] font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#075B60]" />
                    <span>{isArabic ? 'مرفق متاح لكافة ضيفات فنة' : 'Open to all registered Finah guests'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              THUMBNAIL FILMSTRIP CAROUSEL
              ========================================================================= */}
          <div className="p-3 sm:p-4 bg-[#F7E5C8]/40 border-t border-[#DBC7A6]/70 flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-semibold text-[#075B60] uppercase tracking-wider shrink-0 px-2 hidden sm:inline">
              {isArabic ? 'المرافق:' : 'Suites:'}
            </span>

            {filteredFacilities.map((fac, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={fac.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#075B60] ring-2 ring-[#075B60]/30 scale-102 shadow-xs'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={fac.imageUrl} alt={fac.title[isArabic ? 'ar' : 'en']} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1 inset-x-1">
                    <p className="text-[9px] font-semibold text-white truncate drop-shadow-xs">
                      {fac.title[isArabic ? 'ar' : 'en']}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-SCREEN LIGHTBOX MODAL
          ========================================================================= */}
      {lightboxFacility && (
        <div
          className="fixed inset-0 z-50 bg-[#173D3E]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxFacility(null)}
        >
          <div
            className="w-full max-w-5xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] text-right rtl:text-right ltr:text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxFacility(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-9 h-9 rounded-full bg-white/90 text-[#173D3E] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image Box */}
            <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[60vh] sm:max-h-[68vh]">
              <img
                src={lightboxFacility.imageUrl}
                alt={lightboxFacility.title[isArabic ? 'ar' : 'en']}
                className="max-h-[60vh] sm:max-h-[68vh] w-full object-contain"
              />
            </div>

            {/* Lightbox Metadata Bar */}
            <div className="p-6 sm:p-8 bg-white border-t border-[#DBC7A6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-y-auto">
              <div>
                <span className="text-xs font-semibold text-[#075B60] block mb-1">
                  {lightboxFacility.categoryLabel[isArabic ? 'ar' : 'en']} · {lightboxFacility.capacity[isArabic ? 'ar' : 'en']}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#173D3E]">
                  {lightboxFacility.title[isArabic ? 'ar' : 'en']}
                </h3>
                <p className="text-xs text-[#173D3E]/75 mt-1 max-w-2xl leading-relaxed">
                  {lightboxFacility.description[isArabic ? 'ar' : 'en']}
                </p>
              </div>

              {lightboxFacility.associatedServiceId && onBookService && (
                <button
                  onClick={() => {
                    setLightboxFacility(null);
                    onBookService(lightboxFacility.associatedServiceId!);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold shrink-0 shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'احجزي هذا الجناح' : 'Book this Suite'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
