import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { Sparkles, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

interface HammamFeatureProps {
  onBookHammam: () => void;
  onExploreHammam: () => void;
}

export const HammamFeature: React.FC<HammamFeatureProps> = ({
  onBookHammam,
  onExploreHammam
}) => {
  const { t, isArabic } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('hammam.step1.title'),
      desc: t('hammam.step1.desc')
    },
    {
      num: '02',
      title: t('hammam.step2.title'),
      desc: t('hammam.step2.desc')
    },
    {
      num: '03',
      title: t('hammam.step3.title'),
      desc: t('hammam.step3.desc')
    },
    {
      num: '04',
      title: t('hammam.step4.title'),
      desc: t('hammam.step4.desc')
    }
  ];

  return (
    <section className="py-20 bg-[#F7E5C8]/40 border-b border-[#DBC7A6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Media & Visual Frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="p-3 bg-[#FFF7EA] border border-[#DBC7A6] rounded-t-[10rem] rounded-b-xl shadow-xs">
                <EditorialMediaPlaceholder
                  aspectRatio="4:3"
                  title={isArabic ? 'جلسة الحمام المغربي والأوكالبتوس' : 'Moroccan Eucalyptus Hammam Session'}
                  category="hammam"
                  className="rounded-t-[9.5rem] rounded-b-lg"
                />
              </div>

              {/* Bottom Quote Note */}
              <div className="mt-4 p-4 bg-[#FFF7EA] border border-[#DBC7A6]/70 rounded-lg text-xs text-[#173D3E]/80 leading-relaxed italic">
                {isArabic
                  ? '«الحمام المغربي ليس مجرد استحمام، بل تجدد حقيقي يزيل تراكمات التعب ويعيد للبشرة تنفسها ونعومتها الحريرية»'
                  : '“The Moroccan hammam is a ritual of rebirth, freeing the body of accumulated stress and allowing the skin to breathe anew.”'}
              </div>
            </div>
          </div>

          {/* Editorial Steps & Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 mb-3">
              <RosetteEmblem size={18} color="#075B60" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {t('hammam.badge')}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight mb-4">
              {t('hammam.title')}
            </h2>

            <p className="text-base text-[#173D3E]/80 leading-relaxed mb-8 max-w-xl">
              {t('hammam.description')}
            </p>

            {/* 4 Editorial Steps without pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {steps.map(s => (
                <div key={s.num} className="p-4 bg-[#FFF7EA] border border-[#DBC7A6]/70 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-serif text-sm font-semibold text-[#075B60]">
                      {s.num}.
                    </span>
                    <h4 className="text-sm font-semibold text-[#173D3E]">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#173D3E]/75 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onBookHammam}
                className="px-6 py-3 text-xs font-semibold tracking-wide text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('hero.cta.book')}</span>
              </button>

              <button
                onClick={onExploreHammam}
                className="px-5 py-3 text-xs font-semibold text-[#075B60] hover:bg-[#FFF7EA] border border-[#DBC7A6] rounded-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{isArabic ? 'تفاصيل طقس الحمام' : 'Hammam Ritual Details'}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
