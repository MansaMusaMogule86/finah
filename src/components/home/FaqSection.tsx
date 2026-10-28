import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { t, isArabic } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: isArabic ? 'ما الذي أحتاج لإحضاره معي لجلسة الحمام المغربي؟' : 'What do I need to bring for my Moroccan hammam?',
      a: isArabic
        ? 'نوفر لكِ في فنة كل ما تحتاجينه: رداء حمام قطني فاخر، منشفة معقمة، شبشب خاص، وكيس مغربي فردي معقم خاص بكِ يُستخدم لمرة واحدة فقط. لا يلزمك إحضار أي مستلزمات.'
        : 'Finah provides everything you need: a plush cotton robe, sanitized towels, spa slippers, and your own personal, single-use sterilized Moroccan kessa glove. You do not need to bring anything.'
    },
    {
      q: isArabic ? 'كم من الوقت قبل الموعد يفضل أن أحضر؟' : 'How early should I arrive before my appointment?',
      a: isArabic
        ? 'ننصح بالوصول قبل 15 دقيقة من موعد جلستك. يتيح لكِ ذلك الاسترخاء في ردهة الاستقبال، وتناول الشاي المغربي، وإجراء استشارة مريحة مع الأخصائية دون استعجال.'
        : 'We recommend arriving 15 minutes prior to your session. This allows you to settle into the lounge, enjoy herbal tea, and complete your pre-ritual consultation without haste.'
    },
    {
      q: isArabic ? 'هل يمكنني تعديل أو إلغاء موعدي؟' : 'What is your rescheduling and cancellation policy?',
      a: isArabic
        ? 'نعم، يمكنك إلغاء أو إعادة جدولة موعدك ذاتياً بكل سهولة عبر صفحة "حجوزاتي" قبل 24 ساعة على الأقل من وقت الموعد المحدد دون أي رسوم.'
        : 'Yes, appointments may be rescheduled or cancelled self-service via the "My Bookings" page up to 24 hours prior to your scheduled time without fee.'
    },
    {
      q: isArabic ? 'هل تناسب جلسات الحمام الحوامل؟' : 'Are hammam sessions suitable during pregnancy?',
      a: isArabic
        ? 'حرصاً على سلامتك وسلامة جنينك، لا ننصح بجلسات البخار الساخن والحمام التقليدي خلال فترة الحمل. بدلاً من ذلك، نوفر تدليكاً لطيفاً وعناية مخصصة للوجه والشعر بإشراف أخصائياتنا.'
        : 'For maternal and fetal wellness, hot steam hammam sessions are not advised during pregnancy. We instead offer delicate maternity-safe facial care, botanical hair nourishment, and gentle restorative treatments.'
    },
    {
      q: isArabic ? 'هل يمكنني حجز أكثر من خدمة في زيارة واحدة؟' : 'Can I combine multiple rituals into a single visit?',
      a: isArabic
        ? 'بكل تأكيد. يمكنك استخدام ميزة "صممي زيارتك" لدمج الحمام مع تدليك الأركان أو عناية الوجه والشعر، ويقوم النظام باحتساب فترات الانتقال والراحة تلقائياً.'
        : 'Absolutely. Use our "Design My Visit" feature to harmoniously sequence a hammam with an argan massage or facial care, with automatic transition buffers included.'
    }
  ];

  return (
    <section className="py-20 bg-[#FFF7EA] border-b border-[#DBC7A6]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {t('nav.faq')}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight mb-3">
            {isArabic ? 'الأسئلة الشائعة حول الزيارة' : 'Practical Questions & Etiquette'}
          </h2>
          <p className="text-sm text-[#173D3E]/75">
            {isArabic
              ? 'إجابات واضحة تساعدك على التخطيط لزيارتك براحة واطمئنان.'
              : 'Helpful guidance to prepare for a serene sanctuary experience.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#DBC7A6] rounded-xl bg-[#F7E5C8]/30 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-right rtl:text-right ltr:text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7E5C8]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base font-medium text-[#173D3E]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#075B60] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#173D3E]/80 leading-relaxed border-t border-[#DBC7A6]/40 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
