import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service, StaffMember, Appointment, SlotHold, BookingMode } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  CreditCard
} from 'lucide-react';

interface BookingWizardProps {
  initialService?: Service | null;
  additionalServices?: Service[];
  onClose: () => void;
  onBookingCompleted?: (appointment: Appointment) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService,
  additionalServices = [],
  onClose,
  onBookingCompleted
}) => {
  const { t, isArabic } = useLanguage();
  const allServices = finahStore.getServices();
  const allStaff = finahStore.getStaff().filter(s => s.active);
  const config = finahStore.getConfig();

  // Wizard Steps:
  // 1: Service selection
  // 2: Specialist selection
  // 3: Date & Slot selection (Atomic availability)
  // 4: Customer Details
  // 5: Review & Policies
  // 6: Confirmation Screen
  const [currentStep, setCurrentStep] = useState<number>(initialService ? 2 : 1);

  // Selected state
  const [selectedService, setSelectedService] = useState<Service>(initialService || allServices[0]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');

  // Today + 1 day formatted as YYYY-MM-DD
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowString());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [activeHold, setActiveHold] = useState<SlotHold | null>(null);
  const [holdTimeLeft, setHoldTimeLeft] = useState<number>(600); // 10 minutes in seconds

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Finah Rewards state
  const [availableCustomerPoints, setAvailableCustomerPoints] = useState<number>(0);
  const [applyRewardDiscount, setApplyRewardDiscount] = useState(false);
  const [selectedRewardOption, setSelectedRewardOption] = useState<number>(300); // 300 pts = 50 AED, 600 pts = 100 AED

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch slots whenever date, service, or staff changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const slots = finahStore.getAvailability(selectedDate, selectedService.id, selectedStaffId);
      setAvailableSlots(slots);
      if (slots.length > 0 && (!selectedSlot || !slots.includes(selectedSlot))) {
        setSelectedSlot(slots[0]);
      } else if (slots.length === 0) {
        setSelectedSlot('');
      }
    }
  }, [selectedDate, selectedService, selectedStaffId]);

  // Sync customer rewards balance when phone number is entered or step changes
  useEffect(() => {
    if (customerPhone.trim()) {
      const profile = finahStore.getCustomerRewards(customerPhone.trim());
      setAvailableCustomerPoints(profile.totalPoints);
    }
  }, [customerPhone, currentStep]);

  // Hold Countdown timer
  useEffect(() => {
    if (!activeHold) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((activeHold.expiresAt - Date.now()) / 1000));
      setHoldTimeLeft(remaining);
      if (remaining <= 0) {
        finahStore.releaseHold(activeHold.id);
        setActiveHold(null);
        setErrorMessage(isArabic ? 'انتهت مدة حفظ الموعد. يرجى اختيار خانة زمنية مجدداً.' : 'Slot hold expired. Please reselect your slot.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeHold, isArabic]);

  // Handle Slot Selection and create Atomic Hold
  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setErrorMessage('');
    if (activeHold) {
      finahStore.releaseHold(activeHold.id);
    }
    const hold = finahStore.createHold(selectedService.id, selectedDate, slot, selectedStaffId, 'session-guest');
    if (hold) {
      setActiveHold(hold);
    } else {
      setErrorMessage(isArabic ? 'هذا الموعد أصبح محجوزاً للتو. يرجى اختيار موعد آخر.' : 'This slot was just claimed. Please select another slot.');
    }
  };

  // Submit appointment
  const handleConfirmAppointment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage(isArabic ? 'يرجى إدخال الاسم ورقم الهاتف للمتابعة.' : 'Please enter your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const discountAed = (applyRewardDiscount && availableCustomerPoints >= selectedRewardOption)
      ? (selectedRewardOption === 600 ? 100 : 50)
      : 0;

    try {
      const result = finahStore.createAppointment({
        serviceId: selectedService.id,
        additionalServiceIds: additionalServices.map(s => s.id),
        staffId: selectedStaffId,
        date: selectedDate,
        startTime: selectedSlot,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || `${customerPhone.trim()}@guest.finahbeauty.com`,
        notes: customerNotes.trim(),
        holdId: activeHold ? activeHold.id : undefined,
        idempotencyKey: `order-${Date.now()}-${customerPhone.trim()}`,
        rewardPointsUsed: applyRewardDiscount && discountAed > 0 ? selectedRewardOption : 0,
        rewardDiscountAed: discountAed
      });

      setConfirmedAppointment(result.appointment);
      setCurrentStep(6);
      if (onBookingCompleted) {
        onBookingCompleted(result.appointment);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error creating appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Google Calendar link generation without window.open
  const getGoogleCalendarUrl = () => {
    if (!confirmedAppointment) return '#';
    const title = encodeURIComponent(`Finah Beauty: ${confirmedAppointment.serviceName.en}`);
    const details = encodeURIComponent(`Appointment Ref: ${confirmedAppointment.referenceCode} at Finah Beauty, Dubai.`);
    const location = encodeURIComponent('Finah Beauty, Dubai, UAE');
    const startIso = `${confirmedAppointment.date.replace(/-/g, '')}T${confirmedAppointment.startTime.replace(':', '')}00Z`;
    const endIso = `${confirmedAppointment.date.replace(/-/g, '')}T${confirmedAppointment.endTime.replace(':', '')}00Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const mode = config.bookingMode;
  const basePrice = selectedService.priceAed || 0;
  const rewardDiscountAed = (applyRewardDiscount && availableCustomerPoints >= selectedRewardOption)
    ? (selectedRewardOption === 600 ? 100 : 50)
    : 0;
  const price = Math.max(0, basePrice - rewardDiscountAed);
  const deposit = Math.round((price * config.policies.depositPercentage) / 100);
  const remaining = price - deposit;
  const isHammamOrBridal = selectedService.categoryId === 'hammam' || selectedService.categoryId === 'bridal';
  const estimatedPointsToEarn = price + (isHammamOrBridal ? 50 : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#DBC7A6] flex items-center justify-between bg-[#F7E5C8]/40">
          <div className="flex items-center gap-2">
            <RosetteEmblem size={20} color="#075B60" />
            <h3 className="font-serif text-lg font-medium text-[#173D3E]">
              {t('booking.title')}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Clearly Labeled Booking Mode Badge (Mandatory requirement 12) */}
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                mode === 'live'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : mode === 'request'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}
            >
              {mode === 'live'
                ? (isArabic ? 'حجز فوري مباشر' : 'Live Booking')
                : mode === 'request'
                ? (isArabic ? 'وضع طلب الموعد' : 'Request Mode')
                : (isArabic ? 'بيئة تجريبية (Demo)' : 'Sandbox Demo')}
            </span>

            <button
              onClick={onClose}
              className="p-1.5 text-[#173D3E]/70 hover:text-[#075B60] hover:bg-[#F7E5C8] rounded-md transition-colors cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        {currentStep < 6 && (
          <div className="px-6 pt-3 pb-2 bg-[#FFF7EA] border-b border-[#DBC7A6]/40 flex items-center justify-between text-xs text-[#075B60]">
            <span className="font-medium">
              {isArabic ? `الخطوة ${currentStep} من 5` : `Step ${currentStep} of 5`}
            </span>
            <span className="text-[#173D3E]/70 text-[11px]">
              {currentStep === 1 && t('booking.step1')}
              {currentStep === 2 && t('booking.step2')}
              {currentStep === 3 && t('booking.step3')}
              {currentStep === 4 && t('booking.step4')}
              {currentStep === 5 && t('booking.step5')}
            </span>
          </div>
        )}

        {/* Active Hold Banner if applicable */}
        {activeHold && currentStep > 3 && currentStep < 6 && (
          <div className="bg-[#075B60]/10 px-6 py-2 border-b border-[#075B60]/20 flex items-center justify-between text-xs text-[#075B60]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('booking.hold_notice')}</span>
            </span>
            <span className="font-mono font-semibold">
              {Math.floor(holdTimeLeft / 60)}:{('0' + (holdTimeLeft % 60)).slice(-2)}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-right rtl:text-right ltr:text-left">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Ritual */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3">
              <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-2">
                {isArabic ? 'اختاري الطقس المطلوب:' : 'Choose your ritual:'}
              </h4>
              {allServices.map(service => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedService.id === service.id
                      ? 'border-[#075B60] bg-[#F7E5C8]/50 ring-1 ring-[#075B60]'
                      : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/20'
                  }`}
                >
                  <div>
                    <h5 className="font-medium text-sm text-[#173D3E]">
                      {isArabic ? service.name.ar : service.name.en}
                    </h5>
                    <p className="text-xs text-[#173D3E]/70 line-clamp-1">
                      {isArabic ? service.shortIntro.ar : service.shortIntro.en}
                    </p>
                  </div>
                  <div className="text-left rtl:text-left ltr:text-right text-xs text-[#075B60] font-medium shrink-0">
                    <p>{service.durationMinutes} {t('booking.minutes')}</p>
                    <p>{service.priceAed ? `${service.priceAed} ${t('booking.aed')}` : (isArabic ? 'استشارة' : 'Inquiry')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: Specialist Preference */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-3">
              <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-2">
                {isArabic ? 'اختيار الأخصائية:' : 'Select your preferred specialist:'}
              </h4>

              {/* Any Available option */}
              <button
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                  selectedStaffId === 'any'
                    ? 'border-[#075B60] bg-[#F7E5C8]/50 ring-1 ring-[#075B60]'
                    : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#075B60]">
                      {t('booking.any_staff')}
                    </p>
                    <p className="text-xs text-[#173D3E]/70">
                      {isArabic
                        ? 'سيقوم المركز بتعيين أفضل أخصائية متوفرة في الوقت المحدد لضمان أسرع حجز.'
                        : 'Our concierge will allocate the best available specialist for immediate confirmation.'}
                    </p>
                  </div>
                  {selectedStaffId === 'any' && <CheckCircle className="w-5 h-5 text-[#075B60]" />}
                </div>
              </button>

              {allStaff.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStaffId(st.id)}
                  className={`p-4 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                    selectedStaffId === st.id
                      ? 'border-[#075B60] bg-[#F7E5C8]/50 ring-1 ring-[#075B60]'
                      : 'border-[#DBC7A6] bg-[#FFF7EA] hover:bg-[#F7E5C8]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-[#173D3E]">
                        {isArabic ? st.name.ar : st.name.en}
                      </p>
                      <p className="text-xs text-[#173D3E]/70">
                        {isArabic ? st.title.ar : st.title.en}
                      </p>
                    </div>
                    {selectedStaffId === st.id && <CheckCircle className="w-5 h-5 text-[#075B60]" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Date & Slots */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-xl font-medium text-[#173D3E]">
                {isArabic ? 'اختيار التاريخ والوقت بتوقيت دبي:' : 'Select date & Dubai time slot:'}
              </h4>

              <div>
                <label className="block text-xs font-semibold text-[#075B60] mb-1.5">
                  {isArabic ? 'تاريخ الموعد:' : 'Appointment Date:'}
                </label>
                <input
                  type="date"
                  min={getTomorrowString()}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#075B60] mb-2">
                  {isArabic ? 'الأوقات المتاحة المثبتة:' : 'Validated Available Slots:'}
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-2.5 px-3 rounded-md text-xs font-medium text-center border transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-[#075B60] text-white border-[#075B60] shadow-xs'
                            : 'bg-[#F7E5C8]/40 border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    {isArabic
                      ? 'لا توجد خانات متاحة في هذا اليوم للأخصائية المحددة. يرجى اختيار تاريخ آخر أو اختيار "أي أخصائية متاحة".'
                      : 'No available slots on this date for the selected criteria. Please select another day or choose "Any available".'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-1">
                {isArabic ? 'بيانات التواصل (حجز كضيف):' : 'Guest Contact Information:'}
              </h4>
              <p className="text-xs text-[#173D3E]/70 mb-2">
                {t('booking.guest_mode_note')}
              </p>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'الاسم الكريم *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute top-3.5 right-3 rtl:right-3 ltr:left-3 text-[#075B60]" />
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'مثال: سارة الشامسي' : 'e.g. Sarah Al-Shamsi'}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full py-2.5 px-9 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'رقم الهاتف (واتساب) *' : 'Mobile Phone (WhatsApp) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute top-3.5 right-3 rtl:right-3 ltr:left-3 text-[#075B60]" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="+971 50 123 4567"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full py-2.5 px-9 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'البريد الإلكتروني (اختياري للإيصال والتأكيد)' : 'Email (Optional for receipt)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute top-3.5 right-3 rtl:right-3 ltr:left-3 text-[#075B60]" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full py-2.5 px-9 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'ملاحظات خاصة للأخصائية (إن وجدت)' : 'Special notes or preferences'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isArabic ? 'مثال: حساسية معينة، تفضيل ضغط تدليك متوسط...' : 'e.g. Any sensitivities or pressure preferences...'}
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Review & Policies */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-xl font-medium text-[#173D3E] mb-1">
                {isArabic ? 'مراجعة الموعد والشروط:' : 'Review Appointment & Terms:'}
              </h4>

              {/* Summary Card */}
              <div className="p-4 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-xl flex flex-col gap-2 text-xs text-[#173D3E]">
                <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50">
                  <span className="text-[#173D3E]/70">{t('booking.step1')}:</span>
                  <span className="font-semibold">{isArabic ? selectedService.name.ar : selectedService.name.en}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50">
                  <span className="text-[#173D3E]/70">{t('booking.duration')}:</span>
                  <span>{selectedService.durationMinutes} {t('booking.minutes')}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50">
                  <span className="text-[#173D3E]/70">{isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                  <span className="font-medium text-[#075B60]">{selectedDate} · {selectedSlot} (توقيت دبي)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50">
                  <span className="text-[#173D3E]/70">{isArabic ? 'الضيف:' : 'Guest:'}</span>
                  <span>{customerName} ({customerPhone})</span>
                </div>

                {/* Base Price */}
                <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50">
                  <span className="text-[#173D3E]/70">{isArabic ? 'قيمة الخدمة الأساسية:' : 'Base Service Value:'}</span>
                  <span>{basePrice} {t('booking.aed')}</span>
                </div>

                {/* Reward Discount line if active */}
                {applyRewardDiscount && rewardDiscountAed > 0 && (
                  <div className="flex justify-between items-center py-1 border-b border-[#DBC7A6]/50 text-emerald-800 font-medium">
                    <span>{isArabic ? `خصم مكافآت فنة (${selectedRewardOption} نقطة):` : `Finah Rewards Discount (${selectedRewardOption} pts):`}</span>
                    <span>-{rewardDiscountAed} {t('booking.aed')}</span>
                  </div>
                )}

                {/* Final Total */}
                <div className="flex justify-between items-center py-1.5 font-serif text-sm">
                  <span>{t('booking.price')}</span>
                  <span className="font-bold text-[#075B60]">{price} {t('booking.aed')}</span>
                </div>

                {/* Points To Earn Notice */}
                <div className="pt-1.5 border-t border-[#DBC7A6]/40 flex items-center justify-between text-[11px] text-[#075B60]">
                  <span className="flex items-center gap-1">
                    <RosetteEmblem size={13} color="#075B60" />
                    <span>{isArabic ? 'نقاط مكتسبة عن هذه الزيارة:' : 'Finah Rewards to Earn:'}</span>
                  </span>
                  <span className="font-semibold font-mono">+{estimatedPointsToEarn} {isArabic ? 'نقطة' : 'pts'}</span>
                </div>
              </div>

              {/* FINAH REWARDS REDEMPTION PANEL */}
              <div className="p-3.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RosetteEmblem size={15} color="#075B60" />
                    <span className="font-semibold text-[#075B60]">
                      {isArabic ? 'برنامج مكافآت فنة (Finah Rewards)' : 'Finah Rewards Program'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#173D3E]/75">
                    {isArabic ? `رصيدك: ${availableCustomerPoints} نقطة` : `Balance: ${availableCustomerPoints} pts`}
                  </span>
                </div>

                {availableCustomerPoints >= 300 ? (
                  <div className="flex flex-col gap-2 pt-1 border-t border-[#DBC7A6]/40">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#173D3E]">
                      <input
                        type="checkbox"
                        checked={applyRewardDiscount}
                        onChange={e => setApplyRewardDiscount(e.target.checked)}
                        className="rounded text-[#075B60] focus:ring-[#075B60]"
                      />
                      <span>{isArabic ? 'استبدال نقاط للحصول على خصم فوري على هذا الحجز' : 'Redeem points for an immediate courtesy booking discount'}</span>
                    </label>

                    {applyRewardDiscount && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRewardOption(300)}
                          className={`flex-1 py-1.5 px-2 text-center rounded border transition-colors cursor-pointer text-xs ${
                            selectedRewardOption === 300
                              ? 'bg-[#075B60] text-white border-[#075B60]'
                              : 'bg-[#FFF7EA] text-[#173D3E] border-[#DBC7A6]'
                          }`}
                        >
                          {isArabic ? '300 نقطة (خصم 50 درهم)' : '300 pts (50 AED off)'}
                        </button>
                        {availableCustomerPoints >= 600 && (
                          <button
                            type="button"
                            onClick={() => setSelectedRewardOption(600)}
                            className={`flex-1 py-1.5 px-2 text-center rounded border transition-colors cursor-pointer text-xs ${
                              selectedRewardOption === 600
                                ? 'bg-[#075B60] text-white border-[#075B60]'
                                : 'bg-[#FFF7EA] text-[#173D3E] border-[#DBC7A6]'
                            }`}
                          >
                            {isArabic ? '600 نقطة (خصم 100 درهم)' : '600 pts (100 AED off)'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#173D3E]/70 leading-relaxed border-t border-[#DBC7A6]/40 pt-1.5">
                    {isArabic
                      ? `يمكنك استبدال النقاط ابتداءً من 300 نقطة (خصم 50 درهم). ستكتسبين +${estimatedPointsToEarn} نقطة عند إتمام هذه الزيارة تلقائياً على رقم هاتفك.`
                      : `Rewards redemption starts at 300 points (50 AED discount). You will earn +${estimatedPointsToEarn} points upon completing this visit linked to your mobile.`}
                  </p>
                )}
              </div>

              {/* Mode Specific Explanation */}
              {mode === 'request' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                  {t('booking.request_mode_notice')}
                </div>
              )}

              {mode === 'live' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 leading-relaxed">
                  {t('booking.live_mode_notice')}
                </div>
              )}

              {/* Cancellation Policy Agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#173D3E] pt-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#075B60] focus:ring-[#075B60]"
                />
                <span>{t('booking.terms_agreement')}</span>
              </label>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {currentStep === 6 && confirmedAppointment && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#075B60] text-white flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <span className="text-xs font-mono tracking-widest text-[#075B60] uppercase mb-1">
                {confirmedAppointment.referenceCode}
              </span>

              <h4 className="font-serif text-2xl font-medium text-[#173D3E] mb-2">
                {mode === 'request'
                  ? (isArabic ? 'تم استلام طلب موعدك بنجاح' : 'Appointment Request Received')
                  : (isArabic ? 'تم تأكيد موعدك بنجاح في فنة' : 'Appointment Confirmed at Finah')}
              </h4>

              <p className="text-xs sm:text-sm text-[#173D3E]/80 max-w-md mb-6 leading-relaxed">
                {mode === 'request'
                  ? (isArabic
                      ? `شكراً لكِ ${confirmedAppointment.customerName}. سيقوم فريق فنة بالتواصل معكِ عبر الواتساب (${confirmedAppointment.customerPhone}) لتأكيد موعدك النهائي.`
                      : `Thank you, ${confirmedAppointment.customerName}. Our team will contact you via WhatsApp (${confirmedAppointment.customerPhone}) to confirm availability promptly.`)
                  : (isArabic
                      ? `يسعدنا استقبالكِ يوم ${confirmedAppointment.date} الساعة ${confirmedAppointment.startTime}. نتمنى لكِ تجربة استرخاء استثنائية.`
                      : `We look forward to welcoming you on ${confirmedAppointment.date} at ${confirmedAppointment.startTime}. Wishing you a restorative sanctuary experience.`)}
              </p>

              {/* Receipt Summary Box */}
              <div className="w-full max-w-sm p-4 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-xl text-xs text-[#173D3E] flex flex-col gap-2 mb-6 text-right rtl:text-right ltr:text-left">
                <div className="flex justify-between">
                  <span className="text-[#173D3E]/70">{isArabic ? 'الطقس:' : 'Ritual:'}</span>
                  <span className="font-medium">{isArabic ? confirmedAppointment.serviceName.ar : confirmedAppointment.serviceName.en}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#173D3E]/70">{isArabic ? 'الموعد:' : 'Time:'}</span>
                  <span>{confirmedAppointment.date} @ {confirmedAppointment.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#173D3E]/70">{isArabic ? 'الحالة:' : 'Status:'}</span>
                  <span className="font-semibold text-[#075B60] uppercase">{confirmedAppointment.status}</span>
                </div>
                {confirmedAppointment.rewardDiscountAed && confirmedAppointment.rewardDiscountAed > 0 ? (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>{isArabic ? 'خصم مكافآت فنة:' : 'Finah Rewards Discount:'}</span>
                    <span>-{confirmedAppointment.rewardDiscountAed} {t('booking.aed')} ({confirmedAppointment.rewardPointsUsed} pts)</span>
                  </div>
                ) : null}
                <div className="pt-2 border-t border-[#DBC7A6]/60 flex justify-between items-center text-xs text-[#075B60]">
                  <span className="flex items-center gap-1 font-medium">
                    <RosetteEmblem size={13} color="#075B60" />
                    <span>{isArabic ? 'نقاط فنة المكتسبة:' : 'Points Earned:'}</span>
                  </span>
                  <span className="font-bold font-mono">+{confirmedAppointment.rewardPointsEarned} pts</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-[#075B60] bg-[#FFF7EA] border border-[#DBC7A6] hover:bg-[#F7E5C8] rounded-md transition-colors flex items-center gap-2 cursor-pointer no-underline"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>{t('btn.add_to_calendar')}</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer"
                >
                  {t('btn.close')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 6 && (
          <div className="p-4 bg-[#F7E5C8]/30 border-t border-[#DBC7A6] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-xs text-[#173D3E] hover:text-[#075B60] transition-colors cursor-pointer"
              >
                {t('btn.back')}
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                onClick={() => {
                  if (currentStep === 3 && !selectedSlot) {
                    setErrorMessage(isArabic ? 'يرجى اختيار خانة وقت متاحة للمتابعة.' : 'Please select an available slot.');
                    return;
                  }
                  if (currentStep === 4 && (!customerName || !customerPhone)) {
                    setErrorMessage(isArabic ? 'يرجى إدخال الاسم ورقم الهاتف للمتابعة.' : 'Please enter name and phone.');
                    return;
                  }
                  setErrorMessage('');
                  setCurrentStep(currentStep + 1);
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{t('btn.next')}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                disabled={!agreedToTerms || isSubmitting}
                onClick={handleConfirmAppointment}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] disabled:opacity-50 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{isArabic ? 'جاري التأكيد...' : 'Confirming...'}</span>
                ) : (
                  <span>{mode === 'request' ? t('booking.submit_request') : t('booking.confirm_booking')}</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
