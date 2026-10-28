import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Service } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { EditorialMediaPlaceholder } from '../common/EditorialMediaPlaceholder';
import { X, Clock, Check, Sparkles, AlertCircle, Calendar } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service;
  onClose: () => void;
  onBook: (service: Service) => void;
  onInquire: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
  onInquire
}) => {
  const { t, isArabic } = useLanguage();
  const hasApprovedPrice = service.priceAed !== null && service.pricingStatus === 'approved';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#DBC7A6] flex items-center justify-between bg-[#F7E5C8]/40">
          <div className="flex items-center gap-2">
            <RosetteEmblem size={18} color="#075B60" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#075B60]">
              {isArabic ? 'تفاصيل الطقس المعتمد' : 'Ritual Specifications'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#173D3E]/70 hover:text-[#075B60] hover:bg-[#F7E5C8] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 text-right rtl:text-right ltr:text-left">
          {/* Framed Architectural Header */}
          <div className="mb-6">
            <EditorialMediaPlaceholder
              aspectRatio="16:9"
              title={isArabic ? service.name.ar : service.name.en}
              category={service.categoryId}
              className="w-full rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-[#075B60] font-medium mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.durationMinutes} {t('booking.minutes')}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {hasApprovedPrice
                ? `${service.priceAed} ${t('booking.aed')}`
                : (isArabic ? 'السعر عند الاستشارة' : 'Price upon inquiry')}
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#173D3E] mb-3 leading-snug">
            {isArabic ? service.name.ar : service.name.en}
          </h3>

          <p className="text-sm text-[#173D3E]/85 leading-relaxed mb-6">
            {isArabic ? service.description.ar : service.description.en}
          </p>

          {/* Inclusions */}
          <div className="p-4 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-xl mb-6">
            <h4 className="font-serif text-base font-semibold text-[#075B60] mb-2.5">
              {isArabic ? 'ما تشمله هذه الجلسة:' : 'What is included in this ritual:'}
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#173D3E]/85">
              {(isArabic ? service.inclusions.ar : service.inclusions.en).map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Information */}
          <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#075B60] shrink-0 mt-0.5" />
            <div className="text-xs text-[#173D3E]/80 leading-relaxed">
              <p className="font-semibold text-[#075B60] mb-0.5">
                {isArabic ? 'إرشادات الاستعداد للزيارة:' : 'Preparation & Arrival Notes:'}
              </p>
              <p>{isArabic ? service.preparationNotes.ar : service.preparationNotes.en}</p>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-[#F7E5C8]/40 border-t border-[#DBC7A6] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#173D3E]/70">{t('booking.price')}</span>
            <span className="font-serif font-bold text-base text-[#075B60]">
              {hasApprovedPrice
                ? `${service.priceAed} ${t('booking.aed')}`
                : (isArabic ? 'تواصل معنا' : 'Inquire')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#173D3E] hover:text-[#075B60] border border-[#DBC7A6] rounded-md transition-colors cursor-pointer"
            >
              {t('btn.close')}
            </button>

            {service.onlineBookable ? (
              <button
                onClick={() => {
                  onClose();
                  onBook(service);
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('hero.cta.book')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onInquire(service);
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{t('btn.ask_service')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
