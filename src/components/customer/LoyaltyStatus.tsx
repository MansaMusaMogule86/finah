import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { CustomerRewardsProfile, RewardTier } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  Crown,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Award,
  Gift,
  Flame,
  Droplets,
  Star
} from 'lucide-react';

export interface LoyaltyStatusProps {
  customerPhone?: string;
  customerName?: string;
  onViewAllRewards?: () => void;
  onBookRitual?: (serviceId?: string) => void;
  className?: string;
}

interface TierConfig {
  id: RewardTier;
  title: { ar: string; en: string };
  badge: { ar: string; en: string };
  thresholdMin: number;
  thresholdMax: number | null;
  multiplierText: { ar: string; en: string };
  color: string;
  badgeBg: string;
  accentBorder: string;
  highlightPerk: { ar: string; en: string };
}

const SANCTUARY_TIERS: TierConfig[] = [
  {
    id: 'zellige',
    title: { ar: 'عضوية الزليج الأصيل', en: 'Zellige Welcome Tier' },
    badge: { ar: 'المرتبة الترحيبية', en: 'Welcome Tier' },
    thresholdMin: 0,
    thresholdMax: 500,
    multiplierText: { ar: '١ نقطة لكل درهم', en: '1 pt per 1 AED' },
    color: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    accentBorder: 'border-emerald-300',
    highlightPerk: {
      ar: 'اكتساب النقاط التلقائي وضيافة شاي النعناع المغربي',
      en: 'Automatic point accrual & signature mint tea hospitality'
    }
  },
  {
    id: 'amber',
    title: { ar: 'عضوية العنبر المغربي', en: 'Moroccan Amber Tier' },
    badge: { ar: 'مرتبة النخبة والسكينة', en: 'Sanctuary Elite Tier' },
    thresholdMin: 500,
    thresholdMax: 1200,
    multiplierText: { ar: '١.٢٥ نقطة لكل درهم', en: '1.25x Multiplier' },
    color: 'text-[#075B60]',
    badgeBg: 'bg-[#075B60]/10 text-[#075B60] border-[#075B60]/30',
    accentBorder: 'border-[#075B60]',
    highlightPerk: {
      ar: 'مضاعف نقاط ١.٢٥ وترقية مجانية برذاذ ماء الورد الدمشقي',
      en: '1.25x points multiplier & cold-distilled rosewater upgrade'
    }
  },
  {
    id: 'royal_jasmine',
    title: { ar: 'عضوية الياسمين الملكي', en: 'Royal Jasmine Tier' },
    badge: { ar: 'العضوية الملكية الأرفع', en: 'Pinnacle Royal Tier' },
    thresholdMin: 1200,
    thresholdMax: null,
    multiplierText: { ar: '١.٥ نقطة لكل درهم', en: '1.5x Multiplier' },
    color: 'text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    accentBorder: 'border-amber-400',
    highlightPerk: {
      ar: 'جلسة حمام مغربي ملكي كاملة مجاناً سنوياً وأولوية الأجنحة',
      en: 'Complimentary annual royal hammam & guaranteed private suite'
    }
  }
];

interface SparkleParticle {
  char: string;
  left: string;
  top: string;
  color: string;
  size: string;
  delay: string;
  duration: string;
  driftX: string;
}

interface ConfettiPiece {
  left: string;
  top: string;
  color: string;
  size: string;
  delay: string;
  duration: string;
  rotate: number;
  driftX: string;
  isRound?: boolean;
}

const SPARKLE_PARTICLES: SparkleParticle[] = [
  { char: '✦', left: '6%', top: '-18px', color: '#F1C17F', size: '15px', delay: '0s', duration: '2.5s', driftX: '-8px' },
  { char: '✧', left: '15%', top: '2px', color: '#FFF7EA', size: '13px', delay: '0.4s', duration: '2.8s', driftX: '8px' },
  { char: '⋆', left: '26%', top: '-14px', color: '#075B60', size: '14px', delay: '0.8s', duration: '2.4s', driftX: '-5px' },
  { char: '✦', left: '38%', top: '-22px', color: '#F1C17F', size: '18px', delay: '0.2s', duration: '2.6s', driftX: '12px' },
  { char: '✵', left: '48%', top: '4px', color: '#D99B4B', size: '13px', delay: '1.1s', duration: '3.0s', driftX: '-10px' },
  { char: '✧', left: '58%', top: '-18px', color: '#F1C17F', size: '17px', delay: '0.5s', duration: '2.4s', driftX: '6px' },
  { char: '✦', left: '68%', top: '-10px', color: '#075B60', size: '14px', delay: '1.3s', duration: '2.7s', driftX: '-8px' },
  { char: '⋆', left: '78%', top: '2px', color: '#F1C17F', size: '13px', delay: '0.3s', duration: '2.5s', driftX: '10px' },
  { char: '✦', left: '88%', top: '-20px', color: '#D99B4B', size: '17px', delay: '0.9s', duration: '2.8s', driftX: '-6px' },
  { char: '✧', left: '96%', top: '-12px', color: '#FFF7EA', size: '14px', delay: '1.5s', duration: '2.5s', driftX: '8px' }
];

const CONFETTI_PIECES: ConfettiPiece[] = [
  { left: '10%', top: '-20px', color: '#F1C17F', size: '6px', delay: '0.1s', duration: '2.9s', rotate: 25, driftX: '12px' },
  { left: '22%', top: '-26px', color: '#075B60', size: '5px', delay: '0.6s', duration: '3.2s', rotate: 60, driftX: '-14px' },
  { left: '36%', top: '-18px', color: '#D99B4B', size: '7px', delay: '1.2s', duration: '2.8s', rotate: 45, driftX: '16px' },
  { left: '52%', top: '-24px', color: '#F1C17F', size: '6px', delay: '0.3s', duration: '3.1s', rotate: 30, driftX: '-10px' },
  { left: '66%', top: '-28px', color: '#0E8890', size: '5px', delay: '0.9s', duration: '2.7s', rotate: 75, driftX: '15px' },
  { left: '80%', top: '-22px', color: '#F7E5C8', size: '7px', delay: '1.4s', duration: '3.3s', rotate: 15, driftX: '-18px' },
  { left: '92%', top: '-26px', color: '#D99B4B', size: '6px', delay: '0.5s', duration: '3.0s', rotate: 50, driftX: '14px' }
];

export const LoyaltyStatus: React.FC<LoyaltyStatusProps> = ({
  customerPhone = '+971501234567',
  customerName = 'مريم المنصوري',
  onViewAllRewards,
  onBookRitual,
  className = ''
}) => {
  const { isArabic } = useLanguage();

  // Load customer rewards profile from store
  const [profile, setProfile] = useState<CustomerRewardsProfile>(() =>
    finahStore.getCustomerRewards(customerPhone, customerName)
  );

  // Sparkle celebration state
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Re-sync when props change
  useEffect(() => {
    const p = finahStore.getCustomerRewards(customerPhone, customerName);
    setProfile({ ...p });
    if (p.lifetimePointsEarned >= 500) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [customerPhone, customerName]);

  const triggerCelebration = () => {
    setIsCelebrating(true);
    setBannerDismissed(false);
    setTimeout(() => setIsCelebrating(false), 7000);
  };

  // Helper calculations
  const currentTierIndex = SANCTUARY_TIERS.findIndex(t => t.id === profile.tier);
  const currentTier = SANCTUARY_TIERS[currentTierIndex] || SANCTUARY_TIERS[0];
  const nextTier = currentTierIndex < SANCTUARY_TIERS.length - 1 ? SANCTUARY_TIERS[currentTierIndex + 1] : null;

  // Progress Bar Calculations
  const totalScaleMax = 1200;
  const overallProgressPercent = Math.min(100, Math.round((profile.lifetimePointsEarned / totalScaleMax) * 100));
  const pointsNeeded = nextTier ? Math.max(0, nextTier.thresholdMin - profile.lifetimePointsEarned) : 0;
  const estimatedHammamVisits = Math.ceil(pointsNeeded / 430); // 380 AED + 50 bonus pts
  const isMilestoneReached = profile.lifetimePointsEarned >= 500;

  // Interactive tier switcher for reviewing/testing
  const handleSimulateTier = (targetTier: RewardTier) => {
    const pointsMap: Record<RewardTier, number> = {
      zellige: 250,
      amber: 630,
      royal_jasmine: 1350
    };
    const pts = pointsMap[targetTier];
    const updated: CustomerRewardsProfile = {
      ...profile,
      tier: targetTier,
      lifetimePointsEarned: pts,
      totalPoints: pts
    };
    setProfile(updated);
    if (pts >= 500) {
      triggerCelebration();
    } else {
      setIsCelebrating(false);
    }
  };

  return (
    <div
      className={`relative p-6 sm:p-7 bg-gradient-to-br from-[#FFF7EA] via-white to-[#F7E5C8]/35 border-2 border-[#DBC7A6] rounded-3xl shadow-sm overflow-hidden text-right rtl:text-right ltr:text-left transition-all ${className}`}
    >
      {/* Subtle Rosette Architectural Watermark */}
      <div className="absolute top-0 right-0 w-72 h-72 opacity-5 pointer-events-none transform translate-x-16 -translate-y-16">
        <RosetteEmblem size={280} color="#075B60" />
      </div>

      {/* Top Banner Toast when a Milestone is Reached */}
      {isMilestoneReached && !bannerDismissed && (
        <div className="relative z-20 mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF7EA] via-[#F7E5C8]/80 to-[#FFF7EA] border border-[#F1C17F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#075B60] text-[#F1C17F] flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-semibold text-xs text-[#075B60] block leading-tight">
                {isArabic ? '✦ مبارك! تم بلوغ مرتبة جديدة بنجاح' : '✦ Milestone Achieved: New Tier Unlocked'}
              </span>
              <span className="text-[#173D3E]/80 text-[11px] block mt-0.5">
                {isArabic
                  ? `أنتِ الآن في «${currentTier.title.ar}» مع تفعيل مضاعف النقاط ومزايا السكينة الخاصة.`
                  : `You have reached «${currentTier.title.en}» with accelerated points and sanctuary perks.`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={triggerCelebration}
              className="px-2.5 py-1.5 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#F1C17F]" />
              <span>{isArabic ? 'إعادة الاحتفال ✦' : 'Replay Sparkles ✦'}</span>
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="p-1 rounded-lg text-[#173D3E]/50 hover:text-[#173D3E] hover:bg-black/5 transition-colors cursor-pointer text-xs"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header: Member Identity & Points Metrics */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#075B60]">
              {isArabic ? 'حالة الولاء والارتقاء' : 'Loyalty Status & Velocity'}
            </span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${currentTier.badgeBg}`}>
              {currentTier.badge[isArabic ? 'ar' : 'en']}
            </span>
            {isMilestoneReached && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#F1C17F]/30 text-[#173D3E] font-medium border border-[#F1C17F]/60">
                <Sparkles className="w-2.5 h-2.5 text-[#075B60]" />
                <span>{isArabic ? 'إنجاز محقق' : 'Milestone Unlocked'}</span>
              </span>
            )}
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#173D3E] font-medium">
            {profile.customerName}
          </h3>
        </div>

        {/* Dual Points Metrics */}
        <div className="flex items-center gap-5 sm:gap-6 text-right rtl:text-right ltr:text-left flex-wrap">
          <div>
            <span className="text-[11px] text-[#173D3E]/65 block leading-tight">
              {isArabic ? 'الرصيد المتاح' : 'Available Balance'}
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#075B60]">
              {profile.totalPoints}{' '}
              <span className="text-xs font-sans font-normal text-[#173D3E]/70">
                {isArabic ? 'نقطة' : 'pts'}
              </span>
            </span>
          </div>

          <div className="border-r rtl:border-r ltr:border-l border-[#DBC7A6] px-4">
            <span className="text-[11px] text-[#173D3E]/65 block leading-tight">
              {isArabic ? 'إجمالي النقاط المكتسبة' : 'Lifetime Accumulated'}
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#173D3E]">
              {profile.lifetimePointsEarned}{' '}
              <span className="text-xs font-sans font-normal text-[#173D3E]/70">
                {isArabic ? 'نقطة' : 'pts'}
              </span>
            </span>
          </div>

          {/* Sparkle Replay Button */}
          <button
            onClick={triggerCelebration}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isCelebrating
                ? 'bg-[#075B60] text-white border-[#075B60] shadow-xs'
                : 'bg-white hover:bg-[#FFF7EA] text-[#075B60] border-[#DBC7A6]'
            }`}
            title={isArabic ? 'إعادة تشغيل بريق الاحتفال' : 'Trigger Milestone Animation'}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isCelebrating ? 'animate-spin-slow text-[#F1C17F]' : 'text-[#075B60]'}`} />
            <span className="hidden sm:inline">
              {isArabic ? 'بريق الإنجاز' : 'Sparkle'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Tier Tester / Milestone Switcher */}
      <div className="relative z-10 mb-4 p-2.5 rounded-xl bg-white/75 border border-[#DBC7A6]/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="text-[#173D3E]/70 font-medium flex items-center gap-1.5">
          <RosetteEmblem size={14} color="#075B60" />
          <span>{isArabic ? 'معاينة المراتب والاحتفال بالترقية:' : 'Preview Tier Milestones & Sparkles:'}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSimulateTier('zellige')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
              profile.tier === 'zellige'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                : 'bg-[#FFF7EA] hover:bg-[#F7E5C8] text-[#173D3E]/75 border border-transparent'
            }`}
          >
            {isArabic ? 'الزليج (250 ن)' : 'Zellige (250)'}
          </button>
          <button
            onClick={() => handleSimulateTier('amber')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-medium ${
              profile.tier === 'amber'
                ? 'bg-[#075B60] text-white font-semibold shadow-xs'
                : 'bg-[#FFF7EA] hover:bg-[#F7E5C8] text-[#173D3E]/75 border border-transparent'
            }`}
          >
            <span>{isArabic ? 'العنبر' : 'Amber'} (630)</span>
            <span>✨</span>
          </button>
          <button
            onClick={() => handleSimulateTier('royal_jasmine')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-medium ${
              profile.tier === 'royal_jasmine'
                ? 'bg-amber-500 text-amber-950 font-semibold shadow-xs'
                : 'bg-[#FFF7EA] hover:bg-[#F7E5C8] text-[#173D3E]/75 border border-transparent'
            }`}
          >
            <span>{isArabic ? 'الياسمين الملكي' : 'Royal Jasmine'} (1,350)</span>
            <span>👑✨</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CUSTOM PROGRESS BAR TRACK WITH SPARKLE OVERLAY
          ========================================================================= */}
      <div className="relative z-10 mb-6 pt-3 pb-2">
        {/* Subtle Confetti & Sparkle Animation Overlay across the progress bar */}
        {isCelebrating && (
          <div
            className="absolute inset-x-0 -top-10 -bottom-8 pointer-events-none overflow-visible z-30"
            aria-hidden="true"
          >
            {/* Star Sparkle Particles */}
            {SPARKLE_PARTICLES.map((p, i) => (
              <span
                key={`sparkle-${i}`}
                className="absolute animate-finah-sparkle select-none inline-block font-serif drop-shadow-xs"
                style={{
                  left: p.left,
                  top: p.top,
                  color: p.color,
                  fontSize: p.size,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  ['--tw-sparkle-x' as string]: p.driftX
                }}
              >
                {p.char}
              </span>
            ))}

            {/* Geometric Moroccan Confetti Flakes */}
            {CONFETTI_PIECES.map((c, i) => (
              <span
                key={`confetti-${i}`}
                className="absolute animate-finah-confetti select-none block shadow-2xs"
                style={{
                  left: c.left,
                  top: c.top,
                  backgroundColor: c.color,
                  width: c.size,
                  height: c.size,
                  borderRadius: c.isRound ? '9999px' : '2px',
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  opacity: 0.85,
                  ['--tw-drift-x' as string]: c.driftX
                }}
              />
            ))}
          </div>
        )}

        {/* Milestone Labels Above Track */}
        <div className="grid grid-cols-3 gap-2 mb-2.5 text-xs">
          {SANCTUARY_TIERS.map((t, idx) => {
            const isPassedOrCurrent = profile.lifetimePointsEarned >= t.thresholdMin;
            const isCurrent = profile.tier === t.id;

            return (
              <div
                key={t.id}
                className={`flex flex-col ${
                  idx === 0
                    ? 'items-start text-left rtl:text-right'
                    : idx === 1
                    ? 'items-center text-center'
                    : 'items-end text-right rtl:text-left'
                }`}
              >
                <span
                  className={`font-semibold text-xs flex items-center gap-1 ${
                    isCurrent
                      ? 'text-[#075B60]'
                      : isPassedOrCurrent
                      ? 'text-[#173D3E]'
                      : 'text-[#173D3E]/50'
                  }`}
                >
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#075B60] animate-ping" />}
                  <span>{t.title[isArabic ? 'ar' : 'en']}</span>
                  {isCelebrating && isPassedOrCurrent && t.thresholdMin > 0 && (
                    <span className="text-[10px] text-[#F1C17F] animate-pulse">✦</span>
                  )}
                </span>
                <span className="text-[10px] text-[#173D3E]/60 font-mono">
                  {t.thresholdMin} {isArabic ? 'نقطة' : 'pts'}
                </span>
              </div>
            );
          })}
        </div>

        {/* The Progress Bar Line with Shimmer Sheen Wave */}
        <div className="relative w-full h-4 bg-[#F7E5C8]/80 border border-[#DBC7A6] rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#075B60] via-[#0E8890] to-[#F1C17F] rounded-full transition-all duration-700 ease-out shadow-xs relative overflow-hidden"
            style={{ width: `${Math.max(5, overallProgressPercent)}%` }}
          >
            {/* Radiant Shimmer Sheen Wave */}
            {isCelebrating && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-finah-shimmer pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Milestone Checkpoint Nodes */}
        <div className="relative w-full flex justify-between -mt-3 px-0.5 pointer-events-none">
          {SANCTUARY_TIERS.map((t) => {
            const isUnlocked = profile.lifetimePointsEarned >= t.thresholdMin;
            const isCurrent = profile.tier === t.id;
            const isMilestoneNode = t.thresholdMin > 0 && isUnlocked;

            return (
              <div
                key={t.id}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white transition-all shadow-xs relative ${
                  isCelebrating && isMilestoneNode
                    ? 'border-[#075B60] ring-4 ring-[#F1C17F]/60 animate-finah-halo text-[#075B60]'
                    : isCurrent
                    ? 'border-[#075B60] ring-4 ring-[#075B60]/20 text-[#075B60]'
                    : isUnlocked
                    ? 'border-[#075B60] text-[#075B60]'
                    : 'border-[#DBC7A6] text-[#DBC7A6]'
                }`}
              >
                {isUnlocked ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                )}

                {/* Floating Star on Achieved Milestone */}
                {isCelebrating && isMilestoneNode && (
                  <span className="absolute -top-3.5 text-[9px] text-[#D99B4B] font-bold animate-bounce">
                    ✦
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Next-Tier Countdown & Callout Banner */}
      <div className="relative z-10 p-4 rounded-2xl bg-[#075B60]/5 border border-[#075B60]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {nextTier ? (
          <>
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-[#F1C17F] shrink-0" />
              <span className="text-[#173D3E] leading-relaxed">
                {isArabic ? (
                  <>
                    ينقصكِ <strong>{pointsNeeded} نقطة</strong> فقط للترقية إلى{' '}
                    <strong className="text-[#075B60]">{nextTier.title.ar}</strong> (ما يعادل تقريباً{' '}
                    {estimatedHammamVisits} زيارة حمام مغربي ملكي).
                  </>
                ) : (
                  <>
                    You need <strong>{pointsNeeded} more points</strong> to unlock{' '}
                    <strong className="text-[#075B60]">{nextTier.title.en}</strong> (~
                    {estimatedHammamVisits} Royal Hammam visits).
                  </>
                )}
              </span>
            </div>

            {onViewAllRewards && (
              <button
                onClick={onViewAllRewards}
                className="text-xs font-semibold text-[#075B60] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-center"
              >
                <span>{isArabic ? 'استكشاف مزايا الرتبة القادمة' : 'Explore Next Tier Perks'}</span>
                {isArabic ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 text-[#075B60] font-medium">
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isArabic
                  ? 'أنتِ في أعلى مراتب السكينة الملكية (عضوية الياسمين الملكي). استمتعي بكافة الامتيازات الحصرية.'
                  : 'You have attained our pinnacle Royal Jasmine Tier. Enjoy complete bespoke sanctuary privileges.'}
              </span>
            </div>

            {onViewAllRewards && (
              <button
                onClick={onViewAllRewards}
                className="text-xs font-semibold text-[#075B60] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{isArabic ? 'عرض كافة المكافآت' : 'View All Rewards'}</span>
                {isArabic ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Perks Snapshot for Current Status */}
      <div className="relative z-10 mt-3 pt-3 border-t border-[#DBC7A6]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#173D3E]/75">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-[#075B60] shrink-0" />
          <span>
            <strong className="font-semibold text-[#075B60]">
              {isArabic ? 'ميزة مرتبتكِ الحالية:' : 'Current Tier Privilege:'}
            </strong>{' '}
            {currentTier.highlightPerk[isArabic ? 'ar' : 'en']}
          </span>
        </div>

        {onBookRitual && (
          <button
            onClick={() => onBookRitual()}
            className="text-[#075B60] font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <span>{isArabic ? 'احجزي لجمع النقاط' : 'Book to Earn Points'}</span>
            {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
};
