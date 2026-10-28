import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service, ServiceCategory } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { Clock, Check, Search, Calendar, Filter } from 'lucide-react';

interface ServicesCatalogViewProps {
  onSelectService: (service: Service) => void;
  onBookService: (service: Service) => void;
}

export const ServicesCatalogView: React.FC<ServicesCatalogViewProps> = ({
  onSelectService,
  onBookService
}) => {
  const { t, isArabic } = useLanguage();
  const categories = finahStore.getCategories();
  const allServices = finahStore.getServices();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = allServices.filter(s => {
    if (selectedCategory !== 'all' && s.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAr = s.name.ar.toLowerCase().includes(q) || s.description.ar.toLowerCase().includes(q);
      const matchEn = s.name.en.toLowerCase().includes(q) || s.description.en.toLowerCase().includes(q);
      if (!matchAr && !matchEn) return false;
    }
    return true;
  });

  return (
    <section className="py-16 bg-[#FFF7EA] min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="max-w-3xl mb-10 text-right rtl:text-right ltr:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <RosetteEmblem size={18} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'دليل الطقوس الكامل' : 'Full Rituals Catalog'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-3">
            {isArabic ? 'طقوس الحمام والعناية المغربية' : 'Moroccan Hammam & Beauty Care'}
          </h1>
          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed">
            {isArabic
              ? 'تصفحي جميع الجلسات المعتمدة في مركز فنة، مع تفاصيل المكونات الطبيعية، المدة الزمنية، والأسعار المعلنة.'
              : 'Explore our complete menu of approved Moroccan rituals with natural ingredients, durations, and transparent pricing.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#DBC7A6]">
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#075B60] text-white border-[#075B60]'
                  : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
              }`}
            >
              {isArabic ? 'جميع الطقوس' : 'All Rituals'}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#075B60] text-white border-[#075B60]'
                    : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
                }`}
              >
                {isArabic ? cat.name.ar : cat.name.en}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute top-3 right-3 rtl:right-3 ltr:left-3 text-[#075B60]" />
            <input
              type="text"
              placeholder={isArabic ? 'ابحثي عن خدمة أو مكون...' : 'Search ritual or botanical...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full py-2 px-9 bg-[#FFF7EA] border border-[#DBC7A6] rounded-md text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(service => {
            const hasApprovedPrice = service.priceAed !== null && service.pricingStatus === 'approved';

            return (
              <div
                key={service.id}
                className="p-6 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl flex flex-col justify-between hover:border-[#075B60]/40 transition-colors text-right rtl:text-right ltr:text-left"
              >
                <div>
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

                  <div className="pt-4 border-t border-[#DBC7A6]/50 mb-6">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#075B60]/80 mb-2">
                      {isArabic ? 'تشمل الجلسة:' : 'Inclusions:'}
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
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('hero.cta.book')}</span>
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
