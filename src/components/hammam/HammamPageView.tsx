import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { Sparkles, Clock, Check, Calendar, ArrowRight, ArrowLeft, Droplets, ShieldCheck } from 'lucide-react';

interface HammamPageViewProps {
  onBookService: (service: Service) => void;
  onOpenDetails: (service: Service) => void;
}

export const HammamPageView: React.FC<HammamPageViewProps> = ({
  onBookService,
  onOpenDetails
}) => {
  const { t, isArabic } = useLanguage();
  const hammamServices = finahStore.getServices().filter(s => s.categoryId === 'hammam');

  return (
    <section className="py-16 bg-[#FFF7EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Hero */}
        <div className="max-w-3xl mb-14 text-right rtl:text-right ltr:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <RosetteEmblem size={18} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'طقوس الحمام المغربي الأصيل' : 'Ancestral Moroccan Hammam'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-4">
            {isArabic ? 'نقاء، تجدد، وعراقة الأجداد في دبي' : 'Purification, Renewal & Moroccan Heritage'}
          </h1>
          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed max-w-2xl">
            {isArabic
              ? 'الحمام المغربي في فنة ليس مجرد عناية عابرة، بل طقس استرخائي مهدئ للحواس يعيد لبشرتك حيويتها ونعومتها الحريرية باستخدام أنقى المكونات المغربية الطبيعية.'
              : 'The Moroccan hammam at Finah is a sensory sanctuary journey designed to awaken sluggish circulation, clear deep impurities, and envelop the skin in velvety softness.'}
          </p>
        </div>

        {/* Hammam Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {hammamServices.map(service => (
            <div
              key={service.id}
              className="p-8 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl flex flex-col justify-between hover:border-[#075B60]/50 transition-colors text-right rtl:text-right ltr:text-left"
            >
              <div>
                <div className="mb-6 overflow-hidden rounded-xl bg-[#FFF7EA]">
                  <EditorialMediaPlaceholder
                    aspectRatio="16:9"
                    title={isArabic ? service.name.ar : service.name.en}
                    category="hammam"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#075B60] font-medium mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes} {t('booking.minutes')}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-serif font-bold text-sm">
                    {service.priceAed} {t('booking.aed')}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#173D3E] mb-3">
                  {isArabic ? service.name.ar : service.name.en}
                </h3>

                <p className="text-xs sm:text-sm text-[#173D3E]/80 leading-relaxed mb-6">
                  {isArabic ? service.description.ar : service.description.en}
                </p>

                {/* Inclusions */}
                <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6]/60 rounded-xl mb-6">
                  <p className="text-xs font-semibold text-[#075B60] mb-2">
                    {isArabic ? 'تشمل الجلسة:' : 'Included:'}
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-[#173D3E]/80">
                    {(isArabic ? service.inclusions.ar : service.inclusions.en).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DBC7A6]/50 flex items-center justify-between gap-3">
                <button
                  onClick={() => onOpenDetails(service)}
                  className="text-xs text-[#075B60] hover:underline font-medium cursor-pointer"
                >
                  {isArabic ? 'المزيد من التفاصيل' : 'Read Full Details'}
                </button>

                <button
                  onClick={() => onBookService(service)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('hero.cta.book')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hammam Etiquette & Tips */}
        <div className="p-8 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-2xl">
          <h3 className="font-serif text-xl font-medium text-[#173D3E] mb-4 text-right rtl:text-right ltr:text-left">
            {isArabic ? 'إرشادات الاستعداد لجلسة الحمام المغربي' : 'Moroccan Hammam Preparation Guidelines'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#173D3E]/80 leading-relaxed text-right rtl:text-right ltr:text-left">
            <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
              <p className="font-semibold text-sm text-[#075B60] mb-1">
                {isArabic ? '1. ترطيب الجسم وشرب الماء' : '1. Advance Hydration'}
              </p>
              <p>
                {isArabic
                  ? 'يُنصح بشرب كمية وافرة من الماء قبل الجلسة وبعدها لتعويض السوائل المفقودة في غرفة البخار.'
                  : 'Drink plenty of water before and after your ritual to maintain healthy hydration.'}
              </p>
            </div>

            <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
              <p className="font-semibold text-sm text-[#075B60] mb-1">
                {isArabic ? '2. تجنب الحلاقة أو الشمع' : '2. Avoid Shaving / Waxing'}
              </p>
              <p>
                {isArabic
                  ? 'يُرجى عدم إزالة الشعر بالشمع أو الحلاقة قبل الجلسة بـ 24 ساعة لتفادي أي تحسس أثناء فرك الكيس.'
                  : 'Refrain from shaving or waxing 24 hours prior to prevent micro-irritation during exfoliation.'}
              </p>
            </div>

            <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
              <p className="font-semibold text-sm text-[#075B60] mb-1">
                {isArabic ? '3. الوصول المبكر' : '3. Serene Arrival'}
              </p>
              <p>
                {isArabic
                  ? 'وصولك قبل 15 دقيقة يمنحك وقتاً كافياً للاستراحة، وتناول شاي النعناع، والتحضير بروية تامة.'
                  : 'Arrive 15 minutes early to unwind in our lounge with Moroccan tea before your therapist guides you.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
