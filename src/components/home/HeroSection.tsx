import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { Sparkles, Calendar, ChevronDown, Compass } from 'lucide-react';

interface HeroSectionProps {
  onExploreServices: () => void;
  onBookVisit: () => void;
  onFindRitual: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreServices,
  onBookVisit,
  onFindRitual
}) => {
  const { t, isArabic } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#FFF7EA] pt-10 sm:pt-14 pb-16 lg:pt-16 lg:pb-24 border-b border-[#DBC7A6]/50">
      {/* Subtle Moroccan geometric background hint */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none transform translate-x-20 -translate-y-20">
        <RosetteEmblem size={380} color="#075B60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content Column (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right rtl:text-right ltr:text-left">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-[#075B60]/80">
              <RosetteEmblem size={16} color="#075B60" />
              <span>{t('hero.tagline')}</span>
              <span aria-hidden="true">·</span>
              <span>دبي / Dubai</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#173D3E] tracking-tight leading-[1.18] mb-6 text-balance">
              {t('hero.headline')}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#173D3E]/85 leading-relaxed max-w-2xl mb-8">
              {t('hero.subtext')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 text-sm font-medium text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>{t('hero.cta.services')}</span>
              </button>

              <button
                onClick={onBookVisit}
                className="px-6 py-3.5 text-sm font-medium text-[#075B60] bg-[#F7E5C8] hover:bg-[#ebd5b3] border border-[#DBC7A6] rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#075B60]" />
                <span>{t('hero.cta.book')}</span>
              </button>

              <button
                onClick={onFindRitual}
                className="px-4 py-3.5 text-sm text-[#075B60] hover:text-[#173D3E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#075B60]" />
                <span className="underline underline-offset-4 font-medium">{t('nav.find_ritual')}</span>
              </button>
            </div>

            {/* Quiet Trust & Botanical Indicators */}
            <div className="mt-10 pt-6 border-t border-[#DBC7A6]/50 flex flex-wrap items-center gap-6 text-xs text-[#173D3E]/75">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#075B60]" />
                <span>{isArabic ? 'صابون بلدي وأعشاب مغربية نقية' : 'Authentic black soap & Atlas herbs'}</span>
              </div>
              <span aria-hidden="true" className="text-[#DBC7A6]">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#075B60]" />
                <span>{isArabic ? 'أجنحة حمام بخصوصية تامة' : 'Private individual hammam suites'}</span>
              </div>
              <span aria-hidden="true" className="text-[#DBC7A6]">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#075B60]" />
                <span>{isArabic ? 'حجز مرن وشفاف' : 'Transparent, calm booking'}</span>
              </div>
            </div>
          </div>

          {/* Media Column (5 cols on desktop) - Restrained Moroccan Arch Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Arch Border */}
              <div className="relative p-2.5 rounded-t-[14rem] rounded-b-xl border border-[#DBC7A6] bg-[#F7E5C8]/40 shadow-sm">
                <div className="overflow-hidden rounded-t-[13.5rem] rounded-b-lg aspect-[3/4] bg-[#F7E5C8]">
                  <EditorialMediaPlaceholder
                    aspectRatio="3:4"
                    title={isArabic ? 'الحمام المغربي الملكي' : 'Royal Moroccan Hammam'}
                    category="hammam"
                    className="w-full h-full rounded-t-[13.5rem] rounded-b-lg"
                  />
                </div>

                {/* Quiet Floating Sanctuary Card */}
                <div className="absolute -bottom-5 inset-x-8 p-3.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7E5C8] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#075B60]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#075B60]">
                        {isArabic ? 'طقس فنة المميز' : 'Finah Signature Ritual'}
                      </p>
                      <p className="text-[11px] text-[#173D3E]/70">
                        {isArabic ? 'حمام ملكي بالعنبر والورد' : 'Royal Amber & Rose Bath'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-serif text-[#075B60] font-medium">90 {t('booking.minutes')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
