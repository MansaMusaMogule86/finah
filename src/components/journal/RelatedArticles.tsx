import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { JournalArticle } from '../../types/journal';
import { JOURNAL_ARTICLES } from '../../data/journalArticles';
import { Clock, Calendar, ArrowRight, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface RelatedArticlesProps {
  currentArticle: JournalArticle;
  allArticles?: JournalArticle[];
  onSelectArticle: (slug: string) => void;
  className?: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticle,
  allArticles = JOURNAL_ARTICLES,
  onSelectArticle,
  className = ''
}) => {
  const { isArabic } = useLanguage();
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Intelligent relevance algorithm:
  // 1. Filter out the current article
  // 2. Score remaining articles by:
  //    - Category match (+3 points)
  //    - Overlapping secondary keywords (+1 point per match)
  // 3. Sort by score descending and pick top 3
  const candidateArticles = allArticles.filter(art => art.id !== currentArticle.id);

  const currentKeywords = new Set(
    currentArticle.secondaryKeywords.map(k => k.toLowerCase().trim())
  );

  const scoredArticles = candidateArticles.map(art => {
    let score = 0;

    // Direct category match
    if (art.category === currentArticle.category) {
      score += 3;
    }

    // Keyword overlap
    art.secondaryKeywords.forEach(kw => {
      if (currentKeywords.has(kw.toLowerCase().trim())) {
        score += 1;
      }
    });

    return { article: art, score };
  });

  // Sort descending by score; if tied, retain catalog order
  scoredArticles.sort((a, b) => b.score - a.score);

  const relatedList = scoredArticles.slice(0, 3).map(item => item.article);

  if (relatedList.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={isArabic ? 'مقالات ذات صلة' : 'Related Articles'}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-[#F1C17F]/40 ${className}`}
    >
      {/* Editorial Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7E5C8]/60 border border-[#F1C17F]/40 rounded-full text-xs font-semibold text-[#075B60] uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F1C17F]" />
          <span>{isArabic ? 'ترشيحات متخصصة' : 'Curated Editorial Guides'}</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-serif font-light text-[#173D3E] tracking-tight">
          {isArabic ? 'مقالات واستشارات ذات صلة' : 'Related Expert Insights'}
        </h3>
        <p className="text-xs sm:text-sm text-[#173D3E]/70 font-sans mt-2">
          {isArabic
            ? 'تعمقي في المزيد من الأسرار والطقوس التجميلية المختارة بعناية لتكملة قراءتكِ.'
            : 'Explore complementary guides curated by our specialists to deepen your beauty knowledge.'}
        </p>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedList.map(item => {
          const title = isArabic ? item.title.ar : item.title.en;
          const excerpt = isArabic ? item.excerpt.ar : item.excerpt.en;
          const categoryLabel = isArabic ? item.categoryLabel.ar : item.categoryLabel.en;
          const authorName = isArabic ? item.author.name.ar : item.author.name.en;
          const readTime = isArabic ? item.readTime.ar : item.readTime.en;
          const date = isArabic ? item.date.ar : item.date.en;

          return (
            <article
              key={item.id}
              onClick={() => onSelectArticle(item.slug)}
              className="bg-white/80 hover:bg-white rounded-2xl overflow-hidden border border-[#F1C17F]/30 hover:border-[#F1C17F] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Hero Thumbnail */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.heroImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#075B60] text-[10px] font-semibold tracking-wider uppercase rounded-full shadow-xs">
                      {categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-[11px] text-[#075B60] font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#075B60]" />
                      <span>{readTime}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#173D3E]/60">
                      <Calendar className="w-3 h-3" />
                      <span>{date}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-serif font-medium text-[#173D3E] group-hover:text-[#075B60] transition-colors line-clamp-2 mb-2 leading-snug">
                    {title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-xs text-[#173D3E]/75 line-clamp-3 font-sans leading-relaxed">
                    {excerpt}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#F1C17F]/20 bg-white/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={item.author.avatar}
                    alt={authorName}
                    className="w-6 h-6 rounded-full object-cover border border-[#F1C17F]"
                  />
                  <span className="font-medium text-[#173D3E] text-[11px]">
                    {authorName}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 font-semibold text-[#075B60] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>{isArabic ? 'قراءة الدليل' : 'Read Guide'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
