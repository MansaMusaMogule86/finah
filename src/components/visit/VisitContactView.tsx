import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { MapPin, Clock, Phone, Mail, Instagram, MessageCircle, AlertCircle, Calendar } from 'lucide-react';

interface VisitContactViewProps {
  onOpenBooking: () => void;
}

export const VisitContactView: React.FC<VisitContactViewProps> = ({ onOpenBooking }) => {
  const { t, isArabic } = useLanguage();
  const config = finahStore.getConfig();

  return (
    <section className="py-16 bg-[#FFF7EA] min-h-[75vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <RosetteEmblem size={18} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {t('nav.visit')}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-3">
            {isArabic ? 'الموقع، أوقات الزيارة، والتواصل' : 'Location, Sanctuary Hours & Contact'}
          </h1>
          <p className="text-sm text-[#173D3E]/80">
            {isArabic
              ? 'ملاذ مغربي أنثوي هادئ في دبي، مصمم لراحتكِ وخصوصيتكِ التامة.'
              : 'An intimate Moroccan beauty house in Dubai, tailored for serene feminine privacy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* Card 1: Visit Details */}
          <div className="p-8 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            <h3 className="font-serif text-2xl font-medium text-[#173D3E] pb-3 border-b border-[#DBC7A6]">
              {isArabic ? 'معلومات الزيارة والحضور' : 'Visit & Appointment Hours'}
            </h3>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'أوقات العمل اليومية:' : 'Daily Operating Hours:'}
                </p>
                <p className="text-xs text-[#173D3E]/80 mt-0.5">
                  {isArabic
                    ? 'يومياً: من 10:00 صباحاً حتى 9:00 مساءً (بتوقيت دبي)'
                    : 'Daily: 10:00 AM – 9:00 PM GST (Dubai Time)'}
                </p>
                <p className="text-[11px] text-[#075B60] mt-1">
                  {isArabic ? 'نوصي بالوصول قبل 15 دقيقة من موعدك المجدول.' : 'We recommend arriving 15 minutes prior to your slot.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'الموقع في دبي:' : 'Location in Dubai:'}
                </p>
                <p className="text-xs text-[#173D3E]/80 mt-0.5">
                  {isArabic ? config.address.ar : config.address.en}
                </p>
                <div className="mt-2 p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-[11px] text-[#173D3E]/70 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#075B60] shrink-0" />
                  <span>
                    {isArabic
                      ? 'العنوان التفصيلي للمركز وخريطة الوصول قيد الاعتماد الرسمي النهائي من المالك.'
                      : 'Exact boutique location and road map pin pending final owner configuration.'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('hero.cta.book')}</span>
            </button>
          </div>

          {/* Card 2: Contact Channels */}
          <div className="p-8 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            <h3 className="font-serif text-2xl font-medium text-[#173D3E] pb-3 border-b border-[#DBC7A6]">
              {isArabic ? 'قنوات التواصل المباشر' : 'Direct Concierge Channels'}
            </h3>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'محادثة واتساب المباشرة:' : 'Direct WhatsApp Concierge:'}
                </p>
                <a
                  href={config.whatsapp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#075B60] hover:underline font-mono mt-0.5 inline-block"
                  dir="ltr"
                >
                  {config.whatsapp.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'الهاتف الرئيسي للمركز:' : 'Main Telephone Line:'}
                </p>
                <a
                  href={`tel:${config.phone.raw}`}
                  className="text-xs text-[#075B60] hover:underline font-mono mt-0.5 inline-block"
                  dir="ltr"
                >
                  {config.phone.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Instagram className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'إنستغرام فنة الرسمي:' : 'Official Instagram:'}
                </p>
                <a
                  href={config.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#075B60] hover:underline font-mono mt-0.5 inline-block"
                >
                  {config.instagram.handle}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#173D3E]">
                  {isArabic ? 'البريد الإلكتروني:' : 'Email Inquiries:'}
                </p>
                <span className="text-xs text-[#173D3E]/80 font-mono mt-0.5 inline-block">
                  {config.email.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Notice Box - Strictly no fake map embed as ordered in rule 19 */}
        <div className="p-8 bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl text-center">
          <RosetteEmblem size={28} color="#075B60" className="mx-auto mb-3" />
          <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-2">
            {isArabic ? 'خريطة الوصول التفاعلية' : 'Interactive Map Access'}
          </h4>
          <p className="text-xs sm:text-sm text-[#173D3E]/75 max-w-lg mx-auto leading-relaxed">
            {isArabic
              ? 'احتراماً لمعايير الدقة والشفافية، يتم تفعيل الخريطة التفاعلية فور اعتماد الإحداثيات الجغرافية النهائية لمركز فنة في دبي. يمكنكِ التواصل معنا عبر واتساب لتزويدكِ بتفاصيل الوصول خطوة بخطوة.'
              : 'In accordance with our accuracy standards, the live map embed is scheduled to activate once exact GPS coordinates are signed off by salon management in Dubai. Contact our concierge via WhatsApp for step-by-step driving directions.'}
          </p>
        </div>
      </div>
    </section>
  );
};
