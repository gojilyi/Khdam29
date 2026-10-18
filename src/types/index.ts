export type Role = 'client' | 'artisan' | 'admin';
export type Language = 'ar' | 'fr' | 'en';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';
export type VerificationLevel = 0 | 1 | 2; // 0 = unverified, 1 = ID & Selfie, 2 = Certified with Diploma

export interface ArtisanVerification {
  idVerified: boolean;
  certVerified: boolean;
  khodamGuaranteed: boolean;
  topRated: boolean;
  level: VerificationLevel;
  matricule: string;
  yearsExperience: number;
  completedJobsCount: number;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
}

export interface WorkPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTrade: string;
  authorLevel: VerificationLevel;
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  isCompletedTask?: boolean;
  completionDate?: string;
  clientReviewRating?: number;
  location: string;
  createdAt: string;
  likesCount: number;
  hasLiked: boolean;
  sharesCount?: number;
  comments: PostComment[];
}

export interface VerificationRequest {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  trade: string;
  level: 1 | 2;
  idCardImage?: string;
  selfieImage?: string;
  diplomaImage?: string;
  diplomaTitle?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Artisan {
  id: string;
  name: string;
  avatar: string;
  categoryId: string;
  subCategoryIds: string[];
  trade?: string;
  experienceYears?: number;
  completedJobsCount?: number;
  skills?: string[];
  etaMinutes?: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  isOnline: boolean;
  hourlyRate: number;
  city: string;
  neighborhood: string;
  bio: string;
  verification: ArtisanVerification;
  phoneMasked: string;
  portfolioImages?: string[];
  badges: string[];
  isSuspended?: boolean;
  email?: string;
  gender?: 'male' | 'female';
  qualificationTitle?: string;
  diplomaImages?: string[];
  availabilityType?: 'full_time' | 'daily' | 'part_time' | 'emergency';
  isSeekingWork?: boolean;
  workSeekingDescription?: string;
}

export type AuthMethod = 'google' | 'facebook' | 'anonymous' | 'sms' | 'email' | 'apple';

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar: string;
  role: Role;
  method: AuthMethod;
  isLoggedIn: boolean;
  isSuspended?: boolean;
  address?: string;
  city?: string;
  neighborhood?: string;
  sharePhoneWithArtisans?: boolean;
}

export interface SubService {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  description: string;
  estimatedPrice: string;
  iconName: string;
  image: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  icon: string;
  image: string;
  description: string;
  accentColor: string;
  subServices: SubService[];
}

export type OrderStatus = 
  | 'searching' 
  | 'artisan_assigned' 
  | 'on_the_way' 
  | 'in_progress' 
  | 'awaiting_confirmation' 
  | 'completed' 
  | 'cancelled';

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientPhoneVisible?: boolean;
  clientAddressDetails?: string;
  preferredContact?: 'direct_call' | 'masked_call' | 'chat' | 'whatsapp';
  artisanId?: string;
  artisanName?: string;
  artisanAvatar?: string;
  artisanPhoneMasked?: string;
  categoryId: string;
  subServiceId: string;
  subServiceName: string;
  type: 'instant' | 'scheduled' | 'quote';
  scheduledDate?: string;
  scheduledTime?: string;
  address: string;
  city: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedCost: number;
  actualCost?: number;
  ratingGiven?: boolean;
}

export interface QuoteBid {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanRating: number;
  artisanVerification: ArtisanVerification;
  bidAmount: number;
  estimatedDays: number;
  proposalText: string;
  includesMaterials: boolean;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ProjectQuoteRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  category: string;
  description: string;
  budgetEstimated: string;
  city: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  bids: QuoteBid[];
  status: 'open' | 'awarded' | 'closed';
  createdAt: string;
}

export interface ArtisanSchedule {
  workingDays: { [dayKey: string]: boolean }; // e.g. { sat: true, sun: true, mon: true, tue: true, wed: true, thu: true, fri: false }
  startHour: string; // "08:00"
  endHour: string;   // "18:00"
  breakStart?: string; // "12:00"
  breakEnd?: string;   // "13:30"
  vacationDates: string[]; // ["2026-10-15"]
  acceptsEmergencyCalls: boolean;
  timeSlotDurationMinutes: number; // 60
}

export interface QnAAnswer {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanTrade: string;
  artisanLevel: VerificationLevel;
  text: string;
  createdAt: string;
  upvotesCount: number;
  hasUpvoted?: boolean;
  isVerifiedSolution?: boolean;
}

export interface QnAQuestion {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  category: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  answers: QnAAnswer[];
  viewsCount: number;
  isResolved: boolean;
}

export interface BenchmarkPriceItem {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  description: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  durationEstimate: string;
  includesMaterials: boolean;
  pricingNotes: string;
  popular?: boolean;
}

// -------------------------------------------------------------
// Job Market & Work Seeking Interfaces (سوق العمل والبحث عن عمل وعامل)
// -------------------------------------------------------------
export interface JobSeekerCertificate {
  id: string;
  title: string;
  issuer?: string;
  year?: string;
  imageUrl: string;
}

export interface JobSeekerProfile {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  city: string;
  trade: string; // ماذا تتقن (المهنة أو التخصص الأساسي)
  category: string;
  description: string; // ماذا تقدم (تفاصيل الخدمات والقدرات)
  skills: string[];
  experienceYears: number;
  expectedWage: string; // الأجر أو التسعيرة المتوقعة
  availabilityType: 'immediate' | 'full_time' | 'part_time' | 'daily' | 'project';
  hasOwnTools: boolean;
  hasOwnTransport: boolean;
  avatar: string;
  certificates: JobSeekerCertificate[];
  portfolioImages: string[];
  createdAt: string;
  status: 'available' | 'employed' | 'busy';
  isVerified?: boolean;
  gender?: 'male' | 'female';
}

export interface Review {
  id: string;
  artisanId: string;
  clientId: string;
  clientName: string;
  rating: number;
  punctualityScore: number;
  qualityScore: number;
  behaviorScore: number;
  comment: string;
  serviceName: string;
  date: string;
  verifiedJob: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  senderRole: Role | 'admin';
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  audioUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export type AppointmentStatus = 'pending_confirmation' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
export type AppointmentType = 'inspection' | 'execution' | 'emergency' | 'consultation';

export interface Appointment {
  id: string;
  orderId?: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  artisanId: string;
  artisanName: string;
  artisanTrade: string;
  artisanAvatar: string;
  serviceName: string;
  date: string; // e.g. "2026-10-12"
  timeSlot: string; // e.g. "10:00 - 11:30"
  type: AppointmentType;
  status: AppointmentStatus;
  wilaya: string;
  address: string;
  notes?: string;
  estimatedPrice?: number;
  confirmedAt?: string;
  createdAt: string;
}

export interface CallSession {
  isActive: boolean;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  isMuted: boolean;
  isSpeaker: boolean;
  durationSeconds: number;
}

export interface BillboardConfig {
  isVisible: boolean;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  description: string;
  badge: string;
  buttonText: string;
  buttonLink?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'announcement' | 'alert' | 'note' | 'order' | 'qna';
  audience: 'all' | 'artisans' | 'clients';
  version?: string;
  updateUrl?: string;
  actionLink?: string;
  linkText?: string;
  note?: string; // ملاحظات أو تنويه خاص
  imageUrl?: string;
  sentAt: string;
  isRead?: boolean;
}

export interface SquareSpotlightConfig {
  isVisible: boolean;
  mediaType: 'image' | 'video';
  mediaUrl: string; // Direct link or uploaded file base64 data
  title?: string;   // Optional title (معه عنوان أو بدونه)
  text?: string;    // Optional text (معه نص أو بدونه)
  linkUrl?: string; // Optional URL link
  badge?: string;
}

export interface AppSecurityConfig {
  isEncryptionActive: boolean;
  isCallMaskingActive: boolean;
  isPayloadSanitizationActive: boolean;
  isAntiTamperingActive: boolean;
  sessionTokenExpiryHours: number;
  lastAuditDate: string;
  encryptionKeyFingerprint: string;
}

export interface FirebaseFCMConfig {
  isConnected: boolean;
  projectId: string;
  fcmServerKey: string;
  senderId: string;
  appCurrentVersion: string;
}

export interface PlayStoreComplianceConfig {
  // Contact Us Info (Empty strings by default, editable from Admin Panel)
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  supportAddress: string;
  workingHours: string;
  websiteUrl: string;
  privacyPolicyExternalUrl: string;
  // Play Store Policies & Terms (Editable from Admin Panel)
  customPrivacyPolicy: string;
  customTermsOfService: string;
  customDataSafetyPolicy: string;
  accountDeletionInstructions: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  contact: string;
  category: 'general' | 'complaint' | 'suggestion' | 'technical' | 'account_deletion';
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
  status: 'new' | 'in_progress' | 'resolved';
}

// -------------------------------------------------------------
// Work Partner & Business Partnership Interfaces (البحث عن شريك للعمل)
// -------------------------------------------------------------
export type PartnershipType = 
  | 'workshop_sharing'     // تقاسم ورشة أو محل
  | 'project_partner'      // شراكة في مقاولة أو مشروع
  | 'capital_equipment'    // شراكة رأس مال أو معدات
  | 'skill_complementary'  // تكامل مهارات وخبرات
  | 'subcontract_team';    // تكوين فريق عمل متكامل

export interface PartnerComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTrade?: string;
  authorPhone?: string;
  text: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface WorkPartnerPost {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTrade: string;
  authorPhone: string;
  authorVerificationLevel: VerificationLevel;
  partnershipType: PartnershipType;
  wilaya: string;
  city?: string;
  description: string;
  whatIOffer: string;
  whatISeek: string;
  images: string[];
  likesCount: number;
  hasLiked: boolean;
  comments: PartnerComment[];
  createdAt: string;
  status: 'active' | 'partner_found' | 'closed';
  contactPreference?: 'phone' | 'chat' | 'both';
}

export interface HomePanelsConfig {
  billboard: boolean;
  heroMaster: boolean;
  aiDiagnostic: boolean;
  partnerFinder: boolean;
  appointmentsBanner: boolean;
  categoriesGrid: boolean;
  squareSpotlight: boolean;
  guarantees: boolean;
}

export interface ClientAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  avatar: string;
  registeredAt: string;
  ordersCount: number;
  isSuspended?: boolean;
}


export interface Report {
  id: string;
  reporterId: string;
  artisanId: string;
  reason: 'inappropriate' | 'scam' | 'unprofessional' | 'other';
  timestamp: string;
  isResolved: boolean;
}

// -------------------------------------------------------------
// Digital Recharge & Gaming Top-Up (شحن الألعاب والقنوات والبطاقات)
// -------------------------------------------------------------
export interface RechargePackageOption {
  id: string;
  label: string;
  labelAr: string;
  priceDzd: number;
  popular?: boolean;
  bonus?: string;
}

export interface GameChannelRechargeItem {
  id: string;
  category: 'game' | 'channel' | 'card';
  name: string;
  nameAr: string;
  tagline: string;
  icon: string;
  badge?: string;
  inputType: 'player_id' | 'account_email' | 'phone_number';
  inputPlaceholderAr: string;
  options: RechargePackageOption[];
  instructionsAr: string;
}

export interface RechargeOrderRequest {
  id: string;
  itemId: string;
  itemName: string;
  category: 'game' | 'channel' | 'card';
  packageId: string;
  packageLabel: string;
  priceDzd: number;
  targetAccount: string;
  clientName: string;
  clientPhone: string;
  paymentMethod: 'baridimob' | 'ccp' | 'cash';
  notes?: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

// -------------------------------------------------------------
// Vehicle & Truck Rentals (استئجار وكراء السيارات والشاحنات والعربات)
// -------------------------------------------------------------
export type RentalVehicleType = 'car' | 'truck' | 'cart_towing';

export interface RentalVehicleItem {
  id: string;
  title: string;
  type: RentalVehicleType;
  brandModel: string;
  year: number;
  wilaya: string;
  city: string;
  pricePerDay: number;
  pricePerTrip?: number;
  withDriver: boolean;
  transmission: 'manual' | 'automatic';
  fuelType: 'diesel' | 'essence' | 'gpl';
  capacity: string;
  image: string;
  agencyName: string;
  agencyPhone: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  features: string[];
}

export interface VehicleRentalBooking {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleType: RentalVehicleType;
  clientName: string;
  clientPhone: string;
  wilaya: string;
  startDate: string;
  durationDays: number;
  withDriver: boolean;
  totalEstimate: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  createdAt: string;
}
