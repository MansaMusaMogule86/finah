import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CURATED_WELLNESS_TIPS, WellnessTip } from '../../data/wellnessTips';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  Droplets,
  Heart,
  Flame,
  Moon,
  Sun,
  Leaf,
  Feather,
  RotateCw,
  Bookmark,
  BookmarkCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface DailyWellnessTipProps {
  customerName?: string;
  customerPhone?: string;
  customerTier?: string;
  upcomingServiceCategory?: string;
  onRebookService?: (serviceId: string) => void;
}

export const DailyWellnessTip: React.FC<DailyWellnessTipProps> = ({
  customerName,
  customerPhone,
  customerTier,
  upcomingServiceCategory,
  onRebookService
}) => {
  const { isArabic } = useLanguage();

  // Compute a deterministic "Daily Tip" based on today's date + phone hash
  const getDailyTipIndex = (): number => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    const seed = dateKey + (customerPhone || 'finah-default');
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % CURATED_WELLNESS_TIPS.length;
  };

  const [currentTipIndex, setCurrentTipIndex] = useState<number>(getDailyTipIndex);
  const [isRotating, setIsRotating] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Saved Tips in localStorage
  const [savedTipIds, setSavedTipIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finah_saved_wellness_tips');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing saved tips', e);
        }
      }
    }
    return [];
  });

  // Re-sync initial tip when phone changes
  useEffect(() => {
    setCurrentTipIndex(getDailyTipIndex());
  }, [customerPhone]);

  const currentTip = CURATED_WELLNESS_TIPS[currentTipIndex] || CURATED_WELLNESS_TIPS[0];
  const isSaved = savedTipIds.includes(currentTip.id);

  // Randomize to a new tip
  const handleShuffleTip = () => {
    setIsRotating(true);
    let nextIndex = Math.floor(Math.random() * CURATED_WELLNESS_TIPS.length);
    if (nextIndex === currentTipIndex && CURATED_WELLNESS_TIPS.length > 1) {
      nextIndex = (nextIndex + 1) % CURATED_WELLNESS_TIPS.length;
    }
    setTimeout(() => {
      setCurrentTipIndex(nextIndex);
      setIsRotating(false);
    }, 250);
  };

  // Toggle bookmark/saved tip
  const handleToggleSave = () => {
    let updated: string[];
    if (isSaved) {
      updated = savedTipIds.filter(id => id !== currentTip.id);
    } else {
      updated = [...savedTipIds, currentTip.id];
    }
    setSavedTipIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('finah_saved_wellness_tips', JSON.stringify(updated));
    }
  };

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = customerName ? customerName.split(' ')[0] : (isArabic ? 'ضيفتنا الكريمة' : 'Honored Guest');
    if (hour < 12) {
      return isArabic ? `صباح النور والسكينة يا ${name}` : `Good morning & peace, ${name}`;
    } else if (hour < 18) {
      return isArabic ? `مساء الورد والصفاء يا ${name}` : `Good afternoon & stillness, ${name}`;
    } else {
      return isArabic ? `مساء السكينة وراحة البال يا ${name}` : `Good evening & calm, ${name}`;
    }
  };

  const renderTipIcon = (iconName: WellnessTip['iconName']) => {
    const props = { className: 'w-4 h-4 text-[#075B60]' };
    switch (iconName) {
      case 'Droplets':
        return <Droplets {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Moon':
        return <Moon {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Leaf':
        return <Leaf {...props} />;
      case 'Feather':
        return <Feather {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const savedTipsList = CURATED_WELLNESS_TIPS.filter(t => savedTipIds.includes(t.id));

  return (
    <div className="relative mb-8 rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-[#FFF7EA] via-[#F7E5C8]/45 to-[#FFF7EA] border border-[#DBC7A6] shadow-xs overflow-hidden text-right rtl:text-right ltr:text-left transition-all">
      {/* Delicate Rosette Architectural Watermark */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
        <RosetteEmblem size={250} color="#075B60" />
      </div>

      {/* Top Banner: Greeting, Category & Action Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#DBC7A6]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#DBC7A6] flex items-center justify-center shrink-0 shadow-2xs">
            {renderTipIcon(currentTip.iconName)}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#075B60] block leading-tight">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-[#173D3E]/60 mt-0.5">
              <span>{isArabic ? 'إشراقة السكينة اليومية' : 'Daily Moroccan Wellness Tip'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#173D3E]">{currentTip.categoryLabel[isArabic ? 'ar' : 'en']}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Randomize / Save / Saved Counter */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {savedTipIds.length > 0 && (
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                showSavedOnly
                  ? 'bg-[#075B60] text-white border-[#075B60]'
                  : 'bg-white hover:bg-[#F7E5C8] text-[#173D3E] border-[#DBC7A6]'
              }`}
            >
              {isArabic
                ? `نصائحي المحفوظة (${savedTipIds.length})`
                : `Saved Tips (${savedTipIds.length})`}
            </button>
          )}

          <button
            onClick={handleToggleSave}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-[#F7E5C8] text-[#173D3E] border-[#DBC7A6]'
            }`}
            title={isSaved ? (isArabic ? 'محفوظة في مفضلتي' : 'Saved in favorites') : (isArabic ? 'حفظ النصيحة' : 'Save tip')}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-700" />
            ) : (
              <Bookmark className="w-4 h-4 text-[#173D3E]/60" />
            )}
          </button>

          <button
            onClick={handleShuffleTip}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF7EA] text-[#075B60] border border-[#DBC7A6] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            title={isArabic ? 'استكشاف نصيحة أخرى عشوائياً' : 'Fetch another randomized tip'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isArabic ? 'نصيحة أخرى ✦' : 'New Tip ✦'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!showSavedOnly ? (
        <div
          className={`relative z-10 transition-opacity duration-300 ${
            isRotating ? 'opacity-30' : 'opacity-100'
          }`}
        >
          {/* Tip Title & Body */}
          <div className="space-y-2 mb-4">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#173D3E] leading-snug">
              {currentTip.title[isArabic ? 'ar' : 'en']}
            </h3>
            <p className="text-xs sm:text-sm text-[#173D3E]/85 leading-relaxed">
              {currentTip.advice[isArabic ? 'ar' : 'en']}
            </p>
          </div>

          {/* Sanctuary Secret Box + Recommended Ritual CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#DBC7A6]/40 text-xs">
            <div className="flex items-start gap-2 text-[#075B60] bg-white/70 p-2.5 rounded-xl border border-[#DBC7A6]/60 flex-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C17F] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold block text-[11px] text-[#075B60]">
                  {isArabic ? 'سر خبيرات فنة:' : 'Finah Sanctuary Secret:'}
                </span>
                <span className="text-[#173D3E]/80 text-[11px]">
                  {currentTip.sanctuarySecret[isArabic ? 'ar' : 'en']}
                </span>
              </div>
            </div>

            {/* Book Related Service CTA if configured */}
            {currentTip.recommendedServiceId && onRebookService && (
              <button
                onClick={() => onRebookService(currentTip.recommendedServiceId!)}
                className="px-3.5 py-2 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <span>{isArabic ? 'احجزي هذا الطقس في المركز' : 'Experience at Finah'}</span>
                {isArabic ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Saved Tips Drawer List */
        <div className="relative z-10 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-[#075B60]">
              {isArabic ? 'نصائحكِ المحفوظة للرجوع إليها:' : 'Your Bookmarked Wellness Tips:'}
            </span>
            <button
              onClick={() => setShowSavedOnly(false)}
              className="text-xs text-[#075B60] hover:underline cursor-pointer"
            >
              {isArabic ? 'العودة لنصيحة اليوم' : 'Back to Daily Tip'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {savedTipsList.map(tip => (
              <div
                key={tip.id}
                onClick={() => {
                  const idx = CURATED_WELLNESS_TIPS.findIndex(t => t.id === tip.id);
                  if (idx !== -1) setCurrentTipIndex(idx);
                  setShowSavedOnly(false);
                }}
                className="p-3 bg-white rounded-xl border border-[#DBC7A6] hover:border-[#075B60] transition-colors cursor-pointer shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#075B60] font-semibold mb-1">
                    <span>{tip.categoryLabel[isArabic ? 'ar' : 'en']}</span>
                    <span>✦</span>
                  </div>
                  <h4 className="font-serif text-sm font-medium text-[#173D3E] mb-1 leading-snug">
                    {tip.title[isArabic ? 'ar' : 'en']}
                  </h4>
                  <p className="text-[11px] text-[#173D3E]/75 line-clamp-2 leading-relaxed">
                    {tip.advice[isArabic ? 'ar' : 'en']}
                  </p>
                </div>
                <span className="text-[10px] text-[#075B60] font-medium mt-2 block">
                  {isArabic ? 'انقري للقراءة الكاملة ←' : 'Click to view full advice →'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
