import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { SEOHead } from '../common/SEOHead';
import { JournalArticle } from '../../types/journal';
import { JOURNAL_ARTICLES } from '../../data/journalArticles';
import { Service } from '../../types';
import { finahStore } from '../../services/api';
import { AuthorProfile } from './AuthorProfile';
import { RelatedArticles } from './RelatedArticles';
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CalendarCheck,
  MessageCircle,
  ShieldCheck,
  Lightbulb,
  BookOpen
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: JournalArticle;
  onNavigateJournal: () => void;
  onSelectArticle: (slug: string) => void;
  onBookService?: (service: Service) => void;
  onNavigateHome?: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onNavigateJournal,
  onSelectArticle,
  onBookService,
  onNavigateHome
}) => {
  const { isArabic } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  // Track scroll progress for sticky top reading bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check active TOC section
      const sections = article.sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTocId(article.sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleShare = () => {
    const url = window.location.href;
    const shareTitle = isArabic ? article.title.ar : article.title.en;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        url: url
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleBookService = (serviceId: string) => {
    if (!onBookService) return;
    const services = finahStore.getServices();
    const found = services.find(s => s.id === serviceId) || services[0];
    onBookService(found);
  };


  // Generate Schema.org JSON-LD structured data
  const canonicalUrl = `https://finahbeauty.com/journal/${article.slug}`;
  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title.en,
      description: article.metaDescription.en,
      image: article.heroImage,
      datePublished: article.isoDate,
      dateModified: article.isoDate,
      author: {
        '@type': 'Person',
        name: article.author.name.en,
        jobTitle: article.author.role.en
      },
      publisher: {
        '@type': 'Organization',
        name: 'Finah Beauty',
        logo: {
          '@type': 'ImageObject',
          url: 'https://finahbeauty.com/assets/brand/finah_logo_clean.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://finahbeauty.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'The Finah Journal',
          item: 'https://finahbeauty.com/journal'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title.en,
          item: canonicalUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question.en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.en
        }
      }))
    }
  ];

  return (
    <article className="bg-[#FFF7EA] text-[#173D3E] min-h-screen relative pb-24">
      {/* Dynamic SEO Head with JSON-LD */}
      <SEOHead
        title={
          isArabic
            ? `${article.title.ar} | مجلة فنة دبي`
            : `${article.title.en} | The Finah Journal`
        }
        description={
          isArabic ? article.metaDescription.ar : article.metaDescription.en
        }
        canonicalUrl={canonicalUrl}
        ogImage={article.heroImage}
        ogType="article"
        publishedTime={article.isoDate}
        authorName={article.author.name.en}
        keywords={[article.primaryKeyword, ...article.secondaryKeywords]}
        jsonLd={jsonLdData}
      />

      {/* Sticky Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-[#F7E5C8]/80">
        <div
          className="h-full bg-[#075B60] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section with Large Premium Image */}
      <div className="relative h-[480px] sm:h-[580px] lg:h-[640px] w-full overflow-hidden">
        <img
          src={article.heroImage}
          alt={isArabic ? article.title.ar : article.title.en}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173D3E] via-[#173D3E]/60 to-transparent" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full text-white">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-white/80 mb-6 uppercase tracking-wider font-sans">
              <button
                onClick={onNavigateHome}
                className="hover:text-[#F1C17F] transition-colors cursor-pointer"
              >
                {isArabic ? 'الرئيسية' : 'Home'}
              </button>
              <ChevronIcon className="w-3.5 h-3.5 opacity-60" />
              <button
                onClick={onNavigateJournal}
                className="hover:text-[#F1C17F] transition-colors cursor-pointer"
              >
                {isArabic ? 'مجلة فنة' : 'The Finah Journal'}
              </button>
              <ChevronIcon className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[#F1C17F] font-medium truncate max-w-xs sm:max-w-md">
                {isArabic ? article.categoryLabel.ar : article.categoryLabel.en}
              </span>
            </nav>

            <span className="inline-block px-3.5 py-1 bg-[#F1C17F] text-[#173D3E] text-xs font-semibold tracking-widest uppercase rounded-full mb-4 shadow-md">
              {isArabic ? article.categoryLabel.ar : article.categoryLabel.en}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-light tracking-tight leading-tight mb-4 drop-shadow-md">
              {isArabic ? article.title.ar : article.title.en}
            </h1>

            <p className="text-base sm:text-lg text-white/90 font-serif italic max-w-3xl mb-8 leading-relaxed">
              {isArabic ? article.subtitle.ar : article.subtitle.en}
            </p>

            {/* Author Badge & Reading Specs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/20 text-xs font-sans">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={isArabic ? article.author.name.ar : article.author.name.en}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#F1C17F]"
                />
                <div>
                  <p className="font-semibold text-white">
                    {isArabic ? article.author.name.ar : article.author.name.en}
                  </p>
                  <p className="text-white/70 text-[11px]">
                    {isArabic ? article.author.role.ar : article.author.role.en}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F1C17F]" />
                  {isArabic ? article.date.ar : article.date.en}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F1C17F]" />
                  {isArabic ? article.readTime.ar : article.readTime.en}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#F1C17F]" />
                  {article.wordCount.en} {isArabic ? 'كلمة' : 'words'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Sticky Table of Contents Sidebar (Desktop) */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F1C17F]/40 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-[#075B60] uppercase tracking-widest block mb-2">
                {isArabic ? 'فهرس المقال' : 'Table of Contents'}
              </span>
              <p className="text-xs text-[#173D3E]/60 mb-4">
                {isArabic
                  ? 'انقري على أي عنوان للانتقال المباشر'
                  : 'Click any section to jump directly'}
              </p>
            </div>

            <nav className="space-y-2 text-xs font-sans max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              {article.sections.map((section, idx) => {
                const isActive = activeTocId === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left rtl:text-right py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#075B60] text-white font-medium shadow-sm'
                        : 'text-[#173D3E]/80 hover:bg-[#F7E5C8]/60 hover:text-[#075B60]'
                    } ${section.level === 'h3' ? 'pl-6 rtl:pr-6 text-[11px]' : ''}`}
                  >
                    <span className="line-clamp-2">
                      {isArabic ? section.heading.ar : section.heading.en}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => scrollToSection('author-profile')}
                className="block w-full text-left rtl:text-right py-1.5 px-3 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/60 hover:text-[#075B60] text-xs transition-colors"
              >
                {isArabic ? 'عن كاتبة المقال والاعتمادات' : 'Author Profile & Credentials'}
              </button>
              <button
                onClick={() => scrollToSection('comparison-table')}
                className="block w-full text-left rtl:text-right py-1.5 px-3 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/60 hover:text-[#075B60] text-xs transition-colors"
              >
                {isArabic ? 'جدول المقارنة التحليلي' : 'Comparison Matrix'}
              </button>
              <button
                onClick={() => scrollToSection('faqs')}
                className="block w-full text-left rtl:text-right py-1.5 px-3 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/60 hover:text-[#075B60] text-xs transition-colors"
              >
                {isArabic ? 'الأسئلة الشائعة وإجاباتها' : 'Frequently Asked Questions'}
              </button>
            </nav>

            {/* Quick Share & Sanctuary CTA */}
            <div className="pt-6 border-t border-[#F1C17F]/30 space-y-3">
              <button
                onClick={handleShare}
                className="w-full py-2.5 px-4 bg-[#F7E5C8]/70 hover:bg-[#F7E5C8] text-[#173D3E] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#F1C17F]/40"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isArabic ? 'تم نسخ الرابط' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#075B60]" />
                    <span>{isArabic ? 'مشاركة هذا الدليل' : 'Share Article'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleBookService(article.companionServiceId)}
                className="w-full py-2.5 px-4 bg-[#075B60] hover:bg-[#064a4e] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm uppercase tracking-wider"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? 'حجز طقس استشاري' : 'Book Consultation'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Article Body */}
        <div className="lg:col-span-8 space-y-12">
          {/* Quick Answer / AI Overview Callout Box (Main Search Intent) */}
          <div className="bg-gradient-to-br from-[#F7E5C8]/60 to-[#FFFDF9] rounded-2xl p-6 sm:p-8 border border-[#F1C17F] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#075B60] uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-[#F1C17F]" />
              <span>{isArabic ? 'خلاصة الخبراء المركزة' : 'Executive Expert Summary'}</span>
            </div>
            <p className="text-sm sm:text-base text-[#173D3E] font-serif leading-relaxed mb-4">
              {isArabic ? article.excerpt.ar : article.excerpt.en}
            </p>
            <div className="pt-4 border-t border-[#F1C17F]/40">
              <span className="text-xs font-semibold text-[#075B60] block mb-2">
                {isArabic ? 'أهم النقاط الجوهرية:' : 'Key Strategic Takeaways:'}
              </span>
              <ul className="space-y-2 text-xs text-[#173D3E]/80 font-sans">
                {(isArabic ? article.keyTakeaways.ar : article.keyTakeaways.en).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075B60] mt-1.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Quick Table of Contents Drawer/Accordion */}
          <div className="lg:hidden bg-white/80 rounded-2xl p-4 border border-[#F1C17F]/40 shadow-xs font-sans">
            <button
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#075B60] uppercase tracking-wider cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#F1C17F]" />
                <span>{isArabic ? 'فهرس المقال والتنقل السريع' : 'Quick Section Jump'}</span>
              </span>
              {isMobileTocOpen ? (
                <ChevronUp className="w-4 h-4 text-[#075B60]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#173D3E]/60" />
              )}
            </button>
            {isMobileTocOpen && (
              <div className="mt-3 pt-3 border-t border-[#F1C17F]/30 space-y-1.5 text-xs font-sans max-h-60 overflow-y-auto">
                {article.sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      scrollToSection(section.id);
                      setIsMobileTocOpen(false);
                    }}
                    className="block w-full text-left rtl:text-right py-1.5 px-2 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/50 hover:text-[#075B60] truncate"
                  >
                    {isArabic ? section.heading.ar : section.heading.en}
                  </button>
                ))}
                <button
                  onClick={() => {
                    scrollToSection('author-profile');
                    setIsMobileTocOpen(false);
                  }}
                  className="block w-full text-left rtl:text-right py-1.5 px-2 rounded-lg text-[#075B60] font-medium hover:bg-[#F7E5C8]/50"
                >
                  {isArabic ? 'عن كاتبة المقال والاعتمادات' : 'Author Profile & Credentials'}
                </button>
                <button
                  onClick={() => {
                    scrollToSection('comparison-table');
                    setIsMobileTocOpen(false);
                  }}
                  className="block w-full text-left rtl:text-right py-1.5 px-2 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/50 hover:text-[#075B60]"
                >
                  {isArabic ? 'جدول المقارنة التحليلي' : 'Comparison Matrix'}
                </button>
                <button
                  onClick={() => {
                    scrollToSection('faqs');
                    setIsMobileTocOpen(false);
                  }}
                  className="block w-full text-left rtl:text-right py-1.5 px-2 rounded-lg text-[#173D3E]/80 hover:bg-[#F7E5C8]/50 hover:text-[#075B60]"
                >
                  {isArabic ? 'الأسئلة الشائعة وإجاباتها' : 'Frequently Asked Questions'}
                </button>
              </div>
            )}
          </div>

          {/* Article Sections (H2 & H3) */}
          <div className="space-y-12 font-sans text-sm sm:text-base text-[#173D3E]/85 leading-relaxed">
            {article.sections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                {section.level === 'h2' ? (
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#173D3E] font-medium tracking-tight pt-4 border-t border-[#F1C17F]/30">
                    {isArabic ? section.heading.ar : section.heading.en}
                  </h2>
                ) : (
                  <h3 className="text-xl sm:text-2xl font-serif text-[#075B60] font-medium tracking-tight pt-2">
                    {isArabic ? section.heading.ar : section.heading.en}
                  </h3>
                )}

                {/* Direct Answer snippet block for AI Overviews / Search intent */}
                {section.quickAnswer && (
                  <div className="p-4 bg-white/70 rounded-xl border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#075B60] text-xs sm:text-sm text-[#173D3E] font-serif italic shadow-xs">
                    {isArabic ? section.quickAnswer.ar : section.quickAnswer.en}
                  </div>
                )}

                {/* Editorial Section Body with Paragraph Separation */}
                <div className="space-y-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#173D3E]/85 font-sans">
                  {isArabic ? section.content.ar : section.content.en}
                </div>

                {/* Luxury Editorial Pro Tip */}
                {section.proTip && (
                  <div className="p-5 bg-[#F7E5C8]/40 rounded-2xl border border-[#F1C17F]/60 flex items-start gap-3 my-4">
                    <Lightbulb className="w-5 h-5 text-[#075B60] flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-[#173D3E] font-sans leading-relaxed">
                      {isArabic ? section.proTip.ar : section.proTip.en}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Author Profile Component specifically below the article content to establish trust & editorial authority */}
          <section id="author-profile" className="scroll-mt-24 pt-4 border-t border-[#F1C17F]/40">
            <AuthorProfile
              author={article.author}
              companionServiceName={article.companionServiceName}
              onBookConsultation={() => handleBookService(article.companionServiceId)}
            />
          </section>

          {/* Comparison Table Section */}
          <section id="comparison-table" className="scroll-mt-24 pt-8 border-t border-[#F1C17F]/40 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#075B60] uppercase tracking-widest block mb-1">
                {isArabic ? 'جدول تحليلي معتمد' : 'Authoritative Analysis'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#173D3E]">
                {isArabic ? article.comparisonTable.title.ar : article.comparisonTable.title.en}
              </h2>
              {article.comparisonTable.description && (
                <p className="text-xs sm:text-sm text-[#173D3E]/70 font-sans mt-1">
                  {isArabic
                    ? article.comparisonTable.description.ar
                    : article.comparisonTable.description.en}
                </p>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#F1C17F]/40 bg-white/80 shadow-sm">
              <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-sm font-sans">
                <thead>
                  <tr className="bg-[#075B60] text-white">
                    {(isArabic
                      ? article.comparisonTable.colHeaders.ar
                      : article.comparisonTable.colHeaders.en
                    ).map((h, i) => (
                      <th key={i} className="p-4 font-semibold tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1C17F]/20 text-[#173D3E]/85">
                  {article.comparisonTable.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white/40' : 'bg-[#FFFDF9]/60'}
                    >
                      <td className="p-4 font-semibold text-[#075B60]">
                        {isArabic ? row.feature.ar : row.feature.en}
                      </td>
                      <td className="p-4">{isArabic ? row.col1.ar : row.col1.en}</td>
                      <td className="p-4">{isArabic ? row.col2.ar : row.col2.en}</td>
                      <td className="p-4">{isArabic ? row.col3.ar : row.col3.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Contextual Companion Service Recommendation Card */}
          <div className="bg-gradient-to-br from-[#075B60] to-[#173D3E] text-white rounded-3xl p-6 sm:p-10 border border-[#F1C17F]/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
              <RosetteEmblem size={256} color="#F1C17F" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#F1C17F] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isArabic ? 'الطقس الموصى به في المقال' : 'Recommended Companion Ritual'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-light text-white">
                {isArabic ? article.companionServiceName.ar : article.companionServiceName.en}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-white/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F1C17F]" />
                  {article.companionServiceDuration} {isArabic ? 'دقيقة' : 'mins'}
                </span>
                <span>·</span>
                <span className="text-[#F1C17F] font-bold text-sm">
                  {article.companionServicePrice} {isArabic ? 'درهم إماراتي' : 'AED'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  {isArabic ? 'جناح خاص معقم' : 'Sanitized Private Suite'}
                </span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => handleBookService(article.companionServiceId)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#F1C17F] hover:bg-[#e4b370] text-[#173D3E] text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{isArabic ? 'احجزي هذه الجلسة الآن' : 'Reserve This Ritual Online'}</span>
                </button>
                <a
                  href={`https://wa.me/971500000000?text=${encodeURIComponent(
                    `Hello Finah Concierge, I am reading the article "${article.title.en}" and would like to inquire about ${article.companionServiceName.en}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isArabic ? 'استشارة عبر الواتساب' : 'WhatsApp Concierge Inquiry'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <section id="faqs" className="scroll-mt-24 pt-8 border-t border-[#F1C17F]/40 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#075B60] uppercase tracking-widest">
              <HelpCircle className="w-4 h-4 text-[#F1C17F]" />
              <span>{isArabic ? 'إجابات الخبراء' : 'Expert Answers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#173D3E]">
              {isArabic ? 'الأسئلة الشائعة حول هذا الموضوع' : 'Frequently Asked Questions'}
            </h2>

            <div className="space-y-3 font-sans">
              {article.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#F1C17F]/40 rounded-2xl bg-white/70 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 font-serif text-base sm:text-lg text-[#173D3E] hover:text-[#075B60] transition-colors cursor-pointer"
                    >
                      <span className="font-medium">
                        {isArabic ? faq.question.ar : faq.question.en}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#075B60] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#173D3E]/40 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#173D3E]/80 leading-relaxed font-sans border-t border-[#F1C17F]/20 pt-3">
                        {isArabic ? faq.answer.ar : faq.answer.en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Social Share & Back to Journal Bar */}
          <div className="pt-6 border-t border-[#F1C17F]/30 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
            <button
              onClick={onNavigateJournal}
              className="inline-flex items-center gap-2 text-[#075B60] hover:text-[#064a4e] font-semibold cursor-pointer uppercase tracking-wider"
            >
              <ArrowIcon className="w-4 h-4 rotate-180" />
              <span>{isArabic ? 'العودة إلى مجلة فنة' : 'Back to All Articles'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-[#F7E5C8] hover:bg-[#F1C17F]/60 text-[#173D3E] font-semibold rounded-full flex items-center gap-2 transition-colors cursor-pointer border border-[#F1C17F]/40"
              >
                <Share2 className="w-3.5 h-3.5 text-[#075B60]" />
                <span>{copiedLink ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'مشاركة' : 'Share')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Component with category & keyword matching */}
      <RelatedArticles
        currentArticle={article}
        onSelectArticle={onSelectArticle}
      />
    </article>
  );
};
