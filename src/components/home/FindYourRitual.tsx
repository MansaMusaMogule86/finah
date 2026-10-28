import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  PlusCircle,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface FindYourRitualProps {
  onBookService: (service: Service) => void;
  onInquireService: (service: Service) => void;
  onAddToVisit?: (service: Service) => void;
}

export const FindYourRitual: React.FC<FindYourRitualProps> = ({
  onBookService,
  onInquireService,
  onAddToVisit
}) => {
  const { t, isArabic } = useLanguage();
  // Strictly filter only approved services per guidelines
  const approvedServices = finahStore.getServices().filter(s => s.status === 'approved');

  const [step, setStep] = useState<number>(1);
  const [visitType, setVisitType] = useState<string>('hammam'); // hammam, body, facial, hair, bridal
  const [timeAvailable, setTimeAvailable] = useState<number>(90); // 60, 90, 150
  const [priorityGoal, setPriorityGoal] = useState<string>('exfoliation'); // exfoliation, relaxation, radiance, hair_scalp, royal_celebration

  const [primaryMatch, setPrimaryMatch] = useState<Service | null>(null);
  const [alternatives, setAlternatives] = useState<Service[]>([]);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Deterministic, Rules-Based Recommendation Engine (No AI dependency)
  const calculateRecommendations = (selectedGoal: string) => {
    setPriorityGoal(selectedGoal);

    // Score all approved services
    const scored = approvedServices.map(service => {
      let score = 0;

      // 1. Visit Type match (weight: 40)
      if (visitType === 'hammam' && service.categoryId === 'hammam') score += 40;
      else if (visitType === 'body' && service.categoryId === 'body') score += 40;
      else if (visitType === 'facial' && service.categoryId === 'facial') score += 40;
      else if (visitType === 'hair' && service.categoryId === 'hair') score += 40;
      else if (visitType === 'bridal' && (service.categoryId === 'bridal' || service.id === 'hammam-royal-finah')) score += 45;

      // 2. Duration closeness match (weight: 30)
      const diff = Math.abs(service.durationMinutes - timeAvailable);
      if (diff === 0) score += 30;
      else if (diff <= 15) score += 20;
      else if (diff <= 30) score += 10;

      // 3. Wellness Priority match (weight: 30)
      if (selectedGoal === 'exfoliation') {
        if (service.tags.includes('exfoliation') || service.categoryId === 'hammam') score += 30;
      } else if (selectedGoal === 'relaxation') {
        if (service.tags.includes('relaxation') || service.categoryId === 'body') score += 30;
      } else if (selectedGoal === 'radiance') {
        if (service.tags.includes('radiance') || service.categoryId === 'facial') score += 30;
      } else if (selectedGoal === 'hair_scalp') {
        if (service.tags.includes('hair') || service.categoryId === 'hair') score += 30;
      } else if (selectedGoal === 'royal_celebration') {
        if (service.categoryId === 'bridal' || service.id === 'hammam-royal-finah') score += 35;
      }

      // Bonus for signature ceremonies if more than 90 mins available
      if (timeAvailable >= 90 && service.id === 'hammam-royal-finah') {
        score += 5;
      }

      return { service, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0]?.service || approvedServices[0];
    const remaining = scored.filter(s => s.service.id !== primary.id).map(s => s.service);

    // Pick up to two distinct alternatives
    const alts = remaining.slice(0, 2);

    setPrimaryMatch(primary);
    setAlternatives(alts);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setVisitType('hammam');
    setTimeAvailable(90);
    setPriorityGoal('exfoliation');
    setPrimaryMatch(null);
    setAlternatives([]);
    setAddedNotice(null);
  };

  const handleAddToVisit = (service: Service) => {
    if (onAddToVisit) {
      onAddToVisit(service);
    } else {
      onBookService(service);
    }
    setAddedNotice(
      isArabic
        ? `تمت إضافة "${service.name.ar}" بنجاح إلى برنامج زيارتكِ.`
        : `Added "${service.name.en}" to your sanctuary visit.`
    );
    setTimeout(() => setAddedNotice(null), 4000);
  };

  const handleAskTeam = (service: Service) => {
    const config = finahStore.getConfig();
    const serviceName = isArabic ? service.name.ar : service.name.en;
    const message = encodeURIComponent(
      isArabic
        ? `مرحباً فريق فنة، أوصاني محرك اكتشاف الطقوس بـ "${serviceName}"، وأود الاستفسار عن المواعيد المتاحة والاستشارة حول هذا الطقس.`
        : `Hello Finah team, the Ritual Guide recommended "${serviceName}" for me. I would like to inquire about availability and consultation.`
    );
    const rawNumber = config.phone.raw ? config.phone.raw.replace(/[^0-9]/g, '') : '971500000000';
    const whatsappUrl = `https://wa.me/${rawNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="find-your-ritual" className="py-20 sm:py-28 bg-[#F7E5C8]/40 border-b border-[#DBC7A6]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-[#075B60]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'دليل الطقوس الاستشاري' : 'Guided Ritual Consultation'}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight mb-3">
            {isArabic ? 'اكتشفي طقسكِ المغربي المثالي' : 'Find Your Ritual'}
          </h2>
          <p className="text-sm text-[#173D3E]/80 max-w-lg mx-auto">
            {isArabic
              ? 'أجيبي على ٣ أسئلة بسيطة ليرشح لكِ نظامنا القائم على المعايير الطقس الأنسب لاحتياجاتكِ من باقاتنا المعتمدة.'
              : 'Answer 3 focused questions to receive a personalized rules-based recommendation from our approved sanctuary rituals.'}
          </p>
        </div>

        {/* Added to Visit Alert */}
        {addedNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{addedNotice}</span>
          </div>
        )}

        {/* Guided Card Container */}
        <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl p-6 sm:p-10 shadow-sm relative">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-[#DBC7A6]/60 pb-4 mb-8 text-xs text-[#075B60] font-medium">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {step < 4
                  ? `${isArabic ? 'السؤال' : 'Question'} ${step} ${isArabic ? 'من ٣' : 'of 3'}`
                  : (isArabic ? 'التوصية المعتمدة لكِ' : 'Your Recommended Ritual')}
              </span>
            </div>
            {step > 1 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[#173D3E]/70 hover:text-[#075B60] transition-colors cursor-pointer text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isArabic ? 'إعادة البدء' : 'Start Over'}</span>
              </button>
            )}
          </div>

          {/* QUESTION 1: What kind of visit are you considering? */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h3 className="font-serif text-2xl text-[#173D3E] font-medium mb-2 text-right rtl:text-right ltr:text-left">
                {isArabic ? '١. ما نوع الزيارة أو التجربة التي تفكرين فيها؟' : '1. What kind of visit are you considering?'}
              </h3>
              <p className="text-xs text-[#173D3E]/70 mb-6 text-right rtl:text-right ltr:text-left">
                {isArabic ? 'حددي المجال العلاجي أو الجمالي الذي يشكل محور رغبتكِ اليوم.' : 'Select the primary treatment pillar for your sanctuary journey.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {[
                  {
                    id: 'hammam',
                    title: isArabic ? 'الحمام المغربي الأصيل والتنقية بالبخار' : 'Moroccan Hammam & Steam Purification',
                    desc: isArabic ? 'تقشير بالكيس الفردي، صابون بلدي أسود، وغاسول الأطلس' : 'Kessa exfoliation, black olive soap, and mineral ghassoul'
                  },
                  {
                    id: 'body',
                    title: isArabic ? 'الاسترخاء العضلي وتدليك الجسم النباتي' : 'Deep Muscular Rest & Botanical Body Massage',
                    desc: isArabic ? 'تدليك بزيت الأركان الدافئ وعبير زهر البرتقال المغربي' : 'Warm argan oil flow and soothing Moroccan neroli'
                  },
                  {
                    id: 'facial',
                    title: isArabic ? 'نضارة الوجه وإشراقة الورد الدمشقي' : 'Damask Rose Facial Glow & Skin Radiance',
                    desc: isArabic ? 'تقشير اللوز، قناع الطمي الأبيض، ومساج الكوارتز الوردي' : 'Almond micro-polish, white clay mask, and quartz contouring'
                  },
                  {
                    id: 'hair',
                    title: isArabic ? 'علاج الأركان المغربي للشعر وفروة الرأس' : 'Organic Argan Hair & Scalp Revitalization',
                    desc: isArabic ? 'تغذية عميقة للألياف، بخار معتدل، وتصفيف ناعم' : 'Pure argan infusion, micro-steam therapy, and blowout'
                  },
                  {
                    id: 'bridal',
                    title: isArabic ? 'طقس ملكي متكامل لمناسبة أو عروس' : 'Complete Royal Bridal & Celebration Ceremony',
                    desc: isArabic ? 'رحلة شاملة من الرأس إلى القدمين تعتني بكافة تفاصيل الإشراقة' : 'Comprehensive head-to-toe sanctuary pampering'
                  }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setVisitType(opt.id)}
                    className={`p-4 rounded-xl text-right rtl:text-right ltr:text-left border transition-all cursor-pointer ${
                      visitType === opt.id
                        ? 'border-[#075B60] bg-[#F7E5C8]/70 shadow-xs ring-1 ring-[#075B60]'
                        : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/30'
                    }`}
                  >
                    <p className="font-semibold text-sm text-[#173D3E] mb-1">{opt.title}</p>
                    <p className="text-xs text-[#173D3E]/70 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t('btn.next')}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 2: How much time do you have? */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h3 className="font-serif text-2xl text-[#173D3E] font-medium mb-2 text-right rtl:text-right ltr:text-left">
                {isArabic ? '٢. كم من الوقت متاح لكِ لهذه الزيارة؟' : '2. How much time do you have?'}
              </h3>
              <p className="text-xs text-[#173D3E]/70 mb-6 text-right rtl:text-right ltr:text-left">
                {isArabic ? 'سنطابق توصيتنا مع جدولكِ لمنحكِ أقصى درجات الراحة دون استعجال.' : 'We will balance the ritual flow perfectly within your available window.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    mins: 60,
                    title: isArabic ? 'ساعة واحدة (٦٠ دقيقة)' : '1 Hour (60 mins)',
                    desc: isArabic ? 'جلسة مركزة ومنعشة تناسب يومكِ المزدحم' : 'Focused, restorative essential session'
                  },
                  {
                    mins: 90,
                    title: isArabic ? 'ساعة ونصف (٧٥ - ٩٠ دقيقة)' : '1.5 Hours (75 - 90 mins)',
                    desc: isArabic ? 'التوازن المثالي لطقوس فنة الملكية' : 'Ideal luxury balance for our signature rituals'
                  },
                  {
                    mins: 150,
                    title: isArabic ? 'ساعتان أو أكثر (١٢٠+ دقيقة)' : '2+ Hours (120+ mins)',
                    desc: isArabic ? 'رحلة مطولة وشاملة تجمع أكثر من علاج' : 'Unrushed multi-treatment luxury journey'
                  }
                ].map(opt => (
                  <button
                    key={opt.mins}
                    onClick={() => setTimeAvailable(opt.mins)}
                    className={`p-4 rounded-xl text-right rtl:text-right ltr:text-left border transition-all cursor-pointer ${
                      timeAvailable === opt.mins
                        ? 'border-[#075B60] bg-[#F7E5C8]/70 shadow-xs ring-1 ring-[#075B60]'
                        : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/30'
                    }`}
                  >
                    <p className="font-semibold text-sm text-[#173D3E] mb-1">{opt.title}</p>
                    <p className="text-xs text-[#173D3E]/70 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-[#173D3E] hover:text-[#075B60] transition-colors cursor-pointer"
                >
                  {t('btn.back')}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t('btn.next')}</span>
                  {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* QUESTION 3: What is your primary wellness goal? */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h3 className="font-serif text-2xl text-[#173D3E] font-medium mb-2 text-right rtl:text-right ltr:text-left">
                {isArabic ? '٣. ما هو هدفكِ الأساسي أو الشعور الذي تبحثين عنه؟' : '3. What is your primary wellness priority?'}
              </h3>
              <p className="text-xs text-[#173D3E]/70 mb-6 text-right rtl:text-right ltr:text-left">
                {isArabic ? 'اختاري النتيجة التي تودين لمسها فور انتهاء طقسكِ في فنة.' : 'Choose the transformation you desire most upon completing your session.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {[
                  {
                    id: 'exfoliation',
                    title: isArabic ? 'تقشير عميق، تنقية المسام، ونعومة كالحرير' : 'Deep Exfoliation & Silky Smooth Renewal',
                    desc: isArabic ? 'تجديد الخلايا والتخلص التام من الشوائب والجلد الميت' : 'Shedding dead cells and revitalizing skin texture'
                  },
                  {
                    id: 'relaxation',
                    title: isArabic ? 'إزالة التوتر العضلي واستعادة الهدوء التام' : 'Relieving Muscular Tension & Deep Stress',
                    desc: isArabic ? 'تليين الظهر والأكتاف والرقبة مع انسياب الزيوت الدافئة' : 'Unwinding tense shoulders and restoring serene mental calm'
                  },
                  {
                    id: 'radiance',
                    title: isArabic ? 'إشراقة الوجه وتوريد الملامح بماء الورد' : 'Luminous Facial Complexion & Hydration',
                    desc: isArabic ? 'تنظيف المسام وتغذية البشرة بالطين الأبيض وزيت التين الشوكي' : 'Gentle white clay purification and rose hydrosol glow'
                  },
                  {
                    id: 'hair_scalp',
                    title: isArabic ? 'تغذية ألياف الشعر ولمعان صحي بالأركان' : 'Hair Fiber Repair & Scalp Nourishment',
                    desc: isArabic ? 'ترطيب عميق بالزيت البكر المعصور على البارد وبخار لطيف' : 'Botanical organic scalp treatment and restorative shine'
                  },
                  {
                    id: 'royal_celebration',
                    title: isArabic ? 'عناية ملكية شاملة وفاخرة لمناسبة استثنائية' : 'Head-to-Toe Luxury Celebration & Bridal Bliss',
                    desc: isArabic ? 'الطقس الأكثر فخامة وتدليلاً لاستعدادات الزفاف والاحتفالات' : 'Our most lavish multi-step journey for momentous occasions'
                  }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => calculateRecommendations(opt.id)}
                    className="p-4 rounded-xl text-right rtl:text-right ltr:text-left border border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/60 hover:border-[#075B60] transition-all cursor-pointer group"
                  >
                    <p className="font-semibold text-sm text-[#075B60] group-hover:text-[#173D3E] mb-1">
                      {opt.title}
                    </p>
                    <p className="text-xs text-[#173D3E]/75 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs text-[#173D3E] hover:text-[#075B60] transition-colors cursor-pointer"
                >
                  {t('btn.back')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATIONS (1 Primary + Up to 2 Alternatives) */}
          {step === 4 && primaryMatch && (
            <div className="animate-fadeIn">
              {/* Primary Recommendation Card */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FFF7EA] to-[#F7E5C8]/40 border-2 border-[#075B60] rounded-2xl mb-8 relative shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#075B60] text-[#FFF7EA] text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-[#F1C17F]" />
                    <span>{isArabic ? 'الطقس الموصى به أولاً (الخيار الرئيسي)' : 'Primary Recommended Ritual'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#075B60]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{primaryMatch.durationMinutes} {isArabic ? 'دقيقة' : 'mins'}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sm font-mono text-[#173D3E]">
                      {primaryMatch.priceAed
                        ? `${primaryMatch.priceAed} ${isArabic ? 'درهم' : 'AED'}`
                        : (isArabic ? 'السعر عند الاستشارة' : 'Price upon inquiry')}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#173D3E] font-medium tracking-tight mb-2">
                  {isArabic ? primaryMatch.name.ar : primaryMatch.name.en}
                </h3>

                <p className="text-xs sm:text-sm text-[#173D3E]/85 leading-relaxed mb-5">
                  {isArabic ? primaryMatch.description.ar : primaryMatch.description.en}
                </p>

                {/* Inclusions List */}
                <div className="p-4 bg-white/70 border border-[#DBC7A6] rounded-xl mb-6">
                  <p className="text-xs font-semibold text-[#075B60] uppercase tracking-wider mb-2.5">
                    {isArabic ? 'مشتملات الطقس المعتمدة:' : 'Approved Ritual Inclusions:'}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#173D3E]/85">
                    {(isArabic ? primaryMatch.inclusions.ar : primaryMatch.inclusions.en).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#075B60] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary Action Buttons: "Add to my visit" and "Ask the team" */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAddToVisit(primaryMatch)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#F1C17F]" />
                    <span>{isArabic ? 'أضيفي إلى زيارتي' : 'Add to my visit'}</span>
                  </button>

                  <button
                    onClick={() => handleAskTeam(primaryMatch)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-[#075B60] bg-[#FFF7EA] hover:bg-[#F7E5C8] border border-[#075B60]/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#075B60]" />
                    <span>{isArabic ? 'استشيري فريقنا' : 'Ask the team'}</span>
                  </button>

                  <button
                    onClick={() => onBookService(primaryMatch)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-[#173D3E] hover:text-[#075B60] border border-[#DBC7A6] rounded-xl transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isArabic ? 'حجز موعد مباشر' : 'Book directly'}</span>
                  </button>
                </div>
              </div>

              {/* Up to Two Alternatives */}
              {alternatives.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#075B60]">
                      {isArabic ? 'خيارات بديلة مناسبة لتفضيلاتكِ (حتى خيارين):' : 'Alternative Ritual Options (Up to 2):'}
                    </p>
                    <span className="text-[11px] text-[#173D3E]/60">
                      {isArabic ? 'مستمدة من باقاتنا المعتمدة' : 'Drawn strictly from approved services'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alternatives.map(alt => (
                      <div
                        key={alt.id}
                        className="p-5 bg-white border border-[#DBC7A6] rounded-2xl flex flex-col justify-between shadow-2xs hover:border-[#075B60]/60 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#075B60]">
                              {alt.categoryId.toUpperCase()}
                            </span>
                            <div className="text-xs text-[#075B60] font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{alt.durationMinutes} {isArabic ? 'دقيقة' : 'mins'}</span>
                            </div>
                          </div>

                          <h4 className="font-serif text-lg font-medium text-[#173D3E] mb-1">
                            {isArabic ? alt.name.ar : alt.name.en}
                          </h4>

                          <p className="text-xs text-[#173D3E]/75 line-clamp-2 mb-3">
                            {isArabic ? alt.shortIntro.ar : alt.shortIntro.en}
                          </p>

                          {/* Inclusions summary */}
                          <div className="mb-4">
                            <p className="text-[11px] font-semibold text-[#075B60] mb-1">
                              {isArabic ? 'المشتملات:' : 'Inclusions:'}
                            </p>
                            <ul className="text-[11px] text-[#173D3E]/75 space-y-1">
                              {(isArabic ? alt.inclusions.ar : alt.inclusions.en).slice(0, 2).map((inc, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-[#075B60] font-bold">·</span>
                                  <span>{inc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#DBC7A6]/40 flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-[#173D3E]">
                            {alt.priceAed
                              ? `${alt.priceAed} ${isArabic ? 'درهم' : 'AED'}`
                              : (isArabic ? 'استشارة' : 'Inquiry')}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAskTeam(alt)}
                              className="p-2 rounded-lg text-[#075B60] hover:bg-[#F7E5C8]/50 border border-[#DBC7A6] transition-colors cursor-pointer"
                              title={isArabic ? 'استشيري فريقنا' : 'Ask the team'}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleAddToVisit(alt)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>{isArabic ? 'أضيفي لزيارتي' : 'Add to visit'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom reset / explore other button */}
              <div className="mt-8 text-center pt-4 border-t border-[#DBC7A6]/60">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B60] hover:text-[#173D3E] underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تجربة إجابات أخرى وتوليد ترشيحات جديدة' : 'Try different answers & explore more rituals'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
