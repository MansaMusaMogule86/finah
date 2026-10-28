import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { Crown, Sparkles, HeartHandshake, CheckCircle } from 'lucide-react';

interface BridalFeatureProps {
  onOpenBridalInquiry: () => void;
}

export const BridalFeature: React.FC<BridalFeatureProps> = ({ onOpenBridalInquiry }) => {
  const { t, isArabic } = useLanguage();

  const bridalHighlights = [
    {
      title: isArabic ? 'حمام العروس الملكي الخاص' : 'Private Royal Bridal Hammam',
      desc: isArabic
        ? 'جلسة حصرية بجناح خاص مغلق، بالصابون الملكي وزيت الأركان لتقشير لطيف وتوحيد ملمس البشرة.'
        : 'Exclusive private suite hammam with royal argan paste and silk kessa for ultimate softness.'
    },
    {
      title: isArabic ? 'نضارة العكر الفاسي والغاسول الأبيض' : 'Aker Fassi & White Clay Radiance',
      desc: isArabic
        ? 'أقنعة تقليدية مغربية مستخلصة من شقائق النعمان وماء الورد تمنح البشرة توريداً ونضارة طبيعية.'
        : 'Ancestral Moroccan poppy extract and distilled rose petals giving a natural petal glow.'
    },
    {
      title: isArabic ? 'استشارة وجدولة مسبقة دقيقة' : 'Bespoke Advance Consultation',
      desc: isArabic
        ? 'ترتيب التوقيت المناسب قبل موعد الزفاف لتفادي أي إجهاد للبشرة ولضمان أعلى درجات الراحة.'
        : 'Carefully timed sanctuary schedule before the ceremony to guarantee calm and radiant skin.'
    }
  ];

  return (
    <section className="py-20 bg-[#FFF7EA] border-b border-[#DBC7A6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 bg-gradient-to-br from-[#F7E5C8]/70 via-[#FFF7EA] to-[#F1C17F]/30 border border-[#DBC7A6] rounded-3xl shadow-xs relative overflow-hidden">
          {/* Subtle Rosette Watermark */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-15 pointer-events-none transform translate-x-16 -translate-y-16">
            <RosetteEmblem size={320} color="#075B60" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Copy & Details */}
            <div className="lg:col-span-7 flex flex-col text-right rtl:text-right ltr:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-[#075B60]" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                  {t('bridal.title')}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-4">
                {t('bridal.tagline')}
              </h2>

              <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed mb-8 max-w-xl">
                {isArabic
                  ? 'طقس مغربي أصيل توارثته الأجيال للاحتفاء بالعروس في أجواء من الخصوصية والسكينة الملكية، يجمع بين طهارة الحمام ونضارة الورد وزيت الأركان النادر.'
                  : 'An authentic Moroccan ceremonial heritage celebrated for generations, honoring the bride in serene royal privacy with purifying steam, rosewater, and rare argan elixirs.'}
              </p>

              <div className="flex flex-col gap-4 mb-8">
                {bridalHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#075B60] shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#173D3E]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#173D3E]/75 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <button
                  onClick={onOpenBridalInquiry}
                  className="px-7 py-3.5 text-xs font-semibold tracking-wider text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>{t('bridal.inquire_cta')}</span>
                </button>
              </div>
            </div>

            {/* Media Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm p-3 bg-[#FFF7EA] border border-[#DBC7A6] rounded-t-[10rem] rounded-b-xl shadow-xs">
                <EditorialMediaPlaceholder
                  aspectRatio="3:4"
                  title={isArabic ? 'طقوس العروس الملكية' : 'Finah Royal Bridal Journey'}
                  category="bridal"
                  className="rounded-t-[9.5rem] rounded-b-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
