export type Language = 'ar' | 'en';

export type BookingMode = 'demo' | 'request' | 'live';

export type ContentStatus = 'approved' | 'draft' | 'demo';

export type PricingStatus = 'approved' | 'inquiry_only' | 'sample_estimate';

export type AppointmentStatus =
  | 'draft'
  | 'held'
  | 'pending_payment'
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'expired';

export type PaymentStatus =
  | 'unpaid'
  | 'deposit_paid'
  | 'paid_in_full'
  | 'refunded'
  | 'payment_failed'
  | 'exempt';

export type StaffRole = 'owner' | 'manager' | 'reception' | 'therapist';

export interface Service {
  id: string;
  slug: string;
  categoryId: string;
  name: {
    ar: string;
    en: string;
  };
  shortIntro: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  inclusions: {
    ar: string[];
    en: string[];
  };
  durationMinutes: number;
  bufferMinutes: number; // setup & cleanup buffer
  priceAed: number | null; // null if pricing is pending owner approval
  pricingStatus: PricingStatus;
  status: ContentStatus;
  onlineBookable: boolean; // if false, inquiry-only
  requiredRoomType: 'hammam_suite' | 'facial_room' | 'hair_station' | 'body_suite' | 'any';
  eligibleStaffIds: string[];
  preparationNotes: {
    ar: string;
    en: string;
  };
  imagePath?: string;
  tags: string[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  highlightServiceId?: string;
  iconName: string;
}

export interface StaffMember {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  role: StaffRole;
  title: {
    ar: string;
    en: string;
  };
  specialties: string[]; // category IDs or service IDs
  workingDays: number[]; // 0=Sunday, 1=Monday ... 6=Saturday
  shiftStart: string; // "10:00"
  shiftEnd: string; // "20:00"
  active: boolean;
}

export interface Room {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  type: 'hammam_suite' | 'facial_room' | 'hair_station' | 'body_suite';
  capacity: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  referenceCode: string; // e.g. FIN-2026-8942
  serviceId: string;
  serviceName: {
    ar: string;
    en: string;
  };
  additionalServiceIds?: string[];
  staffId: string; // or 'any'
  staffName?: string;
  roomId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  priceAed: number;
  depositPaidAed: number;
  remainingBalanceAed: number;
  rewardPointsEarned?: number;
  rewardPointsUsed?: number;
  rewardDiscountAed?: number;
  mode: BookingMode;
  createdAt: string;
  updatedAt: string;
  holdExpiresAt?: string;
  idempotencyKey?: string;
}

export type RewardTier = 'zellige' | 'amber' | 'royal_jasmine';

export interface RewardTransaction {
  id: string;
  timestamp: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'adjustment';
  points: number;
  description: {
    ar: string;
    en: string;
  };
  referenceCode?: string;
}

export interface CustomerRewardsProfile {
  phone: string;
  customerName: string;
  tier: RewardTier;
  totalPoints: number;
  lifetimePointsEarned: number;
  transactions: RewardTransaction[];
}

export interface CommunicationPreferences {
  whatsappReminders: boolean;
  smsAlerts: boolean;
  emailItineraries: boolean;
  botanicalTips: boolean;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  preferredLanguage: Language;
  preferredStaffId?: string;
  wellnessGoals?: string[];
  allergiesOrSensitivities?: string;
  notes?: string;
  communicationPreferences: CommunicationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface RewardOffer {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  pointsCost: number;
  rewardType: 'discount_fixed' | 'discount_percentage' | 'exclusive_treatment';
  discountAed?: number;
  discountPercentage?: number;
  exclusiveTreatmentName?: {
    ar: string;
    en: string;
  };
}

export interface SlotHold {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId: string;
  expiresAt: number; // timestamp ms
  sessionId: string;
}

export interface BridalInquiry {
  id: string;
  referenceCode: string;
  brideName: string;
  phone: string;
  email: string;
  weddingDate: string;
  preferredAppointmentDate: string;
  guestCount: number;
  servicesOfInterest: string[];
  languagePreference: Language;
  notes?: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'confirmed' | 'archived';
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  preferredDate: string;
  notes?: string;
  status: 'waiting' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface CustomVisitRequest {
  id: string;
  referenceCode: string; // e.g. FIN-VISIT-2026-4819
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredDate: string;
  preferredStartTime: string;
  estimatedEndTime: string;
  serviceIds: string[];
  serviceNames: {
    ar: string;
    en: string;
  }[];
  totalTreatmentMinutes: number;
  totalBufferMinutes: number;
  totalPriceAed: number;
  depositAed: number;
  remainingBalanceAed: number;
  requiredRooms: string[];
  requiredStaffSpecialties: string[];
  requiresManualPlanning: boolean;
  manualPlanningReasons: string[];
  notes?: string;
  status: 'pending_review' | 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}


export interface BusinessConfig {
  salonName: {
    ar: string;
    en: string;
  };
  tagline: {
    ar: string;
    en: string;
  };
  bookingMode: BookingMode;
  timezone: string; // 'Asia/Dubai'
  address: {
    ar: string;
    en: string;
    status: ContentStatus;
    city: string;
    country: string;
  };
  phone: {
    display: string;
    raw: string;
    status: ContentStatus;
  };
  whatsapp: {
    display: string;
    link: string;
    status: ContentStatus;
  };
  email: {
    address: string;
    status: ContentStatus;
  };
  instagram: {
    handle: string;
    url: string;
  };
  businessHours: {
    openTime: string; // "10:00"
    closeTime: string; // "21:00"
    daysOpen: number[]; // [0,1,2,3,4,5,6] (all days)
  };
  policies: {
    depositPercentage: number; // 25% or 0%
    cancellationWindowHours: number; // e.g. 24 hours
    minimumNoticeHours: number; // e.g. 2 hours
    maxBookingHorizonDays: number; // e.g. 60 days
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: StaffRole | 'system' | 'customer';
  action: string;
  details: string;
}

export interface MemberSpotlight {
  id: string;
  name: { ar: string; en: string };
  city: { ar: string; en: string };
  avatarUrl: string;
  tier: RewardTier;
  memberSince: { ar: string; en: string };
  headline: { ar: string; en: string };
  transformationStory: {
    beforeState: { ar: string; en: string };
    ritualPath: { ar: string; en: string };
    outcome: { ar: string; en: string };
  };
  quote: { ar: string; en: string };
  favoriteRituals: {
    serviceId: string;
    name: { ar: string; en: string };
    category: string;
  }[];
  favoriteStaffName: { ar: string; en: string };
  verifiedVisitDate: { ar: string; en: string };
  photos: {
    id: string;
    url: string;
    caption: { ar: string; en: string };
    tag: 'hammam' | 'hair' | 'facial' | 'bridal' | 'atmosphere';
  }[];
  isFeaturedMonth?: boolean;
}

export interface SharedVisitPhoto {
  id: string;
  url: string;
  authorName: { ar: string; en: string };
  authorTier: RewardTier;
  caption: { ar: string; en: string };
  category: 'hammam' | 'hair' | 'facial' | 'bridal' | 'majlis';
  serviceName: { ar: string; en: string };
  serviceId?: string;
  date: { ar: string; en: string };
  likesCount: number;
  featuredStoryId?: string;
}
