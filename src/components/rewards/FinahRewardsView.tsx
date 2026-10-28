import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { RewardOffer, CustomerRewardsProfile, RewardTier } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Sparkles,
  Gift,
  Award,
  Crown,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Phone,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Lock,
  Unlock,
  Heart,
  Droplets,
  Flame,
  ChevronDown,
  ShieldCheck,
  Star
} from 'lucide-react';

interface FinahRewardsViewProps {
  onBookWithReward?: (voucherCode: string) => void;
  onClose?: () => void;
  customerPhone?: string;
  customerName?: string;
}

interface TierDefinition {
  id: RewardTier;
  title: { ar: string; en: string };
  badge: { ar: string; en: string };
  thresholdMin: number;
  thresholdMax: number | null; // null for highest tier
  multiplierText: { ar: string; en: string };
  color: string;
  accentBg: string;
  perks: { ar: string; en: string }[];
  highlight: { ar: string; en: string };
}

const SANCTUARY_TIERS: TierDefinition[] = [
  {
    id: 'zellige',
    title: { ar: 'عضوية الزليج الأصيل', en: 'Zellige Welcome Tier' },
    badge: { ar: 'المرتبة الترحيبية', en: 'Welcome Tier' },
    thresholdMin: 0,
    thresholdMax: 500,
    multiplierText: { ar: '١ نقطة لكل درهم', en: '1 pt per 1 AED' },
    color: 'border-emerald-300 text-emerald-900',
    accentBg: 'bg-emerald-50',
    highlight: {
      ar: 'بداية رحلة العافية واكتساب النقاط التلقائي مع كل زيارة',
      en: 'Foundational entry to Moroccan rewards with automatic earning'
    },
    perks: [
      { ar: '١ نقطة مكافأة عن كل درهم يتم إنفاقه على الطقوس', en: '1 Finah reward point for every 1 AED spent on rituals' },
      { ar: '+٥٠ نقطة بونص إضافية عن كل جلسة حمام مغربي تقليدي', en: '+50 bonus points on traditional Moroccan hammam sessions' },
      { ar: 'ضيافة شاي النعناع المغربي في ردهة الاسترخاء الهادئة', en: 'Complimentary signature Moroccan mint tea in our lounge' },
      { ar: 'صلاحية النقاط تمتد لسنة كاملة (١٢ شهراً) من تاريخ الزيارة', en: '12-month points validity from transaction date' }
    ]
  },
  {
    id: 'amber',
    title: { ar: 'عضوية العنبر المغربي', en: 'Moroccan Amber Tier' },
    badge: { ar: 'مرتبة النخبة والسكينة', en: 'Sanctuary Elite Tier' },
    thresholdMin: 500,
    thresholdMax: 1200,
    multiplierText: { ar: '١.٢٥ نقطة لكل درهم', en: '1.25x Multiplier' },
    color: 'border-[#075B60] text-[#075B60]',
    accentBg: 'bg-[#075B60]/10',
    highlight: {
      ar: 'مضاعفة النقاط وهدايا مائية مقطرة مع كل جلسة',
      en: 'Accelerated point earning & distilled floral hydration gifts'
    },
    perks: [
      { ar: 'جميع مزايا عضوية الزليج الأصيل السابقة', en: 'All foundational Zellige Tier privileges included' },
      { ar: 'مضاعف نقاط ١.٢٥ ضعف على جميع جلسات الحمام والمساج', en: '1.25x points multiplier on all hammam & massage rituals' },
      { ar: 'ترقية مجانية برذاذ ماء الورد الدمشقي المقطر يدوياً', en: 'Complimentary cold-distilled Damask rosewater mist upgrade' },
      { ar: 'أولوية في قوائم الانتظار وحجز الأجنحة في عطلة نهاية الأسبوع', en: 'Priority waitlist access for weekend suite bookings' },
      { ar: 'خصم استثنائي ١٠٪ عند حجز الباقات المتتالية أو جلسات العناية بالشعر', en: '10% privilege discount on multi-ritual sequences' }
    ]
  },
  {
    id: 'royal_jasmine',
    title: { ar: 'عضوية الياسمين الملكي', en: 'Royal Jasmine Tier' },
    badge: { ar: 'العضوية الملكية الأرفع', en: 'Pinnacle Royal Tier' },
    thresholdMin: 1200,
    thresholdMax: null,
    multiplierText: { ar: '١.٥ نقطة لكل درهم', en: '1.5x Multiplier' },
    color: 'border-amber-400 text-amber-900',
    accentBg: 'bg-amber-100/60',
    highlight: {
      ar: 'الأولوية الملكية المطلقة وهدايا الطمي والزيوت المغربية البكر',
      en: 'Absolute royal sanctuary priority & bespoke botanical gifts'
    },
    perks: [
      { ar: 'جميع مزايا عضويتي الزليج والعنبر مجتمعة', en: 'All Zellige and Amber privileges combined' },
      { ar: 'مضاعف نقاط فائق ١.٥ ضعف على كافة الخدمات والمنتجات', en: '1.5x supreme points multiplier across all sanctuary services' },
      { ar: 'جلسة حمام مغربي تقليدي كاملة مجانية سنوياً (قيمة ٣٨٠ درهم)', en: 'One complimentary full Moroccan hammam annually (380 AED value)' },
      { ar: 'قناع مجاني من غاسول الأطلس بالأعشاب السبعة مع كل زيارة', en: 'Complimentary 7-herb Atlas ghassoul mask with every visit' },
      { ar: 'حجز مؤكد للأجنحة الخاصة الملكية مع ضيافة أعشاب حصرية', en: 'Guaranteed private vaulted suite bookings with specialty cellar tea' },
      { ar: 'خط واتساب استشاري مباشر ومخصص مع كبيرة المعالجات', en: 'Direct dedicated WhatsApp VIP line with Senior Specialist' }
    ]
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

// Sanctuary palette particles: Finah Gold, Moroccan Amber, Sanctuary Jade, Cream Pearl
const SPARKLE_PARTICLES: SparkleParticle[] = [
  { char: '✦', left: '5%', top: '-16px', color: '#F1C17F', size: '15px', delay: '0s', duration: '2.5s', driftX: '-8px' },
  { char: '✧', left: '12%', top: '4px', color: '#FFF7EA', size: '13px', delay: '0.4s', duration: '2.8s', driftX: '8px' },
  { char: '⋆', left: '20%', top: '-12px', color: '#075B60', size: '14px', delay: '0.8s', duration: '2.4s', driftX: '-5px' },
  { char: '✦', left: '30%', top: '-20px', color: '#F1C17F', size: '18px', delay: '0.2s', duration: '2.6s', driftX: '12px' },
  { char: '✵', left: '40%', top: '2px', color: '#D99B4B', size: '13px', delay: '1.1s', duration: '3.0s', driftX: '-10px' },
  { char: '✧', left: '49%', top: '-18px', color: '#F1C17F', size: '17px', delay: '0.5s', duration: '2.4s', driftX: '6px' },
  { char: '✦', left: '58%', top: '-8px', color: '#075B60', size: '14px', delay: '1.3s', duration: '2.7s', driftX: '-8px' },
  { char: '⋆', left: '67%', top: '4px', color: '#F1C17F', size: '13px', delay: '0.3s', duration: '2.5s', driftX: '10px' },
  { char: '✦', left: '76%', top: '-19px', color: '#D99B4B', size: '17px', delay: '0.9s', duration: '2.8s', driftX: '-6px' },
  { char: '✧', left: '85%', top: '-12px', color: '#FFF7EA', size: '14px', delay: '1.5s', duration: '2.5s', driftX: '8px' },
  { char: '✵', left: '92%', top: '-17px', color: '#F1C17F', size: '16px', delay: '0.7s', duration: '2.6s', driftX: '-12px' },
  { char: '✦', left: '98%', top: '2px', color: '#075B60', size: '13px', delay: '1.7s', duration: '3.0s', driftX: '5px' }
];

const CONFETTI_PIECES: ConfettiPiece[] = [
  { left: '8%', top: '-18px', color: '#F1C17F', size: '6px', delay: '0.1s', duration: '2.9s', rotate: 25, driftX: '12px' },
  { left: '18%', top: '-24px', color: '#075B60', size: '5px', delay: '0.6s', duration: '3.2s', rotate: 60, driftX: '-14px' },
  { left: '29%', top: '-16px', color: '#D99B4B', size: '7px', delay: '1.2s', duration: '2.8s', rotate: 45, driftX: '16px' },
  { left: '42%', top: '-22px', color: '#F1C17F', size: '6px', delay: '0.3s', duration: '3.1s', rotate: 30, driftX: '-10px' },
  { left: '50%', top: '-28px', color: '#0E8890', size: '5px', delay: '0.9s', duration: '2.7s', rotate: 75, driftX: '15px' },
  { left: '65%', top: '-20px', color: '#F7E5C8', size: '7px', delay: '1.4s', duration: '3.3s', rotate: 15, driftX: '-18px' },
  { left: '77%', top: '-24px', color: '#D99B4B', size: '6px', delay: '0.5s', duration: '3.0s', rotate: 50, driftX: '14px' },
  { left: '87%', top: '-18px', color: '#075B60', size: '5px', delay: '1.1s', duration: '2.9s', rotate: 40, driftX: '-12px' },
  { left: '94%', top: '-26px', color: '#F1C17F', size: '7px', delay: '1.6s', duration: '3.4s', rotate: 65, driftX: '10px' }
];

export const FinahRewardsView: React.FC<FinahRewardsViewProps> = ({
  onBookWithReward,
  onClose,
  customerPhone,
  customerName
}) => {
  const { isArabic } = useLanguage();
  const rewardOffers = finahStore.getRewardOffers();

  // Active phone (uses customerPhone prop from Customer Portal or default demo)
  const initialPhone = customerPhone || '+971501234567';
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [profile, setProfile] = useState<CustomerRewardsProfile>(
    finahStore.getCustomerRewards(initialPhone, customerName || 'مريم المنصوري')
  );

  const [redeemedVoucher, setRedeemedVoucher] = useState<{
    code: string;
    offer: RewardOffer;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTierDetail, setSelectedTierDetail] = useState<RewardTier>('amber');

  // Milestone celebration overlay states
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationBannerDismissed, setCelebrationBannerDismissed] = useState(false);
  const isMilestoneReached = profile.lifetimePointsEarned >= 500;

  // Trigger celebration whenever a milestone tier is achieved or loaded
  useEffect(() => {
    if (profile.lifetimePointsEarned >= 500) {
      setIsCelebrating(true);
      setCelebrationBannerDismissed(false);
      const timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setIsCelebrating(false);
    }
  }, [profile.phone, profile.lifetimePointsEarned, profile.tier]);

  const triggerCelebration = () => {
    setIsCelebrating(true);
    setCelebrationBannerDismissed(false);
    setTimeout(() => {
      setIsCelebrating(false);
    }, 7000);
  };

  // Quick tier simulation for review/testing
  const handleSimulateTier = (targetTier: RewardTier) => {
    const pointsMap: Record<RewardTier, number> = {
      zellige: 250,
      amber: 630,
      royal_jasmine: 1350
    };
    const pts = pointsMap[targetTier];
    const updated = {
      ...profile,
      tier: targetTier,
      lifetimePointsEarned: pts,
      totalPoints: pts
    };
    setProfile(updated);
    setSelectedTierDetail(targetTier);
    if (pts >= 500) {
      triggerCelebration();
    } else {
      setIsCelebrating(false);
    }
  };

  // Sync if customerPhone prop changes
  useEffect(() => {
    if (customerPhone) {
      setPhoneInput(customerPhone);
      const p = finahStore.getCustomerRewards(customerPhone, customerName);
      setProfile(p);
      setSelectedTierDetail(p.tier);
    }
  }, [customerPhone, customerName]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    const p = finahStore.getCustomerRewards(phoneInput.trim());
    setProfile({ ...p });
    setSelectedTierDetail(p.tier);
    setRedeemedVoucher(null);
    setErrorMessage('');
  };

  const handleRedeem = (offer: RewardOffer) => {
    setErrorMessage('');
    const result = finahStore.redeemRewardOffer(profile.phone, offer.id);
    if (result.success && result.voucherCode) {
      setRedeemedVoucher({ code: result.voucherCode, offer });
      setProfile({ ...finahStore.getCustomerRewards(profile.phone) });
    } else {
      setErrorMessage(
        isArabic
          ? `رصيدك الحالي (${profile.totalPoints} نقطة) لا يكفي لهذه المكافأة (${offer.pointsCost} نقطة).`
          : result.message
      );
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tier calculation helper
  const currentTierIndex = SANCTUARY_TIERS.findIndex(t => t.id === profile.tier);
  const currentTier = SANCTUARY_TIERS[currentTierIndex] || SANCTUARY_TIERS[0];
  const nextTier = currentTierIndex < SANCTUARY_TIERS.length - 1 ? SANCTUARY_TIERS[currentTierIndex + 1] : null;

  // Progress Bar Calculations
  // Points in current bracket
  const bracketMin = currentTier.thresholdMin;
  const bracketMax = currentTier.thresholdMax || 2000;
  const pointsInBracket = Math.max(0, profile.lifetimePointsEarned - bracketMin);
  const bracketRange = Math.max(1, bracketMax - bracketMin);
  const currentBracketPercent = Math.min(100, Math.round((pointsInBracket / bracketRange) * 100));

  // Overall progress across 3 tiers (0 to 1200 scale)
  const totalScaleMax = 1200;
  const overallProgressPercent = Math.min(100, Math.round((profile.lifetimePointsEarned / totalScaleMax) * 100));

  // Points needed to reach next tier
  const pointsNeededForNext = nextTier ? Math.max(0, nextTier.thresholdMin - profile.lifetimePointsEarned) : 0;
  const estimatedHammamVisits = Math.ceil(pointsNeededForNext / 430); // 380 AED + 50 bonus points

  return (
    <div className="space-y-10 text-right rtl:text-right ltr:text-left">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#DBC7A6]/60">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'برنامج ولاء فنة ومكافآت السكينة' : 'Finah Rewards Loyalty Programme'}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#173D3E] font-medium tracking-tight">
            {isArabic ? 'مراتب العضوية ومكافآت التقدير' : 'Sanctuary Tiers & Loyalty Privileges'}
          </h2>
          <p className="text-xs sm:text-sm text-[#173D3E]/75 mt-1 max-w-2xl">
            {isArabic
              ? 'تقديراً لثقتكِ الدائمة، تكتسبين نقاطاً تلقائية مع كل حجز لترقية مرتبتكِ واستبدالها بخصومات وطقوس حصرية.'
              : 'Our invitation to gratitude: accumulate points with each ritual to elevate your status and unlock bespoke sanctuary privileges.'}
          </p>
        </div>

        {/* Member Quick Badge */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#DBC7A6] shrink-0 shadow-2xs">
          <RosetteEmblem size={28} color="#075B60" />
          <div>
            <span className="text-[10px] text-[#173D3E]/60 uppercase tracking-wider block">
              {isArabic ? 'المرتبة المعتمدة' : 'Verified Member Tier'}
            </span>
            <span className="text-xs font-semibold text-[#075B60]">
              {currentTier.title[isArabic ? 'ar' : 'en']}
            </span>
          </div>
        </div>
      </div>

      {/* TIER PROGRESS BAR COMPONENT */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF7EA] via-white to-[#F7E5C8]/40 border-2 border-[#075B60]/40 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Subtle Watermark Rosette */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none transform translate-x-16 -translate-y-16">
          <RosetteEmblem size={320} color="#075B60" />
        </div>

        {/* Milestone Achievement Toast / Banner */}
        {isMilestoneReached && !celebrationBannerDismissed && (
          <div className="relative z-20 mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FFF7EA] via-[#F7E5C8]/80 to-[#FFF7EA] border border-[#F1C17F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#075B60] text-[#F1C17F] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <span className="font-semibold text-sm text-[#075B60] block">
                  {isArabic ? '✦ مبارك! تم بلوغ مرتبة جديدة بنجاح' : '✦ Milestone Achieved: New Tier Unlocked'}
                </span>
                <span className="text-[#173D3E]/80">
                  {isArabic
                    ? `لقد ارتقيتِ إلى «${currentTier.title.ar}» واستحققتِ مزايا وامتيازات السكينة الاستثنائية.`
                    : `You have advanced to «${currentTier.title.en}» with exclusive botanical privileges.`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={triggerCelebration}
                className="px-3 py-1.5 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white font-medium flex items-center gap-1.5 transition-all text-xs shadow-xs cursor-pointer active:scale-95"
                title={isArabic ? 'إعادة تشغيل احتفال الإنجاز' : 'Replay milestone celebration'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F1C17F]" />
                <span>{isArabic ? 'احتفلي بالترقية ✦' : 'Celebrate Milestone ✦'}</span>
              </button>
              <button
                onClick={() => setCelebrationBannerDismissed(true)}
                className="p-1.5 rounded-lg text-[#173D3E]/50 hover:text-[#173D3E] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Top Header of Progress Component */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#075B60]">
                {isArabic ? 'مؤشر التقدم نحو المراتب الملكية' : 'Tier Progression & Velocity'}
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${currentTier.color}`}>
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

          {/* Points Metrics & Quick Celebration Trigger */}
          <div className="flex items-center gap-4 sm:gap-6 text-right rtl:text-right ltr:text-left flex-wrap">
            <div>
              <span className="text-[11px] text-[#173D3E]/65 block">
                {isArabic ? 'الرصيد المتاح للاستبدال' : 'Available Balance'}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#075B60]">
                {profile.totalPoints}{' '}
                <span className="text-xs font-sans font-normal text-[#173D3E]/70">
                  {isArabic ? 'نقطة' : 'pts'}
                </span>
              </span>
            </div>

            <div className="border-r rtl:border-r ltr:border-l border-[#DBC7A6] px-4">
              <span className="text-[11px] text-[#173D3E]/65 block">
                {isArabic ? 'إجمالي النقاط المكتسبة' : 'Lifetime Accumulated'}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#173D3E]">
                {profile.lifetimePointsEarned}{' '}
                <span className="text-xs font-sans font-normal text-[#173D3E]/70">
                  {isArabic ? 'نقطة' : 'pts'}
                </span>
              </span>
            </div>

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

        {/* Quick Tier Preview / Interactive Milestone Switcher */}
        <div className="relative z-10 mb-4 p-2.5 rounded-xl bg-white/70 border border-[#DBC7A6]/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
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

        {/* Visual 3-Stage Progress Bar Track with Sparkle & Confetti Overlay */}
        <div className="relative z-10 mb-8 pt-4 pb-2">
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
          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
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
              {/* Subtle radiant shimmer light wave gliding through progress fill */}
              {isCelebrating && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-finah-shimmer pointer-events-none"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* Milestone Checkpoints / Node Dots with Halo Glow */}
          <div className="relative w-full flex justify-between -mt-3 px-0.5 pointer-events-none">
            {SANCTUARY_TIERS.map((t, idx) => {
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

                  {/* Little star badge floating above unlocked milestone nodes */}
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
                      ينقصكِ <strong>{pointsNeededForNext} نقطة</strong> فقط للترقية إلى{' '}
                      <strong className="text-[#075B60]">{nextTier.title.ar}</strong> (ما يعادل تقريباً{' '}
                      {estimatedHammamVisits} زيارة حمام مغربي ملكي).
                    </>
                  ) : (
                    <>
                      You need <strong>{pointsNeededForNext} more points</strong> to unlock{' '}
                      <strong className="text-[#075B60]">{nextTier.title.en}</strong> (~
                      {estimatedHammamVisits} royal hammam ritual visit).
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-semibold text-[#075B60] bg-white px-2.5 py-1 rounded-lg border border-[#075B60]/30">
                  {currentBracketPercent}% {isArabic ? 'مكتمل' : 'completed'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5 text-amber-900">
              <Crown className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-semibold">
                {isArabic
                  ? 'تهانينا! لقد بلغتِ المرتبة الملكية الأرفع (عضوية الياسمين الملكي) وتتمتعين بكافة المزايا القصوى.'
                  : 'Congratulations! You have attained our pinnacle Royal Jasmine tier with full exclusive privileges.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MEMBER STATUS BENEFITS SHOWCASE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-1 text-xs font-semibold uppercase tracking-wider text-[#075B60]">
              <Award className="w-4 h-4 text-[#075B60]" />
              <span>{isArabic ? 'المزايا المعتمدة لمرتبتكِ الحالية' : 'Your Current Status Privileges'}</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
              {isArabic
                ? `مزايا ${currentTier.title.ar} الخاصة بكِ`
                : `${currentTier.title.en} Privileges Unlocked`}
            </h3>
          </div>

          <span className="text-xs text-[#075B60] font-medium hidden sm:inline-block">
            {isArabic ? 'تُطبق المزايا تلقائياً عند كل زيارة' : 'Privileges apply automatically at check-in'}
          </span>
        </div>

        {/* Current Tier Highlight Box */}
        <div className="p-6 sm:p-8 bg-white border border-[#DBC7A6] rounded-3xl shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#DBC7A6]/50">
            <div>
              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${currentTier.color}`}>
                {currentTier.badge[isArabic ? 'ar' : 'en']}
              </span>
              <p className="text-xs sm:text-sm text-[#173D3E]/80 mt-2 font-medium">
                {currentTier.highlight[isArabic ? 'ar' : 'en']}
              </p>
            </div>

            <div className="p-3 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-2xl text-center shrink-0">
              <span className="text-[10px] text-[#173D3E]/60 uppercase tracking-wider block">
                {isArabic ? 'معدل اكتساب النقاط' : 'Earning Velocity'}
              </span>
              <span className="text-sm font-bold text-[#075B60] font-mono">
                {currentTier.multiplierText[isArabic ? 'ar' : 'en']}
              </span>
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
            {currentTier.perks.map((perk, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#FFF7EA] border border-[#DBC7A6]/60 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs text-[#173D3E]/90 leading-relaxed font-medium">
                  {perk[isArabic ? 'ar' : 'en']}
                </span>
              </div>
            ))}
          </div>

          {/* Next Tier Teaser if applicable */}
          {nextTier && (
            <div className="p-4 rounded-2xl bg-[#F7E5C8]/30 border border-dashed border-[#075B60]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#075B60] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#173D3E] block">
                    {isArabic
                      ? `ما ينتظركِ عند بلوغ ${nextTier.title.ar}:`
                      : `Awaiting you upon unlocking ${nextTier.title.en}:`}
                  </span>
                  <span className="text-[#173D3E]/70 block mt-0.5">
                    {nextTier.perks[2]?.[isArabic ? 'ar' : 'en']} ·{' '}
                    {nextTier.perks[3]?.[isArabic ? 'ar' : 'en']}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTierDetail(nextTier.id)}
                className="px-4 py-2 text-xs font-semibold text-[#075B60] bg-white border border-[#075B60]/30 rounded-xl hover:bg-[#FFF7EA] transition-colors cursor-pointer shrink-0"
              >
                {isArabic ? 'استعراض مزايا الترقية' : 'Preview Next Tier'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE ALL-TIERS COMPARISON MODAL / TABS */}
      <div className="p-6 bg-white border border-[#DBC7A6] rounded-3xl shadow-xs">
        <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-2">
          {isArabic ? 'مقارنة مراتب برنامج الولاء' : 'Explore All Finah Sanctuary Tiers'}
        </h4>
        <p className="text-xs text-[#173D3E]/70 mb-6">
          {isArabic
            ? 'انقري على أي مرتبة للاطلاع على معايير التأهيل والمزايا الحصرية لكل مستوى.'
            : 'Click on any tier to compare qualification thresholds and exclusive privileges.'}
        </p>

        {/* Tier Switcher Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-2xl mb-6">
          {SANCTUARY_TIERS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTierDetail(t.id)}
              className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                selectedTierDetail === t.id
                  ? 'bg-[#075B60] text-white shadow-xs'
                  : 'text-[#173D3E] hover:bg-[#F7E5C8]'
              }`}
            >
              <span>{t.title[isArabic ? 'ar' : 'en']}</span>
            </button>
          ))}
        </div>

        {/* Selected Tier Detail Card */}
        {(() => {
          const detail = SANCTUARY_TIERS.find(t => t.id === selectedTierDetail) || SANCTUARY_TIERS[0];
          const isUserCurrent = profile.tier === detail.id;

          return (
            <div className="p-6 rounded-2xl bg-[#FFF7EA] border border-[#DBC7A6] animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DBC7A6]/50">
                <div className="flex items-center gap-2">
                  <h5 className="font-serif text-lg font-semibold text-[#173D3E]">
                    {detail.title[isArabic ? 'ar' : 'en']}
                  </h5>
                  {isUserCurrent && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      {isArabic ? 'مرتبتكِ الحالية' : 'Your Current Tier'}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono font-semibold text-[#075B60]">
                  {detail.thresholdMin}
                  {detail.thresholdMax ? ` - ${detail.thresholdMax}` : '+'} {isArabic ? 'نقطة' : 'pts'}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-[#173D3E]/85">
                {detail.perks.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                    <span>{p[isArabic ? 'ar' : 'en']}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>

      {/* REDEEMABLE VOUCHERS CATALOG */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
              {isArabic ? 'المكافآت والطقوس المتاحة للاستبدال' : 'Redeemable Rewards & Sanctuary Vouchers'}
            </h3>
            <p className="text-xs text-[#173D3E]/70">
              {isArabic ? 'استبدلي نقاطكِ المتاحة برصيد فوري أو جلسات استثنائية مجانية:' : 'Redeem points for instant courtesy credits or complimentary rituals:'}
            </p>
          </div>
        </div>

        {/* Redeemed Voucher Success Banner */}
        {redeemedVoucher && (
          <div className="mb-6 p-6 bg-emerald-50 border-2 border-emerald-500 rounded-3xl shadow-sm text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-medium text-emerald-900 mb-1">
              {isArabic ? 'تهانينا! تم استبدال المكافأة بنجاح' : 'Reward Successfully Redeemed!'}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 mb-4 max-w-md mx-auto">
              {isArabic ? redeemedVoucher.offer.name.ar : redeemedVoucher.offer.name.en}
            </p>

            <div className="inline-flex items-center gap-3 p-3 bg-white border border-emerald-300 rounded-xl mb-3">
              <span className="font-mono text-base font-bold text-emerald-800 tracking-wider">
                {redeemedVoucher.code}
              </span>
              <button
                onClick={() => handleCopyCode(redeemedVoucher.code)}
                className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-emerald-700">
              {isArabic
                ? 'تم خصم النقاط من رصيدك. يمكنكِ استخدام هذا الرمز عند الحجز القادم أو إبرازه لموظفة الاستقبال عند زيارتك.'
                : 'Points have been deducted. Use this voucher code during your next booking or present at the boutique reception.'}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardOffers.map(offer => {
            const canAfford = profile.totalPoints >= offer.pointsCost;

            return (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  canAfford
                    ? 'bg-white border-[#075B60]/40 shadow-xs hover:border-[#075B60]'
                    : 'bg-[#F7E5C8]/30 border-[#DBC7A6] opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-serif font-bold text-base text-[#075B60]">
                      {offer.pointsCost} {isArabic ? 'نقطة' : 'pts'}
                    </span>
                    {canAfford && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        {isArabic ? 'متاح للاستبدال' : 'Available'}
                      </span>
                    )}
                  </div>

                  <h5 className="font-serif text-base font-semibold text-[#173D3E] mb-1.5 leading-snug">
                    {isArabic ? offer.name.ar : offer.name.en}
                  </h5>

                  <p className="text-xs text-[#173D3E]/75 leading-relaxed mb-4">
                    {isArabic ? offer.description.ar : offer.description.en}
                  </p>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => handleRedeem(offer)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-[#075B60] text-white hover:bg-[#064a4e]'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>
                    {canAfford
                      ? (isArabic ? 'استبدال هذه المكافأة' : 'Redeem Reward')
                      : (isArabic
                          ? `ينقصكِ ${offer.pointsCost - profile.totalPoints} نقطة`
                          : `${offer.pointsCost - profile.totalPoints} pts needed`)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORICAL POINTS TRANSACTION LEDGER */}
      <div className="p-6 bg-white border border-[#DBC7A6] rounded-3xl shadow-xs">
        <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-3 pb-3 border-b border-[#DBC7A6]/60">
          {isArabic ? 'سجل حركات واكتساب النقاط' : 'Loyalty Points Activity Ledger'}
        </h4>

        {profile.transactions.length === 0 ? (
          <p className="text-xs text-[#173D3E]/60 text-center py-6">
            {isArabic ? 'لا توجد حركات مسجلة لهذا الحساب حتى الآن.' : 'No transactions recorded yet.'}
          </p>
        ) : (
          <div className="divide-y divide-[#DBC7A6]/40">
            {profile.transactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-medium text-[#173D3E]">
                    {isArabic ? tx.description.ar : tx.description.en}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#173D3E]/60 mt-0.5">
                    <span dir="ltr">{tx.timestamp}</span>
                    {tx.referenceCode && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#075B60]">{tx.referenceCode}</span>
                      </>
                    )}
                  </div>
                </div>

                <span
                  className={`font-mono font-bold text-sm shrink-0 ${
                    tx.points > 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points} {isArabic ? 'نقطة' : 'pts'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
