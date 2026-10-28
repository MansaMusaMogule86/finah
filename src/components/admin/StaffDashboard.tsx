import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { finahStore } from '../../services/api';
import { Appointment, Service, StaffRole, BridalInquiry, BookingMode, CustomVisitRequest } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Shield,
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Sparkles,
  Crown,
  History,
  Lock,
  LogOut,
  Edit,
  Save,
  Plus,
  DoorOpen
} from 'lucide-react';

interface StaffDashboardProps {
  onClose: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onClose }) => {
  const { t, isArabic } = useLanguage();
  const { isStaffAuthenticated, staffRole, staffName, loginAsStaff, logoutStaff } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'custom-visits' | 'calendar' | 'services' | 'bridal' | 'reporting' | 'settings' | 'logs'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>(finahStore.getAppointments());
  const [services, setServices] = useState<Service[]>(finahStore.getServices());
  const [bridalInquiries, setBridalInquiries] = useState<BridalInquiry[]>(finahStore.getBridalInquiries());
  const [customVisits, setCustomVisits] = useState<CustomVisitRequest[]>(finahStore.getCustomVisitRequests());
  const [auditLogs, setAuditLogs] = useState(finahStore.getAuditLogs());
  const [businessConfig, setBusinessConfig] = useState(finahStore.getConfig());
  const metrics = finahStore.getReportingMetrics();

  // Service Edit state
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Filter state for appointments
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    const updated = finahStore.updateAppointmentStatus(id, newStatus, staffName);
    if (updated) {
      setAppointments([...finahStore.getAppointments()]);
      setAuditLogs([...finahStore.getAuditLogs()]);
    }
  };

  const handleSaveService = (service: Service) => {
    finahStore.updateService(service, staffName);
    setServices([...finahStore.getServices()]);
    setEditingService(null);
    setAuditLogs([...finahStore.getAuditLogs()]);
  };

  const handleSwitchMode = (newMode: BookingMode) => {
    const updated = finahStore.setBookingMode(newMode, staffName);
    setBusinessConfig({ ...updated });
    setAuditLogs([...finahStore.getAuditLogs()]);
  };

  // If not authenticated, render quick-access role login panel for review
  if (!isStaffAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl p-6 shadow-xl text-right rtl:text-right ltr:text-left">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DBC7A6]">
            <div className="flex items-center gap-2">
              <RosetteEmblem size={24} color="#075B60" />
              <h3 className="font-serif text-lg font-medium text-[#173D3E]">
                {isArabic ? 'بوابة إدارة فنة (Staff Portal)' : 'Finah Staff Sanctuary Portal'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#075B60] underline cursor-pointer"
            >
              {t('btn.close')}
            </button>
          </div>

          <p className="text-xs text-[#173D3E]/75 mb-6 leading-relaxed">
            {isArabic
              ? 'اختر الدور الإداري للدخول واستعراض جدول المواعيد، تعديل الخدمات، مراجعة استشارات العروس، وتغيير وضع الحجز (Live / Request / Demo):'
              : 'Select your role to manage appointment calendars, pricing, bridal requests, and booking mode:'}
          </p>

          <div className="flex flex-col gap-2.5 mb-6">
            <button
              onClick={() => loginAsStaff('owner', 'Lalla Nadia (Owner)')}
              className="p-3 bg-[#F7E5C8]/60 hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <p className="font-semibold text-xs text-[#075B60]">
                  {isArabic ? 'المالكة (Owner)' : 'Owner / General Director'}
                </p>
                <p className="text-[11px] text-[#173D3E]/70">
                  {isArabic ? 'صلاحيات كاملة: التكوين المالي، تبديل وضع الحجز، واعتماد الأسعار' : 'Full permissions: financial control & live mode toggle'}
                </p>
              </div>
              <Shield className="w-4 h-4 text-[#075B60]" />
            </button>

            <button
              onClick={() => loginAsStaff('manager', 'Siham (Manager)')}
              className="p-3 bg-[#F7E5C8]/40 hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <p className="font-semibold text-xs text-[#075B60]">
                  {isArabic ? 'مديرة المركز (Manager)' : 'Spa Manager'}
                </p>
                <p className="text-[11px] text-[#173D3E]/70">
                  {isArabic ? 'إدارة المواعيد، قائمة الانتظار، واستشارات العروس' : 'Appointments, waitlists, and bridal inquiries'}
                </p>
              </div>
              <Users className="w-4 h-4 text-[#075B60]" />
            </button>

            <button
              onClick={() => loginAsStaff('reception', 'Yasmine (Front Desk)')}
              className="p-3 bg-[#F7E5C8]/20 hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <p className="font-semibold text-xs text-[#075B60]">
                  {isArabic ? 'الاستقبال (Reception)' : 'Reception & Concierge'}
                </p>
                <p className="text-[11px] text-[#173D3E]/70">
                  {isArabic ? 'استقبال الزائرات وتسجيل الحضور وتأكيد المواعيد' : 'Guest check-in, slot holds, and attendance'}
                </p>
              </div>
              <Clock className="w-4 h-4 text-[#075B60]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF7EA] text-[#173D3E] flex flex-col">
      {/* Top Admin Header */}
      <div className="px-6 py-4 bg-[#173D3E] text-[#FFF7EA] flex flex-wrap items-center justify-between gap-4 border-b border-[#075B60]">
        <div className="flex items-center gap-3">
          <RosetteEmblem size={24} color="#F1C17F" />
          <div>
            <h2 className="font-serif text-lg font-medium text-[#FFF7EA]">
              {isArabic ? 'لوحة تحكم فنة | الإدارة والعمليات' : 'Finah Beauty · Management Portal'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#F1C17F]">
              <span>{staffName}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase tracking-wider font-semibold">{staffRole}</span>
            </div>
          </div>
        </div>

        {/* Current Booking Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#075B60] rounded-lg text-xs">
            <span className="text-[#FFF7EA]/75 px-2 font-medium">
              {isArabic ? 'وضع النظام:' : 'Mode:'}
            </span>
            {(['demo', 'request', 'live'] as BookingMode[]).map(m => (
              <button
                key={m}
                onClick={() => handleSwitchMode(m)}
                className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition-colors cursor-pointer ${
                  businessConfig.bookingMode === m
                    ? 'bg-[#F1C17F] text-[#173D3E]'
                    : 'text-[#FFF7EA]/80 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={logoutStaff}
            className="p-2 text-[#FFF7EA]/80 hover:text-white hover:bg-[#075B60] rounded transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#173D3E] bg-[#F1C17F] hover:bg-[#ebd5b3] rounded transition-colors cursor-pointer"
          >
            {isArabic ? 'الخروج للموقع' : 'Return to Site'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="px-6 bg-[#F7E5C8]/50 border-b border-[#DBC7A6] flex items-center gap-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'appointments', label: isArabic ? 'جدول المواعيد' : 'Appointments', icon: CalendarIcon },
          { id: 'custom-visits', label: isArabic ? 'الزيارات المخصصة' : 'Custom Visits', icon: Sparkles },
          { id: 'bridal', label: isArabic ? 'استشارات العروس' : 'Bridal Inquiries', icon: Crown },
          { id: 'services', label: isArabic ? 'محرر الخدمات والأسعار' : 'Service Catalog', icon: Layers },
          { id: 'reporting', label: isArabic ? 'التقارير والإيرادات' : 'Reporting & Revenue', icon: TrendingUp },
          { id: 'logs', label: isArabic ? 'سجل التدقيق' : 'Audit Logs', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#075B60] text-[#075B60] font-bold bg-[#FFF7EA]/80'
                  : 'border-transparent text-[#173D3E]/75 hover:text-[#075B60]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full text-right rtl:text-right ltr:text-left">
        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                  {isArabic ? 'سجل المواعيد والحجوزات' : 'Appointment Registry'}
                </h3>
                <p className="text-xs text-[#173D3E]/70">
                  {isArabic
                    ? 'إدارة المواعيد، تغيير الحالات، ومتابعة رغبات الضيفات.'
                    : 'Manage customer bookings, atomic slot holds, and attendance.'}
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                {['all', 'requested', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#075B60] text-white border-[#075B60]'
                        : 'bg-[#FFF7EA] text-[#173D3E] border-[#DBC7A6] hover:bg-[#F7E5C8]'
                    }`}
                  >
                    {st === 'all' ? (isArabic ? 'الكل' : 'All') : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-[#173D3E]">
                  <thead className="bg-[#F7E5C8]/60 border-b border-[#DBC7A6] font-semibold text-[#075B60]">
                    <tr>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'المرجع' : 'Ref'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الضيف' : 'Guest'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الطقس' : 'Ritual'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الموعد' : 'Schedule'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الأخصائية' : 'Specialist'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'السعر' : 'Price'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الحالة' : 'Status'}</th>
                      <th className="p-3 text-right rtl:text-right ltr:text-left">{isArabic ? 'الإجراء' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DBC7A6]/50">
                    {filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-[#F7E5C8]/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#075B60]">
                          {apt.referenceCode}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold">{apt.customerName}</p>
                          <p className="text-[11px] text-[#173D3E]/70" dir="ltr">{apt.customerPhone}</p>
                        </td>
                        <td className="p-3 font-medium">
                          {isArabic ? apt.serviceName.ar : apt.serviceName.en}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <p>{apt.date}</p>
                          <p className="text-[11px] text-[#075B60]">{apt.startTime} - {apt.endTime}</p>
                        </td>
                        <td className="p-3">
                          {apt.staffName || 'Auto-assign'}
                        </td>
                        <td className="p-3 font-medium">
                          {apt.priceAed} {t('booking.aed')}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded border uppercase ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'requested'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : apt.status === 'cancelled'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {apt.status === 'requested' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                className="px-2 py-1 text-[11px] bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors cursor-pointer"
                              >
                                {isArabic ? 'تأكيد' : 'Confirm'}
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                className="px-2 py-1 text-[11px] bg-[#075B60] text-white rounded hover:bg-[#064a4e] transition-colors cursor-pointer"
                              >
                                {isArabic ? 'إتمام' : 'Complete'}
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                className="px-2 py-1 text-[11px] bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors cursor-pointer"
                              >
                                {isArabic ? 'إلغاء' : 'Cancel'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRIDAL INQUIRIES */}
        {activeTab === 'bridal' && (
          <div>
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                {isArabic ? 'طلبات استشارات العروس الملكية' : 'Royal Bridal Consultation Pipeline'}
              </h3>
              <p className="text-xs text-[#173D3E]/70">
                {isArabic
                  ? 'متابعة طلبات العرائس المخصصة وتنسيق مواعيد الجلسات والضيقات.'
                  : 'Track bespoke bridal inquiries, customized packages, and dates.'}
              </p>
            </div>

            {bridalInquiries.length === 0 ? (
              <div className="p-8 text-center bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl text-sm text-[#173D3E]/70">
                {isArabic ? 'لا توجد طلبات عروس مسجلة حالياً.' : 'No bridal inquiries recorded yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bridalInquiries.map(inq => (
                  <div key={inq.id} className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-[#075B60]">
                        {inq.referenceCode}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded uppercase">
                        {inq.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#173D3E] mb-2">
                      {inq.brideName}
                    </h4>

                    <div className="flex flex-col gap-1.5 text-xs text-[#173D3E]/80 mb-4">
                      <p><strong>{isArabic ? 'الهاتف:' : 'Phone:'}</strong> <span dir="ltr">{inq.phone}</span></p>
                      <p><strong>{isArabic ? 'موعد الزفاف:' : 'Wedding Date:'}</strong> {inq.weddingDate}</p>
                      <p><strong>{isArabic ? 'الضيقات:' : 'Guests:'}</strong> {inq.guestCount}</p>
                      <p><strong>{isArabic ? 'الخدمات المطلوبة:' : 'Services:'}</strong> {inq.servicesOfInterest.join(' · ')}</p>
                      {inq.notes && <p className="italic text-[#173D3E]/70">"{inq.notes}"</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#DBC7A6]/50">
                      <button
                        onClick={() => {
                          finahStore.updateBridalStatus(inq.id, 'contacted', staffName);
                          setBridalInquiries([...finahStore.getBridalInquiries()]);
                        }}
                        className="px-3 py-1.5 text-xs bg-[#075B60] text-white rounded hover:bg-[#064a4e] cursor-pointer"
                      >
                        {isArabic ? 'تم التواصل' : 'Mark Contacted'}
                      </button>
                      <button
                        onClick={() => {
                          finahStore.updateBridalStatus(inq.id, 'confirmed', staffName);
                          setBridalInquiries([...finahStore.getBridalInquiries()]);
                        }}
                        className="px-3 py-1.5 text-xs bg-emerald-700 text-white rounded hover:bg-emerald-800 cursor-pointer"
                      >
                        {isArabic ? 'تأكيد الحجز' : 'Confirm Package'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CUSTOM VISITS (DESIGN MY VISIT REQUESTS) */}
        {activeTab === 'custom-visits' && (
          <div>
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                {isArabic ? 'طلبات باقات الزيارات المخصصة' : 'Custom Bespoke Visit Requests'}
              </h3>
              <p className="text-xs text-[#173D3E]/70">
                {isArabic
                  ? 'باقات متعددة الطقوس تم إنشاؤها عبر "صممي زيارتك" وتتطلب تنسيقاً بين عدة أجنحة وأخصائيات.'
                  : 'Multi-service bespoke journeys created via "Design My Visit" requiring suite and specialist scheduling.'}
              </p>
            </div>

            {customVisits.length === 0 ? (
              <div className="p-8 text-center bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-xl text-sm text-[#173D3E]/70">
                {isArabic ? 'لا توجد طلبات زيارة مخصصة حالياً.' : 'No custom visit requests submitted yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customVisits.map(visit => (
                  <div key={visit.id} className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl shadow-xs text-right rtl:text-right ltr:text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#075B60]">
                        {visit.referenceCode}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded uppercase">
                        {visit.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#173D3E] mb-1">
                      {visit.customerName}
                    </h4>

                    <div className="flex flex-col gap-1.5 text-xs text-[#173D3E]/80 mb-4">
                      <p><strong>{isArabic ? 'الهاتف:' : 'Phone:'}</strong> <span dir="ltr">{visit.customerPhone}</span></p>
                      <p><strong>{isArabic ? 'الموعد المفضل:' : 'Schedule:'}</strong> {visit.preferredDate} ({visit.preferredStartTime} – {visit.estimatedEndTime})</p>
                      <p><strong>{isArabic ? 'الطقوس المطلوبة:' : 'Rituals:'}</strong> {visit.serviceNames.map(s => isArabic ? s.ar : s.en).join(' ← ')}</p>
                      <p><strong>{isArabic ? 'إجمالي المدة:' : 'Duration:'}</strong> {visit.totalTreatmentMinutes + visit.totalBufferMinutes} {t('booking.minutes')} ({visit.totalBufferMinutes} {isArabic ? 'دقيقة راحة وانتقال' : 'mins tea buffer'})</p>
                      <p><strong>{isArabic ? 'القيمة الإجمالية:' : 'Total Value:'}</strong> {visit.totalPriceAed} AED (العربون: {visit.depositAed} AED)</p>
                      <p><strong>{isArabic ? 'الأجنحة المطلوبة:' : 'Suites:'}</strong> {visit.requiredRooms.join(', ')}</p>
                      {visit.notes && <p className="italic text-[#173D3E]/70">"{visit.notes}"</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-[#DBC7A6]/50">
                      <button
                        onClick={() => {
                          finahStore.updateCustomVisitRequestStatus(visit.id, 'confirmed', staffName);
                          setCustomVisits([...finahStore.getCustomVisitRequests()]);
                        }}
                        className="px-3 py-1.5 text-xs bg-emerald-700 text-white rounded hover:bg-emerald-800 cursor-pointer"
                      >
                        {isArabic ? 'تأكيد الموعد وإرسال الجدولة' : 'Confirm Itinerary'}
                      </button>
                      <button
                        onClick={() => {
                          finahStore.updateCustomVisitRequestStatus(visit.id, 'cancelled', staffName);
                          setCustomVisits([...finahStore.getCustomVisitRequests()]);
                        }}
                        className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"
                      >
                        {isArabic ? 'رفض / إلغاء' : 'Decline'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVICES EDITOR */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                  {isArabic ? 'محرر الخدمات والأسعار المعتمدة' : 'Service & Pricing Catalog'}
                </h3>
                <p className="text-xs text-[#173D3E]/70">
                  {isArabic
                    ? 'تعديل أسعار الدرهم، المدد، والحالة (معتمد، مسودة، أو للاستفسار فقط).'
                    : 'Configure prices in AED, treatment durations, and published status.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {services.map(srv => {
                const isEditing = editingService?.id === srv.id;

                if (isEditing && editingService) {
                  return (
                    <div key={srv.id} className="p-6 bg-[#F7E5C8]/40 border-2 border-[#075B60] rounded-xl">
                      <h4 className="font-serif text-lg font-medium text-[#173D3E] mb-4">
                        {isArabic ? 'تعديل الخدمة:' : 'Edit Service:'} {srv.name.en}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                        <div>
                          <label className="block font-semibold mb-1">{isArabic ? 'السعر (درهم إماراتي):' : 'Price (AED):'}</label>
                          <input
                            type="number"
                            value={editingService.priceAed || 0}
                            onChange={e => setEditingService({ ...editingService, priceAed: Number(e.target.value) })}
                            className="w-full p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">{isArabic ? 'المدة (بالدقائق):' : 'Duration (mins):'}</label>
                          <input
                            type="number"
                            value={editingService.durationMinutes}
                            onChange={e => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                            className="w-full p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">{isArabic ? 'حالة الحجز أونلاين:' : 'Online Booking:'}</label>
                          <select
                            value={editingService.onlineBookable ? 'true' : 'false'}
                            onChange={e => setEditingService({ ...editingService, onlineBookable: e.target.value === 'true' })}
                            className="w-full p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded text-sm"
                          >
                            <option value="true">{isArabic ? 'متاح للحجز الفوري' : 'Online Bookable'}</option>
                            <option value="false">{isArabic ? 'للاستفسار فقط' : 'Inquiry Only'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 text-xs border border-[#DBC7A6] rounded cursor-pointer"
                        >
                          {t('btn.cancel')}
                        </button>
                        <button
                          onClick={() => handleSaveService(editingService)}
                          className="px-5 py-2 text-xs font-semibold text-white bg-[#075B60] rounded cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'حفظ التعديلات' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={srv.id} className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif text-base font-medium text-[#173D3E]">
                          {isArabic ? srv.name.ar : srv.name.en}
                        </span>
                        <span className="text-[11px] text-[#075B60] font-mono">
                          {srv.durationMinutes} {t('booking.minutes')}
                        </span>
                      </div>
                      <p className="text-xs text-[#173D3E]/70 line-clamp-1">
                        {isArabic ? srv.shortIntro.ar : srv.shortIntro.en}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-serif font-bold text-sm text-[#075B60]">
                        {srv.priceAed ? `${srv.priceAed} ${t('booking.aed')}` : (isArabic ? 'استشارة' : 'Inquiry')}
                      </span>

                      <button
                        onClick={() => setEditingService(srv)}
                        className="p-2 text-[#075B60] hover:bg-[#F7E5C8] border border-[#DBC7A6] rounded cursor-pointer"
                        title="Edit service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTING */}
        {activeTab === 'reporting' && (
          <div>
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                {isArabic ? 'التقارير والإيرادات المحققة' : 'Financial Reporting & Event Analytics'}
              </h3>
              <p className="text-xs text-[#173D3E]/70">
                {isArabic
                  ? 'حسابات حقيقية مبنية على الأحداث المخزنة فعلياً دون أرقام وهمية أو افتراضية.'
                  : 'Real metrics calculated strictly from actual events, separating collected revenue from booked pipeline.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
                <p className="text-xs text-[#173D3E]/70 mb-1">{isArabic ? 'إجمالي المواعيد المسجلة' : 'Total Bookings'}</p>
                <p className="font-serif text-3xl font-bold text-[#075B60]">{metrics.totalAppointments}</p>
                <p className="text-[11px] text-[#173D3E]/60 mt-1">{metrics.confirmed} {isArabic ? 'مؤكد' : 'confirmed'} · {metrics.requested} {isArabic ? 'طلب' : 'requested'}</p>
              </div>

              <div className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
                <p className="text-xs text-[#173D3E]/70 mb-1">{isArabic ? 'الإيراد المحصل فعلياً (العربونات)' : 'Collected Revenue (Deposits)'}</p>
                <p className="font-serif text-3xl font-bold text-[#075B60]">{metrics.collectedRevenueAed} <span className="text-xs font-sans">AED</span></p>
                <p className="text-[11px] text-emerald-700 mt-1">{isArabic ? 'عربونات مدفوعة ومؤكدة' : 'Realized deposits'}</p>
              </div>

              <div className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
                <p className="text-xs text-[#173D3E]/70 mb-1">{isArabic ? 'المتبقي عند الزيارة (المتوقع)' : 'Outstanding Balances'}</p>
                <p className="font-serif text-3xl font-bold text-[#173D3E]">{metrics.pendingBalanceAed} <span className="text-xs font-sans">AED</span></p>
                <p className="text-[11px] text-[#173D3E]/60 mt-1">{isArabic ? 'يُحصّل عند الحضور للمركز' : 'Due upon guest arrival'}</p>
              </div>

              <div className="p-5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl">
                <p className="text-xs text-[#173D3E]/70 mb-1">{isArabic ? 'استشارات العروس الواردة' : 'Bridal Inquiries'}</p>
                <p className="font-serif text-3xl font-bold text-[#075B60]">{metrics.bridalInquiriesCount}</p>
                <p className="text-[11px] text-[#173D3E]/60 mt-1">{isArabic ? 'باقات ملكية مخصصة' : 'Custom bridal journeys'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div>
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-[#173D3E]">
                {isArabic ? 'سجل التدقيق والأمان' : 'System Audit Trail'}
              </h3>
              <p className="text-xs text-[#173D3E]/70">
                {isArabic
                  ? 'سجل غير قابل للتعديل لكافة عمليات إنشاء المواعيد، الإلغاء، وتغيير الإعدادات.'
                  : 'Immutable record of appointment bookings, status shifts, and configuration edits.'}
              </p>
            </div>

            <div className="bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl divide-y divide-[#DBC7A6]/50">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#075B60] mr-2">
                      [{log.action}]
                    </span>
                    <span className="text-[#173D3E] font-medium">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#173D3E]/60 shrink-0">
                    <span>{log.actor} ({log.role})</span>
                    <span aria-hidden="true">·</span>
                    <span dir="ltr">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
