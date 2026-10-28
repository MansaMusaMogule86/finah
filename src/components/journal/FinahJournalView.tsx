import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { SEOHead } from '../common/SEOHead';
import { JOURNAL_ARTICLES, JOURNAL_CATEGORIES } from '../../data/journalArticles';
import { JournalArticle } from '../../types/journal';
import { Service } from '../../types';
import { finahStore } from '../../services/api';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Share2,
  CalendarCheck
} from 'lucide-react';

interface FinahJournalViewProps {
  onSelectArticle: (slug: string) => void;
  onBookService?: (service: Service) => void;
  onNavigateHome?: () => void;
}

export const FinahJournalView: React.FC<FinahJournalViewProps> = ({
  onSelectArticle,
  onBookService,
  onNavigateHome
}) => {
  const { isArabic } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  // Filter articles
  const filteredArticles = JOURNAL_ARTICLES.filter(art => {
    const matchesCat = activeCategory === 'all' || art.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const titleEn = art.title.en.toLowerCase();
    const titleAr = art.title.ar.toLowerCase();
    const excerptEn = art.excerpt.en.toLowerCase();
    const excerptAr = art.excerpt.ar.toLowerCase();
    const kw = art.secondaryKeywords.map(k => k.toLowerCase()).join(' ');

    return (
      matchesCat &&
      (titleEn.includes(q) ||
        titleAr.includes(q) ||
        excerptEn.includes(q) ||
        excerptAr.includes(q) ||
        kw.includes(q))
    );
  });

  const featuredArticle = JOURNAL_ARTICLES[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError(isArabic ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }
    if (!newsletterConsent) {
      setNewsletterError(
        isArabic
          ? 'يرجى الموافقة على استلام نشرتنا الإخبارية الدورية'
          : 'Please consent to receiving our curated wellness newsletters'
      );
      return;
    }
    setNewsletterError('');
    setNewsletterSubmitted(true);
  };

  const handleBookService = (serviceId: string) => {
    if (!onBookService) return;
    const services = finahStore.getServices();
    const found = services.find(s => s.id === serviceId) || services[0];
    onBookService(found);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FFF7EA] text-[#173D3E] min-h-screen relative overflow-hidden">
      {/* SEO Metadata for Journal Index */}
      <SEOHead
        title={
          isArabic
            ? 'مجلة فنة | طقوس الجمال المغربي واستشارات الخبراء في دبي'
            : 'The Finah Journal | Beauty, Rituals & Expert Insights Dubai'
        }
        description={
          isArabic
            ? 'المجلة التحريرية الراقية من فنة بيوتي. استشارات خبراء العناية بالشعر، البالياج، الحمام المغربي، وأسرار الجمال التراثي في دبي.'
            : 'The premier luxury beauty journal by Finah Beauty. Authoritative guides on hair treatments, bespoke balayage, authentic hammam wellness, and nail care in Dubai.'
        }
        canonicalUrl="https://finahbeauty.com/journal"
        ogType="website"
        keywords={[
          'Finah Journal',
          'Dubai beauty blog',
          'luxury hair care Dubai',
          'Moroccan beauty rituals',
          'wellness magazine Dubai'
        ]}
      />

      {/* Decorative Architectural Elements */}
      <div className="absolute top-10 left-0 w-96 h-96 opacity-10 pointer-events-none -translate-x-32">
        <RosetteEmblem size={384} color="#075B60" />
      </div>
      <div className="absolute bottom-10 right-0 w-96 h-96 opacity-10 pointer-events-none translate-x-32">
        <RosetteEmblem size={384} color="#F1C17F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#075B60]/70 mb-8 uppercase tracking-widest">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#075B60] transition-colors cursor-pointer"
          >
            {isArabic ? 'الرئيسية' : 'Home'}
          </button>
          <ChevronIcon className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#173D3E] font-medium">
            {isArabic ? 'مجلة فنة' : 'The Finah Journal'}
          </span>
        </div>

        {/* Hero Header: Vogue Beauty Meets Dubai Sanctuary */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7E5C8]/70 border border-[#F1C17F]/40 rounded-full text-xs font-semibold text-[#075B60] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F1C17F]" />
            <span>{isArabic ? 'إصدارات تحريرية فاخرة' : 'Luxury Editorial Edition'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#173D3E] tracking-tight mb-4">
            {isArabic ? 'مجلة فنة' : 'The Finah Journal'}
          </h1>
          <p className="text-lg sm:text-xl font-serif italic text-[#075B60] mb-6">
            {isArabic ? 'طقوس الجمال، رعاية الفروة، واستشارات الخبراء' : 'Beauty, Rituals & Expert Insights'}
          </p>
          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            {isArabic
              ? 'موسوعة متخصصة تجمع بين أسرار التراث المغربي العريق وأحدث العلوم التجميلية العالمية، مصممة خصيصاً لمواكبة متطلبات المرأة العصرية ومناخ الخليج العربي.'
              : 'An authoritative editorial sanctuary bridging ancestral Moroccan botanical heritage with contemporary trichology and dermal science, calibrated specifically for Dubai’s dynamic climate.'}
          </p>
        </div>

        {/* Featured Editorial Article */}
        {featuredArticle && activeCategory === 'all' && !searchQuery && (
          <div className="mb-20">
            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#F7E5C8]/30 rounded-3xl overflow-hidden border border-[#F1C17F]/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 group transition-all duration-500 hover:shadow-2xl">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={featuredArticle.heroImage}
                  alt={isArabic ? featuredArticle.title.ar : featuredArticle.title.en}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173D3E]/60 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="px-3.5 py-1.5 bg-[#075B60]/90 backdrop-blur-md text-[#FFF7EA] text-xs font-medium tracking-wider uppercase rounded-full shadow-md">
                    {isArabic ? 'مقال الغلاف المميز' : 'Cover Feature'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#075B60] font-semibold uppercase tracking-wider mb-3">
                    <span>
                      {isArabic
                        ? featuredArticle.categoryLabel.ar
                        : featuredArticle.categoryLabel.en}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {isArabic ? featuredArticle.readTime.ar : featuredArticle.readTime.en}
                    </span>
                  </div>

                  <h2
                    onClick={() => onSelectArticle(featuredArticle.slug)}
                    className="text-2xl sm:text-3xl font-serif text-[#173D3E] font-medium leading-snug mb-4 hover:text-[#075B60] transition-colors cursor-pointer"
                  >
                    {isArabic ? featuredArticle.title.ar : featuredArticle.title.en}
                  </h2>

                  <p className="text-sm text-[#173D3E]/75 font-sans leading-relaxed mb-6 line-clamp-3">
                    {isArabic ? featuredArticle.excerpt.ar : featuredArticle.excerpt.en}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#F1C17F]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={isArabic ? featuredArticle.author.name.ar : featuredArticle.author.name.en}
                      className="w-10 h-10 rounded-full object-cover border border-[#F1C17F]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#173D3E]">
                        {isArabic ? featuredArticle.author.name.ar : featuredArticle.author.name.en}
                      </p>
                      <p className="text-[11px] text-[#075B60]">
                        {isArabic ? featuredArticle.date.ar : featuredArticle.date.en}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectArticle(featuredArticle.slug)}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#075B60] hover:text-[#064a4e] transition-colors cursor-pointer group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  >
                    <span>{isArabic ? 'قراءة الدليل الكامل' : 'Read Guide'}</span>
                    <ArrowIcon className="w-4 h-4 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs & Search Bar */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#F1C17F]/30">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {JOURNAL_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#075B60] text-white shadow-md'
                      : 'bg-[#F7E5C8]/50 text-[#173D3E] hover:bg-[#F7E5C8] border border-[#F1C17F]/30'
                  }`}
                >
                  {isArabic ? cat.label.ar : cat.label.en}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحثي في مقالات المجلة...'
                  : 'Search beauty articles...'
              }
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-xs rounded-full bg-white/80 border border-[#F1C17F]/50 focus:outline-none focus:ring-2 focus:ring-[#075B60]/30 text-[#173D3E] placeholder-[#173D3E]/40"
            />
            <Search className="w-4 h-4 text-[#075B60] absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-3xl border border-[#F1C17F]/30">
            <BookOpen className="w-12 h-12 text-[#F1C17F] mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-serif text-[#173D3E] mb-2">
              {isArabic ? 'لم نجد أي مقالات تطابق بحثكِ' : 'No articles matched your search'}
            </h3>
            <p className="text-xs text-[#173D3E]/60 max-w-sm mx-auto mb-6">
              {isArabic
                ? 'جربي البحث بكلمات أخرى أو تصفحي التصنيفات المختلفة.'
                : 'Try refining your query or explore one of the main categories above.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-5 py-2 text-xs font-semibold text-[#075B60] bg-[#F7E5C8] rounded-full hover:bg-[#F1C17F]/60 transition-colors"
            >
              {isArabic ? 'عرض جميع المقالات' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article.slug)}
                className="bg-white/70 hover:bg-white rounded-2xl overflow-hidden border border-[#F1C17F]/30 hover:border-[#F1C17F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.heroImage}
                      alt={isArabic ? article.title.ar : article.title.en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#075B60] text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-sm">
                        {isArabic ? article.categoryLabel.ar : article.categoryLabel.en}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] text-[#075B60] font-medium mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {isArabic ? article.readTime.ar : article.readTime.en}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {isArabic ? article.date.ar : article.date.en}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-[#173D3E] leading-snug mb-3 group-hover:text-[#075B60] transition-colors line-clamp-2">
                      {isArabic ? article.title.ar : article.title.en}
                    </h3>

                    <p className="text-xs text-[#173D3E]/70 font-sans leading-relaxed line-clamp-3 mb-4">
                      {isArabic ? article.excerpt.ar : article.excerpt.en}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#F1C17F]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.author.avatar}
                      alt={isArabic ? article.author.name.ar : article.author.name.en}
                      className="w-7 h-7 rounded-full object-cover border border-[#F1C17F]/60"
                    />
                    <span className="text-xs font-medium text-[#173D3E]">
                      {isArabic ? article.author.name.ar : article.author.name.en}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#075B60] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isArabic ? 'قراءة' : 'Read'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Functioning Consent-Based Newsletter Section */}
        <div className="bg-gradient-to-br from-[#075B60] to-[#173D3E] text-white rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden shadow-xl border border-[#F1C17F]/30">
          <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none translate-x-20 -translate-y-20">
            <RosetteEmblem size={320} color="#F1C17F" />
          </div>

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-widest text-[#F1C17F] uppercase mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>{isArabic ? 'رسائل فنة الدورية' : 'Curated Botanical Dispatch'}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif font-light mb-3">
              {isArabic
                ? 'انضمي إلى دائرة المعرفة والجمال التراثي'
                : 'Subscribe to The Finah Botanical Gazette'}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed mb-6">
              {isArabic
                ? 'استقبلي استشارات حصرية من أخصائياتنا حول العناية بالشعر والبشرة في مناخ دبي، مع عروض خاصة لزوار مجلتنا.'
                : 'Receive seasonal trichology insights, ancestral Moroccan botanical recipes, and exclusive sanctuary invitations directly in your inbox.'}
            </p>

            {newsletterSubmitted ? (
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-[#F1C17F]/40 flex items-center justify-center gap-3 text-sm text-[#F1C17F]">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>
                  {isArabic
                    ? 'شكراً لكِ! تم تسجيل اشتراككِ بنجاح. ستصلكِ رسالتنا الترحيبية قريباً.'
                    : 'Welcome to the circle. Your subscription is confirmed, and your first botanical guide is on its way.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder={
                      isArabic ? 'أدخلي بريدكِ الإلكتروني...' : 'Enter your email address...'
                    }
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#F1C17F]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#F1C17F] hover:bg-[#e4b370] text-[#173D3E] font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-md uppercase tracking-wider"
                  >
                    {isArabic ? 'اشتراك' : 'Subscribe'}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 max-w-md mx-auto text-[11px] text-white/70">
                  <input
                    type="checkbox"
                    id="newsletter-consent"
                    checked={newsletterConsent}
                    onChange={e => setNewsletterConsent(e.target.checked)}
                    className="rounded border-white/30 text-[#075B60] focus:ring-[#F1C17F]"
                  />
                  <label htmlFor="newsletter-consent" className="cursor-pointer">
                    {isArabic
                      ? 'أوافق على استلام رسائل تحريرية من فنة، ويمكنني إلغاء الاشتراك في أي وقت.'
                      : 'I consent to receiving curated editorial letters from Finah. Unsubscribe at any time.'}
                  </label>
                </div>

                {newsletterError && (
                  <p className="text-xs text-rose-300 font-medium">{newsletterError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Premium Sanctuary Booking Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F1C17F]/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-[#075B60] uppercase tracking-widest mb-2 block">
              {isArabic ? 'تجربة حية في قلب دبي' : 'Sanctuary Experience in Dubai'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#173D3E] mb-3">
              {isArabic
                ? 'حوّلي المعرفة إلى تجربة استرخاء حقيقية'
                : 'Transform Reading into a Sacred Ritual'}
            </h3>
            <p className="text-xs sm:text-sm text-[#173D3E]/75 leading-relaxed font-sans">
              {isArabic
                ? 'استمتعي بجلسات الحمام المغربي الملكي وعلاجات الأركان العضوية في أجنحتنا الخاصة الهادئة.'
                : 'Experience our royal hammam rituals and organic restorative argan hair therapies within private, tranquil sanctuary suites.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleBookService('hammam-royal-finah')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#075B60] hover:bg-[#064a4e] text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{isArabic ? 'احجزي طقسكِ الآن' : 'Reserve a Ritual'}</span>
            </button>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#F7E5C8] hover:bg-[#F1C17F]/60 text-[#173D3E] text-xs font-semibold rounded-xl transition-all border border-[#F1C17F]/40 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>{isArabic ? 'محادثة الكونسيرج' : 'WhatsApp Concierge'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
