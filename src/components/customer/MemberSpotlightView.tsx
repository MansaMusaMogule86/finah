import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MemberSpotlight, SharedVisitPhoto, Service, RewardTier } from '../../types';
import { INITIAL_MEMBER_SPOTLIGHTS, INITIAL_SHARED_VISIT_PHOTOS } from '../../data/memberSpotlights';
import { finahStore } from '../../services/api';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Crown,
  Star,
  Play,
  Pause,
  Maximize2,
  ArrowRight,
  ArrowLeft,
  Droplets,
  Flame,
  ShieldCheck,
  Send,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface MemberSpotlightViewProps {
  onRebook: (serviceId: string) => void;
  currentCustomerName?: string;
  currentCustomerPhone?: string;
}

export const MemberSpotlightView: React.FC<MemberSpotlightViewProps> = ({
  onRebook,
  currentCustomerName,
  currentCustomerPhone
}) => {
  const { isArabic } = useLanguage();
  const allServices = finahStore.getServices();

  // Spotlights & Photos state (stored in local state + fallback to initial)
  const [spotlights, setSpotlights] = useState<MemberSpotlight[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finah_member_spotlights');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing saved spotlights', e);
        }
      }
    }
    return INITIAL_MEMBER_SPOTLIGHTS;
  });

  const [sharedPhotos, setSharedPhotos] = useState<SharedVisitPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finah_shared_visit_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing saved shared photos', e);
        }
      }
    }
    return INITIAL_SHARED_VISIT_PHOTOS;
  });

  // Selected featured member spotlight
  const [activeSpotlightId, setActiveSpotlightId] = useState<string>(
    spotlights[0]?.id || 'spotlight-mariam'
  );
  const activeSpotlight =
    spotlights.find(s => s.id === activeSpotlightId) || spotlights[0];

  // Carousel Category filter
  const [photoFilter, setPhotoFilter] = useState<
    'all' | 'hammam' | 'hair' | 'facial' | 'bridal' | 'majlis'
  >('all');

  const filteredPhotos = sharedPhotos.filter(photo => {
    if (photoFilter === 'all') return true;
    return photo.category === photoFilter;
  });

  // Carousel Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Likes tracking in localStorage
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finah_liked_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing liked photos', e);
        }
      }
    }
    return {};
  });

  // Lightbox Modal State
  const [lightboxPhoto, setLightboxPhoto] = useState<SharedVisitPhoto | null>(null);

  // Share Your Visit Moment Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState(currentCustomerName || (isArabic ? 'مريم المنصوري' : 'Mariam Al-Mansouri'));
  const [formServiceId, setFormServiceId] = useState<string>('hammam-royal-finah');
  const [formSpecialist, setFormSpecialist] = useState<string>('كنزة الفاسي');
  const [formCategory, setFormCategory] = useState<'hammam' | 'hair' | 'facial' | 'bridal' | 'majlis'>('hammam');
  const [formBeforeStory, setFormBeforeStory] = useState('');
  const [formOutcomeStory, setFormOutcomeStory] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80');
  const [formConsent, setFormConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample guest photo presets for easy submission
  const PHOTO_PRESETS = [
    {
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      label: isArabic ? 'جناح الحمام المغربي' : 'Hammam Suite'
    },
    {
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      label: isArabic ? 'علاج وتصفيف الشعر' : 'Argan Hair'
    },
    {
      url: 'https://images.unsplash.com/photo-1608248597359-2e06180fc545?auto=format&fit=crop&w=1200&q=80',
      label: isArabic ? 'نضارة الورد الدمشقي' : 'Rose Radiance'
    },
    {
      url: 'https://images.unsplash.com/photo-1512290900672-1f55b9359a60?auto=format&fit=crop&w=1200&q=80',
      label: isArabic ? 'إشراقة العروس الملكية' : 'Bridal Glow'
    },
    {
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      label: isArabic ? 'ضيافة شاي النعناع' : 'Mint Tea Lounge'
    }
  ];

  // Carousel Autoplay
  useEffect(() => {
    if (!isAutoplay || filteredPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % filteredPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay, filteredPhotos.length]);

  // Reset slide index if filter shrinks length
  useEffect(() => {
    if (currentSlideIndex >= filteredPhotos.length) {
      setCurrentSlideIndex(0);
    }
  }, [photoFilter, filteredPhotos.length]);

  const handleNextSlide = () => {
    if (filteredPhotos.length === 0) return;
    setCurrentSlideIndex(prev => (prev + 1) % filteredPhotos.length);
  };

  const handlePrevSlide = () => {
    if (filteredPhotos.length === 0) return;
    setCurrentSlideIndex(prev => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Toggle Like on a photo
  const handleToggleLike = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isCurrentlyLiked = !!likedPhotoIds[photoId];
    const newLiked = { ...likedPhotoIds, [photoId]: !isCurrentlyLiked };
    setLikedPhotoIds(newLiked);
    localStorage.setItem('finah_liked_photos', JSON.stringify(newLiked));

    // Update count in sharedPhotos state
    setSharedPhotos(prev => {
      const updated = prev.map(p => {
        if (p.id === photoId) {
          return {
            ...p,
            likesCount: isCurrentlyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
          };
        }
        return p;
      });
      localStorage.setItem('finah_shared_visit_photos', JSON.stringify(updated));
      return updated;
    });

    if (lightboxPhoto && lightboxPhoto.id === photoId) {
      setLightboxPhoto(prev =>
        prev
          ? {
              ...prev,
              likesCount: isCurrentlyLiked ? Math.max(0, prev.likesCount - 1) : prev.likesCount + 1
            }
          : null
      );
    }
  };

  // Submit Member Spotlight / Visit Photo
  const handleSubmitMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCaption.trim() || !formName.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedService = allServices.find(s => s.id === formServiceId);
      const serviceTitle = selectedService
        ? { ar: selectedService.name.ar, en: selectedService.name.en }
        : { ar: 'جلسة فنة المعتمدة', en: 'Finah Signature Ritual' };

      const newPhotoId = `sv-user-${Date.now()}`;
      const newPhoto: SharedVisitPhoto = {
        id: newPhotoId,
        url: formPhotoUrl,
        authorName: { ar: formName.trim(), en: formName.trim() },
        authorTier: 'amber',
        caption: { ar: formCaption.trim(), en: formCaption.trim() },
        category: formCategory,
        serviceName: serviceTitle,
        serviceId: formServiceId,
        date: { ar: isArabic ? 'اليوم' : 'Today', en: 'Today' },
        likesCount: 1
      };

      const updatedPhotos = [newPhoto, ...sharedPhotos];
      setSharedPhotos(updatedPhotos);
      localStorage.setItem('finah_shared_visit_photos', JSON.stringify(updatedPhotos));

      // If they wrote transformation notes, also add or enrich spotlight
      if (formBeforeStory.trim() || formOutcomeStory.trim()) {
        const newSpotlight: MemberSpotlight = {
          id: `spotlight-user-${Date.now()}`,
          name: { ar: formName.trim(), en: formName.trim() },
          city: { ar: isArabic ? 'دبي' : 'Dubai', en: 'Dubai' },
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          tier: 'amber',
          memberSince: { ar: isArabic ? 'عضوة معتمدة' : 'Verified Member', en: 'Verified Member' },
          headline: {
            ar: formCaption.trim() || (isArabic ? 'تجربة سكينة وتحول حقيقي في فنة' : 'Authentic Sanctuary Transformation at Finah'),
            en: formCaption.trim() || 'Authentic Sanctuary Transformation at Finah'
          },
          transformationStory: {
            beforeState: {
              ar: formBeforeStory.trim() || (isArabic ? 'إرهاق وجفاف بحاجة إلى عناية مغربية عميقة' : 'Fatigue and skin dryness seeking restoration'),
              en: formBeforeStory.trim() || 'Fatigue and skin dryness seeking restoration'
            },
            ritualPath: {
              ar: serviceTitle.ar,
              en: serviceTitle.en
            },
            outcome: {
              ar: formOutcomeStory.trim() || (isArabic ? 'راحة فائقة ونعومة حريرية تدوم طويلاً' : 'Lasting silkiness and profound inner calm'),
              en: formOutcomeStory.trim() || 'Lasting silkiness and profound inner calm'
            }
          },
          quote: {
            ar: `«${formCaption.trim()}»`,
            en: `“${formCaption.trim()}”`
          },
          favoriteRituals: [
            {
              serviceId: formServiceId,
              name: serviceTitle,
              category: formCategory
            }
          ],
          favoriteStaffName: { ar: formSpecialist, en: formSpecialist },
          verifiedVisitDate: { ar: isArabic ? 'اليوم' : 'Today', en: 'Today' },
          photos: [
            {
              id: `p-${newPhotoId}`,
              url: formPhotoUrl,
              caption: { ar: formCaption.trim(), en: formCaption.trim() },
              tag: formCategory === 'majlis' ? 'atmosphere' : formCategory
            }
          ]
        };

        const updatedSpotlights = [newSpotlight, ...spotlights];
        setSpotlights(updatedSpotlights);
        setActiveSpotlightId(newSpotlight.id);
        localStorage.setItem('finah_member_spotlights', JSON.stringify(updatedSpotlights));
      }

      setSubmitSuccessNotice(
        isArabic
          ? 'تمت إضافة مشاركتكِ وصورتكِ بنجاح إلى إضاءات العضويات وألبوم الزيارات!'
          : 'Your visit story and photo have been published to the Member Spotlight!'
      );
      setIsSubmitModalOpen(false);
      setFormCaption('');
      setFormBeforeStory('');
      setFormOutcomeStory('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierBadgeStyle = (tier: RewardTier) => {
    switch (tier) {
      case 'royal_jasmine':
        return {
          label: isArabic ? 'عضوية الياسمين الملكي' : 'Royal Jasmine Tier',
          pill: 'bg-amber-100 text-amber-900 border-amber-300',
          iconColor: 'text-amber-600'
        };
      case 'amber':
        return {
          label: isArabic ? 'عضوية العنبر المغربي' : 'Moroccan Amber Tier',
          pill: 'bg-[#075B60]/10 text-[#075B60] border-[#075B60]/30',
          iconColor: 'text-[#075B60]'
        };
      default:
        return {
          label: isArabic ? 'عضوية الزليج الأصيل' : 'Zellige Member',
          pill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          iconColor: 'text-emerald-700'
        };
    }
  };

  return (
    <div className="space-y-12 text-right rtl:text-right ltr:text-left">
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#DBC7A6]/60">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'إضاءات العضويات · قصص السكينة الحقيقية' : 'Member Spotlight · Genuine Sanctuary Journeys'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#173D3E] font-medium tracking-tight">
            {isArabic ? 'إضاءات العضويات وتحولات الجمال' : 'Featured Member Spotlights & Transformations'}
          </h2>
          <p className="text-xs sm:text-sm text-[#173D3E]/75 mt-1.5 max-w-2xl leading-relaxed">
            {isArabic
              ? 'تجارب حية وموثقة لضيفات فنة، ورحلاتهن في استعادة نقاء البشرة الحريري، وترميم الشعر بالأركان، وتجديد السكينة الداخلية مع كل زيارة.'
              : 'Authentic transformation journeys and candid visit moments shared by our cherished members, celebrating timeless Moroccan rituals and inner calm.'}
          </p>

          {/* Clean unboxed metadata with separators */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#173D3E]/60 mt-3 font-medium">
            <span>{spotlights.length} {isArabic ? 'عضوات مميزات' : 'Featured Members'}</span>
            <span aria-hidden="true">·</span>
            <span>{sharedPhotos.length} {isArabic ? 'صورة موثقة من الزيارات' : 'Verified Visit Photos'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#075B60] font-semibold">{isArabic ? '١٠٠٪ مكونات مغربية أصلية' : '100% Authentic Moroccan Botanicals'}</span>
          </div>
        </div>

        {/* Primary CTA: Share Your Visit Moment */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white font-medium flex items-center gap-2 transition-all text-xs sm:text-sm shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#F1C17F]" />
            <span>{isArabic ? 'شاركي إشراقتكِ وصوركِ' : 'Share Your Visit Glow'}</span>
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST NOTICE */}
      {submitSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{submitSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSubmitSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          FEATURED MEMBER TRANSFORMATION SHOWCASE
          ========================================================================= */}
      <section className="bg-gradient-to-br from-[#FFF7EA] via-white to-[#F7E5C8]/30 border-2 border-[#DBC7A6]/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle Moroccan Architectural Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none transform translate-x-20 -translate-y-20">
          <RosetteEmblem size={380} color="#075B60" />
        </div>

        {/* Member Switcher Tabs */}
        <div className="relative z-10 mb-8 pb-5 border-b border-[#DBC7A6]/50">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#075B60]">
              {isArabic ? 'اختر عضوة للاطلاع على رحلتها:' : 'Select Featured Member Journey:'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {spotlights.map(member => {
              const isSelected = member.id === activeSpotlightId;
              const tierInfo = getTierBadgeStyle(member.tier);

              return (
                <button
                  key={member.id}
                  onClick={() => setActiveSpotlightId(member.id)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-[#075B60] text-white border-[#075B60] shadow-xs'
                      : 'bg-white hover:bg-[#F7E5C8]/60 text-[#173D3E] border-[#DBC7A6]/70'
                  }`}
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name[isArabic ? 'ar' : 'en']}
                    className="w-7 h-7 rounded-full object-cover border border-white/40 shrink-0"
                  />
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="text-xs font-semibold block leading-tight">
                      {member.name[isArabic ? 'ar' : 'en']}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight ${
                        isSelected ? 'text-[#F1C17F]' : 'text-[#173D3E]/60'
                      }`}
                    >
                      {tierInfo.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Member Hero Card */}
        {activeSpotlight && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Member Profile & Portrait */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-right rtl:lg:text-right ltr:lg:text-left space-y-4">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-3 border-[#075B60] shadow-md p-1 bg-white">
                  <img
                    src={activeSpotlight.avatarUrl}
                    alt={activeSpotlight.name[isArabic ? 'ar' : 'en']}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                {activeSpotlight.tier === 'royal_jasmine' && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-xs border-2 border-white">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1.5">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#173D3E]">
                    {activeSpotlight.name[isArabic ? 'ar' : 'en']}
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      getTierBadgeStyle(activeSpotlight.tier).pill
                    }`}
                  >
                    {getTierBadgeStyle(activeSpotlight.tier).label}
                  </span>
                </div>

                <p className="text-xs text-[#173D3E]/70 font-medium">
                  {activeSpotlight.city[isArabic ? 'ar' : 'en']} · {activeSpotlight.memberSince[isArabic ? 'ar' : 'en']}
                </p>

                <div className="mt-3 p-3 rounded-xl bg-white/80 border border-[#DBC7A6]/60 text-xs text-[#173D3E]/80">
                  <span className="block text-[11px] text-[#075B60] font-semibold mb-0.5">
                    {isArabic ? 'الخبيـرة المعالجة المعتمدة:' : 'Dedicated Care Specialist:'}
                  </span>
                  <span className="font-medium text-[#173D3E]">
                    {activeSpotlight.favoriteStaffName[isArabic ? 'ar' : 'en']}
                  </span>
                  <span className="text-[10px] text-[#173D3E]/50 block mt-0.5">
                    {isArabic ? 'آخر زيارة موثقة: ' : 'Verified visit: '}
                    {activeSpotlight.verifiedVisitDate[isArabic ? 'ar' : 'en']}
                  </span>
                </div>
              </div>

              {/* Member Direct Quote */}
              <div className="p-4 rounded-2xl bg-[#075B60]/5 border border-[#075B60]/20 text-[#173D3E] text-xs sm:text-sm font-serif italic leading-relaxed relative">
                {activeSpotlight.quote[isArabic ? 'ar' : 'en']}
              </div>
            </div>

            {/* Right Column: Transformation Journey Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              {/* Headline */}
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#075B60] block mb-1">
                  {isArabic ? 'قصة التحول وإشراقة السكينة' : 'Beauty Transformation Narrative'}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#173D3E] leading-snug">
                  {activeSpotlight.headline[isArabic ? 'ar' : 'en']}
                </h4>
              </div>

              {/* 3-Step Journey Grid */}
              <div className="space-y-4">
                {/* Step 1: Before State */}
                <div className="p-4 rounded-2xl bg-white border border-[#DBC7A6]/80 text-xs sm:text-sm shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-800 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{isArabic ? '١. الحالة قبل الطقوس (نقطة البداية)' : '1. Starting State & Concerns'}</span>
                  </div>
                  <p className="text-[#173D3E]/80 leading-relaxed pr-4 rtl:pr-4 ltr:pl-4">
                    {activeSpotlight.transformationStory.beforeState[isArabic ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Step 2: Ritual Path */}
                <div className="p-4 rounded-2xl bg-white border border-[#075B60]/30 text-xs sm:text-sm shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5 text-[#075B60] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#075B60]" />
                    <span>{isArabic ? '٢. مسار الطقوس والمكونات المغربية' : '2. Botanical Ritual Pathway'}</span>
                  </div>
                  <p className="text-[#173D3E]/80 leading-relaxed pr-4 rtl:pr-4 ltr:pl-4">
                    {activeSpotlight.transformationStory.ritualPath[isArabic ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Step 3: Transformation Outcome */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-300 text-xs sm:text-sm shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isArabic ? '٣. النتيجة المحققة والإشراقة المستدامة' : '3. Transformation & Lasting Radiance'}</span>
                  </div>
                  <p className="text-emerald-950 font-medium leading-relaxed pr-4 rtl:pr-4 ltr:pl-4">
                    {activeSpotlight.transformationStory.outcome[isArabic ? 'ar' : 'en']}
                  </p>
                </div>
              </div>

              {/* Member's Favorite Rituals & Instant Rebook Button */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#173D3E]/70 block mb-2">
                  {isArabic ? 'الطقوس المفضلة لدى العضوة في فنة:' : 'Member’s Endorsed Rituals:'}
                </span>

                <div className="flex flex-wrap gap-2">
                  {activeSpotlight.favoriteRituals.map(ritual => (
                    <div
                      key={ritual.serviceId}
                      className="p-2.5 rounded-xl bg-white border border-[#DBC7A6] flex items-center justify-between gap-3 text-xs shadow-2xs flex-1 min-w-[240px]"
                    >
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5 text-[#075B60] shrink-0" />
                        <span className="font-medium text-[#173D3E]">
                          {ritual.name[isArabic ? 'ar' : 'en']}
                        </span>
                      </div>
                      <button
                        onClick={() => onRebook(ritual.serviceId)}
                        className="px-2.5 py-1 rounded-lg bg-[#075B60] hover:bg-[#0E8890] text-white text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        {isArabic ? 'احجزي هذا الطقس' : 'Book Ritual'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Strip from this Member's Visit */}
              {activeSpotlight.photos.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#173D3E]/70 block mb-2">
                    {isArabic ? 'لقطات من زيارة العضوة:' : 'Photos from Member’s Visit:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeSpotlight.photos.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          const matchedPhoto = sharedPhotos.find(sp => sp.url === p.url) || {
                            id: p.id,
                            url: p.url,
                            authorName: activeSpotlight.name,
                            authorTier: activeSpotlight.tier,
                            caption: p.caption,
                            category: (p.tag === 'atmosphere' ? 'majlis' : p.tag) as any,
                            serviceName: activeSpotlight.favoriteRituals[0]?.name || { ar: 'جلسة فنة', en: 'Finah Visit' },
                            date: activeSpotlight.verifiedVisitDate,
                            likesCount: 15
                          };
                          setLightboxPhoto(matchedPhoto);
                        }}
                        className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-[#DBC7A6] cursor-pointer shadow-2xs bg-white"
                      >
                        <img
                          src={p.url}
                          alt={p.caption[isArabic ? 'ar' : 'en']}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-[10px] text-white line-clamp-1 leading-tight">
                            {p.caption[isArabic ? 'ar' : 'en']}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          USER-SHARED PHOTOS CAROUSEL FROM VISITS
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <Camera className="w-4 h-4 text-[#075B60]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'ألبوم ضيفات فنة' : 'Guest Moments Album'}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#173D3E] font-medium">
              {isArabic ? 'معرض صور زيارات العضويات' : 'Carousel of User-Shared Visit Moments'}
            </h3>
            <p className="text-xs sm:text-sm text-[#173D3E]/70 mt-1">
              {isArabic
                ? 'لحظات أصيلة شاركتها ضيفات فنة من أجنحة الحمام، وجلسات الشعر، وردهة الشاي المغربي.'
                : 'Candid snapshots and serene memories captured by our members during their sanctuary rituals.'}
            </p>
          </div>

          {/* Carousel Controls: Autoplay toggle & Next/Prev */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isAutoplay
                  ? 'bg-white text-[#075B60] border-[#DBC7A6]'
                  : 'bg-[#075B60]/10 text-[#075B60] border-[#075B60]/30'
              }`}
              title={isAutoplay ? 'Pause Carousel' : 'Play Carousel'}
            >
              {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">
                {isAutoplay ? (isArabic ? 'إيقاف تلقائي' : 'Pause') : (isArabic ? 'تشغيل تلقائي' : 'Autoplay')}
              </span>
            </button>

            <button
              onClick={handlePrevSlide}
              aria-label="Previous photo"
              className="p-2 rounded-xl bg-white hover:bg-[#F7E5C8] border border-[#DBC7A6] text-[#075B60] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next photo"
              className="p-2 rounded-xl bg-white hover:bg-[#F7E5C8] border border-[#DBC7A6] text-[#075B60] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* Category Filters for Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: isArabic ? 'جميع اللقطات' : 'All Moments' },
            { id: 'hammam', label: isArabic ? 'الحمام المغربي' : 'Hammam & Body' },
            { id: 'hair', label: isArabic ? 'عناية الأركان والشعر' : 'Hair Therapies' },
            { id: 'facial', label: isArabic ? 'نضارة الورد والوجه' : 'Facial Radiance' },
            { id: 'bridal', label: isArabic ? 'طقوس العروس' : 'Bridal Sanctuary' },
            { id: 'majlis', label: isArabic ? 'الردهة وشاي النعناع' : 'Sanctuary Majlis' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setPhotoFilter(tab.id as any);
                setCurrentSlideIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
                photoFilter === tab.id
                  ? 'bg-[#075B60] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F7E5C8]/60 text-[#173D3E] border border-[#DBC7A6]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carousel Visual Frame */}
        <div
          ref={carouselContainerRef}
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
          className="relative overflow-hidden rounded-3xl"
        >
          {filteredPhotos.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#DBC7A6] text-[#173D3E]/60 text-sm">
              {isArabic ? 'لا توجد صور في هذا التصنيف حالياً.' : 'No photos found in this category.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Responsive window of photos based on currentSlideIndex */}
              {[0, 1, 2].map(offset => {
                const photoIdx = (currentSlideIndex + offset) % filteredPhotos.length;
                const photo = filteredPhotos[photoIdx];
                if (!photo) return null;
                const isLiked = !!likedPhotoIds[photo.id];
                const tierInfo = getTierBadgeStyle(photo.authorTier);

                return (
                  <div
                    key={`${photo.id}-${offset}`}
                    onClick={() => setLightboxPhoto(photo)}
                    className="group bg-white border border-[#DBC7A6] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF7EA]">
                      <img
                        src={photo.url}
                        alt={photo.caption[isArabic ? 'ar' : 'en']}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-[#173D3E]/70 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide">
                          {photo.category === 'hammam'
                            ? (isArabic ? 'حمام مغربي' : 'Hammam')
                            : photo.category === 'hair'
                            ? (isArabic ? 'عناية الأركان' : 'Hair Spa')
                            : photo.category === 'facial'
                            ? (isArabic ? 'نضارة الوجه' : 'Facial')
                            : photo.category === 'bridal'
                            ? (isArabic ? 'عروس ملكية' : 'Bridal')
                            : (isArabic ? 'ردهة السكينة' : 'Majlis')}
                        </span>

                        {/* Interactive Like Button */}
                        <button
                          onClick={e => handleToggleLike(photo.id, e)}
                          className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-125 cursor-pointer shadow-xs ${
                            isLiked
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 hover:bg-white text-[#173D3E]'
                          }`}
                          title="Like this photo"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Expand Overlay Icon */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#075B60] flex items-center justify-center shadow-md">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Author info */}
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#173D3E]">
                              {photo.authorName[isArabic ? 'ar' : 'en']}
                            </span>
                            <span className="text-[10px] text-[#075B60] font-medium">
                              ({tierInfo.label})
                            </span>
                          </div>
                          <span className="text-[10px] text-[#173D3E]/50 font-mono">
                            {photo.date[isArabic ? 'ar' : 'en']}
                          </span>
                        </div>

                        {/* Caption */}
                        <p className="text-xs text-[#173D3E]/85 line-clamp-2 leading-relaxed mb-3">
                          {photo.caption[isArabic ? 'ar' : 'en']}
                        </p>
                      </div>

                      {/* Footer: Service Name + Likes Counter */}
                      <div className="pt-2.5 border-t border-[#DBC7A6]/50 flex items-center justify-between text-[11px] text-[#173D3E]/60">
                        <span className="truncate max-w-[170px] text-[#075B60] font-medium">
                          {photo.serviceName[isArabic ? 'ar' : 'en']}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          <Heart className={`w-3 h-3 ${isLiked ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                          <span className="font-mono">{photo.likesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Carousel Slide Indicators */}
        {filteredPhotos.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {filteredPhotos.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentSlideIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === dotIdx
                    ? 'w-6 bg-[#075B60]'
                    : 'w-1.5 bg-[#DBC7A6] hover:bg-[#075B60]/50'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          FULL-SCREEN LIGHTBOX MODAL
          ========================================================================= */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-[#173D3E]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-4xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] animate-fadeIn text-right rtl:text-right ltr:text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 rounded-full bg-white/90 text-[#173D3E] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Large Image with aspect containment */}
            <div className="md:w-3/5 bg-black/90 flex items-center justify-center relative overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption[isArabic ? 'ar' : 'en']}
                className="max-h-[55vh] md:max-h-[85vh] w-full object-contain"
              />
            </div>

            {/* Right: Metadata, Story, and Actions */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Author Badge */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#075B60] text-white flex items-center justify-center font-bold text-sm">
                    {lightboxPhoto.authorName[isArabic ? 'ar' : 'en'].charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#173D3E]">
                      {lightboxPhoto.authorName[isArabic ? 'ar' : 'en']}
                    </h4>
                    <span className="text-[11px] text-[#075B60]">
                      {getTierBadgeStyle(lightboxPhoto.authorTier).label} · {lightboxPhoto.date[isArabic ? 'ar' : 'en']}
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 rounded-2xl bg-white border border-[#DBC7A6]/70 mb-5 shadow-2xs">
                  <p className="text-xs sm:text-sm text-[#173D3E] leading-relaxed">
                    {lightboxPhoto.caption[isArabic ? 'ar' : 'en']}
                  </p>
                </div>

                {/* Ritual Tag */}
                <div className="mb-4">
                  <span className="text-[11px] text-[#173D3E]/60 block mb-1">
                    {isArabic ? 'الطقس المعتمد للزيارة:' : 'Verified Sanctuary Ritual:'}
                  </span>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#075B60]/5 border border-[#075B60]/20 text-xs font-medium text-[#075B60]">
                    <Droplets className="w-3.5 h-3.5 shrink-0" />
                    <span>{lightboxPhoto.serviceName[isArabic ? 'ar' : 'en']}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DBC7A6]/60 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleToggleLike(lightboxPhoto.id)}
                  className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    likedPhotoIds[lightboxPhoto.id]
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white hover:bg-[#F7E5C8] text-[#173D3E] border-[#DBC7A6]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPhotoIds[lightboxPhoto.id] ? 'fill-current text-red-500' : 'text-slate-400'
                    }`}
                  />
                  <span>
                    {lightboxPhoto.likesCount} {isArabic ? 'إعجاب' : 'Likes'}
                  </span>
                </button>

                {lightboxPhoto.serviceId && (
                  <button
                    onClick={() => {
                      setLightboxPhoto(null);
                      if (lightboxPhoto.serviceId) onRebook(lightboxPhoto.serviceId);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isArabic ? 'احجزي هذا الطقس' : 'Book Ritual'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SHARE YOUR VISIT GLOW SUBMISSION MODAL
          ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#173D3E]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right rtl:text-right ltr:text-left max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#173D3E]/60 hover:text-[#173D3E] p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-[#075B60]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'مشاركة تجربة وزيارة جديدة' : 'Share Your Visit Moment'}
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#173D3E] mb-1">
              {isArabic ? 'شاركي إشراقتكِ وصوركِ مع عضوات فنة' : 'Share Your Transformation & Photos'}
            </h3>
            <p className="text-xs text-[#173D3E]/75 mb-6">
              {isArabic
                ? 'يسعدنا توثيق رحلتكِ مع طقوس الجمال المغربي الأصيل، ونشر صوركِ وتجربتكِ في ألبوم الزيارات.'
                : 'Share your authentic visit memory, botanical transformation, or lounge snapshot to inspire fellow Finah sanctuary guests.'}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmitMoment} className="space-y-4 text-xs sm:text-sm">
              {/* Member Name */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                  {isArabic ? 'اسمكِ الكريم:' : 'Your Name / Member Alias:'}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              {/* Ritual Visited */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                    {isArabic ? 'الطقس الذي استمتعتِ به:' : 'Ritual Experienced:'}
                  </label>
                  <select
                    value={formServiceId}
                    onChange={e => {
                      setFormServiceId(e.target.value);
                      const srv = allServices.find(s => s.id === e.target.value);
                      if (srv?.categoryId) {
                        setFormCategory((srv.categoryId === 'bridal' ? 'bridal' : srv.categoryId === 'hair' ? 'hair' : srv.categoryId === 'facial' ? 'facial' : 'hammam') as any);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  >
                    {allServices.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name[isArabic ? 'ar' : 'en']}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                    {isArabic ? 'الخبيـرة المعالجة:' : 'Specialist:'}
                  </label>
                  <select
                    value={formSpecialist}
                    onChange={e => setFormSpecialist(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  >
                    <option value="كنزة الفاسي">كنزة الفاسي (Kenza Al-Fassi)</option>
                    <option value="فاطمة المرابط">فاطمة المرابط (Fatima Al-Morabit)</option>
                    <option value="أمينة التازي">أمينة التازي (Amina Al-Tazi)</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                  {isArabic ? 'تصنيف الصورة:' : 'Photo Category:'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'hammam', label: isArabic ? 'الحمام' : 'Hammam' },
                    { id: 'hair', label: isArabic ? 'الشعر' : 'Hair' },
                    { id: 'facial', label: isArabic ? 'الوجه' : 'Facial' },
                    { id: 'bridal', label: isArabic ? 'العروس' : 'Bridal' },
                    { id: 'majlis', label: isArabic ? 'الردهة' : 'Majlis' }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormCategory(cat.id as any)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-medium border cursor-pointer ${
                        formCategory === cat.id
                          ? 'bg-[#075B60] text-white border-[#075B60]'
                          : 'bg-white hover:bg-[#F7E5C8] text-[#173D3E] border-[#DBC7A6]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Selector presets */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                  {isArabic ? 'اختاري صورة من لقطات البوتيك أو أدخلي رابط صورتكِ:' : 'Select Photo Preset or Paste Custom URL:'}
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormPhotoUrl(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${
                        formPhotoUrl === preset.url
                          ? 'border-[#075B60] ring-2 ring-[#075B60]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formPhotoUrl}
                  onChange={e => setFormPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                  {isArabic ? 'وصف الصورة أو انطباع الزيارة:' : 'Photo Caption & Memory:'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formCaption}
                  onChange={e => setFormCaption(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال: رائحة الورد والسكينة في جناحي الخاص كانت فوق الوصف...'
                      : 'e.g. Unwinding with fresh Damask rose mist and gentle candlelight...'
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              {/* Transformation Notes (Optional) */}
              <div className="pt-2 border-t border-[#DBC7A6]/60 space-y-3">
                <span className="text-xs font-semibold text-[#075B60] block">
                  {isArabic ? 'قصة التحول (اختياري للإبراز في نجمات الشهر):' : 'Transformation Story (Optional for Featured Spotlight):'}
                </span>
                <div>
                  <label className="block text-[11px] text-[#173D3E]/70 mb-1">
                    {isArabic ? 'كيف كانت بشرتكِ أو شعركِ قبل الجلسة؟' : 'Before state & concerns:'}
                  </label>
                  <input
                    type="text"
                    value={formBeforeStory}
                    onChange={e => setFormBeforeStory(e.target.value)}
                    placeholder={isArabic ? 'مثال: جفاف وشحوب من المكيفات...' : 'e.g. Dryness from travel and desert air...'}
                    className="w-full px-3 py-2 bg-white border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#173D3E]/70 mb-1">
                    {isArabic ? 'ما هي النتيجة والإشراقة التي شعرتِ بها بعد الزيارة؟' : 'Outcome & radiance achieved:'}
                  </label>
                  <input
                    type="text"
                    value={formOutcomeStory}
                    onChange={e => setFormOutcomeStory(e.target.value)}
                    placeholder={isArabic ? 'مثال: نعومة حريرية وتورد ممتلئ استمر لأيام...' : 'e.g. Deep hydration, silk texture, rested calm...'}
                    className="w-full px-3 py-2 bg-white border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer text-xs text-[#173D3E]/80">
                <input
                  type="checkbox"
                  checked={formConsent}
                  onChange={e => setFormConsent(e.target.checked)}
                  className="w-4 h-4 text-[#075B60] rounded border-gray-300 focus:ring-[#075B60] mt-0.5"
                />
                <span>
                  {isArabic
                    ? 'أوافق على مشاركة هذه الصورة وتجربتي في ألبوم ضيفات فنة لإلهام العضوات الأخريات.'
                    : 'I consent to publish my visit moment in the Finah Member Spotlight and Guest Moments gallery.'}
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DBC7A6] text-[#173D3E] hover:bg-black/5 text-xs font-semibold cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formConsent}
                  className="px-5 py-2.5 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? (isArabic ? 'جاري الحفظ...' : 'Publishing...')
                    : (isArabic ? 'نشر اللحظة في الألبوم ✦' : 'Publish Moment ✦')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
