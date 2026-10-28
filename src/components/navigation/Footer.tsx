import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { Instagram, MapPin, Clock, Phone, Mail, ShieldAlert, Heart } from 'lucide-react';
import { finahStore } from '../../services/api';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const { t, isArabic } = useLanguage();
  const config = finahStore.getConfig();

  return (
    <footer className="bg-[#173D3E] text-[#FFF7EA] border-t border-[#075B60]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#075B60]/60">
          {/* Col 1: Brand & Identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo size="md" variant="light" />
            </div>
            <p className="text-sm text-[#FFF7EA]/80 leading-relaxed max-w-sm">
              {isArabic ? config.tagline.ar : config.tagline.en}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={config.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#F1C17F] hover:text-[#FFF7EA] transition-colors"
                aria-label="Instagram @finahbeauty"
              >
                <Instagram className="w-4 h-4" />
                <span>{config.instagram.handle}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Moroccan Rituals & Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F1C17F]">
              {isArabic ? 'طقوس الجمال المغربي' : 'Moroccan Rituals'}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#FFF7EA]/85">
              <li>
                <button
                  onClick={() => onNavigate('hammam')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'الحمام المغربي الأصيل' : 'Traditional Moroccan Hammam'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bridal')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'طقوس العروس الملكية' : 'Royal Bridal Journeys'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'علاجات الأركان للشعر' : 'Argan Hair Therapies'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'نضارة الوجه بماء الورد' : 'Damask Rose Facials'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('design-visit')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'تصميم زيارة مخصصة' : 'Design Custom Visit'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rewards')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer text-[#F1C17F]/90 font-medium"
                >
                  {isArabic ? 'مكافآت ونقاط فنة' : 'Finah Rewards & Points'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'آراء وشهادات ضيفاتنا' : 'Guest Reviews & Ratings'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('journal')}
                  className="hover:text-[#F1C17F] transition-colors cursor-pointer"
                >
                  {isArabic ? 'مجلة فنة للعافية' : 'Finah Wellness Journal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Visit Information */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F1C17F]">
              {isArabic ? 'أوقات الزيارة والموقع' : 'Sanctuary Visit & Hours'}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#FFF7EA]/85 leading-relaxed">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F1C17F] shrink-0 mt-0.5" />
                <span>
                  {isArabic
                    ? 'يومياً: 10:00 صباحاً – 9:00 مساءً (بتوقيت دبي)'
                    : 'Daily: 10:00 AM – 9:00 PM GST (Dubai Time)'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F1C17F] shrink-0 mt-0.5" />
                <div>
                  <span>{isArabic ? config.address.ar : config.address.en}</span>
                  <p className="text-[11px] text-[#F1C17F]/80 italic mt-0.5">
                    {isArabic
                      ? 'موقع المركز التفصيلي قيد الاعتماد من المالك.'
                      : 'Exact boutique location pending owner sign-off.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F1C17F] shrink-0" />
                <span dir="ltr">{config.phone.display}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Guest Sanctuary & Staff Access */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F1C17F]">
              {isArabic ? 'حجوزات الضيوف والإدارة' : 'Guest Care & Management'}
            </h4>
            <p className="text-xs text-[#FFF7EA]/80 leading-relaxed">
              {isArabic
                ? 'الحجز متاح كضيف دون الحاجة لتسجيل حساب مسبق، مع إمكانية مراجعة الحجز لاحقاً برقم الهاتف.'
                : 'Guest reservations available without account sign-up. Retrieve your appointment anytime with your contact number.'}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2 px-3 text-xs font-semibold text-[#173D3E] bg-[#F1C17F] hover:bg-[#ebd5b3] rounded transition-colors text-center cursor-pointer"
              >
                {t('hero.cta.book')}
              </button>
              <button
                onClick={() => onNavigate('staff-portal')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs text-[#FFF7EA]/75 hover:text-[#F1C17F] border border-[#075B60] rounded transition-colors cursor-pointer"
              >
                <span>{t('nav.admin_portal')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Restrained metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF7EA]/60">
          <div className="flex items-center gap-2">
            <RosetteEmblem size={18} color="#F1C17F" />
            <span>
              &copy; {new Date().getFullYear()} FINAH BEAUTY (فنة - مركز تجميل مغربي).
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#FFF7EA] transition-colors"
            >
              {isArabic ? 'الخصوصية' : 'Privacy'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-[#FFF7EA] transition-colors"
            >
              {isArabic ? 'الشروط والأحكام' : 'Terms'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:text-[#FFF7EA] transition-colors"
            >
              {isArabic ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
