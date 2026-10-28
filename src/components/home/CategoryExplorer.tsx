import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service, ServiceCategory } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { Clock, Sparkles, ArrowRight, ArrowLeft, Check, HelpCircle } from 'lucide-react';

interface CategoryExplorerProps {
  onSelectService: (service: Service) => void;
  onBookService: (service: Service) => void;
  onViewAllServices: () => void;
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  onSelectService,
  onBookService,
  onViewAllServices
}) => {
  const { t, isArabic } = useLanguage();
  const categories = finahStore.getCategories();
  const services = finahStore.getServices();

  const [activeCategory, setActiveCategory] = useState<string>('hammam');

  const filteredServices = services.filter(s => s.categoryId === activeCategory);

  return (
    <section className="py-20 bg-[#FFF7EA] border-b border-[#DBC7A6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl text-right rtl:text-right ltr:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <RosetteEmblem size={16} color="#075B60" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'قائمة الطقوس المعتمدة' : 'Verified Service Menu'}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight">
              {isArabic ? 'اكتشفي باقات وعلاجات فنة' : 'Discover Finah Rituals & Care'}
            </h2>
          </div>

          <button
            onClick={onViewAllServices}
            className="self-start md:self-end text-xs font-semibold text-[#075B60] hover:text-[#173D3E] flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
          >
            <span>{t('btn.view_catalog')}</span>
            {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Interactive Segmented Category Filter (Allowed in design rules as functional buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#075B60] text-white border-[#075B60] shadow-xs'
                    : 'bg-[#F7E5C8]/50 text-[#173D3E] border-[#DBC7A6] hover:bg-[#F7E5C8]'
                }`}
              >
                {isArabic ? cat.name.ar : cat.name.en}
              </button>
            );
          })}
        </div>

        {/* Services Grid (Single level of elevation, whitespace, unboxed metadata) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => {
            const hasApprovedPrice = service.priceAed !== null && service.pricingStatus === 'approved';

            return (
              <div
                key={service.id}
                className="p-6 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl flex flex-col justify-between hover:border-[#075B60]/40 transition-colors"
              >
                <div>
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-xs text-[#075B60] font-medium mb-3">
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

                  <h3 className="font-serif text-xl font-medium text-[#173D3E] mb-2 leading-snug">
                    {isArabic ? service.name.ar : service.name.en}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#173D3E]/80 leading-relaxed mb-5 line-clamp-3">
                    {isArabic ? service.shortIntro.ar : service.shortIntro.en}
                  </p>

                  {/* Highlights / Inclusions */}
                  <div className="pt-4 border-t border-[#DBC7A6]/50 mb-6">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#075B60]/80 mb-2">
                      {isArabic ? 'ما تشمله الجلسة:' : 'Included in ritual:'}
                    </p>
                    <ul className="flex flex-col gap-1.5 text-xs text-[#173D3E]/80">
                      {(isArabic ? service.inclusions.ar : service.inclusions.en).slice(0, 3).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#DBC7A6]/50 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectService(service)}
                    className="text-xs text-[#075B60] hover:text-[#173D3E] font-medium cursor-pointer"
                  >
                    {isArabic ? 'تفاصيل الجلسة' : 'View Details'}
                  </button>

                  {service.onlineBookable ? (
                    <button
                      onClick={() => onBookService(service)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer"
                    >
                      {t('hero.cta.book')}
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectService(service)}
                      className="px-4 py-2 text-xs font-semibold text-[#075B60] bg-[#FFF7EA] border border-[#DBC7A6] hover:bg-[#F7E5C8] rounded-md transition-colors cursor-pointer"
                    >
                      {t('btn.ask_service')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
