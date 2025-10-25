import { Coordinates, AddressData, ContactData, WorkingHours, PaymentMethod } from './branch';
import { CartItem } from './cart';

// ============================================
// MAP & ADDRESS DATA
// ============================================

export interface MapData {
  address: string;
  coordinates: Coordinates;
}

export interface CustomerAddressData {
  completeAddress: string;
  coordinates: Coordinates;
}

// ============================================
// DELIVERY OPTIONS
// ============================================

export interface BranchDataForDelivery {
  addressData: AddressData;
  contactData: ContactData;
  workingHours: WorkingHours;
}

export interface PickupOption {
  deliveryType: 'pickup';
  branchId: string;
  active: boolean;
  name: string;
  distancePickupPointToCustomerAddressInKms: string | null;
  deliveryAmount: number;
  branchData: BranchDataForDelivery;
}

export interface MotoDeliveryOption {
  deliveryType: 'motoDelivery';
  branchId: string;
  active: boolean;
  name: string;
  distanceMotoDeliveryToCustomerAddressInKms: string;
  deliveryAmount: number;
  customerAddressData: CustomerAddressData;
}

export type DeliveryOption = PickupOption | MotoDeliveryOption;

// ============================================
// CHECKOUT FORM & ORDER DATA
// ============================================

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPhoneCountry: string;
  motoDeliverybetweenStreets?: string;
  motoDeliveryReference?: string;
  motoDeliveryExtraInfo?: string;
}

export interface CustomerData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPhoneCountry: string;
  selectedPaymentMethodType: string | null;
  selectedDeliveryMethodType: 'pickup' | 'motoDelivery' | undefined;
  pickupPointCompleteAddress: string | null;
  customerAddressData: CustomerAddressData | null;
  motoDeliverybetweenStreets: string | null;
  motoDeliveryReference: string | null;
  motoDeliveryExtraInfo: string | null;
  notes: string;
}

export interface OrderTicket {
  cartDetail: CartItem[];
  cartItemsCount: number;
  cartTicketAmount: number;
  deliveryAmount: number;
  orderTax: number;
  finalAmount: number;
  currency: string;
}

export interface CheckoutPayload {
  customerData: CustomerData;
  orderTicketPreview: OrderTicket;
  branchId: string | undefined;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  phone?: string;
}