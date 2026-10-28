import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { WELLNESS_ARTICLES, WellnessArticle } from '../../data/wellnessArticles';
import { finahStore } from '../../services/api';
import { Service } from '../../types';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  CheckCircle2,
  Share2,
  Bookmark,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface WellnessJournalViewProps {
  onBookService?: (service: Service) => void;
  onNavigateHome?: () => void;
}

export const WellnessJournalView: React.FC<WellnessJournalViewProps> = ({
  onBookService,
  onNavigateHome
}) => {
  const { isArabic, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<WellnessArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<Record<string, boolean>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isArabic ? 'جميع المقالات' : 'All Articles' },
    { id: 'rituals', label: isArabic ? 'طقوس وتراث' : 'Rituals & Heritage' },
    { id: 'skincare', label: isArabic ? 'عناية ومكونات' : 'Skincare & Botanicals' },
    { id: 'wellness', label: isArabic ? 'عافية وسكينة' : 'Holistic Wellness' },
    { id: 'bridal', label: isArabic ? 'دليل العروس' : 'Bridal Guides' }
  ];

  const filteredArticles = WELLNESS_ARTICLES.filter(art => {
    const matchesCat = activeCategory === 'all' || art.category === activeCategory;
    const titleMatch =
      art.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && titleMatch;
  });

  const featuredArticle = WELLNESS_ARTICLES[0];

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (article: WellnessArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedSlug(article.id);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleBookCompanion = (serviceId: string) => {
    if (!onBookService) return;
    const allServices = finahStore.getServices();
    // Try exact match or match category
    let found = allServices.find(s => s.id === serviceId);
    if (!found) {
      // Find by category or fallback to first
      if (serviceId.includes('hammam')) {
        found = allServices.find(s => s.categoryId === 'hammam');
      } else if (serviceId.includes('bridal')) {
        found = allServices.find(s => s.categoryId === 'bridal');
      } else {
        found = allServices[0];
      }
    }
    if (found) {
      onBookService(found);
      setReadingArticle(null);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FFF7EA] text-[#173D3E] min-h-screen relative overflow-hidden">
      {/* Background Architectural Ornamentation */}
      <div className="absolute top-10 left-0 w-96 h-96 opacity-10 pointer-events-none -translate-x-32">
        <RosetteEmblem size={384} color="#075B60" />
      </div>
      <div className="absolute top-96 right-0 w-96 h-96 opacity-10 pointer-events-none translate-x-32">
        <RosetteEmblem size={384} color="#F1C17F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb / Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'مجلة فنة للعافية والجمال' : 'Finah Wellness Journal'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-4">
            {isArabic ? 'أسرار الطقوس، العناية، والسكينة' : 'Moroccan Rituals, Botanicals & Stillness'}
          </h1>

          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed max-w-2xl mx-auto">
            {isArabic
              ? 'مقالات متخصصة تستكشف أسرار الحمام المغربي، فوائد زيت الأركان البكر، وطرق الحفاظ على نضارة البشرة والتوازن الداخلي بروح أصيلة.'
              : 'Curated essays unveiling ancestral hammam wisdom, virgin argan elixirs, and holistic wellness guidance rooted in authentic Moroccan heritage.'}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-10 border-b border-[#DBC7A6]/60">
          {/* Segmented Category Buttons (Zero pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all rounded-lg cursor-pointer ${
                    isActive
                      ? 'bg-[#075B60] text-[#FFF7EA] shadow-xs'
                      : 'text-[#173D3E]/80 hover:text-[#075B60] hover:bg-[#F7E5C8]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#173D3E]/50 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحثي في المقالات والطقوس...' : 'Search articles and rituals...'}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs sm:text-sm bg-white/80 border border-[#DBC7A6] rounded-xl text-[#173D3E] placeholder-[#173D3E]/45 focus:outline-none focus:border-[#075B60]"
            />
          </div>
        </div>

        {/* Featured Hero Article (when showing All and no search) */}
        {activeCategory === 'all' && !searchQuery && featuredArticle && (
          <div className="mb-14 bg-gradient-to-br from-[#F7E5C8]/70 via-[#FFF7EA] to-[#F1C17F]/30 border border-[#DBC7A6] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 opacity-15 pointer-events-none translate-x-16 -translate-y-16">
              <RosetteEmblem size={320} color="#075B60" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 flex flex-col items-start rtl:items-start ltr:items-start">
                {/* Meta details with typographic separators, zero pills */}
                <div className="flex items-center gap-2 text-xs text-[#075B60] font-medium mb-3">
                  <span className="font-semibold">{featuredArticle.categoryLabel[isArabic ? 'ar' : 'en']}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-[#173D3E]/70">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredArticle.readTime[isArabic ? 'ar' : 'en']}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-[#173D3E]/70">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{featuredArticle.date[isArabic ? 'ar' : 'en']}</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl text-[#173D3E] font-medium tracking-tight mb-3 leading-snug">
                  {featuredArticle.title[isArabic ? 'ar' : 'en']}
                </h2>

                <p className="text-xs sm:text-sm text-[#075B60] font-medium mb-4">
                  {featuredArticle.subtitle[isArabic ? 'ar' : 'en']}
                </p>

                <p className="text-sm text-[#173D3E]/85 leading-relaxed mb-6 max-w-2xl">
                  {featuredArticle.summary[isArabic ? 'ar' : 'en']}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setReadingArticle(featuredArticle)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#075B60] hover:bg-[#173D3E] text-[#FFF7EA] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{isArabic ? 'قراءة المقال بالكامل' : 'Read Full Article'}</span>
                    {isArabic ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>

                  <div className="text-xs text-[#173D3E]/70 flex items-center gap-1.5 ml-2 rtl:ml-0 rtl:mr-2">
                    <User className="w-3.5 h-3.5 text-[#075B60]" />
                    <span>{featuredArticle.author.name[isArabic ? 'ar' : 'en']}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Highlight Card */}
              <div className="lg:col-span-4 bg-[#FFF7EA]/90 border border-[#DBC7A6] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#075B60] block mb-2">
                    {isArabic ? 'اقتباس من المقال' : 'Editorial Reflection'}
                  </span>
                  <blockquote className="font-serif text-base text-[#173D3E] leading-relaxed italic mb-4">
                    "{featuredArticle.quote[isArabic ? 'ar' : 'en']}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-[#DBC7A6]/50">
                  <span className="text-xs font-semibold text-[#173D3E] block mb-1">
                    {isArabic ? 'الطقس المصاحب الموصى به:' : 'Recommended Companion Ritual:'}
                  </span>
                  <button
                    onClick={() => handleBookCompanion(featuredArticle.companionServiceId)}
                    className="text-xs text-[#075B60] hover:text-[#173D3E] font-medium underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{featuredArticle.companionServiceName[isArabic ? 'ar' : 'en']}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              onClick={() => setReadingArticle(article)}
              className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#075B60]/50 hover:shadow-md transition-all cursor-pointer group relative"
            >
              <div>
                {/* Meta details with quiet typographic separators (Zero pills) */}
                <div className="flex items-center justify-between text-xs text-[#075B60] font-medium mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">
                      {article.categoryLabel[isArabic ? 'ar' : 'en']}
                    </span>
                    <span>·</span>
                    <span className="text-[#173D3E]/60">
                      {article.readTime[isArabic ? 'ar' : 'en']}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => handleToggleSave(article.id, e)}
                      className="p-1 text-[#173D3E]/50 hover:text-[#075B60] transition-colors"
                      title={isArabic ? 'حفظ المقال' : 'Save article'}
                      aria-label={isArabic ? 'حفظ المقال' : 'Save article'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          savedArticles[article.id] ? 'fill-[#075B60] text-[#075B60]' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={e => handleShare(article, e)}
                      className="p-1 text-[#173D3E]/50 hover:text-[#075B60] transition-colors"
                      title={isArabic ? 'نسخ الرابط' : 'Copy link'}
                      aria-label={isArabic ? 'نسخ الرابط' : 'Copy link'}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#173D3E] font-medium tracking-tight mb-2 group-hover:text-[#075B60] transition-colors leading-snug">
                  {article.title[isArabic ? 'ar' : 'en']}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-[#075B60]/90 font-medium mb-3 line-clamp-1">
                  {article.subtitle[isArabic ? 'ar' : 'en']}
                </p>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#173D3E]/75 leading-relaxed mb-6 line-clamp-3">
                  {article.summary[isArabic ? 'ar' : 'en']}
                </p>

                {/* Key takeaway preview bullets */}
                <div className="bg-[#F7E5C8]/30 rounded-xl p-3.5 border border-[#DBC7A6]/50 mb-6">
                  <div className="flex items-start gap-2 text-xs text-[#173D3E]/85">
                    <Sparkles className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {article.keyTakeaways[0][isArabic ? 'ar' : 'en']}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#DBC7A6]/50 flex items-center justify-between text-xs text-[#173D3E]/70">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#075B60]" />
                  <span className="font-medium text-[#173D3E]">
                    {article.author.name[isArabic ? 'ar' : 'en']}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 font-semibold text-[#075B60] group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px] transition-transform">
                  <span>{isArabic ? 'قراءة' : 'Read'}</span>
                  {isArabic ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-[#F7E5C8]/30 rounded-2xl border border-[#DBC7A6] p-8 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-[#075B60] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#173D3E] font-medium mb-1">
              {isArabic ? 'لم نعثر على مقالات مطابقة' : 'No articles matched your search'}
            </h3>
            <p className="text-xs text-[#173D3E]/70 mb-4">
              {isArabic
                ? 'جربي البحث بكلمات أخرى أو اختاري تصنيفاً مختلفاً.'
                : 'Try searching with another keyword or explore a different ritual category.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#075B60] bg-[#FFF7EA] border border-[#075B60]/40 rounded-xl hover:bg-[#F7E5C8] transition-colors cursor-pointer"
            >
              {isArabic ? 'إعادة ضبط البحث' : 'Reset Search'}
            </button>
          </div>
        )}
      </div>

      {/* Full Article Reading Modal */}
      {readingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173D3E]/70 backdrop-blur-xs"
        >
          <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Top Bar with Close & Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DBC7A6]/60 mb-6 sticky top-0 bg-[#FFF7EA] z-10">
              <div className="flex items-center gap-2 text-xs text-[#075B60] font-medium">
                <span className="font-semibold">
                  {readingArticle.categoryLabel[isArabic ? 'ar' : 'en']}
                </span>
                <span>·</span>
                <span>{readingArticle.readTime[isArabic ? 'ar' : 'en']}</span>
                <span>·</span>
                <span className="text-[#173D3E]/60">{readingArticle.date[isArabic ? 'ar' : 'en']}</span>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 text-[#173D3E]/60 hover:text-[#173D3E] hover:bg-[#F7E5C8]/50 rounded-lg transition-colors cursor-pointer"
                aria-label={t('btn.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Header */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl sm:text-4xl text-[#173D3E] font-medium tracking-tight mb-3 leading-tight">
                {readingArticle.title[isArabic ? 'ar' : 'en']}
              </h2>
              <p className="text-sm font-medium text-[#075B60] mb-4">
                {readingArticle.subtitle[isArabic ? 'ar' : 'en']}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#DBC7A6]/40 text-xs text-[#173D3E]/80">
                <div className="w-8 h-8 rounded-full bg-[#075B60]/10 flex items-center justify-center text-[#075B60] font-serif font-bold">
                  {readingArticle.author.name[isArabic ? 'ar' : 'en'].charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-[#173D3E]">
                    {readingArticle.author.name[isArabic ? 'ar' : 'en']}
                  </h4>
                  <p className="text-[11px] text-[#173D3E]/60">
                    {readingArticle.author.role[isArabic ? 'ar' : 'en']}
                  </p>
                </div>
              </div>
            </div>

            {/* Pull Quote */}
            <div className="my-6 bg-gradient-to-r from-[#F7E5C8]/60 to-[#FFF7EA] border-r-4 rtl:border-r-4 rtl:border-l-0 ltr:border-l-4 ltr:border-r-0 border-[#075B60] p-5 rounded-xl">
              <blockquote className="font-serif text-base sm:text-lg text-[#173D3E] italic leading-relaxed">
                "{readingArticle.quote[isArabic ? 'ar' : 'en']}"
              </blockquote>
            </div>

            {/* Main Article Sections */}
            <div className="space-y-6 text-sm text-[#173D3E]/90 leading-relaxed font-sans mb-8">
              <p className="text-base text-[#173D3E] font-medium leading-relaxed">
                {readingArticle.summary[isArabic ? 'ar' : 'en']}
              </p>

              {readingArticle.sections.map((section, idx) => (
                <div key={idx} className="pt-4">
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#075B60] mb-2">
                    {section.heading[isArabic ? 'ar' : 'en']}
                  </h4>
                  <p className="leading-relaxed text-sm sm:text-base text-[#173D3E]/85">
                    {section.body[isArabic ? 'ar' : 'en']}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Takeaways Checklist */}
            <div className="bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl p-6 mb-8">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#075B60] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#075B60]" />
                <span>
                  {isArabic ? 'خلاصة الطقس وإرشادات التطبيق:' : 'Sanctuary Takeaways & Application:'}
                </span>
              </h4>
              <div className="space-y-2.5">
                {readingArticle.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#173D3E]/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075B60] shrink-0 mt-2" />
                    <span>{takeaway[isArabic ? 'ar' : 'en']}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Companion Ritual Booking Card */}
            <div className="bg-gradient-to-r from-[#075B60] to-[#173D3E] text-[#FFF7EA] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#F1C17F] block mb-1">
                  {isArabic ? 'تجربة الطقس في فنة' : 'Experience This Ritual In Person'}
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-medium text-[#FFF7EA]">
                  {readingArticle.companionServiceName[isArabic ? 'ar' : 'en']}
                </h4>
                <p className="text-xs text-[#FFF7EA]/75 mt-1">
                  {isArabic
                    ? 'عشي هذه التفاصيل بحرفية خبيراتنا المغربيات في أجنحتنا الخاصة بدبي.'
                    : 'Immerse in these authentic ancestral techniques inside our secluded Dubai suites.'}
                </p>
              </div>

              <button
                onClick={() => handleBookCompanion(readingArticle.companionServiceId)}
                className="shrink-0 px-5 py-2.5 bg-[#F1C17F] hover:bg-[#F7E5C8] text-[#173D3E] text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {t('hero.cta.book')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
