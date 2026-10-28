import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
  isArabic: boolean;
}

const translations: Record<string, { ar: string; en: string }> = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.experience': { ar: 'تجربة فنة', en: 'The Experience' },
  'nav.services': { ar: 'الخدمات', en: 'Services' },
  'nav.hammam': { ar: 'الحمام المغربي', en: 'Moroccan Hammam' },
  'nav.bridal': { ar: 'طقوس العروس', en: 'Bridal' },
  'nav.packages': { ar: 'الباقات', en: 'Packages' },
  'nav.design_visit': { ar: 'صممي زيارتك', en: 'Design My Visit' },
  'nav.journal': { ar: 'مجلة العافية', en: 'Wellness Journal' },
  'nav.find_ritual': { ar: 'اكتشفي طقسك', en: 'Find Your Ritual' },
  'nav.visit': { ar: 'الموقع والزيارة', en: 'Visit & Contact' },
  'nav.faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'nav.book': { ar: 'احجزي زيارتك', en: 'Book a Visit' },
  'nav.my_account': { ar: 'حجوزاتي', en: 'My Bookings' },
  'nav.admin_portal': { ar: 'بوابة الإدارة', en: 'Staff Portal' },

  // Hero
  'hero.tagline': { ar: 'مركز تجميل مغربي', en: 'Moroccan Beauty House' },
  'hero.headline': { ar: 'طقوس الجمال المغربي، بروح فنة', en: 'Moroccan beauty rituals, the Finah way.' },
  'hero.subtext': {
    ar: 'ملاذ أنثوي هادئ في دبي، يحتفي بأسرار الحمام المغربي الأصيل، وعناية الورد وزيت الأركان النقي لراحة الجسم والروح.',
    en: 'An intimate beauty sanctuary in Dubai honoring authentic Moroccan hammam rituals, pure argan elixirs, and restorative tranquility.'
  },
  'hero.cta.services': { ar: 'اكتشفي الخدمات', en: 'Explore Services' },
  'hero.cta.book': { ar: 'احجزي زيارتك', en: 'Book Your Visit' },
  'hero.cta.design': { ar: 'صممي زيارتك المتكاملة', en: 'Design Your Visit' },

  // Philosophy
  'experience.title': { ar: 'روح فنة المغربية', en: 'The Spirit of Finah' },
  'experience.heading': { ar: 'السكينة، الحرفية، والطقوس المتوارثة', en: 'Stillness, Craft, and Ancestral Rituals' },
  'experience.body1': {
    ar: 'في فنة، لا نعتبر العناية مجرد موعد تجميلي، بل طقساً مغربياً حياً يجدد النشاط ويعيد التوازن. من دفء غرف البخار التقليدية إلى نفحات زهر البرتقال والورد الدمشقي، كل تفصيلة صُممت لتمنحك خصوصية مطلقة.',
    en: 'At Finah, care is not merely an appointment; it is a living Moroccan ritual designed to restore equilibrium. From the warm embrace of private steam suites to the uplifting aroma of neroli and Damask rose, every detail ensures serene privacy.'
  },
  'experience.body2': {
    ar: 'نستخدم مكونات طبيعية أصيلة مستوردة مباشرة من التعاونيات المغربية النسائية: صابون زيت الزيتون البلدي، غاسول جبال الأطلس، وزيت الأركان البكر المعصور على البارد.',
    en: 'We source pure botanical treasures directly from Moroccan women\'s cooperatives: cold-pressed olive black soap, Atlas mountain mineral ghassoul, and virgin argan oil.'
  },

  // Hammam Feature
  'hammam.badge': { ar: 'الطقس الأصيل', en: 'Signature Ritual' },
  'hammam.title': { ar: 'الحمام المغربي الأصيل', en: 'Authentic Moroccan Hammam' },
  'hammam.description': {
    ar: 'تجربة تطهير وتجديد عميقة تنقلك إلى أجواء الرياض المغربية، تجمع بين بخار الأوكالبتوس الدافئ، فرك الكيس الدقيق، وقناع الطين المعطر.',
    en: 'A profound cleansing and renewing journey transporting you to Moroccan riads, combining aromatic steam, precision kessa exfoliation, and herbal clay wrap.'
  },
  'hammam.step1.title': { ar: 'فتح المسام بالبخار الدافئ', en: 'Warm Steam Chamber' },
  'hammam.step1.desc': { ar: 'استرخاء في دفء البخار لتهدئة العضلات وفتح مسام البشرة بلطف.', en: 'Gentle warmth to soften tensions and open pores.' },
  'hammam.step2.title': { ar: 'الصابون الأسود البلدي', en: 'Moroccan Black Soap' },
  'hammam.step2.desc': { ar: 'تغطية الجسم بمستخلص زيت الزيتون الغني بفيتامين E لتليين البشرة.', en: 'Natural olive paste rich in vitamin E to prep the skin.' },
  'hammam.step3.title': { ar: 'تقشير الكيس المغربي', en: 'Kessa Glove Exfoliation' },
  'hammam.step3.desc': { ar: 'إزالة لطيفة وعميقة لكافة الخلايا الميتة والشوائب.', en: 'Precision technique clearing impurities and dullness.' },
  'hammam.step4.title': { ar: 'غاسول الأطلس وماء الورد', en: 'Ghassoul & Rose Water' },
  'hammam.step4.desc': { ar: 'قناع الطين المعدني لشد وتنعيم الجسم مع لمسة ماء الورد المنعشة.', en: 'Mineral clay body wrap with refreshing rosewater.' },

  // Guided Ritual Tool
  'ritual_finder.title': { ar: 'اكتشفي طقسك المثالي', en: 'Find Your Ritual' },
  'ritual_finder.subtitle': {
    ar: 'دليل بسيط يرشدك للخدمة الأكثر ملاءمة لاحتياجك ووقتك.',
    en: 'A guided selection to recommend the ceremony tailored to your time and intention.'
  },
  'ritual_finder.q1': { ar: 'ما نوع الزيارة التي تتطلعين إليها اليوم؟', en: 'What kind of visit are you looking for today?' },
  'ritual_finder.q2': { ar: 'كم من الوقت يتوفر لديك لهذه الزيارة؟', en: 'How much time do you have for this experience?' },
  'ritual_finder.q3': { ar: 'هل تستعدين لمناسبة خاصة قريبة؟', en: 'Are you preparing for a special upcoming occasion?' },
  'ritual_finder.recommendation': { ar: 'الطقس الموصى به لكِ', en: 'Your Tailored Ritual Recommendation' },
  'ritual_finder.alternative': { ar: 'خيارات أخرى مناسبة', en: 'Alternative rituals to consider' },
  'ritual_finder.why': { ar: 'لماذا هذا الطقس يناسبك؟', en: 'Why this ritual suits you' },

  // Booking system
  'booking.title': { ar: 'حجز زيارة في فنة', en: 'Reserve Your Visit at Finah' },
  'booking.step1': { ar: 'اختيار الطقس', en: 'Select Ritual' },
  'booking.step2': { ar: 'الأخصائية', en: 'Specialist' },
  'booking.step3': { ar: 'الموعد والوقت', en: 'Date & Time' },
  'booking.step4': { ar: 'بيانات التواصل', en: 'Your Details' },
  'booking.step5': { ar: 'المراجعة والتأكيد', en: 'Review & Terms' },
  'booking.any_staff': { ar: 'أي أخصائية متاحة (الأسرع)', en: 'Any Available Specialist (Fastest)' },
  'booking.guest_mode_note': { ar: 'يمكنك إتمام الحجز كضيف دون الحاجة لإنشاء حساب مسبق.', en: 'You can book as a guest without creating an account.' },
  'booking.duration': { ar: 'المدة:', en: 'Duration:' },
  'booking.minutes': { ar: 'دقيقة', en: 'mins' },
  'booking.price': { ar: 'السعر:', en: 'Price:' },
  'booking.aed': { ar: 'درهم', en: 'AED' },
  'booking.deposit': { ar: 'مبلغ العربون:', en: 'Deposit:' },
  'booking.balance': { ar: 'المتبقي عند الزيارة:', en: 'Remaining balance at visit:' },
  'booking.request_mode_notice': {
    ar: 'نظام الحجز حالياً في وضع "طلب الموعد": سيقوم فريق فنة بمراجعة طلبك والتأكيد معك مباشرة.',
    en: 'Booking is currently in "Appointment Request" mode: our team will review your selection and confirm availability promptly.'
  },
  'booking.live_mode_notice': {
    ar: 'حجز فوري مباشر مؤكد وفق التوفر اللحظي للمواعيد.',
    en: 'Live instant booking with real-time slot reservation.'
  },
  'booking.terms_agreement': {
    ar: 'أوافق على سياسة الإلغاء (إمكانية التعديل قبل 24 ساعة من الموعد).',
    en: 'I agree to the cancellation policy (rescheduling allowed up to 24 hours prior).'
  },
  'booking.submit_request': { ar: 'إرسال طلب الحجز', en: 'Submit Booking Request' },
  'booking.confirm_booking': { ar: 'تأكيد الحجز الفوري', en: 'Confirm Booking' },
  'booking.hold_notice': { ar: 'يتم حفظ هذا الموعد مؤقتاً لمدة 10 دقائق لإتمام الحجز.', en: 'This slot is held for 10 minutes to allow completion.' },

  // Buttons & Shared
  'btn.back': { ar: 'السابق', en: 'Back' },
  'btn.next': { ar: 'المتابعة', en: 'Next' },
  'btn.close': { ar: 'إغلاق', en: 'Close' },
  'btn.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'btn.reschedule': { ar: 'تعديل الموعد', en: 'Reschedule' },
  'btn.ask_service': { ar: 'استفسري عن هذا الطقس', en: 'Inquire About This Ritual' },
  'btn.add_to_calendar': { ar: 'إضافة إلى التقويم', en: 'Add to Calendar' },
  'btn.view_catalog': { ar: 'عرض جميع الخدمات', en: 'View All Services' },

  // Concierge
  'concierge.title': { ar: 'مستشارة فنة', en: 'Ask Finah Concierge' },
  'concierge.placeholder': { ar: 'اسألي عن الحمام، مدة الجلسات، أو نصائح الاستعداد...', en: 'Ask about hammam rituals, prep tips, or bridal journeys...' },
  'concierge.disclaimer': {
    ar: 'المستشارة تقدم معلومات من دليل خدمات وسياسات فنة المعتمدة، ولا تقدم تشخيصاً طبياً.',
    en: 'Answers are drawn from Finah\'s verified service catalog and policies, not medical advice.'
  },

  // Bridal
  'bridal.title': { ar: 'طقوس العروس المغربية', en: 'Moroccan Bridal Sanctuary' },
  'bridal.tagline': { ar: 'بريق، نقاء، وسكينة قبل اليوم المنتظر', en: 'Luminance, purity, and stillness before your day' },
  'bridal.inquire_cta': { ar: 'طلب استشارة العروس المخصصة', en: 'Request Bridal Consultation' },

  // Customer Account
  'account.title': { ar: 'سجل المواعيد والزيارات', en: 'My Appointments & Sanctuary Visits' },
  'account.empty': { ar: 'لا توجد حجوزات مسجلة بهذا الهاتف حالياً.', en: 'No appointments found for this contact number.' },
  'account.lookup_phone': { ar: 'رقم الهاتف المسجل للحجز:', en: 'Contact phone used for booking:' },
  'account.lookup_btn': { ar: 'عرض حجوزاتي', en: 'Find My Bookings' },

  // Testimonials & Reviews
  'testimonials.kicker': { ar: 'آراء وشهادات ضيفات فنة', en: 'Guest Experiences & Verified Trust' },
  'testimonials.title': { ar: 'ثقة متوارثة وشهادات من قلب التجربة', en: 'Revered Trust, Authored by Our Guests' },
  'testimonials.subtitle': {
    ar: 'تجارب حقيقية لضيفات عشن دفء الحمام المغربي، نضارة الورد الدمشقي، والسكينة الخالصة في أجنحتنا الخاصة.',
    en: 'Authentic testimonials from guests who experienced the restorative warmth of Moroccan steam, Damask rose elixirs, and private sanctuary tranquility.'
  },
  'testimonials.score_summary': { ar: 'متوسط التقييم العام من ضيفات الملاذ', en: 'Overall Sanctuary Guest Rating' },
  'testimonials.share_review': { ar: 'شاركينا تجربتك', en: 'Share Your Experience' },
  'testimonials.filter_all': { ar: 'جميع الطقوس', en: 'All Rituals' },
  'testimonials.filter_hammam': { ar: 'الحمام المغربي', en: 'Moroccan Hammam' },
  'testimonials.filter_bridal': { ar: 'طقوس العروس', en: 'Bridal Journey' },
  'testimonials.filter_facial': { ar: 'عناية الوجه والورد', en: 'Facial & Rose' },
  'testimonials.filter_hair': { ar: 'علاج الأركان للشعر', en: 'Argan Hair Care' },
  'testimonials.filter_custom': { ar: 'صممي زيارتك', en: 'Custom Visit' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Respect explicit choice in localStorage or URL, default to Arabic 'ar' as requested
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/en')) return 'en';
      if (path.startsWith('/ar')) return 'ar';
      const saved = localStorage.getItem('finah_lang') as Language;
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar'; // Default first visits to Arabic as instructed
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('finah_lang', language);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Sync URL path softly without full refresh if feasible
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.pathname = `/${lang}`;
      window.history.replaceState({}, '', url.toString());
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.ar || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dir,
        t,
        isArabic: language === 'ar'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
