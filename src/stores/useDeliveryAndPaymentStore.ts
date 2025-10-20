import { create } from "zustand";
import  CheckoutService  from "@/lib/CheckoutService";


const useDeliveryAndPaymentStore = create((set, get) => ({
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
setMapData: (mapData?: {address: string, coordinates: {lat: number, lng: number}} | null) => {
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

  selectDeliveryOption: (deliveryOption: any) => {
      set({ selectedDeliveryOption: deliveryOption, });
      const allowedPaymentMethods = CheckoutService.getBranchPaymenthMethods(deliveryOption?.branchId);
      set({ allowedPaymentMethods: allowedPaymentMethods || [] });
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
