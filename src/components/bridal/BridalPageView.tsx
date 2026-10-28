import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { Crown, Sparkles, Check, Calendar, HeartHandshake, ShieldCheck } from 'lucide-react';

interface BridalPageViewProps {
  onOpenInquiry: () => void;
}

export const BridalPageView: React.FC<BridalPageViewProps> = ({ onOpenInquiry }) => {
  const { t, isArabic } = useLanguage();
  const bridalService = finahStore.getServices().find(s => s.categoryId === 'bridal');

  return (
    <section className="py-16 bg-[#FFF7EA] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-12 text-right rtl:text-right ltr:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {t('bridal.title')}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-4">
            {t('bridal.tagline')}
          </h1>
          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed">
            {isArabic
              ? 'رحلة عناية ملكية متوارثة تستحضر بهجة وتقاليد الأعراس المغربية، تمنح العروس نقاءً، توريداً طبيعياً بالعكر الفاسي، ونعومة استثنائية في جناح خاص بالكامل.'
              : 'An ancestral ceremonial royal journey honoring the Moroccan wedding tradition. Envelops the bride in deep purity, botanical Aker Fassi petal glow, and complete private sanctuary rest.'}
          </p>
        </div>

        {/* Featured Bridal Package Card */}
        {bridalService && (
          <div className="p-8 sm:p-12 bg-gradient-to-br from-[#F7E5C8]/70 via-[#FFF7EA] to-[#F1C17F]/30 border border-[#DBC7A6] rounded-3xl shadow-xs mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 text-right rtl:text-right ltr:text-left">
                <div className="flex items-center gap-3 text-xs text-[#075B60] font-medium mb-3">
                  <span className="font-serif font-bold text-base">
                    {bridalService.priceAed} {t('booking.aed')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{bridalService.durationMinutes} {t('booking.minutes')}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#173D3E] mb-4">
                  {isArabic ? bridalService.name.ar : bridalService.name.en}
                </h2>

                <p className="text-xs sm:text-sm text-[#173D3E]/85 leading-relaxed mb-6">
                  {isArabic ? bridalService.description.ar : bridalService.description.en}
                </p>

                <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl mb-6">
                  <h4 className="font-serif text-sm font-semibold text-[#075B60] mb-2.5">
                    {isArabic ? 'تفاصيل باقة العروس المتكاملة:' : 'Complete Bridal Inclusions:'}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#173D3E]/80">
                    {(isArabic ? bridalService.inclusions.ar : bridalService.inclusions.en).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={onOpenInquiry}
                    className="px-7 py-3 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>{t('bridal.inquire_cta')}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm p-3 bg-[#FFF7EA] border border-[#DBC7A6] rounded-t-[10rem] rounded-b-xl">
                  <EditorialMediaPlaceholder
                    aspectRatio="3:4"
                    title={isArabic ? 'طقوس العروس الملكية' : 'Moroccan Royal Bridal Ritual'}
                    category="bridal"
                    className="rounded-t-[9.5rem] rounded-b-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transparent Distinction Notice as required by rule 14 */}
        <div className="p-6 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl text-center max-w-2xl mx-auto">
          <p className="text-xs text-[#075B60] font-semibold mb-1">
            {isArabic ? 'كيف يتم تنسيق موعد العروس في فنة؟' : 'How Bridal Scheduling Works at Finah'}
          </p>
          <p className="text-xs text-[#173D3E]/75 leading-relaxed">
            {isArabic
              ? 'نظراً لأن طقوس العروس تمتد لعدة ساعات وتتطلب تجهيزاً مسبقاً للجناح والزيوت الملكية، فإن إرسال الطلب يُسجل كـ "استشارة مخصصة". تقوم مديرة المركز بالتواصل معكِ هاتفياً لتثبيت الموعد النهائي بما يتناغم بدقة مع جدول زفافك.'
              : 'Because our bridal rituals span multiple hours with tailored suite preparation, requests are registered as a "Bespoke Consultation". Our sanctuary director confirms the final schedule directly with you to align smoothly with your wedding timeline.'}
          </p>
        </div>
      </div>
    </section>
  );
};
