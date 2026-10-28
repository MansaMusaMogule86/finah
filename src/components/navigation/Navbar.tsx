import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import {
  Menu,
  X,
  Calendar,
  User,
  Sparkles,
  ChevronDown,
  BookOpen,
  Award,
  MapPin,
  Compass,
  Sparkle,
  Compass as CompassIcon,
  Camera
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenBooking: () => void;
  onOpenConcierge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenConcierge
}) => {
  const { toggleLanguage, t, isArabic } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop navigation links (curated to fit comfortably on 1024px-1366px without collision)
  const primaryNavLinks = [
    { id: 'services', label: t('nav.services') },
    { id: 'hammam', label: t('nav.hammam') },
    { id: 'find-ritual', label: isArabic ? 'اكتشفي طقسكِ' : 'Find Ritual' },
    { id: 'bridal', label: t('nav.bridal') },
    { id: 'design-visit', label: t('nav.design_visit') }
  ];

  // Secondary destinations housed in the sleek "More" dropdown on desktop
  const secondaryNavLinks = [
    {
      id: 'experience',
      label: t('nav.experience'),
      desc: isArabic ? 'فلسفة الضيافة وسكينة الحواس' : 'Sanctuary philosophy & heritage',
      icon: Sparkle
    },
    {
      id: 'journal',
      label: t('nav.journal'),
      desc: isArabic ? 'مقالات الجمال والعناية المغربية' : 'Moroccan skincare & botanical journal',
      icon: BookOpen
    },
    {
      id: 'rewards',
      label: isArabic ? 'مكافآت فنة' : 'Finah Rewards',
      desc: isArabic ? 'نقاط الولاء ومزايا العضوية' : 'Loyalty points & member privileges',
      icon: Award
    },
    {
      id: 'spotlight',
      label: isArabic ? 'إضاءات العضويات' : 'Member Spotlight',
      desc: isArabic ? 'قصص التحول وألبوم صور الزيارات' : 'Featured transformations & visit photos',
      icon: Camera
    },
    {
      id: 'facilities',
      label: isArabic ? 'مرافق السبا' : 'Spa Facilities',
      desc: isArabic ? 'أجنحة الحمام الملكي وصالونات العرائس' : 'Hammam suites & private sanctuary vaults',
      icon: Compass
    },
    {
      id: 'visit',
      label: t('nav.visit'),
      desc: isArabic ? 'موقع البوتيك وساعات الاستقبال' : 'Boutique location & visiting hours',
      icon: MapPin
    }
  ];

  // Full flat list for mobile drawer
  const allMobileNavLinks = [
    { id: 'services', label: t('nav.services') },
    { id: 'hammam', label: t('nav.hammam') },
    { id: 'find-ritual', label: isArabic ? 'اكتشفي طقسكِ (دليل الطقوس)' : 'Find Your Ritual' },
    { id: 'bridal', label: t('nav.bridal') },
    { id: 'design-visit', label: t('nav.design_visit') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'journal', label: t('nav.journal') },
    { id: 'rewards', label: isArabic ? 'مكافآت فنة' : 'Rewards' },
    { id: 'spotlight', label: isArabic ? 'إضاءات العضويات' : 'Member Spotlight' },
    { id: 'facilities', label: isArabic ? 'مرافق السبا' : 'Spa Facilities' },
    { id: 'visit', label: t('nav.visit') }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const isSecondaryActive = secondaryNavLinks.some(link => link.id === currentView) || currentView === 'journal-detail';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF7EA]/95 backdrop-blur-md border-b border-[#DBC7A6]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Zone 1: Brand Wordmark / Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="shrink-0 flex items-center focus:outline-none group cursor-pointer py-1"
          aria-label={isArabic ? 'الرئيسية - مركز فنة' : 'Finah Beauty Home'}
        >
          <Logo size="sm" />
        </button>

        {/* Zone 2: Curated single-line nav links (Guaranteed zero overlap across all resolutions) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-3 2xl:gap-5 text-xs xl:text-sm font-medium text-[#173D3E] shrink min-w-0">
          {primaryNavLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`whitespace-nowrap transition-colors relative px-2 py-1 hover:text-[#075B60] cursor-pointer ${
                  isActive ? 'text-[#075B60] font-semibold' : 'text-[#173D3E]/85'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#075B60] rounded-full" />
                )}
              </button>
            );
          })}

          {/* Sleek "More" Dropdown Menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`whitespace-nowrap inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer hover:text-[#075B60] ${
                isSecondaryActive || moreMenuOpen
                  ? 'text-[#075B60] font-semibold bg-[#F7E5C8]/50'
                  : 'text-[#173D3E]/85'
              }`}
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
            >
              <span>{isArabic ? 'المزيد' : 'More'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreMenuOpen ? 'rotate-180 text-[#075B60]' : 'text-[#173D3E]/60'
                }`}
              />
              {isSecondaryActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#075B60] rounded-full" />
              )}
            </button>

            {/* Dropdown Floating Card */}
            {moreMenuOpen && (
              <div
                className={`absolute top-full mt-2 w-64 bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl p-2 z-50 animate-fadeIn ${
                  isArabic ? 'left-0 text-right' : 'right-0 text-left'
                }`}
              >
                <div className="space-y-1">
                  {secondaryNavLinks.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLinkClick(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer text-right rtl:text-right ltr:text-left ${
                          isActive
                            ? 'bg-[#075B60] text-[#FFF7EA]'
                            : 'hover:bg-[#F7E5C8]/60 text-[#173D3E]'
                        }`}
                      >
                        <ItemIcon
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isActive ? 'text-[#F1C17F]' : 'text-[#075B60]'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold leading-snug">{item.label}</p>
                          <p
                            className={`text-[10px] leading-tight mt-0.5 ${
                              isActive ? 'text-[#FFF7EA]/75' : 'text-[#173D3E]/65'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Actions + Concierge + Language + Book Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Ask Finah Concierge: compact on laptop screens, full on xl */}
          <button
            onClick={onOpenConcierge}
            title={t('concierge.title')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#075B60] bg-[#F7E5C8]/80 hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#075B60] shrink-0" />
            <span className="font-medium whitespace-nowrap hidden xl:inline">
              {t('concierge.title')}
            </span>
          </button>

          {/* Customer Appointments button */}
          <button
            onClick={() => onNavigate('customer-account')}
            title={t('nav.my_account')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              currentView === 'customer-account'
                ? 'bg-[#075B60] text-white'
                : 'text-[#075B60] hover:text-[#173D3E] hover:bg-[#F7E5C8]/50'
            }`}
            aria-label={t('nav.my_account')}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Bilingual Language Switch button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold tracking-wider text-[#075B60] hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl transition-colors cursor-pointer uppercase"
            aria-label="Toggle language"
          >
            {isArabic ? 'English' : 'عربي'}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenBooking}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-xs transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{t('hero.cta.book')}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#075B60] hover:bg-[#F7E5C8] rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DBC7A6]/60 bg-[#FFF7EA] px-4 pt-3 pb-6 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            {allMobileNavLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-[#075B60] text-white font-semibold'
                    : 'text-[#173D3E] hover:bg-[#F7E5C8]/50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#DBC7A6]/40 flex flex-col gap-2 mt-2">
              <button
                onClick={() => {
                  onNavigate('customer-account');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2.5 px-3 text-sm text-[#173D3E] hover:bg-[#F7E5C8]/50 rounded-xl"
              >
                <User className="w-4 h-4 text-[#075B60]" />
                <span>{t('nav.my_account')}</span>
              </button>

              <button
                onClick={() => {
                  onOpenConcierge();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2.5 px-3 text-sm text-[#075B60] bg-[#F7E5C8]/70 hover:bg-[#F7E5C8] rounded-xl font-medium"
              >
                <Sparkles className="w-4 h-4 text-[#075B60]" />
                <span>{t('concierge.title')}</span>
              </button>

              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-1 py-3 px-4 text-center text-sm font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-xs"
              >
                {t('hero.cta.book')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
