import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { JOURNAL_ARTICLES } from '../../data/journalArticles';
import { Service } from '../../types';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface WellnessJournalSectionProps {
  onExploreJournal: () => void;
  onSelectArticle?: (slug: string) => void;
  onBookService?: (service: Service) => void;
}

export const WellnessJournalSection: React.FC<WellnessJournalSectionProps> = ({
  onExploreJournal,
  onSelectArticle
}) => {
  const { isArabic } = useLanguage();

  // Show top 3 luxury editorial articles from our new God Mode Content Engine
  const featuredArticles = JOURNAL_ARTICLES.slice(0, 3);

  const handleArticleClick = (slug: string) => {
    if (onSelectArticle) {
      onSelectArticle(slug);
    } else {
      onExploreJournal();
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FFF7EA] border-b border-[#DBC7A6]/60 relative overflow-hidden">
      {/* Subtle Rosette Backdrop Watermark */}
      <div className="absolute top-1/2 left-0 w-80 h-80 opacity-10 pointer-events-none -translate-y-1/2 -translate-x-20">
        <RosetteEmblem size={320} color="#075B60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-[#075B60]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                {isArabic ? 'مجلة فنة | إصدارات الخبراء' : 'The Finah Journal | Expert Editions'}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#173D3E] font-normal tracking-tight mb-4 leading-tight">
              {isArabic ? 'طقوس الجمال، رعاية الفروة، والسكينة' : 'Beauty, Rituals & Expert Insights'}
            </h2>

            <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed font-sans">
              {isArabic
                ? 'استكشفي مقالاتنا المتخصصة حول أفضل صالونات دبي لعلاجات الشعر، وفنون البالياج، وحجز السبا الفاخر، وعناية الأظافر في مناخ الخليج.'
                : 'Explore our authoritative editorial guides on hair treatments, high-end balayage techniques, luxury online booking, and holistic hand and foot care in Dubai.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onExploreJournal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#075B60] bg-[#FFF7EA] hover:bg-[#F7E5C8]/50 border border-[#075B60]/40 rounded-xl transition-all shadow-xs cursor-pointer uppercase tracking-wider"
            >
              <span>{isArabic ? 'تصفحي جميع مقالات المجلة' : 'Explore All Journal Articles'}</span>
              {isArabic ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 3 Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map(article => (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.slug)}
              className="bg-white/80 border border-[#DBC7A6] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#075B60]/60 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.heroImage}
                    alt={isArabic ? article.title.ar : article.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#075B60] text-[10px] font-semibold tracking-wider uppercase rounded-full shadow-xs">
                      {isArabic ? article.categoryLabel.ar : article.categoryLabel.en}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta details */}
                  <div className="flex items-center justify-between text-xs text-[#075B60] font-medium mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{isArabic ? article.readTime.ar : article.readTime.en}</span>
                    </div>
                    <span className="text-[11px] text-[#173D3E]/60">
                      {isArabic ? article.date.ar : article.date.en}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-[#173D3E] font-medium tracking-tight mb-2 group-hover:text-[#075B60] transition-colors leading-snug line-clamp-2">
                    {isArabic ? article.title.ar : article.title.en}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-[#075B60] font-medium mb-3 line-clamp-1">
                    {isArabic ? article.subtitle.ar : article.subtitle.en}
                  </p>

                  {/* Summary */}
                  <p className="text-xs text-[#173D3E]/75 leading-relaxed mb-4 line-clamp-3 font-sans">
                    {isArabic ? article.excerpt.ar : article.excerpt.en}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 py-4 border-t border-[#DBC7A6]/40 flex items-center justify-between text-xs text-[#173D3E]/70 bg-white/40">
                <div className="flex items-center gap-2">
                  <img
                    src={article.author.avatar}
                    alt={isArabic ? article.author.name.ar : article.author.name.en}
                    className="w-6 h-6 rounded-full object-cover border border-[#F1C17F]"
                  />
                  <span className="font-medium text-[#173D3E]">
                    {isArabic ? article.author.name.ar : article.author.name.en}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 font-semibold text-[#075B60] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>{isArabic ? 'قراءة الدليل' : 'Read Guide'}</span>
                  {isArabic ? (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
