import {
  BusinessConfig,
  Service,
  ServiceCategory,
  StaffMember,
  Room,
  Appointment,
  SlotHold,
  BridalInquiry,
  WaitlistEntry,
  AuditLog,
  BookingMode,
  CustomVisitRequest,
  RewardOffer,
  CustomerRewardsProfile,
  RewardTransaction,
  RewardTier,
  CustomerProfile,
  CommunicationPreferences
} from '../types';
import {
  initialBusinessConfig,
  serviceCategories,
  initialServices,
  initialStaff,
  initialRooms,
  initialDemoAppointments,
  initialAuditLogs,
  initialRewardOffers,
  initialCustomerRewards,
  initialCustomerProfiles
} from '../data/initialData';

// Storage keys
const STORAGE_CONFIG = 'finah_business_config';
const STORAGE_SERVICES = 'finah_services_catalog';
const STORAGE_STAFF = 'finah_staff_roster';
const STORAGE_ROOMS = 'finah_rooms_roster';
const STORAGE_APPOINTMENTS = 'finah_appointments';
const STORAGE_HOLDS = 'finah_slot_holds';
const STORAGE_BRIDAL = 'finah_bridal_inquiries';
const STORAGE_CUSTOM_VISITS = 'finah_custom_visits';
const STORAGE_REWARDS = 'finah_customer_rewards';
const STORAGE_REWARD_OFFERS = 'finah_reward_offers';
const STORAGE_WAITLIST = 'finah_waitlist';
const STORAGE_LOGS = 'finah_audit_logs';
const STORAGE_CUSTOMER_PROFILES = 'finah_customer_profiles';

class FinahStore {
  private config: BusinessConfig;
  private services: Service[];
  private staff: StaffMember[];
  private rooms: Room[];
  private appointments: Appointment[];
  private holds: SlotHold[];
  private bridalInquiries: BridalInquiry[];
  private customVisitRequests: CustomVisitRequest[];
  private rewardOffers: RewardOffer[];
  private customerRewards: Record<string, CustomerRewardsProfile>;
  private customerProfiles: Record<string, CustomerProfile>;
  private waitlist: WaitlistEntry[];
  private auditLogs: AuditLog[];

  constructor() {
    this.config = this.load(STORAGE_CONFIG, initialBusinessConfig);
    this.services = this.load(STORAGE_SERVICES, initialServices);
    this.staff = this.load(STORAGE_STAFF, initialStaff);
    this.rooms = this.load(STORAGE_ROOMS, initialRooms);
    this.appointments = this.load(STORAGE_APPOINTMENTS, initialDemoAppointments);
    this.holds = this.load(STORAGE_HOLDS, []);
    this.bridalInquiries = this.load(STORAGE_BRIDAL, []);
    this.customVisitRequests = this.load(STORAGE_CUSTOM_VISITS, []);
    this.rewardOffers = this.load(STORAGE_REWARD_OFFERS, initialRewardOffers);
    this.customerRewards = this.load(STORAGE_REWARDS, initialCustomerRewards);
    this.customerProfiles = this.load(STORAGE_CUSTOMER_PROFILES, initialCustomerProfiles);
    this.waitlist = this.load(STORAGE_WAITLIST, []);
    this.auditLogs = this.load(STORAGE_LOGS, initialAuditLogs);

    // Clean expired holds on startup
    this.cleanupExpiredHolds();
  }

  private load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
  }

  private cleanupExpiredHolds() {
    const now = Date.now();
    this.holds = this.holds.filter(h => h.expiresAt > now);
    this.save(STORAGE_HOLDS, this.holds);
  }

  public getConfig(): BusinessConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<BusinessConfig>, actor = 'Staff Admin'): BusinessConfig {
    this.config = { ...this.config, ...newConfig };
    this.save(STORAGE_CONFIG, this.config);
    this.addAuditLog(actor, 'manager', 'UPDATE_BUSINESS_CONFIG', 'Updated settings, booking mode, or hours');
    return this.config;
  }

  public setBookingMode(mode: BookingMode, actor = 'Staff Admin'): BusinessConfig {
    this.config.bookingMode = mode;
    this.save(STORAGE_CONFIG, this.config);
    this.addAuditLog(actor, 'owner', 'CHANGE_BOOKING_MODE', `Switched mode to ${mode.toUpperCase()}`);
    return this.config;
  }

  public getCategories(): ServiceCategory[] {
    return serviceCategories;
  }

  public getServices(): Service[] {
    return this.services;
  }

  public getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(s => s.slug === slug || s.id === slug);
  }

  public updateService(updated: Service, actor = 'Staff Admin'): Service {
    this.services = this.services.map(s => s.id === updated.id ? updated : s);
    this.save(STORAGE_SERVICES, this.services);
    this.addAuditLog(actor, 'manager', 'UPDATE_SERVICE', `Updated service ${updated.name.en} / ${updated.name.ar}`);
    return updated;
  }

  public getStaff(): StaffMember[] {
    return this.staff;
  }

  public updateStaff(staffList: StaffMember[], actor = 'Staff Admin'): void {
    this.staff = staffList;
    this.save(STORAGE_STAFF, this.staff);
    this.addAuditLog(actor, 'manager', 'UPDATE_STAFF', 'Updated staff shifts and active rosters');
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  // Calculate realistic server availability
  public getAvailability(date: string, serviceId: string, preferredStaffId = 'any'): string[] {
    this.cleanupExpiredHolds();
    const service = this.services.find(s => s.id === serviceId);
    if (!service) return [];

    const dayOfWeek = new Date(date).getDay();
    if (!this.config.businessHours.daysOpen.includes(dayOfWeek)) {
      return []; // Salon closed
    }

    const duration = service.durationMinutes + service.bufferMinutes;
    const openParts = this.config.businessHours.openTime.split(':').map(Number);
    const closeParts = this.config.businessHours.closeTime.split(':').map(Number);
    const openMinutes = openParts[0] * 60 + openParts[1];
    const closeMinutes = closeParts[0] * 60 + closeParts[1];

    // Filter staff eligible for this service and working today
    const activeStaff = this.staff.filter(st => {
      if (!st.active) return false;
      if (!st.workingDays.includes(dayOfWeek)) return false;
      if (preferredStaffId !== 'any' && st.id !== preferredStaffId) return false;
      if (service.eligibleStaffIds.length > 0 && !service.eligibleStaffIds.includes(st.id)) return false;
      return true;
    });

    if (activeStaff.length === 0) return [];

    // Filter eligible rooms
    const eligibleRooms = this.rooms.filter(r => {
      if (!r.active) return false;
      if (service.requiredRoomType === 'any') return true;
      return r.type === service.requiredRoomType;
    });

    if (eligibleRooms.length === 0) return [];

    // Interval slots every 30 minutes
    const potentialSlots: string[] = [];
    for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
      const hours = Math.floor(m / 60);
      const mins = m % 60;
      potentialSlots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }

    // Filter out conflicts with existing appointments & active holds
    const existing = this.appointments.filter(a => a.date === date && a.status !== 'cancelled');
    const existingHolds = this.holds.filter(h => h.date === date);

    const availableSlots = potentialSlots.filter(startTime => {
      const [h, min] = startTime.split(':').map(Number);
      const slotStartMin = h * 60 + min;
      const slotEndMin = slotStartMin + duration;

      // Find at least one staff member who is free
      const freeStaff = activeStaff.find(st => {
        const [shiftStartH, shiftStartM] = st.shiftStart.split(':').map(Number);
        const [shiftEndH, shiftEndM] = st.shiftEnd.split(':').map(Number);
        const staffShiftStart = shiftStartH * 60 + shiftStartM;
        const staffShiftEnd = shiftEndH * 60 + shiftEndM;

        if (slotStartMin < staffShiftStart || slotEndMin > staffShiftEnd) return false;

        // Check if st has appointment overlap
        const staffConflict = existing.some(app => {
          if (app.staffId !== st.id) return false;
          const [ah, am] = app.startTime.split(':').map(Number);
          const appStart = ah * 60 + am;
          const appEnd = appStart + app.durationMinutes + 20; // with buffer
          return !(slotEndMin <= appStart || slotStartMin >= appEnd);
        });
        if (staffConflict) return false;

        // Check hold overlap
        const holdConflict = existingHolds.some(hd => {
          if (hd.staffId !== st.id && hd.staffId !== 'any') return false;
          const [hh, hm] = hd.startTime.split(':').map(Number);
          const hStart = hh * 60 + hm;
          const [he_h, he_m] = hd.endTime.split(':').map(Number);
          const hEnd = he_h * 60 + he_m;
          return !(slotEndMin <= hStart || slotStartMin >= hEnd);
        });

        return !holdConflict;
      });

      if (!freeStaff) return false;

      // Find at least one room that is free
      const freeRoom = eligibleRooms.find(rm => {
        const roomConflict = existing.some(app => {
          if (app.roomId !== rm.id) return false;
          const [ah, am] = app.startTime.split(':').map(Number);
          const appStart = ah * 60 + am;
          const appEnd = appStart + app.durationMinutes + 20;
          return !(slotEndMin <= appStart || slotStartMin >= appEnd);
        });
        if (roomConflict) return false;

        const roomHoldConflict = existingHolds.some(hd => {
          if (hd.roomId !== rm.id) return false;
          const [hh, hm] = hd.startTime.split(':').map(Number);
          const hStart = hh * 60 + hm;
          const [he_h, he_m] = hd.endTime.split(':').map(Number);
          const hEnd = he_h * 60 + he_m;
          return !(slotEndMin <= hStart || slotStartMin >= hEnd);
        });

        return !roomHoldConflict;
      });

      return !!freeRoom;
    });

    return availableSlots;
  }

  // Atomic hold mechanism
  public createHold(serviceId: string, date: string, startTime: string, staffId = 'any', sessionId: string): SlotHold | null {
    this.cleanupExpiredHolds();
    const service = this.services.find(s => s.id === serviceId);
    if (!service) return null;

    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + service.durationMinutes;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // Select eligible room
    const eligibleRoom = this.rooms.find(r => r.active && (service.requiredRoomType === 'any' || r.type === service.requiredRoomType));
    const roomId = eligibleRoom ? eligibleRoom.id : 'room-general';

    const hold: SlotHold = {
      id: `hold-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      serviceId,
      staffId,
      date,
      startTime,
      endTime,
      roomId,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes hold
      sessionId
    };

    this.holds.push(hold);
    this.save(STORAGE_HOLDS, this.holds);
    return hold;
  }

  public releaseHold(holdId: string): void {
    this.holds = this.holds.filter(h => h.id !== holdId);
    this.save(STORAGE_HOLDS, this.holds);
  }

  // Create real appointment
  public createAppointment(params: {
    serviceId: string;
    additionalServiceIds?: string[];
    staffId: string;
    date: string;
    startTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes?: string;
    holdId?: string;
    idempotencyKey?: string;
    rewardPointsUsed?: number;
    rewardDiscountAed?: number;
  }): { appointment: Appointment; mode: BookingMode } {
    this.cleanupExpiredHolds();

    if (params.idempotencyKey) {
      const existing = this.appointments.find(a => a.idempotencyKey === params.idempotencyKey);
      if (existing) {
        return { appointment: existing, mode: existing.mode };
      }
    }

    const service = this.services.find(s => s.id === params.serviceId);
    if (!service) throw new Error('Service not found');

    const totalMinutes = service.durationMinutes;
    const [h, m] = params.startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + totalMinutes;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    const mode = this.config.bookingMode;
    const isLive = mode === 'live';
    const isDemo = mode === 'demo';

    // Pricing & deposit math with loyalty discount support
    const basePrice = service.priceAed || 0;
    const discount = params.rewardDiscountAed || 0;
    const finalPrice = Math.max(0, basePrice - discount);
    const depositPct = this.config.policies.depositPercentage;
    const depositAmount = isLive ? Math.round((finalPrice * depositPct) / 100) : 0;
    const remaining = finalPrice - depositAmount;

    // Finah Rewards Points math: 1 AED = 1 pt + 50 pts bonus for hammam / signature ceremonies
    const isHammamOrSignature = service.categoryId === 'hammam' || service.categoryId === 'bridal';
    const pointsEarned = finalPrice + (isHammamOrSignature ? 50 : 0);

    // Staff resolution
    let resolvedStaff = this.staff.find(st => st.id === params.staffId);
    if (!resolvedStaff && params.staffId === 'any') {
      resolvedStaff = this.staff.find(st => st.active && (service.eligibleStaffIds.length === 0 || service.eligibleStaffIds.includes(st.id)));
    }

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `FIN-${new Date().getFullYear()}-${refNum}`;

    const appointment: Appointment = {
      id: `apt-${Date.now()}-${refNum}`,
      referenceCode,
      serviceId: service.id,
      serviceName: service.name,
      additionalServiceIds: params.additionalServiceIds || [],
      staffId: resolvedStaff ? resolvedStaff.id : 'staff-unassigned',
      staffName: resolvedStaff ? resolvedStaff.name.en : 'Assigned by Finah Concierge',
      roomId: 'room-fes',
      date: params.date,
      startTime: params.startTime,
      endTime,
      durationMinutes: totalMinutes,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      notes: params.notes,
      status: isLive ? 'confirmed' : (isDemo ? 'confirmed' : 'requested'),
      paymentStatus: isLive ? 'deposit_paid' : 'unpaid',
      priceAed: finalPrice,
      depositPaidAed: depositAmount,
      remainingBalanceAed: remaining,
      rewardPointsEarned: pointsEarned,
      rewardPointsUsed: params.rewardPointsUsed || 0,
      rewardDiscountAed: discount,
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey: params.idempotencyKey
    };

    this.appointments.unshift(appointment);
    this.save(STORAGE_APPOINTMENTS, this.appointments);

    // Record Earned Rewards Points for Customer
    this.recordPointsEarned(
      params.customerPhone,
      params.customerName,
      pointsEarned,
      referenceCode,
      service.name
    );

    // If points were redeemed for discount, record deduction
    if (params.rewardPointsUsed && params.rewardPointsUsed > 0) {
      this.deductPointsForDiscount(
        params.customerPhone,
        params.customerName,
        params.rewardPointsUsed,
        discount,
        referenceCode
      );
    }

    if (params.holdId) {
      this.releaseHold(params.holdId);
    }

    this.addAuditLog(
      params.customerName,
      'customer',
      'CREATE_APPOINTMENT',
      `Booked ${service.name.en} for ${params.date} at ${params.startTime} (${mode.toUpperCase()})`
    );

    return { appointment, mode };
  }

  public getAppointments(): Appointment[] {
    return this.appointments;
  }

  public getCustomerAppointments(phoneOrEmail: string): Appointment[] {
    const clean = phoneOrEmail.trim().toLowerCase();
    return this.appointments.filter(a => {
      const matchPhone = a.customerPhone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''));
      const matchEmail = a.customerEmail.toLowerCase() === clean;
      return matchPhone || matchEmail;
    });
  }

  public updateAppointmentStatus(
    id: string,
    status: Appointment['status'],
    actor = 'Staff Reception'
  ): Appointment | null {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return null;
    apt.status = status;
    apt.updatedAt = new Date().toISOString();
    this.save(STORAGE_APPOINTMENTS, this.appointments);
    this.addAuditLog(actor, 'reception', 'UPDATE_STATUS', `Appointment ${apt.referenceCode} status changed to ${status}`);
    return apt;
  }

  public cancelAppointment(id: string, reason?: string, actor = 'Customer'): { success: boolean; message: string } {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return { success: false, message: 'Appointment not found' };

    // Check 24-hour policy
    const aptTime = new Date(`${apt.date}T${apt.startTime}:00`).getTime();
    const now = Date.now();
    const hoursRemaining = (aptTime - now) / (1000 * 60 * 60);

    if (hoursRemaining < this.config.policies.cancellationWindowHours && actor === 'Customer') {
      return {
        success: false,
        message: `Self-service cancellation is permitted up to ${this.config.policies.cancellationWindowHours} hours before the appointment. Please contact our concierge directly.`
      };
    }

    apt.status = 'cancelled';
    apt.updatedAt = new Date().toISOString();
    this.save(STORAGE_APPOINTMENTS, this.appointments);
    this.addAuditLog(actor, 'customer', 'CANCEL_APPOINTMENT', `Cancelled appointment ${apt.referenceCode}. Reason: ${reason || 'N/A'}`);
    return { success: true, message: 'Appointment has been cancelled successfully.' };
  }

  public rescheduleAppointment(
    id: string,
    newDate: string,
    newStartTime: string,
    preferredStaffId = 'any',
    actor = 'Customer'
  ): { success: boolean; message: string; appointment?: Appointment } {
    const apt = this.appointments.find(a => a.id === id);
    if (!apt) return { success: false, message: 'Appointment not found' };

    const aptTime = new Date(`${apt.date}T${apt.startTime}:00`).getTime();
    const now = Date.now();
    const hoursRemaining = (aptTime - now) / (1000 * 60 * 60);

    if (hoursRemaining < this.config.policies.cancellationWindowHours && actor === 'Customer') {
      return {
        success: false,
        message: `Self-service rescheduling is permitted up to ${this.config.policies.cancellationWindowHours} hours before the appointment.`
      };
    }

    const service = this.services.find(s => s.id === apt.serviceId);
    const duration = service ? service.durationMinutes : apt.durationMinutes;

    const [h, m] = newStartTime.split(':').map(Number);
    const endMinutes = h * 60 + m + duration;
    const newEndTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // Verify staff availability for newDate and newStartTime
    const dayOfWeek = new Date(newDate).getDay();
    const eligibleStaff = this.staff.filter(st => {
      if (!st.active) return false;
      if (!st.workingDays.includes(dayOfWeek)) return false;
      if (preferredStaffId !== 'any' && st.id !== preferredStaffId) return false;
      if (service && service.eligibleStaffIds.length > 0 && !service.eligibleStaffIds.includes(st.id)) return false;
      return true;
    });

    const existingOnDate = this.appointments.filter(a => a.id !== id && a.date === newDate && a.status !== 'cancelled');
    const availableTherapist = eligibleStaff.find(st => {
      const [shStartH, shStartM] = st.shiftStart.split(':').map(Number);
      const [shEndH, shEndM] = st.shiftEnd.split(':').map(Number);
      const shiftStartMin = shStartH * 60 + shStartM;
      const shiftEndMin = shEndH * 60 + shEndM;
      const slotStart = h * 60 + m;
      const slotEnd = slotStart + duration;

      if (slotStart < shiftStartMin || slotEnd > shiftEndMin) return false;

      const hasConflict = existingOnDate.some(app => {
        if (app.staffId !== st.id) return false;
        const [ah, am] = app.startTime.split(':').map(Number);
        const aStart = ah * 60 + am;
        const aEnd = aStart + app.durationMinutes;
        return !(slotEnd <= aStart || slotStart >= aEnd);
      });
      return !hasConflict;
    });

    apt.date = newDate;
    apt.startTime = newStartTime;
    apt.endTime = newEndTime;
    if (availableTherapist) {
      apt.staffId = availableTherapist.id;
      apt.staffName = `${availableTherapist.name.en} (${availableTherapist.name.ar})`;
    }
    apt.status = 'confirmed';
    apt.updatedAt = new Date().toISOString();

    this.save(STORAGE_APPOINTMENTS, this.appointments);
    this.addAuditLog(actor, 'customer', 'RESCHEDULE_APPOINTMENT', `Rescheduled ${apt.referenceCode} to ${newDate} at ${newStartTime} with specialist ${apt.staffName}`);
    return { success: true, message: 'Appointment successfully rescheduled.', appointment: apt };
  }

  // Customer Profile & Preferences
  public getCustomerProfile(phone: string, fallbackName = '', fallbackEmail = ''): CustomerProfile {
    const cleanPhone = phone.trim();
    if (this.customerProfiles[cleanPhone]) {
      return this.customerProfiles[cleanPhone];
    }
    const digits = cleanPhone.replace(/[^0-9]/g, '');
    const foundKey = Object.keys(this.customerProfiles).find(k => k.replace(/[^0-9]/g, '') === digits);
    if (foundKey) {
      return this.customerProfiles[foundKey];
    }

    const defaultProfile: CustomerProfile = {
      id: `cust-${Date.now()}`,
      fullName: fallbackName || (digits.includes('1234567') ? 'مريم المنصوري' : 'ضيفة فنة'),
      phone: cleanPhone,
      email: fallbackEmail || (digits.includes('1234567') ? 'mariam@example.com' : 'guest@example.com'),
      preferredLanguage: 'ar',
      preferredStaffId: 'any',
      wellnessGoals: ['تقشير وتنعيم البشرة', 'الاسترخاء والسكينة'],
      allergiesOrSensitivities: '',
      notes: '',
      communicationPreferences: {
        whatsappReminders: true,
        smsAlerts: true,
        emailItineraries: false,
        botanicalTips: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.customerProfiles[cleanPhone] = defaultProfile;
    this.save(STORAGE_CUSTOMER_PROFILES, this.customerProfiles);
    return defaultProfile;
  }

  public updateCustomerProfile(phone: string, data: Partial<CustomerProfile>): CustomerProfile {
    const current = this.getCustomerProfile(phone);
    const updated: CustomerProfile = {
      ...current,
      ...data,
      communicationPreferences: {
        ...current.communicationPreferences,
        ...(data.communicationPreferences || {})
      },
      updatedAt: new Date().toISOString()
    };
    this.customerProfiles[phone] = updated;
    this.save(STORAGE_CUSTOMER_PROFILES, this.customerProfiles);
    this.addAuditLog(updated.fullName, 'customer', 'UPDATE_PROFILE', `Updated customer profile preferences for ${phone}`);
    return updated;
  }

  // Bridal Inquiries
  public submitBridalInquiry(data: Omit<BridalInquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>): BridalInquiry {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const inquiry: BridalInquiry = {
      ...data,
      id: `bridal-${Date.now()}`,
      referenceCode: `BRIDE-${new Date().getFullYear()}-${refNum}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.bridalInquiries.unshift(inquiry);
    this.save(STORAGE_BRIDAL, this.bridalInquiries);
    this.addAuditLog(data.brideName, 'customer', 'SUBMIT_BRIDAL_INQUIRY', `Bridal inquiry for wedding date ${data.weddingDate}`);
    return inquiry;
  }

  public getBridalInquiries(): BridalInquiry[] {
    return this.bridalInquiries;
  }

  public updateBridalStatus(id: string, status: BridalInquiry['status'], actor = 'Staff'): void {
    const item = this.bridalInquiries.find(b => b.id === id);
    if (item) {
      item.status = status;
      this.save(STORAGE_BRIDAL, this.bridalInquiries);
      this.addAuditLog(actor, 'reception', 'UPDATE_BRIDAL_STATUS', `Updated inquiry ${item.referenceCode} to ${status}`);
    }
  }

  // Custom Visit Requests (Multi-service custom packages requiring manual coordination)
  public submitCustomVisitRequest(data: Omit<CustomVisitRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>): CustomVisitRequest {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const request: CustomVisitRequest = {
      ...data,
      id: `visit-req-${Date.now()}`,
      referenceCode: `FIN-VISIT-${new Date().getFullYear()}-${refNum}`,
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };
    this.customVisitRequests.unshift(request);
    this.save(STORAGE_CUSTOM_VISITS, this.customVisitRequests);
    this.addAuditLog(
      data.customerName,
      'customer',
      'SUBMIT_CUSTOM_VISIT_REQUEST',
      `Custom Visit Request (${request.referenceCode}) with ${data.serviceIds.length} treatments for ${data.preferredDate}`
    );
    return request;
  }

  public getCustomVisitRequests(): CustomVisitRequest[] {
    return this.customVisitRequests;
  }

  public updateCustomVisitRequestStatus(id: string, status: CustomVisitRequest['status'], actor = 'Staff'): void {
    const item = this.customVisitRequests.find(v => v.id === id);
    if (item) {
      item.status = status;
      this.save(STORAGE_CUSTOM_VISITS, this.customVisitRequests);
      this.addAuditLog(actor, 'reception', 'UPDATE_VISIT_REQ_STATUS', `Updated custom visit ${item.referenceCode} to ${status}`);
    }
  }

  // Waitlist

  public submitWaitlist(data: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): WaitlistEntry {
    const entry: WaitlistEntry = {
      ...data,
      id: `wl-${Date.now()}`,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    this.waitlist.unshift(entry);
    this.save(STORAGE_WAITLIST, this.waitlist);
    return entry;
  }

  public getWaitlist(): WaitlistEntry[] {
    return this.waitlist;
  }

  // --- FINAH REWARDS LOYALTY SYSTEM ---

  public getRewardOffers(): RewardOffer[] {
    return this.rewardOffers;
  }

  public getCustomerRewards(phone: string, customerName?: string): CustomerRewardsProfile {
    const cleanPhone = phone.trim();
    if (!this.customerRewards[cleanPhone]) {
      this.customerRewards[cleanPhone] = {
        phone: cleanPhone,
        customerName: customerName || 'ضيفة فنة',
        tier: 'zellige',
        totalPoints: 0,
        lifetimePointsEarned: 0,
        transactions: []
      };
      this.save(STORAGE_REWARDS, this.customerRewards);
    }
    return this.customerRewards[cleanPhone];
  }

  public getAllCustomerRewards(): CustomerRewardsProfile[] {
    return Object.values(this.customerRewards);
  }

  public recordPointsEarned(
    phone: string,
    customerName: string,
    points: number,
    referenceCode: string,
    serviceName: { ar: string; en: string }
  ): void {
    const profile = this.getCustomerRewards(phone, customerName);
    profile.totalPoints += points;
    profile.lifetimePointsEarned += points;

    // Recalculate Tier based on lifetime points
    if (profile.lifetimePointsEarned >= 1200) {
      profile.tier = 'royal_jasmine';
    } else if (profile.lifetimePointsEarned >= 500) {
      profile.tier = 'amber';
    } else {
      profile.tier = 'zellige';
    }

    const tx: RewardTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }) + ' GST',
      type: 'earned',
      points,
      description: {
        ar: `نقاط مكتسبة عن حجز ${serviceName.ar}`,
        en: `Points earned for booking ${serviceName.en}`
      },
      referenceCode
    };

    profile.transactions.unshift(tx);
    this.save(STORAGE_REWARDS, this.customerRewards);
    this.addAuditLog(
      customerName,
      'system',
      'EARN_LOYALTY_POINTS',
      `Awarded ${points} points to ${phone} for booking ${referenceCode}`
    );
  }

  public deductPointsForDiscount(
    phone: string,
    customerName: string,
    points: number,
    discountAed: number,
    referenceCode: string
  ): void {
    const profile = this.getCustomerRewards(phone, customerName);
    profile.totalPoints = Math.max(0, profile.totalPoints - points);

    const tx: RewardTransaction = {
      id: `tx-red-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }) + ' GST',
      type: 'redeemed',
      points: -points,
      description: {
        ar: `استبدال ${points} نقطة لخصم ${discountAed} درهم في الحجز`,
        en: `Redeemed ${points} points for ${discountAed} AED courtesy discount`
      },
      referenceCode
    };

    profile.transactions.unshift(tx);
    this.save(STORAGE_REWARDS, this.customerRewards);
    this.addAuditLog(
      customerName,
      'customer',
      'REDEEM_LOYALTY_POINTS',
      `Redeemed ${points} points for booking ${referenceCode}`
    );
  }

  public redeemRewardOffer(phone: string, offerId: string): { success: boolean; message: string; voucherCode?: string; offer?: RewardOffer } {
    const offer = this.rewardOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: 'Reward offer not found.' };

    const profile = this.getCustomerRewards(phone);
    if (profile.totalPoints < offer.pointsCost) {
      return {
        success: false,
        message: `Insufficient points. You need ${offer.pointsCost} points, current balance is ${profile.totalPoints}.`
      };
    }

    profile.totalPoints -= offer.pointsCost;
    const voucherCode = `FINAH-${offer.pointsCost}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const tx: RewardTransaction = {
      id: `tx-offer-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }) + ' GST',
      type: 'redeemed',
      points: -offer.pointsCost,
      description: {
        ar: `استبدال مكافأة: ${offer.name.ar} (رمز القسيمة: ${voucherCode})`,
        en: `Redeemed reward: ${offer.name.en} (Voucher: ${voucherCode})`
      },
      referenceCode: voucherCode
    };

    profile.transactions.unshift(tx);
    this.save(STORAGE_REWARDS, this.customerRewards);
    this.addAuditLog(
      profile.customerName,
      'customer',
      'REDEEM_REWARD_OFFER',
      `Redeemed ${offer.name.en} using ${offer.pointsCost} points. Voucher: ${voucherCode}`
    );

    return {
      success: true,
      message: 'Reward redeemed successfully.',
      voucherCode,
      offer
    };
  }

  public awardManualLoyaltyPoints(phone: string, points: number, reason: string, actor = 'Manager'): void {
    const profile = this.getCustomerRewards(phone);
    profile.totalPoints += points;
    profile.lifetimePointsEarned += points;

    if (profile.lifetimePointsEarned >= 1200) {
      profile.tier = 'royal_jasmine';
    } else if (profile.lifetimePointsEarned >= 500) {
      profile.tier = 'amber';
    }

    const tx: RewardTransaction = {
      id: `tx-adj-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }) + ' GST',
      type: 'bonus',
      points,
      description: {
        ar: `منح نقاط تقديرية: ${reason}`,
        en: `Courtesy points awarded: ${reason}`
      }
    };

    profile.transactions.unshift(tx);
    this.save(STORAGE_REWARDS, this.customerRewards);
    this.addAuditLog(actor, 'manager', 'AWARD_MANUAL_POINTS', `Awarded ${points} points to ${phone}: ${reason}`);
  }


  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  private addAuditLog(actor: string, role: AuditLog['role'], action: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }) + ' GST',
      actor,
      role,
      action,
      details
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    this.save(STORAGE_LOGS, this.auditLogs);
  }

  // Reporting with real accounting definitions
  public getReportingMetrics() {
    const totalAppointments = this.appointments.length;
    const confirmed = this.appointments.filter(a => a.status === 'confirmed').length;
    const requested = this.appointments.filter(a => a.status === 'requested').length;
    const completed = this.appointments.filter(a => a.status === 'completed').length;
    const cancelled = this.appointments.filter(a => a.status === 'cancelled').length;
    const noShow = this.appointments.filter(a => a.status === 'no_show').length;

    // Real collected revenue: only from paid deposits or full payments, strictly excluding unpaid/booked amounts
    const collectedRevenueAed = this.appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((acc, curr) => acc + (curr.depositPaidAed || 0), 0);

    const pendingBalanceAed = this.appointments
      .filter(a => a.status === 'confirmed' || a.status === 'completed')
      .reduce((acc, curr) => acc + (curr.remainingBalanceAed || 0), 0);

    const bridalInquiriesCount = this.bridalInquiries.length;
    const waitlistCount = this.waitlist.filter(w => w.status === 'waiting').length;

    return {
      totalAppointments,
      confirmed,
      requested,
      completed,
      cancelled,
      noShow,
      collectedRevenueAed,
      pendingBalanceAed,
      bridalInquiriesCount,
      waitlistCount
    };
  }
}

export const finahStore = new FinahStore();
