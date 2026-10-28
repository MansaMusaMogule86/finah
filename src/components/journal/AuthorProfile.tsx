import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { JournalAuthor } from '../../types/journal';
import {
  Award,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  MessageCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AuthorProfileProps {
  author: JournalAuthor;
  companionServiceName?: { ar: string; en: string };
  onBookConsultation?: () => void;
  className?: string;
}

export const AuthorProfile: React.FC<AuthorProfileProps> = ({
  author,
  companionServiceName,
  onBookConsultation,
  className = ''
}) => {
  const { isArabic } = useLanguage();
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const credentials = author.credentials
    ? isArabic
      ? author.credentials.ar
      : author.credentials.en
    : [];

  const specialties = author.specialties
    ? isArabic
      ? author.specialties.ar
      : author.specialties.en
    : [];

  const authorName = isArabic ? author.name.ar : author.name.en;
  const authorRole = isArabic ? author.role.ar : author.role.en;
  const authorBio = isArabic ? author.bio.ar : author.bio.en;

  const whatsappMessage = encodeURIComponent(
    isArabic
      ? `مرحباً كونسيرج فنة، أود استشارة الأخصائية ${author.name.ar} بخصوص مقالها المنشور في مجلة فنة.`
      : `Hello Finah Concierge, I would like to consult with specialist ${author.name.en} regarding their editorial guide on The Finah Journal.`
  );

  return (
    <div
      className={`bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F1C17F]/50 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Subtle Architectural Ambient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F1C17F]/10 rounded-full blur-2xl pointer-events-none -translate-y-12 translate-x-12" />

      {/* Header with Verified Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#F1C17F]/30 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#075B60]/10 border border-[#075B60]/20 rounded-full text-xs font-semibold text-[#075B60] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#075B60]" />
          <span>{isArabic ? 'أخصائية معتمدة لدى فنة' : 'Verified Finah Specialist'}</span>
        </div>

        {author.yearsOfExperience && (
          <div className="inline-flex items-center gap-1.5 text-xs text-[#075B60] font-medium font-sans">
            <Award className="w-4 h-4 text-[#F1C17F]" />
            <span>
              {isArabic
                ? `${author.yearsOfExperience}+ سنوات من الخبرة المعتمدة`
                : `${author.yearsOfExperience}+ Years Specialized Mastery`}
            </span>
          </div>
        )}
      </div>

      {/* Main Author Bio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Avatar Column */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center text-center">
          <div className="relative group mb-3">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#075B60] via-[#F1C17F] to-[#075B60] shadow-md">
              <img
                src={author.avatar}
                alt={authorName}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            <span className="absolute bottom-1 right-2 rtl:right-auto rtl:left-2 p-1 bg-[#075B60] text-white rounded-full border-2 border-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C17F]" />
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#173D3E] mb-1">
            {authorName}
          </h3>
          <p className="text-xs text-[#075B60] font-semibold leading-relaxed mb-3">
            {authorRole}
          </p>

          <a
            href={`https://wa.me/971500000000?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 text-[11px] font-semibold text-[#075B60] bg-[#F7E5C8]/60 hover:bg-[#F7E5C8] border border-[#F1C17F]/40 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استشيري الأخصائية' : 'Consult Specialist'}</span>
          </a>
        </div>

        {/* Content Column */}
        <div className="md:col-span-8 lg:col-span-9 space-y-5">
          <div>
            <span className="text-[11px] font-semibold text-[#075B60]/80 uppercase tracking-widest block mb-1.5">
              {isArabic ? 'عن الخبيرة ومسيرتها المهنية' : 'Specialist Background & Philosophy'}
            </span>
            <p className="text-xs sm:text-sm text-[#173D3E]/85 font-sans leading-relaxed">
              {authorBio}
            </p>
          </div>

          {/* Verified Credentials */}
          {credentials.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#173D3E] flex items-center gap-1.5 mb-2.5">
                <Award className="w-3.5 h-3.5 text-[#075B60]" />
                <span>{isArabic ? 'الاعتمادات والشهادات الدولية' : 'Verified Credentials & Diplomas'}</span>
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-[#173D3E]/80">
                {credentials.map((cred, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#FFFDF9] p-2 rounded-xl border border-[#F1C17F]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{cred}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Specialties */}
          {specialties.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#173D3E] block mb-2">
                {isArabic ? 'مجالات التخصص الدقيق' : 'Core Clinical & Botanical Focus Areas'}
              </span>
              <div className="flex flex-wrap gap-2">
                {specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#F7E5C8]/50 border border-[#F1C17F]/40 text-[#075B60] text-xs font-medium rounded-lg font-sans"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          {onBookConsultation && (
            <div className="pt-4 border-t border-[#F1C17F]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#173D3E]/70 font-sans">
                {companionServiceName
                  ? isArabic
                    ? `يمكنكِ حجز جلسة استشارية خاصة مع ${author.name.ar} لحضور ${companionServiceName.ar}.`
                    : `Schedule your private diagnostic consultation with ${author.name.en} for ${companionServiceName.en}.`
                  : isArabic
                  ? `احجزي جلستكِ القادمة بإشراف الأخصائية ${author.name.ar}.`
                  : `Book your next sanctuary ritual supervised by ${author.name.en}.`}
              </p>

              <button
                onClick={onBookConsultation}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#075B60] hover:bg-[#064a4e] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider flex-shrink-0"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>{isArabic ? 'حجز موعد بإشرافها' : 'Reserve Appointment'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
