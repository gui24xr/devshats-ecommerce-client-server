// ============================================
// BRANCH TYPES
// ============================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressData {
  textAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  formattedAddress: string;
  references?: string;
  coordinates: Coordinates;
}

export interface ContactData {
  phones: string[];
  emails: string[];
}

export interface DaySchedule {
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface ChatMessageContactData {
  whatsappNumbers: string[];
  phones: string[];
  emails: string[];
}

export interface ChatMessageConfig {
  header: string;
  welcomeMessage: string;
  contactData: ChatMessageContactData;
  ubicationText: string;
  workingHoursText: string;
  showConfirmButton: boolean;
  confirmButtonUrl: string;
  showCancelButton: boolean;
  cancelButtonUrl: string;
  footerTitle: string;
  footerMessage: string;
}

export interface WaMessageConfig {
  waPhoneNumber: string;
  chatMessageConfig: ChatMessageConfig;
}

// ============================================
// DELIVERY METHODS
// ============================================

export interface DeliveryMethodUIData {
  label: string;
  emoji: string;
  icon: string;
  maxRadius?: string;
  availableHours?: string;
  estimatedTime?: string;
  showAvailableHours?: boolean;
  showMaxRadius?: boolean;
  showEstimatedTime?: boolean;
  showSchedule?: boolean;
}

export interface AvailableHours {
  start: string;
  end: string;
}

export interface DistancePricing {
  from: number;
  to: number;
  addPrice: number;
}

export interface MotoDeliveryPricing {
  basePrice: number;
  currency: string;
  distancePricing: DistancePricing[];
}

export interface MotoDeliveryConstraints {
  maxDistanceInKms: number;
  originCoordinates: Coordinates;
  availableHours: AvailableHours;
  pricing: MotoDeliveryPricing;
}

export interface PickupConstraints {
  preparationTimeInMinutes: number;
  pickupInstructions: string;
  pickupPointCompleteAddress: string;
  pickupCoordinates: Coordinates;
  workingHours: WorkingHours;
}

export interface MotoDeliveryMethod {
  type: 'motoDelivery';
  enabled: boolean;
  uiData: DeliveryMethodUIData;
  constraints: MotoDeliveryConstraints;
}

export interface PickupDeliveryMethod {
  type: 'pickup';
  enabled: boolean;
  uiData: DeliveryMethodUIData;
  constraints: PickupConstraints;
}

export type DeliveryMethod = MotoDeliveryMethod | PickupDeliveryMethod;

// ============================================
// PAYMENT METHODS
// ============================================

export interface PaymentMethodUIData {
  label: string;
  emoji: string;
  icon: string;
  description?: string;
  showDescription?: boolean;
}

export interface PaymentMethod {
  type: 'CASH_PAYMENT' | 'CREDIT_CARD_PAYMENT' | 'BANK_TRANSFER_PAYMENT' | 'MERCADO_PAGO_PAYMENT';
  enabled: boolean;
  uiData: PaymentMethodUIData;
  constraints: Record<string, any>; // Vacío por ahora, puede extenderse
}

// ============================================
// BRANCH MAIN INTERFACE
// ============================================

export interface Branch {
  id: string;
  name: string;
  active: boolean;
  addressData: AddressData;
  contactData: ContactData;
  workingHours: WorkingHours;
  waMessageConfig: WaMessageConfig;
  deliveryMethods: DeliveryMethod[];
  paymentMethods: PaymentMethod[];
}

// ============================================
// MAPPED BRANCH (usado en el store)
// ============================================

export interface MappedBranch extends Branch {
  pickupPointCompleteAddress?: string;
  pickupPointCoordinates?: Coordinates;
  motoDeliveryOriginCoordinates?: Coordinates;
  motoDeliveryMaxDistanceInKms?: number;
  motoDeliveryBasePrice?: number;
  motoDeliveryDistancePricing?: DistancePricing[];
}