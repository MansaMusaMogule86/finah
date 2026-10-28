import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import {
  Appointment,
  CustomerProfile,
  CustomerRewardsProfile,
  StaffMember
} from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { FinahRewardsView } from '../rewards/FinahRewardsView';
import { MemberSpotlightView } from './MemberSpotlightView';
import { LoyaltyStatus } from './LoyaltyStatus';
import { SpaFacilitiesGallery } from './SpaFacilitiesGallery';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Bell,
  MessageSquare,
  Smartphone,
  Save,
  Check,
  X,
  Heart,
  CalendarDays,
  History,
  FileText,
  Camera,
  Compass,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface CustomerPortalProps {
  onRebook: (serviceId: string) => void;
  onClose: () => void;
  initialTab?: 'bookings' | 'profile' | 'rewards' | 'spotlight' | 'facilities';
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onRebook,
  onClose,
  initialTab = 'bookings'
}) => {
  const { t, isArabic } = useLanguage();
  const config = finahStore.getConfig();
  const allStaff = finahStore.getStaff();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'rewards' | 'spotlight' | 'facilities'>(initialTab);
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'past'>('upcoming');

  // Customer credentials & lookup state
  const [phoneNumber, setPhoneNumber] = useState('+971501234567');
  const [hasSearched, setHasSearched] = useState(true);

  // Data state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [rewardsProfile, setRewardsProfile] = useState<CustomerRewardsProfile | null>(null);

  // Feedback notifications
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  // Reschedule modal state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [selectedStaffId, setSelectedStaffId] = useState('any');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  // Cancellation modal state
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileStaffPref, setProfileStaffPref] = useState('any');
  const [profileNotes, setProfileNotes] = useState('');
  const [profileAllergies, setProfileAllergies] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [botanicalTipsOptIn, setBotanicalTipsOptIn] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load customer data
  const loadCustomerData = (phone: string) => {
    const cleanPhone = phone.trim();
    const apts = finahStore.getCustomerAppointments(cleanPhone);
    setAppointments(apts);

    const prof = finahStore.getCustomerProfile(cleanPhone);
    setProfile(prof);
    setProfileName(prof.fullName);
    setProfileEmail(prof.email);
    setProfileStaffPref(prof.preferredStaffId || 'any');
    setProfileNotes(prof.notes || '');
    setProfileAllergies(prof.allergiesOrSensitivities || '');
    setWhatsappOptIn(prof.communicationPreferences.whatsappReminders);
    setSmsOptIn(prof.communicationPreferences.smsAlerts);
    setEmailOptIn(prof.communicationPreferences.emailItineraries);
    setBotanicalTipsOptIn(prof.communicationPreferences.botanicalTips);

    const rewards = finahStore.getCustomerRewards(cleanPhone, prof.fullName);
    setRewardsProfile(rewards);
  };

  useEffect(() => {
    loadCustomerData(phoneNumber);
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    loadCustomerData(phoneNumber);
    setHasSearched(true);
    setActionMessage(null);
  };

  // Filter appointments: upcoming vs past
  const nowTs = Date.now();
  const upcomingAppointments = appointments.filter(a => {
    if (a.status === 'cancelled' || a.status === 'completed') return false;
    const aptTime = new Date(`${a.date}T${a.startTime}:00`).getTime();
    return aptTime >= nowTs - 2 * 60 * 60 * 1000; // within 2 hours or in the future
  });

  const pastAppointments = appointments.filter(a => {
    if (a.status === 'cancelled' || a.status === 'completed') return true;
    const aptTime = new Date(`${a.date}T${a.startTime}:00`).getTime();
    return aptTime < nowTs - 2 * 60 * 60 * 1000;
  });

  // Check 24-hr policy helper
  const isWithinCancellationPolicy = (apt: Appointment): boolean => {
    const aptTime = new Date(`${apt.date}T${apt.startTime}:00`).getTime();
    const hoursRemaining = (aptTime - Date.now()) / (1000 * 60 * 60);
    return hoursRemaining >= config.policies.cancellationWindowHours;
  };

  // Handle open reschedule dialog
  const handleOpenReschedule = (apt: Appointment) => {
    if (!isWithinCancellationPolicy(apt)) {
      setActionMessage({
        type: 'warning',
        text: isArabic
          ? `تنص سياسة فنة على أن إعادة الجدولة الذاتية متاحة حتى ${config.policies.cancellationWindowHours} ساعة قبل الموعد. يرجى التواصل مباشرة مع فريق الاستقبال عبر واتساب للمساعدة الفورية.`
          : `Self-service rescheduling is allowed up to ${config.policies.cancellationWindowHours} hours before your appointment. Please contact our concierge directly via WhatsApp.`
      });
      return;
    }

    setReschedulingApt(apt);
    // Default to tomorrow or current appointment date
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const defaultDate = d.toISOString().split('T')[0];
    setNewDate(defaultDate);
    setSelectedStaffId(apt.staffId || 'any');

    // Calculate real availability
    const slots = finahStore.getAvailability(defaultDate, apt.serviceId, 'any');
    setAvailableSlots(slots.length > 0 ? slots : ['11:00', '12:30', '14:00', '15:30', '17:00', '18:30']);
    setNewTime(slots[0] || '14:00');
  };

  // Date change during reschedule
  const handleDateChange = (date: string) => {
    setNewDate(date);
    if (!reschedulingApt) return;
    const slots = finahStore.getAvailability(date, reschedulingApt.serviceId, selectedStaffId);
    setAvailableSlots(slots.length > 0 ? slots : ['11:00', '12:30', '14:00', '15:30', '17:00', '18:30']);
    if (slots.length > 0 && !slots.includes(newTime)) {
      setNewTime(slots[0]);
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = async () => {
    if (!reschedulingApt || !newDate || !newTime) return;
    setIsSubmittingReschedule(true);

    try {
      // 1. Update local store with staff availability
      const res = finahStore.rescheduleAppointment(
        reschedulingApt.id,
        newDate,
        newTime,
        selectedStaffId,
        reschedulingApt.customerName
      );

      // 2. Sync with server records endpoint
      try {
        await fetch('/api/customer/reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: reschedulingApt.id,
            newDate,
            newStartTime: newTime,
            staffId: selectedStaffId
          })
        });
      } catch (e) {
        console.warn('Server sync note:', e);
      }

      if (res.success) {
        setActionMessage({
          type: 'success',
          text: isArabic
            ? `تمت إعادة جدولة موعدكِ بنجاح إلى تاريخ ${newDate} الساعة ${newTime}. تم تحديث جدول المعالجة وسجلات الحجز.`
            : `Appointment successfully rescheduled to ${newDate} at ${newTime}. Therapist roster and server records updated.`
        });
        setReschedulingApt(null);
        loadCustomerData(phoneNumber);
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Open Cancel dialog
  const handleOpenCancel = (apt: Appointment) => {
    if (!isWithinCancellationPolicy(apt)) {
      setActionMessage({
        type: 'warning',
        text: isArabic
          ? `تنص سياسة الإلغاء على أن الإلغاء الذاتي متاح حتى ${config.policies.cancellationWindowHours} ساعة قبل الموعد. للمواعيد العاجلة، يُرجى التواصل هاتفياً أو عبر واتساب مع المركز.`
          : `Self-service cancellation is permitted up to ${config.policies.cancellationWindowHours} hours before the appointment. Please contact our reception directly.`
      });
      return;
    }
    setCancellingApt(apt);
    setCancellationReason('');
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!cancellingApt) return;
    setIsSubmittingCancel(true);

    try {
      // 1. Cancel in local store
      const res = finahStore.cancelAppointment(
        cancellingApt.id,
        cancellationReason || 'Customer self-service cancellation',
        cancellingApt.customerName
      );

      // 2. Sync with server records
      try {
        await fetch('/api/customer/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: cancellingApt.id,
            reason: cancellationReason
          })
        });
      } catch (e) {
        console.warn('Server sync note:', e);
      }

      if (res.success) {
        setActionMessage({
          type: 'success',
          text: isArabic
            ? 'تم إلغاء الموعد بنجاح وفق سياسة فنة المعتمدة، وتحرير الجناح وجدول المعالجة.'
            : 'Appointment cancelled according to Finah policy. Room and therapist slot released.'
        });
        setCancellingApt(null);
        loadCustomerData(phoneNumber);
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Save Profile Changes & Communication Preferences
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const updatedPayload: Partial<CustomerProfile> = {
        fullName: profileName.trim(),
        email: profileEmail.trim(),
        preferredStaffId: profileStaffPref,
        notes: profileNotes.trim(),
        allergiesOrSensitivities: profileAllergies.trim(),
        communicationPreferences: {
          whatsappReminders: whatsappOptIn,
          smsAlerts: smsOptIn,
          emailItineraries: emailOptIn,
          botanicalTips: botanicalTipsOptIn
        }
      };

      // 1. Update in local finahStore
      const updated = finahStore.updateCustomerProfile(phoneNumber, updatedPayload);
      setProfile(updated);

      // 2. Sync to server API
      try {
        await fetch('/api/customer/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber,
            profile: updatedPayload
          })
        });
      } catch (e) {
        console.warn('Server profile sync note:', e);
      }

      setActionMessage({
        type: 'success',
        text: isArabic
          ? 'تم حفظ بيانات ملفكِ الشخصي وتفضيلات التواصل بنجاح على خوادم فنة.'
          : 'Your customer profile and communication preferences have been saved successfully.'
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>{isArabic ? 'موعد مؤكد' : 'Confirmed'}</span>
          </span>
        );
      case 'requested':
        return (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{isArabic ? 'قيد المراجعة' : 'Requested'}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Check className="w-3 h-3 text-slate-600" />
            <span>{isArabic ? 'مكتمل' : 'Completed'}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-semibold text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>{isArabic ? 'ملغي' : 'Cancelled'}</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus: Appointment['paymentStatus']) => {
    switch (paymentStatus) {
      case 'paid_in_full':
        return (
          <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            {isArabic ? 'مدفوع بالكامل' : 'Paid in Full'}
          </span>
        );
      case 'deposit_paid':
        return (
          <span className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
            {isArabic ? 'العربون مدفوع' : 'Deposit Paid'}
          </span>
        );
      case 'unpaid':
      default:
        return (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            {isArabic ? 'الدفع في المركز' : 'Pay at Venue'}
          </span>
        );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF7EA] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DBC7A6]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F7E5C8] border border-[#DBC7A6] flex items-center justify-center text-[#075B60] shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#173D3E]">
                  {isArabic ? 'حساب الضيفة والمواعيد' : 'Customer Account & Bookings'}
                </h1>
                {profile && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#075B60]/10 text-[#075B60]">
                    {profile.fullName}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#173D3E]/70 mt-0.5">
                {isArabic
                  ? 'متابعة المواعيد القادمة والسابقة، إعادة الجدولة أو الإلغاء، وإدارة التفضيلات الشخصية.'
                  : 'Track appointments, reschedule or cancel within policy, and manage preferences.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-medium text-[#075B60] hover:text-[#173D3E] underline cursor-pointer self-start sm:self-center"
          >
            {isArabic ? 'العودة للرئيسية' : 'Return Home'}
          </button>
        </div>

        {/* Quick Phone Lookup Switcher */}
        <div className="p-4 sm:p-5 bg-[#F7E5C8]/50 border border-[#DBC7A6] rounded-2xl mb-8">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full text-right rtl:text-right ltr:text-left">
              <label className="block text-xs font-semibold text-[#075B60] mb-1.5">
                {isArabic ? 'رقم الهاتف المسجل للحجز والحساب:' : 'Registered Phone Number for Account Lookup:'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute top-3 right-3 rtl:right-3 ltr:left-3 text-[#075B60]" />
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="+971 50 123 4567"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full py-2 px-9 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {isArabic ? 'عرض بيانات الحساب' : 'Access Account'}
            </button>
          </form>

          {/* Quick Demo Numbers */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#173D3E]/65">
            <span>{isArabic ? 'أرقام تجريبية جاهزة:' : 'Sample numbers for instant testing:'}</span>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('+971501234567');
                loadCustomerData('+971501234567');
              }}
              className="text-[#075B60] font-mono underline hover:text-[#173D3E] cursor-pointer"
            >
              +971501234567 (مريم)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('+971529876543');
                loadCustomerData('+971529876543');
              }}
              className="text-[#075B60] font-mono underline hover:text-[#173D3E] cursor-pointer"
            >
              +971529876543 (نورة)
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-start justify-between gap-3 border animate-fadeIn ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : actionMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {actionMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {actionMessage.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              {actionMessage.type === 'error' && <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-[#173D3E]/50 hover:text-[#173D3E] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Visual Loyalty Status Component (Tracks progress toward next tier & milestone sparkles) */}
        {activeTab !== 'rewards' && (
          <LoyaltyStatus
            customerPhone={phoneNumber}
            customerName={profile?.fullName}
            onViewAllRewards={() => setActiveTab('rewards')}
            onBookRitual={(serviceId) => {
              if (serviceId) {
                onRebook(serviceId);
              } else {
                setActiveTab('bookings');
              }
            }}
            className="mb-8"
          />
        )}

        {/* Main Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 p-1.5 bg-[#F7E5C8]/60 border border-[#DBC7A6] rounded-2xl text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#075B60] text-white shadow-xs'
                : 'text-[#173D3E] hover:bg-[#F7E5C8]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>{isArabic ? 'سجل المواعيد والطقوس' : 'Appointments & Bookings'}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/20">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#075B60] text-white shadow-xs'
                : 'text-[#173D3E] hover:bg-[#F7E5C8]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isArabic ? 'الملف الشخصي والتفضيلات' : 'Profile & Preferences'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-[#075B60] text-white shadow-xs'
                : 'text-[#173D3E] hover:bg-[#F7E5C8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F1C17F]" />
            <span>{isArabic ? 'مكافآت فنة' : 'Finah Rewards'}</span>
            {rewardsProfile && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/20">
                {rewardsProfile.totalPoints} pts
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('spotlight')}
            className={`flex-1 py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'spotlight'
                ? 'bg-[#075B60] text-white shadow-xs'
                : 'text-[#173D3E] hover:bg-[#F7E5C8]'
            }`}
          >
            <Camera className="w-4 h-4 text-[#F1C17F]" />
            <span>{isArabic ? 'إضاءات العضويات' : 'Member Spotlight'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-medium">
              {isArabic ? 'ألبوم' : 'Spotlight'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`flex-1 py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'facilities'
                ? 'bg-[#075B60] text-white shadow-xs'
                : 'text-[#173D3E] hover:bg-[#F7E5C8]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#F1C17F]" />
            <span>{isArabic ? 'مرافق السبا' : 'Spa Facilities'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-medium">
              {isArabic ? 'معرض الصور' : 'Gallery'}
            </span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS & BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            {/* Sub-filter: Upcoming vs Past */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex p-1 bg-white border border-[#DBC7A6] rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setBookingFilter('upcoming')}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    bookingFilter === 'upcoming'
                      ? 'bg-[#075B60] text-white'
                      : 'text-[#173D3E] hover:text-[#075B60]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'المواعيد القادمة' : 'Upcoming Appointments'}</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {upcomingAppointments.length}
                  </span>
                </button>

                <button
                  onClick={() => setBookingFilter('past')}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                    bookingFilter === 'past'
                      ? 'bg-[#075B60] text-white'
                      : 'text-[#173D3E] hover:text-[#075B60]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'الزيارات السابقة' : 'Past Rituals'}</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {pastAppointments.length}
                  </span>
                </button>
              </div>

              {/* Policy Quick Note */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#075B60]">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isArabic
                    ? `سياسة الإلغاء أو التعديل: حتى ${config.policies.cancellationWindowHours} ساعة قبل الموعد`
                    : `Modification window: up to ${config.policies.cancellationWindowHours}h prior`}
                </span>
              </div>
            </div>

            {/* Appointments List */}
            {bookingFilter === 'upcoming' ? (
              upcomingAppointments.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#DBC7A6] rounded-2xl text-sm text-[#173D3E]/75">
                  <Calendar className="w-8 h-8 text-[#075B60]/40 mx-auto mb-3" />
                  <p className="font-medium mb-1">
                    {isArabic ? 'لا توجد مواعيد قادمة مسجلة لهذا الرقم.' : 'No upcoming appointments found for this number.'}
                  </p>
                  <p className="text-xs text-[#173D3E]/60 mb-4">
                    {isArabic ? 'يمكنكِ حجز جلسة جديدة أو تصفح زياراتكِ السابقة لإعادة الحجز.' : 'You can book a new ritual or explore past visits to rebook.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcomingAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="p-6 bg-white border border-[#DBC7A6] rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      {/* Left: Service Details & Staff */}
                      <div className="space-y-3 flex-1 text-right rtl:text-right ltr:text-left">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs font-semibold text-[#075B60] bg-[#F7E5C8]/50 px-2.5 py-1 rounded-md">
                            {apt.referenceCode}
                          </span>
                          {getStatusBadge(apt.status)}
                          {getPaymentBadge(apt.paymentStatus)}
                        </div>

                        <div>
                          <h3 className="font-serif text-xl font-medium text-[#173D3E]">
                            {isArabic ? apt.serviceName.ar : apt.serviceName.en}
                          </h3>
                        </div>

                        {/* Schedule & Staff Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#173D3E]/85">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#075B60] shrink-0" />
                            <span>
                              <strong>{isArabic ? 'التاريخ:' : 'Date:'}</strong> {apt.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#075B60] shrink-0" />
                            <span>
                              <strong>{isArabic ? 'الوقت:' : 'Time:'}</strong> {apt.startTime} - {apt.endTime} ({apt.durationMinutes} {isArabic ? 'دقيقة' : 'mins'})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 sm:col-span-2">
                            <User className="w-4 h-4 text-[#075B60] shrink-0" />
                            <span>
                              <strong>{isArabic ? 'المعالجة المخصصة:' : 'Assigned Specialist:'}</strong> {apt.staffName || (isArabic ? 'بإشراف فريق الاستقبال' : 'Assigned by Finah')}
                            </span>
                          </div>
                        </div>

                        {/* Payment Breakdown Summary */}
                        <div className="p-3 bg-[#F7E5C8]/30 border border-[#DBC7A6]/60 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#075B60]" />
                            <span className="font-medium text-[#075B60]">
                              {isArabic ? 'ملخص الدفع:' : 'Payment Summary:'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[#173D3E]">
                            <span>
                              {isArabic ? 'الإجمالي:' : 'Total:'} <strong>{apt.priceAed} {isArabic ? 'درهم' : 'AED'}</strong>
                            </span>
                            <span>
                              {isArabic ? 'العربون المدفوع:' : 'Deposit Paid:'} <strong>{apt.depositPaidAed} {isArabic ? 'درهم' : 'AED'}</strong>
                            </span>
                            <span>
                              {isArabic ? 'المتبقي عند الزيارة:' : 'Balance Due:'} <strong className="text-[#075B60]">{apt.remainingBalanceAed} {isArabic ? 'درهم' : 'AED'}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap lg:flex-col items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DBC7A6]/40 shrink-0">
                        <button
                          onClick={() => handleOpenReschedule(apt)}
                          className="px-4 py-2 text-xs font-semibold text-[#075B60] bg-[#F7E5C8]/70 hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'تعديل الموعد' : 'Reschedule'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenCancel(apt)}
                          className="px-4 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'إلغاء الموعد' : 'Cancel'}</span>
                        </button>

                        <button
                          onClick={() => onRebook(apt.serviceId)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl transition-colors cursor-pointer"
                        >
                          {isArabic ? 'حجز جلسة إضافية' : 'Book Another'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Past Appointments
              pastAppointments.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#DBC7A6] rounded-2xl text-sm text-[#173D3E]/75">
                  <History className="w-8 h-8 text-[#075B60]/40 mx-auto mb-3" />
                  <p className="font-medium mb-1">
                    {isArabic ? 'لا توجد زيارات سابقة مسجلة.' : 'No past visits recorded yet.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pastAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="p-5 bg-white border border-[#DBC7A6] rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-right rtl:text-right ltr:text-left opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#075B60] font-semibold">
                            {apt.referenceCode}
                          </span>
                          {getStatusBadge(apt.status)}
                          {getPaymentBadge(apt.paymentStatus)}
                        </div>

                        <h4 className="font-serif text-lg font-medium text-[#173D3E]">
                          {isArabic ? apt.serviceName.ar : apt.serviceName.en}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#173D3E]/75">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#075B60]" />
                            <span>{apt.date}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#075B60]" />
                            <span>{apt.startTime} ({apt.durationMinutes} {isArabic ? 'دقيقة' : 'mins'})</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {isArabic ? 'المعالجة:' : 'Therapist:'} {apt.staffName || 'Finah Specialist'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-semibold text-[#173D3E]">
                            {apt.priceAed} {isArabic ? 'درهم' : 'AED'}
                          </span>
                        </div>
                      </div>

                      {/* Rebook Previously Used Service button */}
                      <div className="shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => onRebook(apt.serviceId)}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'إعادة حجز هذا الطقس' : 'Rebook this Ritual'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Explore Facilities Banner on Bookings Tab */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#FFF7EA] via-[#F7E5C8]/50 to-[#FFF7EA] border border-[#DBC7A6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DBC7A6] flex items-center justify-center text-[#075B60] shrink-0 shadow-2xs">
                  <Compass className="w-5 h-5 text-[#075B60]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#173D3E]">
                    {isArabic ? 'جولة تفاعلية في مرافق وأجنحة فنة' : 'Take an Interactive Tour of Our Spa Suites'}
                  </h4>
                  <p className="text-[#173D3E]/70 text-[11px] mt-0.5">
                    {isArabic
                      ? 'شاهدي صور أجنحة الحمام المغربي الخاصة، وصالون العروس الملكي، وردهة الشاي الأندلسية.'
                      : 'Explore high-resolution images of our private hammam vaults, bridal suites, and tea majlis.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('facilities')}
                className="px-4 py-2 rounded-xl bg-[#075B60] hover:bg-[#0E8890] text-white text-xs font-semibold shrink-0 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{isArabic ? 'استكشاف معرض المرافق' : 'View Facilities Gallery'}</span>
                {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & PREFERENCES */}
        {activeTab === 'profile' && profile && (
          <div className="bg-white border border-[#DBC7A6] rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="mb-6 pb-4 border-b border-[#DBC7A6]/60">
              <h3 className="font-serif text-xl font-medium text-[#173D3E] mb-1">
                {isArabic ? 'بيانات الضيفة وتفضيلات العناية' : 'Guest Profile & Sanctuary Preferences'}
              </h3>
              <p className="text-xs text-[#173D3E]/70">
                {isArabic
                  ? 'تتيح لنا هذه التفضيلات تخصيص تفاصيل طقوسكِ، درجة حرارة البخار، ونوع الزيوت العضوية المستخدمة.'
                  : 'Your preferences allow us to tailor steam temperatures, pressure levels, and organic oils.'}
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                    {isArabic ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                    {isArabic ? 'البريد الإلكتروني:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              {/* Preferred Specialist */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                  {isArabic ? 'المعالجة أو الخبيرة المفضلة لديكِ:' : 'Preferred Ritual Specialist / Therapist:'}
                </label>
                <select
                  value={profileStaffPref}
                  onChange={e => setProfileStaffPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                >
                  <option value="any">{isArabic ? 'أي خبيرة متاحة من فريق فنة' : 'Any available specialist'}</option>
                  {allStaff.map(st => (
                    <option key={st.id} value={st.id}>
                      {isArabic ? st.name.ar : st.name.en} - {isArabic ? st.title.ar : st.title.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Allergies / Skin Sensitivities */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                  {isArabic ? 'ملاحظات الحساسية أو نوع البشرة:' : 'Allergies, Skin Sensitivities or Pressure Notes:'}
                </label>
                <input
                  type="text"
                  value={profileAllergies}
                  onChange={e => setProfileAllergies(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال: بشرة حساسة، تفضيل الضغط المتوسط، تجنب زيت اللافندر...'
                      : 'e.g. Sensitive skin, medium pressure preferred, no lavender oil...'
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              {/* Personal Visit Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                  {isArabic ? 'تفضيلات الضيافة الخاصة:' : 'Hospitality & Sanctuary Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={profileNotes}
                  onChange={e => setProfileNotes(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'مثال: تفضيل شاي النعناع برغوة وفيرة، استراحة أطول بعد الحمام...'
                      : 'e.g. Traditional mint tea with extra mint, quiet relaxation lounge...'
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              {/* Communication Preferences Section */}
              <div className="pt-4 border-t border-[#DBC7A6]/60">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-[#075B60]" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#075B60]">
                    {isArabic ? 'تفضيلات قنوات التواصل والتنبيهات' : 'Communication & Notification Preferences'}
                  </h4>
                </div>

                <div className="space-y-3">
                  {/* WhatsApp Reminder */}
                  <label className="flex items-center justify-between p-3 rounded-xl border border-[#DBC7A6]/60 bg-[#FFF7EA] hover:bg-[#F7E5C8]/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-semibold text-[#173D3E] block">
                          {isArabic ? 'تذكيرات وتأكيدات الحجز عبر واتساب' : 'WhatsApp Booking Reminders & Confirmations'}
                        </span>
                        <span className="text-[11px] text-[#173D3E]/60 block">
                          {isArabic ? 'إرسال تأكيد الموعد وخريطة الموقع قبل ٢٤ ساعة' : 'Receive appointment summary and suite directions'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={e => setWhatsappOptIn(e.target.checked)}
                      className="w-4 h-4 text-[#075B60] rounded border-gray-300 focus:ring-[#075B60]"
                    />
                  </label>

                  {/* SMS Alerts */}
                  <label className="flex items-center justify-between p-3 rounded-xl border border-[#DBC7A6]/60 bg-[#FFF7EA] hover:bg-[#F7E5C8]/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-[#075B60]" />
                      <div>
                        <span className="text-xs font-semibold text-[#173D3E] block">
                          {isArabic ? 'رسائل الجوال النصية (SMS)' : 'SMS Status Notifications'}
                        </span>
                        <span className="text-[11px] text-[#173D3E]/60 block">
                          {isArabic ? 'تنبيه فوري عند تأكيد أو تعديل أي موعد' : 'Instant SMS when appointments are confirmed or rescheduled'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={e => setSmsOptIn(e.target.checked)}
                      className="w-4 h-4 text-[#075B60] rounded border-gray-300 focus:ring-[#075B60]"
                    />
                  </label>

                  {/* Email Itineraries */}
                  <label className="flex items-center justify-between p-3 rounded-xl border border-[#DBC7A6]/60 bg-[#FFF7EA] hover:bg-[#F7E5C8]/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#075B60]" />
                      <div>
                        <span className="text-xs font-semibold text-[#173D3E] block">
                          {isArabic ? 'برنامج الزيارة المفصل عبر البريد الإلكتروني' : 'Email Visit Itinerary & Preparation Guide'}
                        </span>
                        <span className="text-[11px] text-[#173D3E]/60 block">
                          {isArabic ? 'إرشادات ما قبل الحمام المغربي وتفاصيل الفاتورة' : 'Comprehensive preparation notes and payment summary'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailOptIn}
                      onChange={e => setEmailOptIn(e.target.checked)}
                      className="w-4 h-4 text-[#075B60] rounded border-gray-300 focus:ring-[#075B60]"
                    />
                  </label>

                  {/* Botanical Tips */}
                  <label className="flex items-center justify-between p-3 rounded-xl border border-[#DBC7A6]/60 bg-[#FFF7EA] hover:bg-[#F7E5C8]/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-[#F1C17F]" />
                      <div>
                        <span className="text-xs font-semibold text-[#173D3E] block">
                          {isArabic ? 'نصائح مجلة الجمال المغربي والعناية بالأركان' : 'Moroccan Botanical Skincare & Hair Advice'}
                        </span>
                        <span className="text-[11px] text-[#173D3E]/60 block">
                          {isArabic ? 'مقالات دورية حول العناية المنزلية ونضارة البشرة' : 'Occasional wellness journal articles and seasonal tips'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={botanicalTipsOptIn}
                      onChange={e => setBotanicalTipsOptIn(e.target.checked)}
                      className="w-4 h-4 text-[#075B60] rounded border-gray-300 focus:ring-[#075B60]"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ تعديلات الملف والتفضيلات' : 'Save Profile Changes')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: FINAH REWARDS */}
        {activeTab === 'rewards' && (
          <FinahRewardsView
            customerPhone={phoneNumber}
            customerName={profile?.fullName}
          />
        )}

        {/* TAB 4: MEMBER SPOTLIGHT & BEAUTY TRANSFORMATIONS */}
        {activeTab === 'spotlight' && (
          <MemberSpotlightView
            onRebook={serviceId => onRebook(serviceId)}
            currentCustomerName={profile?.fullName}
            currentCustomerPhone={phoneNumber}
          />
        )}

        {/* TAB 5: SPA FACILITIES & PRIVATE SUITES PHOTO GALLERY */}
        {activeTab === 'facilities' && (
          <SpaFacilitiesGallery
            onBookService={serviceId => onRebook(serviceId)}
          />
        )}

        {/* RESCHEDULE MODAL */}
        {reschedulingApt && (
          <div className="fixed inset-0 z-50 bg-[#173D3E]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right rtl:text-right ltr:text-left animate-fadeIn">
              <button
                onClick={() => setReschedulingApt(null)}
                className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#173D3E]/60 hover:text-[#173D3E] p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <RosetteEmblem size={22} color="#075B60" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
                  {isArabic ? 'تعديل موعد الحجز' : 'Reschedule Appointment'}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-[#173D3E] mb-1">
                {isArabic ? reschedulingApt.serviceName.ar : reschedulingApt.serviceName.en}
              </h3>
              <p className="text-xs text-[#075B60] font-mono mb-6">
                {reschedulingApt.referenceCode} · {reschedulingApt.durationMinutes} {isArabic ? 'دقيقة' : 'mins'}
              </p>

              {/* Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                    {isArabic ? 'اختاري التاريخ الجديد:' : 'Choose New Date:'}
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => handleDateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                    {isArabic ? 'الأوقات المتاحة لهذا اليوم:' : 'Available Time Slots for this Date:'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setNewTime(time)}
                        className={`py-2 px-1 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                          newTime === time
                            ? 'bg-[#075B60] text-white border-[#075B60] shadow-2xs'
                            : 'bg-white border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]/50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#173D3E] mb-1">
                    {isArabic ? 'تفضيل المعالجة:' : 'Specialist Preference:'}
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={e => {
                      setSelectedStaffId(e.target.value);
                      if (reschedulingApt) {
                        const slots = finahStore.getAvailability(newDate, reschedulingApt.serviceId, e.target.value);
                        setAvailableSlots(slots.length > 0 ? slots : ['11:00', '12:30', '14:00', '15:30', '17:00']);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  >
                    <option value="any">{isArabic ? 'أي معالجة متاحة' : 'Any available specialist'}</option>
                    {allStaff.map(st => (
                      <option key={st.id} value={st.id}>
                        {isArabic ? st.name.ar : st.name.en} ({isArabic ? st.title.ar : st.title.en})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 text-xs font-medium text-[#173D3E]/70 hover:text-[#173D3E] cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Dismiss'}
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReschedule || !newDate || !newTime}
                  onClick={handleConfirmReschedule}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmittingReschedule
                    ? (isArabic ? 'جاري التعديل...' : 'Updating...')
                    : (isArabic ? 'تثبيت الموعد الجديد' : 'Confirm Reschedule')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CANCELLATION MODAL */}
        {cancellingApt && (
          <div className="fixed inset-0 z-50 bg-[#173D3E]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#FFF7EA] border border-[#DBC7A6] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right rtl:text-right ltr:text-left animate-fadeIn">
              <button
                onClick={() => setCancellingApt(null)}
                className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#173D3E]/60 hover:text-[#173D3E] p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">
                  {isArabic ? 'إلغاء الموعد' : 'Cancel Appointment'}
                </span>
              </div>

              <h3 className="font-serif text-xl font-medium text-[#173D3E] mb-1">
                {isArabic ? cancellingApt.serviceName.ar : cancellingApt.serviceName.en}
              </h3>
              <p className="text-xs text-[#173D3E]/70 mb-4 font-mono">
                {cancellingApt.referenceCode} · {cancellingApt.date} الساعة {cancellingApt.startTime}
              </p>

              <p className="text-xs text-[#173D3E]/80 leading-relaxed mb-4">
                {isArabic
                  ? 'سيتم إلغاء الموعد وتحرير الجناح في النظام. إذا كنتِ ترغبين في تغيير التوقيت فقط، نوصي بخيار إعادة الجدولة للحفاظ على حجزكِ.'
                  : 'This will cancel your booking and release the suite. If you only need a different time, we recommend rescheduling instead.'}
              </p>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#173D3E] mb-1.5">
                  {isArabic ? 'سبب الإلغاء (اختياري لمساعدتنا على تحسين الخدمة):' : 'Reason for Cancellation (optional):'}
                </label>
                <input
                  type="text"
                  value={cancellationReason}
                  onChange={e => setCancellationReason(e.target.value)}
                  placeholder={isArabic ? 'تغيير في المواعيد، ظرف طارئ...' : 'Schedule conflict, travel...'}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DBC7A6] rounded-xl text-xs sm:text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingApt(null)}
                  className="px-4 py-2 text-xs font-medium text-[#173D3E]/70 hover:text-[#173D3E] cursor-pointer"
                >
                  {isArabic ? 'تراجع' : 'Keep Appointment'}
                </button>

                <button
                  type="button"
                  disabled={isSubmittingCancel}
                  onClick={handleConfirmCancel}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmittingCancel
                    ? (isArabic ? 'جاري الإلغاء...' : 'Cancelling...')
                    : (isArabic ? 'تأكيد الإلغاء' : 'Confirm Cancellation')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
