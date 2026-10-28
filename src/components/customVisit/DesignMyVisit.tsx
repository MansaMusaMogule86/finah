import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service, Room, CustomVisitRequest } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Clock,
  Check,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Coffee,
  DoorOpen,
  UserCheck,
  Users,
  CheckCircle,
  Send,
  Info,
  CalendarCheck
} from 'lucide-react';

interface DesignMyVisitProps {
  onProceedToBooking: (selectedServices: Service[]) => void;
}

export const DesignMyVisit: React.FC<DesignMyVisitProps> = ({ onProceedToBooking }) => {
  const { t, isArabic } = useLanguage();
  const allServices = finahStore.getServices();
  const config = finahStore.getConfig();

  // Tomorrow's date as default
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Selected services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([allServices[0].id]);
  const [preferredStartTime, setPreferredStartTime] = useState<string>('11:00');
  const [preferredDate, setPreferredDate] = useState<string>(getTomorrowString());

  // Manual Request Form State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<CustomVisitRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Category Filter for Service Tray
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Moroccan Ritual Sequence Priority Order
  // Traditional rule: 1. Hammam (cleanse/pores) -> 2. Body Massage/Wrap -> 3. Facial -> 4. Hair styling
  const getCategoryOrder = (catId: string): number => {
    switch (catId) {
      case 'hammam':
        return 1;
      case 'body':
        return 2;
      case 'facial':
        return 3;
      case 'hair':
        return 4;
      case 'bridal':
        return 0; // bridal is self-contained
      default:
        return 5;
    }
  };

  // Sort selected services into harmonious Moroccan ritual sequence
  const sequencedServices: Service[] = useMemo(() => {
    const list = selectedServiceIds
      .map(id => allServices.find(s => s.id === id))
      .filter((s): s is Service => !!s);

    return [...list].sort((a, b) => getCategoryOrder(a.categoryId) - getCategoryOrder(b.categoryId));
  }, [selectedServiceIds, allServices]);

  // Handle service toggle
  const handleToggleService = (service: Service) => {
    const exists = selectedServiceIds.includes(service.id);
    if (exists) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter(id => id !== service.id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, service.id]);
    }
  };

  // Duration & Transition Buffer Math
  const totalTreatmentMins = sequencedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  // 15-minute tea rest and suite transition between consecutive rituals
  const bufferPerTransition = 15;
  const totalBufferMins = (sequencedServices.length - 1) * bufferPerTransition;
  const totalVisitMins = totalTreatmentMins + totalBufferMins;

  // Pricing & Deposit Breakdown
  const totalPriceAed = sequencedServices.reduce((sum, s) => sum + (s.priceAed || 0), 0);
  const depositPct = config.policies.depositPercentage;
  const depositAed = Math.round((totalPriceAed * depositPct) / 100);
  const remainingAed = totalPriceAed - depositAed;

  // Room and Staff Requirements Analysis
  const requiredRoomTypes = useMemo(() => {
    const types = new Set<string>();
    sequencedServices.forEach(s => {
      if (s.requiredRoomType && s.requiredRoomType !== 'any') {
        types.add(s.requiredRoomType);
      }
    });
    return Array.from(types);
  }, [sequencedServices]);

  const roomNamesMap: Record<string, { ar: string; en: string }> = {
    hammam_suite: { ar: 'جناح الحمام الملكي (فاس أو مراكش)', en: 'Fez or Marrakech Royal Hammam Suite' },
    facial_room: { ar: 'مقصورة الدار البيضاء للعناية بالبشرة', en: 'Casablanca Facial Sanctuary' },
    hair_station: { ar: 'استوديو الرباط لتصفيف الشعر', en: 'Rabat Hair Atelier' },
    body_suite: { ar: 'جناح الأطلس للمساج والاسترخاء', en: 'Atlas Body & Massage Suite' }
  };

  // Staff requirements: check if multiple therapists are required
  const eligibleStaffSets = sequencedServices.map(s => s.eligibleStaffIds);
  // Find intersection of staff who can do all services
  const sharedStaff = eligibleStaffSets.length > 0
    ? eligibleStaffSets.reduce((acc, current) => acc.filter(id => current.includes(id)))
    : [];

  const requiresMultiTherapists = sharedStaff.length === 0 && sequencedServices.length > 1;

  // Evaluation: Does this combination require manual schedule coordination?
  const manualPlanningReasons: string[] = [];
  if (sequencedServices.length >= 3) {
    manualPlanningReasons.push(
      isArabic
        ? 'باقة تشمل 3 طقوس أو أكثر تتطلب تنسيقاً زمنياً مطولاً بين الأجنحة'
        : 'Package includes 3 or more rituals requiring extended suite orchestration'
    );
  }
  if (requiredRoomTypes.length >= 2) {
    manualPlanningReasons.push(
      isArabic
        ? `تتطلب الزيارة التنقل بين ${requiredRoomTypes.length} أجنحة مختلفة مع تجهيز مسبق`
        : `Visit requires transitions between ${requiredRoomTypes.length} distinct private suites`
    );
  }
  if (requiresMultiTherapists) {
    manualPlanningReasons.push(
      isArabic
        ? 'تتطلب الجلسات مهارات أخصائيتين مختلفتين (حمام وعناية بشرة/شعر)'
        : 'Requires coordinating two specialized therapists for seamless handoff'
    );
  }
  if (totalVisitMins > 180) {
    manualPlanningReasons.push(
      isArabic
        ? 'المدة الإجمالية تتجاوز 3 ساعات، مما يستلزم جدولة فترات راحة وشاي مخصصة'
        : 'Total duration exceeds 3 hours, requiring curated rest and tea pacing'
    );
  }
  if (sequencedServices.some(s => s.categoryId === 'bridal')) {
    manualPlanningReasons.push(
      isArabic
        ? 'تشمل الباقة طقس العروس الملكي الذي يخضع لجدولة استشارية مسبقة'
        : 'Includes royal bridal journey requiring bespoke consultation scheduling'
    );
  }

  const requiresManualPlanning = manualPlanningReasons.length > 0;

  // Timeline Step Builder with Exact Start and End Times
  const timelineSteps = useMemo(() => {
    const steps: {
      type: 'welcome' | 'treatment' | 'buffer';
      title: { ar: string; en: string };
      room: { ar: string; en: string };
      durationMins: number;
      startTimeStr: string;
      endTimeStr: string;
      notes?: { ar: string; en: string };
    }[] = [];

    const [startH, startM] = preferredStartTime.split(':').map(Number);
    let currentMins = startH * 60 + startM;

    const formatMins = (m: number) => {
      const h = Math.floor(m / 60) % 24;
      const min = m % 60;
      return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    };

    // Step 0: Welcome and consultation
    const welcomeEnd = currentMins + 10;
    steps.push({
      type: 'welcome',
      title: {
        ar: 'الاستقبال والترحيب والشاي المغربي',
        en: 'Welcome, Consultation & Mint Tea'
      },
      room: {
        ar: 'ردهة الاستقبال الهادئة',
        en: 'Sanctuary Lounge Courtyard'
      },
      durationMins: 10,
      startTimeStr: formatMins(currentMins),
      endTimeStr: formatMins(welcomeEnd),
      notes: {
        ar: 'استشارة مريحة وتجهيز رداء الحمام المعقم والمستلزمات الخاصة',
        en: 'Consultation, intake check, and preparation of robes and slippers'
      }
    });
    currentMins = welcomeEnd;

    // Treatments & Buffers
    sequencedServices.forEach((service, index) => {
      const treatmentEnd = currentMins + service.durationMinutes;
      const roomInfo = roomNamesMap[service.requiredRoomType] || {
        ar: 'جناح خاص',
        en: 'Private Sanctuary Suite'
      };

      steps.push({
        type: 'treatment',
        title: service.name,
        room: roomInfo,
        durationMins: service.durationMinutes,
        startTimeStr: formatMins(currentMins),
        endTimeStr: formatMins(treatmentEnd),
        notes: service.shortIntro
      });
      currentMins = treatmentEnd;

      // Add buffer between services (if not last)
      if (index < sequencedServices.length - 1) {
        const bufferEnd = currentMins + bufferPerTransition;
        steps.push({
          type: 'buffer',
          title: {
            ar: 'استراحة شاي وانتقال مريح بين الأجنحة',
            en: 'Moroccan Tea Rest & Suite Transition'
          },
          room: {
            ar: 'ردهة الاسترخاء',
            en: 'Relaxation Courtyard'
          },
          durationMins: bufferPerTransition,
          startTimeStr: formatMins(currentMins),
          endTimeStr: formatMins(bufferEnd),
          notes: {
            ar: 'فترة نقاهة لتنفس البشرة وارتشاف شاي الأعشاب قبل الطقس التالي',
            en: 'Rest interval to hydrate and relax before your next treatment'
          }
        });
        currentMins = bufferEnd;
      }
    });

    return steps;
  }, [sequencedServices, preferredStartTime]);

  const estimatedEndTime = timelineSteps.length > 0 ? timelineSteps[timelineSteps.length - 1].endTimeStr : '';

  // Submit Custom Visit Request
  const handleSubmitVisitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const request = finahStore.submitCustomVisitRequest({
        customerName: guestName.trim(),
        customerPhone: guestPhone.trim(),
        customerEmail: guestEmail.trim() || `${guestPhone.trim()}@guest.finahbeauty.com`,
        preferredDate,
        preferredStartTime,
        estimatedEndTime,
        serviceIds: sequencedServices.map(s => s.id),
        serviceNames: sequencedServices.map(s => s.name),
        totalTreatmentMinutes: totalTreatmentMins,
        totalBufferMinutes: totalBufferMins,
        totalPriceAed,
        depositAed,
        remainingBalanceAed: remainingAed,
        requiredRooms: requiredRoomTypes.map(rt => roomNamesMap[rt]?.en || rt),
        requiredStaffSpecialties: requiresMultiTherapists
          ? ['Hammam Specialist', 'Beauty/Hair Specialist']
          : ['Dedicated Sanctuary Therapist'],
        requiresManualPlanning,
        manualPlanningReasons,
        notes: guestNotes.trim()
      });

      setSubmittedRequest(request);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="design-my-visit-section" className="py-16 sm:py-20 bg-[#FFF7EA] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <RosetteEmblem size={20} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {t('nav.design_visit')}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#173D3E] tracking-tight mb-3">
            {isArabic ? 'صممي برنامج زيارتك المتكاملة' : 'Design Your Bespoke Sanctuary Visit'}
          </h1>
          <p className="text-sm sm:text-base text-[#173D3E]/80 leading-relaxed max-w-2xl mx-auto">
            {isArabic
              ? 'ادمجي الطقوس المتوافقة في زيارة واحدة متناسقة. يقوم نظام فنة تلقائياً بترتيب الطقوس في تسلسلها المغربي الأمثل، واحتساب فترات الانتقال والراحة وشاي النعناع، وعرض متطلبات الأجنحة والأخصائيات بدقة.'
              : 'Combine harmonious rituals into a seamless visit. Finah automatically sequences treatments in optimal Moroccan tradition, factors in transition buffers and tea rest, and details exact room and specialist requirements.'}
          </p>
        </div>

        {/* Main Grid: Selection Tray (Left/Right) + Live Itinerary Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Services Selection Tray (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#DBC7A6]/60">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#075B60] text-white border-[#075B60]'
                    : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
                }`}
              >
                {isArabic ? 'جميع الخدمات' : 'All Rituals'}
              </button>
              {finahStore.getCategories().map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                    activeCategoryFilter === cat.id
                      ? 'bg-[#075B60] text-white border-[#075B60]'
                      : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
                  }`}
                >
                  {isArabic ? cat.name.ar : cat.name.en}
                </button>
              ))}
            </div>

            {/* List of Available Services */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-[#173D3E]">
                  {isArabic ? 'الطقوس المتاحة للدمج:' : 'Available rituals for combination:'}
                </h3>
                <span className="text-xs text-[#075B60]">
                  {sequencedServices.length} {isArabic ? 'طقوس محددة' : 'selected'}
                </span>
              </div>

              {allServices
                .filter(s => activeCategoryFilter === 'all' || s.categoryId === activeCategoryFilter)
                .map(service => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  const isHammam = service.categoryId === 'hammam';

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleToggleService(service)}
                      className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                        isSelected
                          ? 'border-[#075B60] bg-[#F7E5C8]/50 shadow-xs ring-1 ring-[#075B60]'
                          : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/25'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                            isSelected
                              ? 'bg-[#075B60] border-[#075B60] text-white'
                              : 'border-[#DBC7A6] bg-white'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-3.5 h-3.5 text-[#075B60]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-serif text-base font-medium text-[#173D3E]">
                              {isArabic ? service.name.ar : service.name.en}
                            </h4>
                            {isHammam && (
                              <span className="text-[10px] text-[#075B60] bg-[#075B60]/10 px-1.5 py-0.5 rounded font-medium">
                                {isArabic ? 'الطقس التمهيدي' : 'Foundation Step'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#173D3E]/75 line-clamp-1 mb-2">
                            {isArabic ? service.shortIntro.ar : service.shortIntro.en}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#075B60] font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{service.durationMinutes} {t('booking.minutes')}</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{service.priceAed ? `${service.priceAed} ${t('booking.aed')}` : (isArabic ? 'استشارة' : 'Inquiry')}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#173D3E]/60 text-[11px]">
                              {roomNamesMap[service.requiredRoomType]
                                ? (isArabic ? roomNamesMap[service.requiredRoomType].ar : roomNamesMap[service.requiredRoomType].en)
                                : service.requiredRoomType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-left rtl:text-left ltr:text-right">
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-medium ${
                            isSelected
                              ? 'text-[#075B60] bg-[#FFF7EA] border border-[#075B60]'
                              : 'text-[#173D3E]/60 bg-[#F7E5C8]/40'
                          }`}
                        >
                          {isSelected ? (isArabic ? 'مُضاف' : 'Added') : (isArabic ? '+ إضافة' : '+ Add')}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Moroccan Ritual Sequencing Philosophy Callout */}
            <div className="p-4 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl flex items-start gap-3 text-xs text-[#173D3E]/80 leading-relaxed">
              <Info className="w-4 h-4 text-[#075B60] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#075B60] mb-0.5">
                  {isArabic ? 'التسلسل المغربي الأمثل للطقوس:' : 'Optimal Moroccan Sanctuary Flow:'}
                </p>
                <p>
                  {isArabic
                    ? 'يبدأ البرنامج دائماً بالحمام المغربي لفتح المسام وتليين العضلات، يليه تدليك الجسم أو لفافة الطين، ثم جلسة نضارة الوجه، ويُختتم بتصفيف الشعر والزيوت العطرية.'
                    : 'Journeys always begin with the Hammam to open pores and warm muscles, followed by body massage/wrap, facial care, and concluding with hair styling.'}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Live Itinerary & Schedule Analysis Panel (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col gap-5 text-right rtl:text-right ltr:text-left">
            <div className="p-6 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DBC7A6]">
                <h3 className="font-serif text-xl font-medium text-[#173D3E]">
                  {isArabic ? 'جدول الزيارة والمواقيت التقديرية' : 'Estimated Itinerary & Timeline'}
                </h3>
                <span className="text-xs font-mono font-semibold text-[#075B60]">
                  {totalVisitMins} {t('booking.minutes')}
                </span>
              </div>

              {/* Time & Date Pickers */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-xs font-medium text-[#075B60] mb-1">
                    {isArabic ? 'تاريخ الزيارة:' : 'Visit Date:'}
                  </label>
                  <input
                    type="date"
                    min={getTomorrowString()}
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#075B60] mb-1">
                    {isArabic ? 'وقت الوصول المفضل:' : 'Preferred Arrival:'}
                  </label>
                  <select
                    value={preferredStartTime}
                    onChange={e => setPreferredStartTime(e.target.value)}
                    className="w-full p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  >
                    {['10:30', '11:00', '12:00', '13:30', '15:00', '16:30', '18:00'].map(tm => (
                      <option key={tm} value={tm}>
                        {tm} {isArabic ? '(دبي)' : 'GST'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step-by-Step Chronological Itinerary */}
              <div className="flex flex-col gap-3 mb-6">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#075B60]">
                  {isArabic ? 'التسلسل الزمني للزيارة:' : 'Chronological Visit Sequence:'}
                </p>

                <div className="relative pl-0 pr-0 flex flex-col gap-2.5">
                  {timelineSteps.map((step, idx) => {
                    const isTreatment = step.type === 'treatment';
                    const isWelcome = step.type === 'welcome';
                    const isBuffer = step.type === 'buffer';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs transition-colors ${
                          isTreatment
                            ? 'bg-[#FFF7EA] border-[#DBC7A6]'
                            : isBuffer
                            ? 'bg-[#F7E5C8]/40 border-dashed border-[#DBC7A6] text-[#075B60]'
                            : 'bg-[#FFF7EA]/80 border-[#DBC7A6]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 font-semibold">
                            {isWelcome && <Coffee className="w-3.5 h-3.5 text-[#075B60]" />}
                            {isTreatment && <Sparkles className="w-3.5 h-3.5 text-[#075B60]" />}
                            {isBuffer && <Coffee className="w-3.5 h-3.5 text-[#075B60]" />}
                            <span>{isArabic ? step.title.ar : step.title.en}</span>
                          </div>
                          <span className="font-mono text-[11px] text-[#075B60] font-medium whitespace-nowrap">
                            {step.startTimeStr} – {step.endTimeStr}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#173D3E]/70">
                          <span className="flex items-center gap-1">
                            <DoorOpen className="w-3 h-3 text-[#075B60]" />
                            <span>{isArabic ? step.room.ar : step.room.en}</span>
                          </span>
                          <span>{step.durationMins} {t('booking.minutes')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room & Staff Requirements Card */}
              <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl mb-6 flex flex-col gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#075B60] font-semibold pb-1.5 border-b border-[#DBC7A6]/40">
                  <DoorOpen className="w-4 h-4" />
                  <span>{isArabic ? 'متطلبات الأجنحة والأخصائيات:' : 'Room & Specialist Requirements:'}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-[#173D3E]/75">
                    {isArabic ? 'الأجنحة المحجوزة لهذه الزيارة:' : 'Suites reserved for this journey:'}
                  </p>
                  <ul className="flex flex-col gap-1 text-[11px] text-[#173D3E]">
                    {requiredRoomTypes.map(rt => (
                      <li key={rt} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#075B60]" />
                        <span>{roomNamesMap[rt] ? (isArabic ? roomNamesMap[rt].ar : roomNamesMap[rt].en) : rt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#DBC7A6]/40 flex items-center justify-between text-[11px]">
                  <span className="text-[#173D3E]/75">{isArabic ? 'فريق العمل المخصص:' : 'Specialist Allocation:'}</span>
                  <span className="font-medium text-[#075B60]">
                    {requiresMultiTherapists
                      ? (isArabic ? 'أخصائيتان بالتناوب المنظم' : '2 Specialized Therapists')
                      : (isArabic ? 'أخصائية مخصصة طوال الزيارة' : '1 Dedicated Specialist')}
                  </span>
                </div>
              </div>

              {/* Financial & Deposit Breakdown */}
              <div className="p-4 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl mb-6 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#173D3E]/75">{isArabic ? 'إجمالي قيمة الجلسات:' : 'Total Rituals Value:'}</span>
                  <span className="font-serif font-bold text-base text-[#173D3E]">
                    {totalPriceAed} {t('booking.aed')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#075B60] pt-1.5 border-t border-[#DBC7A6]/40">
                  <span>{isArabic ? `العربون المطلوب (${depositPct}%):` : `Deposit (${depositPct}%):`}</span>
                  <span className="font-semibold">{depositAed} {t('booking.aed')}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#173D3E]/70">
                  <span>{isArabic ? 'المتبقي عند الحضور في المركز:' : 'Balance upon arrival:'}</span>
                  <span>{remainingAed} {t('booking.aed')}</span>
                </div>

                <p className="text-[10px] text-[#173D3E]/60 italic mt-1">
                  {isArabic ? 'الأسعار شاملة ضريبة القيمة المضافة 5%.' : 'All prices include 5% UAE VAT.'}
                </p>
              </div>

              {/* Planning Status Badge & Action Trigger */}
              {requiresManualPlanning ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <div className="flex items-center gap-2 font-semibold text-amber-950 mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{isArabic ? 'تنسيق مخصص من فريق فنة' : 'Custom Schedule Coordination'}</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      {isArabic
                        ? 'نظراً لتعدد الأجنحة والأخصائيات في هذه الباقة، سيتم إنشاء "طلب موعد مخصص" لتقوم مديرة المركز بتأكيد التوقيت الدقيق معكِ عبر واتساب.'
                        : 'Because this custom journey spans multiple suites and specialist handoffs, our concierge will coordinate room transitions and confirm your bespoke schedule via WhatsApp.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isArabic ? 'إرسال طلب الزيارة المخصصة' : 'Generate Custom Visit Request'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onProceedToBooking(sequencedServices)}
                    className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{isArabic ? 'متابعة حجز هذا البرنامج' : 'Schedule This Visit Directly'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Custom Visit Request Submission Form */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#DBC7A6] flex items-center justify-between bg-[#F7E5C8]/40">
              <div className="flex items-center gap-2">
                <RosetteEmblem size={20} color="#075B60" />
                <h3 className="font-serif text-lg font-medium text-[#173D3E]">
                  {isArabic ? 'طلب تنسيق زيارة مخصصة' : 'Custom Visit Coordination Request'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsRequestModalOpen(false);
                  setSubmittedRequest(null);
                }}
                className="text-xs text-[#075B60] hover:underline cursor-pointer"
              >
                {t('btn.close')}
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 text-right rtl:text-right ltr:text-left">
              {submittedRequest ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#075B60] text-white flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <span className="text-xs font-mono font-bold text-[#075B60] tracking-wider mb-1">
                    {submittedRequest.referenceCode}
                  </span>

                  <h4 className="font-serif text-2xl font-medium text-[#173D3E] mb-2">
                    {isArabic ? 'تم إنشاء طلب الزيارة المخصصة بنجاح' : 'Visit Request Generated Successfully'}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#173D3E]/80 max-w-md mb-6 leading-relaxed">
                    {isArabic
                      ? `شكراً لكِ ${submittedRequest.customerName}. سيقوم فريق فنة بمراجعة جاهزية الأجنحة والأخصائيات وتأكيد الموعد النهائي معكِ عبر واتساب (${submittedRequest.customerPhone}) خلال ساعتين.`
                      : `Thank you, ${submittedRequest.customerName}. Our sanctuary team will review room transitions and confirm your bespoke itinerary via WhatsApp (${submittedRequest.customerPhone}) within 2 hours.`}
                  </p>

                  {/* Summary Box */}
                  <div className="w-full max-w-sm p-4 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-xl text-xs flex flex-col gap-2 mb-6 text-right rtl:text-right ltr:text-left">
                    <div className="flex justify-between">
                      <span className="text-[#173D3E]/70">{isArabic ? 'التاريخ المفضل:' : 'Preferred Date:'}</span>
                      <span>{submittedRequest.preferredDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#173D3E]/70">{isArabic ? 'وقت الوصول:' : 'Arrival Window:'}</span>
                      <span>{submittedRequest.preferredStartTime} – {submittedRequest.estimatedEndTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#173D3E]/70">{isArabic ? 'إجمالي المدة:' : 'Total Duration:'}</span>
                      <span>{submittedRequest.totalTreatmentMinutes + submittedRequest.totalBufferMinutes} {t('booking.minutes')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#075B60] pt-1 border-t border-[#DBC7A6]/50">
                      <span>{isArabic ? 'قيمة الباقة:' : 'Total Value:'}</span>
                      <span>{submittedRequest.totalPriceAed} {t('booking.aed')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsRequestModalOpen(false);
                      setSubmittedRequest(null);
                    }}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer"
                  >
                    {t('btn.close')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitVisitRequest} className="flex flex-col gap-4">
                  {/* Package Quick Overview */}
                  <div className="p-3.5 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] flex flex-col gap-1.5">
                    <div className="flex justify-between font-semibold text-[#075B60]">
                      <span>{isArabic ? 'برنامج الزيارة المحدد:' : 'Curated Sequence:'}</span>
                      <span>{sequencedServices.length} {isArabic ? 'طقوس' : 'rituals'} · {totalVisitMins} {t('booking.minutes')}</span>
                    </div>
                    <p className="text-[11px] text-[#173D3E]/75">
                      {sequencedServices.map(s => isArabic ? s.name.ar : s.name.en).join(' ← ')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#173D3E] mb-1">
                      {isArabic ? 'الاسم الكريم *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isArabic ? 'مثال: مريم المنصوري' : 'e.g. Mariam Al Mansoori'}
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#173D3E] mb-1">
                        {isArabic ? 'رقم الهاتف (واتساب لتأكيد الموعد) *' : 'Phone (WhatsApp for confirmation) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="+971 50 123 4567"
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#173D3E] mb-1">
                        {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        placeholder="guest@example.com"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#173D3E] mb-1">
                      {isArabic ? 'تاريخ ووقت الوصول المطلوب:' : 'Preferred Date & Arrival Time:'}
                    </label>
                    <div className="p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-xs text-[#075B60] font-medium flex justify-between items-center">
                      <span>{preferredDate}</span>
                      <span>{preferredStartTime} – {estimatedEndTime} ({isArabic ? 'بتوقيت دبي' : 'Dubai GST'})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#173D3E] mb-1">
                      {isArabic ? 'ملاحظات أو تفضيلات خاصة للأخصائيات:' : 'Special notes or preferences:'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={isArabic ? 'مثال: أي حساسية تجاه عطور معينة، درجة حرارة البخار، أو تفضيل ضغط التدليك...' : 'e.g. Any pressure preferences or sensitivities...'}
                      value={guestNotes}
                      onChange={e => setGuestNotes(e.target.value)}
                      className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(false)}
                      className="px-4 py-2 text-xs border border-[#DBC7A6] text-[#173D3E] rounded-md"
                    >
                      {t('btn.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] disabled:opacity-50 rounded-md transition-colors cursor-pointer"
                    >
                      {isSubmitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال طلب الزيارة' : 'Submit Visit Request')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
