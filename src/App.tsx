import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { finahStore } from './services/api';
import { Service } from './types';
import { JOURNAL_ARTICLES } from './data/journalArticles';

// Components
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ExperienceIntroduction } from './components/home/ExperienceIntroduction';
import { HammamFeature } from './components/home/HammamFeature';
import { AmbientHammamFeature } from './components/home/AmbientHammamFeature';
import { CategoryExplorer } from './components/home/CategoryExplorer';
import { FindYourRitual } from './components/home/FindYourRitual';
import { BridalFeature } from './components/home/BridalFeature';
import { TestimonialSection } from './components/home/TestimonialSection';
import { WellnessJournalSection } from './components/home/WellnessJournalSection';
import { FinahJournalView } from './components/journal/FinahJournalView';
import { ArticleDetailView } from './components/journal/ArticleDetailView';
import { BookingWalkthrough } from './components/home/BookingWalkthrough';
import { FaqSection } from './components/home/FaqSection';
import { ServicesCatalogView } from './components/services/ServicesCatalogView';
import { HammamPageView } from './components/hammam/HammamPageView';
import { BridalPageView } from './components/bridal/BridalPageView';
import { DesignMyVisit } from './components/customVisit/DesignMyVisit';
import { VisitContactView } from './components/visit/VisitContactView';
import { PolicyView } from './components/policies/PolicyView';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { StaffDashboard } from './components/admin/StaffDashboard';

// Modals
import { BookingWizard } from './components/booking/BookingWizard';
import { BridalInquiryModal } from './components/bridal/BridalInquiryModal';
import { AskFinahConcierge } from './components/concierge/AskFinahConcierge';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { Calendar } from 'lucide-react';

const AppContent: React.FC = () => {
  const { t, isArabic } = useLanguage();

  // Navigation state & browser URL sync
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBridalInquiryOpen, setIsBridalInquiryOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [detailService, setDetailService] = useState<Service | null>(null);

  const [bookingInitialService, setBookingInitialService] = useState<Service | null>(null);
  const [bookingAdditionalServices, setBookingAdditionalServices] = useState<Service[]>([]);

  // Parse path on initial mount
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === '/journal') {
        setCurrentView('journal');
        setActiveArticleSlug(null);
      } else if (path.startsWith('/journal/')) {
        const slug = path.replace('/journal/', '');
        const exists = JOURNAL_ARTICLES.find(a => a.slug === slug);
        if (exists) {
          setCurrentView('journal-detail');
          setActiveArticleSlug(slug);
        } else {
          setCurrentView('journal');
          setActiveArticleSlug(null);
        }
      } else if (path === '/services') {
        setCurrentView('services');
      } else if (path === '/hammam') {
        setCurrentView('hammam');
      } else if (path === '/bridal') {
        setCurrentView('bridal');
      } else if (path === '/design-visit') {
        setCurrentView('design-visit');
      } else if (path === '/visit') {
        setCurrentView('visit');
      } else {
        setCurrentView('home');
      }
    };

    parseUrl();

    const handlePopState = () => {
      parseUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized navigation router with history pushState
  const navigateTo = (view: string, param?: string) => {
    let newPath = '/';
    if (view === 'journal') {
      newPath = '/journal';
      setActiveArticleSlug(null);
      setCurrentView('journal');
    } else if (view === 'journal-detail' && param) {
      newPath = `/journal/${param}`;
      setActiveArticleSlug(param);
      setCurrentView('journal-detail');
    } else if (view === 'services') {
      newPath = '/services';
      setCurrentView('services');
    } else if (view === 'hammam') {
      newPath = '/hammam';
      setCurrentView('hammam');
    } else if (view === 'bridal') {
      newPath = '/bridal';
      setCurrentView('bridal');
    } else if (view === 'design-visit') {
      newPath = '/design-visit';
      setCurrentView('design-visit');
    } else if (view === 'visit') {
      newPath = '/visit';
      setCurrentView('visit');
    } else {
      newPath = '/';
      setCurrentView(view);
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeArticleSlug]);

  const handleOpenBookingForService = (service: Service) => {
    setBookingInitialService(service);
    setBookingAdditionalServices([]);
    setIsBookingOpen(true);
  };

  const handleOpenBookingForVisitSequence = (services: Service[]) => {
    if (services.length > 0) {
      setBookingInitialService(services[0]);
      setBookingAdditionalServices(services.slice(1));
    }
    setIsBookingOpen(true);
  };

  const activeArticle = JOURNAL_ARTICLES.find(a => a.slug === activeArticleSlug) || JOURNAL_ARTICLES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7EA] text-[#173D3E]">
      {/* Top Navbar adhering strictly to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={(view, param) => navigateTo(view, param)}
        onOpenBooking={() => {
          setBookingInitialService(null);
          setBookingAdditionalServices([]);
          setIsBookingOpen(true);
        }}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreServices={() => navigateTo('services')}
              onBookVisit={() => {
                setBookingInitialService(null);
                setBookingAdditionalServices([]);
                setIsBookingOpen(true);
              }}
              onFindRitual={() => {
                const el = document.getElementById('find-your-ritual');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigateTo('home');
                }
              }}
            />
            <ExperienceIntroduction />
            {/* Ambient Hammam Video Storytelling Feature */}
            <AmbientHammamFeature
              onBookHammam={() => {
                const hammam = finahStore.getServices().find(s => s.categoryId === 'hammam');
                if (hammam) handleOpenBookingForService(hammam);
              }}
              onDesignVisit={() => navigateTo('design-visit')}
            />
            <HammamFeature
              onBookHammam={() => {
                const hammam = finahStore.getServices().find(s => s.categoryId === 'hammam');
                if (hammam) handleOpenBookingForService(hammam);
              }}
              onExploreHammam={() => navigateTo('hammam')}
            />
            <CategoryExplorer
              onSelectService={srv => setDetailService(srv)}
              onBookService={srv => handleOpenBookingForService(srv)}
              onViewAllServices={() => navigateTo('services')}
            />
            <FindYourRitual
              onBookService={srv => handleOpenBookingForService(srv)}
              onInquireService={srv => {
                if (srv.categoryId === 'bridal') {
                  setIsBridalInquiryOpen(true);
                } else {
                  handleOpenBookingForService(srv);
                }
              }}
              onAddToVisit={srv => handleOpenBookingForService(srv)}
            />
            {/* Inline Design My Visit Showcase */}
            <DesignMyVisit
              onProceedToBooking={seq => handleOpenBookingForVisitSequence(seq)}
            />
            <BridalFeature onOpenBridalInquiry={() => setIsBridalInquiryOpen(true)} />
            <TestimonialSection
              onOpenBooking={() => {
                setBookingInitialService(null);
                setBookingAdditionalServices([]);
                setIsBookingOpen(true);
              }}
              onDesignVisit={() => navigateTo('design-visit')}
            />
            {/* Wellness Journal Section */}
            <WellnessJournalSection
              onExploreJournal={() => navigateTo('journal')}
              onSelectArticle={slug => navigateTo('journal-detail', slug)}
              onBookService={srv => handleOpenBookingForService(srv)}
            />
            <BookingWalkthrough />
            <FaqSection />
          </>
        )}

        {/* VIEW: THE EXPERIENCE */}
        {currentView === 'experience' && (
          <div>
            <ExperienceIntroduction />
            <HammamFeature
              onBookHammam={() => {
                const hammam = finahStore.getServices().find(s => s.categoryId === 'hammam');
                if (hammam) handleOpenBookingForService(hammam);
              }}
              onExploreHammam={() => navigateTo('hammam')}
            />
            <TestimonialSection
              onOpenBooking={() => {
                setBookingInitialService(null);
                setBookingAdditionalServices([]);
                setIsBookingOpen(true);
              }}
              onDesignVisit={() => navigateTo('design-visit')}
            />
            <BookingWalkthrough />
          </div>
        )}

        {/* VIEW: TESTIMONIALS */}
        {currentView === 'testimonials' && (
          <div>
            <TestimonialSection
              onOpenBooking={() => {
                setBookingInitialService(null);
                setBookingAdditionalServices([]);
                setIsBookingOpen(true);
              }}
              onDesignVisit={() => navigateTo('design-visit')}
            />
            <BookingWalkthrough />
          </div>
        )}

        {/* VIEW: SERVICES CATALOG */}
        {currentView === 'services' && (
          <ServicesCatalogView
            onSelectService={srv => setDetailService(srv)}
            onBookService={srv => handleOpenBookingForService(srv)}
          />
        )}

        {/* VIEW: MOROCCAN HAMMAM */}
        {currentView === 'hammam' && (
          <HammamPageView
            onBookService={srv => handleOpenBookingForService(srv)}
            onOpenDetails={srv => setDetailService(srv)}
          />
        )}

        {/* VIEW: BRIDAL EXPERIENCES */}
        {currentView === 'bridal' && (
          <BridalPageView onOpenInquiry={() => setIsBridalInquiryOpen(true)} />
        )}

        {/* VIEW: DESIGN MY VISIT */}
        {currentView === 'design-visit' && (
          <DesignMyVisit
            onProceedToBooking={seq => handleOpenBookingForVisitSequence(seq)}
          />
        )}

        {/* VIEW: VISIT & CONTACT */}
        {currentView === 'visit' && (
          <VisitContactView
            onOpenBooking={() => {
              setBookingInitialService(null);
              setBookingAdditionalServices([]);
              setIsBookingOpen(true);
            }}
          />
        )}

        {/* VIEW: FAQ */}
        {currentView === 'faq' && <FaqSection />}

        {/* VIEW: CUSTOMER ACCOUNT */}
        {currentView === 'customer-account' && (
          <CustomerPortal
            initialTab="bookings"
            onRebook={serviceId => {
              const srv = finahStore.getServices().find(s => s.id === serviceId);
              if (srv) handleOpenBookingForService(srv);
            }}
            onClose={() => navigateTo('home')}
          />
        )}

        {/* VIEW: FINAH REWARDS */}
        {currentView === 'rewards' && (
          <CustomerPortal
            initialTab="rewards"
            onRebook={serviceId => {
              const srv = finahStore.getServices().find(s => s.id === serviceId);
              if (srv) handleOpenBookingForService(srv);
            }}
            onClose={() => navigateTo('home')}
          />
        )}

        {/* VIEW: MEMBER SPOTLIGHT */}
        {currentView === 'spotlight' && (
          <CustomerPortal
            initialTab="spotlight"
            onRebook={serviceId => {
              const srv = finahStore.getServices().find(s => s.id === serviceId);
              if (srv) handleOpenBookingForService(srv);
            }}
            onClose={() => navigateTo('home')}
          />
        )}

        {/* VIEW: SPA FACILITIES GALLERY */}
        {currentView === 'facilities' && (
          <CustomerPortal
            initialTab="facilities"
            onRebook={serviceId => {
              const srv = finahStore.getServices().find(s => s.id === serviceId);
              if (srv) handleOpenBookingForService(srv);
            }}
            onClose={() => navigateTo('home')}
          />
        )}

        {/* VIEW: FIND YOUR RITUAL GUIDED EXPERIENCE */}
        {currentView === 'find-ritual' && (
          <FindYourRitual
            onBookService={srv => handleOpenBookingForService(srv)}
            onInquireService={srv => {
              if (srv.categoryId === 'bridal') {
                setIsBridalInquiryOpen(true);
              } else {
                handleOpenBookingForService(srv);
              }
            }}
            onAddToVisit={srv => handleOpenBookingForService(srv)}
          />
        )}

        {/* VIEW: THE FINAH JOURNAL (LISTING) */}
        {currentView === 'journal' && (
          <FinahJournalView
            onSelectArticle={slug => navigateTo('journal-detail', slug)}
            onBookService={srv => handleOpenBookingForService(srv)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW: JOURNAL ARTICLE DETAIL (/journal/[slug]) */}
        {currentView === 'journal-detail' && (
          <ArticleDetailView
            article={activeArticle}
            onNavigateJournal={() => navigateTo('journal')}
            onSelectArticle={slug => navigateTo('journal-detail', slug)}
            onBookService={srv => handleOpenBookingForService(srv)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW: STAFF DASHBOARD PORTAL */}
        {currentView === 'staff-portal' && (
          <StaffDashboard onClose={() => navigateTo('home')} />
        )}

        {/* VIEW: POLICIES */}
        {(currentView === 'privacy' || currentView === 'terms') && (
          <PolicyView
            type={currentView as 'privacy' | 'terms'}
            onBack={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={view => navigateTo(view)}
        onOpenBooking={() => {
          setBookingInitialService(null);
          setBookingAdditionalServices([]);
          setIsBookingOpen(true);
        }}
      />

      {/* Floating Mobile Bottom Action (Adheres strictly to <= 15% mobile viewport cap) */}
      <div className="md:hidden fixed bottom-3 inset-x-4 z-30 flex items-center gap-2">
        <button
          onClick={() => {
            setBookingInitialService(null);
            setBookingAdditionalServices([]);
            setIsBookingOpen(true);
          }}
          className="flex-1 py-3 px-4 text-xs font-semibold tracking-wide text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#075B60]"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('hero.cta.book')}</span>
        </button>

        <button
          onClick={() => setIsConciergeOpen(true)}
          className="px-4 py-3 text-xs font-semibold tracking-wide text-[#075B60] bg-[#FFF7EA] hover:bg-[#F7E5C8] border border-[#075B60]/40 rounded-xl shadow-md flex items-center justify-center cursor-pointer"
        >
          {isArabic ? 'استشارة' : 'Concierge'}
        </button>
      </div>

      {/* Global Modals */}
      {isBookingOpen && (
        <BookingWizard
          onClose={() => setIsBookingOpen(false)}
          initialService={bookingInitialService}
          additionalServices={bookingAdditionalServices}
        />
      )}

      {isBridalInquiryOpen && (
        <BridalInquiryModal
          onClose={() => setIsBridalInquiryOpen(false)}
        />
      )}

      {isConciergeOpen && (
        <AskFinahConcierge
          onClose={() => setIsConciergeOpen(false)}
          onBookService={srv => handleOpenBookingForService(srv)}
        />
      )}

      {detailService && (
        <ServiceDetailModal
          service={detailService}
          onClose={() => setDetailService(null)}
          onBook={srv => {
            setDetailService(null);
            handleOpenBookingForService(srv);
          }}
          onInquire={srv => {
            setDetailService(null);
            if (srv.categoryId === 'bridal') {
              setIsBridalInquiryOpen(true);
            } else {
              setIsConciergeOpen(true);
            }
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
