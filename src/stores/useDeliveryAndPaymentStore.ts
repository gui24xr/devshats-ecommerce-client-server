import { create } from "zustand";
import CheckoutService from "@/lib/CheckoutService";
import {
  MapData,
  PickupOption,
  MotoDeliveryOption,
  DeliveryOption,
  PaymentMethod,
  CartTicket
} from "@/types";

interface DeliveryAndPaymentStoreState {
  isSubmitting: boolean;
  mapData: MapData | null;
  motoDeliveryOptions: MotoDeliveryOption[];
  pickupDeliveryOptions: PickupOption[];
  allowedPaymentMethods: PaymentMethod[];
  selectedDeliveryOption: DeliveryOption | null;
  selectedPaymentMethodType: string | null;

  cartTicket: CartTicket | null;
  orderTax: number;
  orderCurrency: string;
  orderFinalAmount: number;

  // Methods
  reset: () => void;
  setMapData: (mapData?: MapData | null) => void;
  selectDeliveryOption: (deliveryOption: DeliveryOption | null) => void;
  selectPaymentMethodType: (paymentMethodType: string) => void;
}

const useDeliveryAndPaymentStore = create<DeliveryAndPaymentStoreState>((set, get) => ({
  isSubmitting: false,
  mapData: null,
  motoDeliveryOptions: [],
  pickupDeliveryOptions: [],
  allowedPaymentMethods: [],
  selectedDeliveryOption: null,
  selectedPaymentMethodType: null,


  cartTicket: null,
  orderTax: 0,
  orderCurrency: "ARS", //Queda abierto como resolver esto
  orderFinalAmount: 0,

reset: () => {
    const pickupOptionsWithoutDistance = CheckoutService.getPickupOptions(null)
    set({ motoDeliveryOptions: [] });
    set({ pickupDeliveryOptions: pickupOptionsWithoutDistance });
    get().selectDeliveryOption(null);
  },
setMapData: (mapData?: MapData | null) => {
   if (!mapData) {
    get().reset();
    return;
  }
  const { address, coordinates } = mapData;
  if (!address || !coordinates) {
    const pickupOptionsWithoutDistance = CheckoutService.getPickupOptions(null);
    set({ motoDeliveryOptions: [] });
    set({ pickupDeliveryOptions: pickupOptionsWithoutDistance });
    set({ mapData: null });
    get().selectDeliveryOption(null);
    return;
  }
  
  const pickupOptionsWithDistance = CheckoutService.getPickupOptions(coordinates);
  const motoDeliveryOptionsWithDistance = CheckoutService.getMotoDeliveryOptions(address, coordinates);
  set({ motoDeliveryOptions: motoDeliveryOptionsWithDistance });
  set({ pickupDeliveryOptions: pickupOptionsWithDistance });
  set({ mapData: { address, coordinates } });
  get().selectDeliveryOption(null);
},

  selectDeliveryOption: (deliveryOption: DeliveryOption | null) => {
      set({ selectedDeliveryOption: deliveryOption });
      if (deliveryOption) {
        const allowedPaymentMethods = CheckoutService.getBranchPaymenthMethods(deliveryOption.branchId);
        set({ allowedPaymentMethods: allowedPaymentMethods || [] });
      } else {
        set({ allowedPaymentMethods: [] });
      }
      //get().calculateOrderAmount();
  },

  selectPaymentMethodType: (paymentMethodType: string) => {
    try {
      set({ selectedPaymentMethodType: paymentMethodType})
    } catch (error) {
      throw error;
    }
  },

}));



export default useDeliveryAndPaymentStore;
