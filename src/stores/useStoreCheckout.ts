import { create } from "zustand";
import {  useBranchesStore, useCartStore, useModalsStore } from "@/stores";
import { checkoutOrder } from "@/actions";
import { use } from "react";


const useStoreCheckout = create((set, get) => ({
  isSubmitting: false,
 
  selectedDeliveryMethodType: null,
  selectedPaymentMethodType: null,
  customerName: null,
  customerPhone: null,
  customerEmail: null,
  currentCustomerAddress: {
    completeAddress: null,
    coordinates: null,
  },
  notes: null,

  cartTicket: null,

  distancePickupPointToCustomerAddressInKms: null,
  distanceMotoDeliveryToCustomerAddressInKms: null,
  allowMotoDeliveryToCustomerAddress: false,

  orderDeliveryAmount: 0,
  orderTax: 0,
  orderCurrency: "ARS",
  orderFinalAmount: 0,


  errors: {
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    customerAddress: null,
    notes: null,
  },
  

  setCustomerName: (customerName: string) => {
    set({ customerName: customerName });
  },

  setCustomerEmail: (customerEmail: string) => {
    set({ customerEmail: customerEmail });
  },

  setCustomerPhone: (customerPhone: string) => {
    set({ customerPhone: customerPhone });
  },

  selectDeliveryMethodType: (deliveryMethodType: string) => {
    try {
      const foundDeliveryMethod = useBranchesStore.getState().selectedBranch?.deliveryMethods?.find(
        (deliveryMethod) => deliveryMethod.type === deliveryMethodType
      );
      if (!foundDeliveryMethod) {
        throw new Error("Delivery method not found");
      }
      switch (foundDeliveryMethod.type) {
        case "pickup":
          get()._onSelectPickupDeliveryMethod();
          break;
        case "motoDelivery":
          get()._onSelectMotoDeliveryDeliveryMethod();
          break;
      }
    } catch (error) {
      throw error;
    }
  },

  _onSelectPickupDeliveryMethod: () => {
    try{
      set({ selectedDeliveryMethodType: "pickup"});
      get().calculateOrderAmount();
    }catch (error) {
      throw error;
    }
    
  },

  _onSelectMotoDeliveryDeliveryMethod: () => {
    try{
      set({ selectedDeliveryMethodType: "motoDelivery"});
      get().calculateOrderAmount();
    }catch (error) {
      throw error;
    }
  },

  selectPaymentMethodType: (paymentMethodType: string) => {
    try {
      set({ selectedPaymentMethodType: paymentMethodType})
    } catch (error) {
      throw error;
    }
  },

  setNotes: (notes: string) => {
    set({ notes: notes });
  },

 validateCustomerAddress: ({ completeAddress, customerCoordinates, onSuccess, onError }) => {
  try{
const {
      distanceMotoDeliveryToCustomerAddressInKms,
      distancePickupPointToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress,
      deliveryAmount,
    } = getDeliveryStatics({ 
      customerCoordinates: customerCoordinates,
      pickupPointCoordinates: useBranchesStore.getState().selectedBranch.pickupPointCoordinates,
      motoDeliveryOriginCoordinates: useBranchesStore.getState().selectedBranch.motoDeliveryOriginCoordinates,
      motoDeliveryMaxDistanceInKms: useBranchesStore.getState().selectedBranch.motoDeliveryMaxDistanceInKms,
      motoDeliveryBasePrice: useBranchesStore.getState().selectedBranch.motoDeliveryBasePrice,
      motoDeliveryDistancePricing: useBranchesStore.getState().selectedBranch.motoDeliveryDistancePricing
  });

    onSuccess({
      currentCustomerAddress: { completeAddress: completeAddress, coordinates: customerCoordinates,},
      distancePickupPointToCustomerAddressInKms:distancePickupPointToCustomerAddressInKms,
      distanceMotoDeliveryToCustomerAddressInKms:distanceMotoDeliveryToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress: allowMotoDeliveryToCustomerAddress,      
      orderDeliveryAmount: deliveryAmount,
    })
  }catch(error: any){
    onError?.(error.message)
  }
    
  },
  setCustomerAddress: ({ completeAddress, customerCoordinates}) => {
    try{
const {
      distanceMotoDeliveryToCustomerAddressInKms,
      distancePickupPointToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress,
      deliveryAmount,
    } = getDeliveryStatics({ 
      customerCoordinates: customerCoordinates,
      pickupPointCoordinates: useBranchesStore.getState().selectedBranch.pickupPointCoordinates,
      motoDeliveryOriginCoordinates: useBranchesStore.getState().selectedBranch.motoDeliveryOriginCoordinates,
      motoDeliveryMaxDistanceInKms: useBranchesStore.getState().selectedBranch.motoDeliveryMaxDistanceInKms,
      motoDeliveryBasePrice: useBranchesStore.getState().selectedBranch.motoDeliveryBasePrice,
      motoDeliveryDistancePricing: useBranchesStore.getState().selectedBranch.motoDeliveryDistancePricing
  });


    set({
      currentCustomerAddress: {
        completeAddress: completeAddress,
        coordinates: customerCoordinates,
      },
      distancePickupPointToCustomerAddressInKms:distancePickupPointToCustomerAddressInKms,
      distanceMotoDeliveryToCustomerAddressInKms:distanceMotoDeliveryToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress: allowMotoDeliveryToCustomerAddress,      
      orderDeliveryAmount: deliveryAmount,
    });

      get().calculateOrderAmount();
      useModalsStore.getState().hideAddressMapSelectorModal();
    }catch(error: any){
      throw error
    }
    

    //----------------------------------------------------------
  },

  onChangeCart(cartTicket: any) {
    set({cartTicket: cartTicket});
    get().calculateOrderAmount();
  },

  submitOrder: async () => {
    const checkoutData = {
      branchId: useBranchesStore.getState().selectedBranch.id,
      customerCkeckoutData: {
        customerName: get().customerName,
        customerPhone: get().customerPhone,
        customerEmail: get().customerEmail,
        notes: get().notes,
        selectedDeliveryMethodType: get().selectedDeliveryMethodType,
        selectedPaymentMethodType: get().selectedPaymentMethodType,
        customerCompleteAddress: get().currentCustomerAddress?.completeAddress,
        customerCoordinates: get().currentCustomerAddress?.coordinates,
      },
      cartTicket: get().cartTicket,
    }

    const response = await checkoutOrder(checkoutData);
    console.log("Resultado action: ", response);

   if (response.success) {
    const encodeMessage = encodeURIComponent(response.message)
    const waLink = `https://wa.me/${response.phone}?text=${encodeMessage}`
    window.open(waLink, "_blank")
   }
   else {
    alert('Problemas')
   }
  },

  calculateOrderAmount: () => {
    const currentCartTicketAmount = get().cartTicket?.totalPrice;

    const deliveryAmount =
      get().selectedDeliveryMethod?.type === "motoDelivery"
        ? get().orderDeliveryAmount
        : 0;

    set({
      orderFinalAmount:
        Number(currentCartTicketAmount) + Number(deliveryAmount),
    });
  },
}));



export default useStoreCheckout;

//Helpers ---------------------------------------------------------------

const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

//------------------------------------------------------------------------------------------------------------
function getDeliveryStatics({
  customerCoordinates,
  pickupPointCoordinates,
  motoDeliveryOriginCoordinates,
  motoDeliveryMaxDistanceInKms,
  motoDeliveryBasePrice,
  motoDeliveryDistancePricing
}) {

  console.log('aaa csustomerCoordinates', customerCoordinates)
  console.log('aaa pickupPointCoordinates', pickupPointCoordinates)
  console.log('aaa motoDeliveryOriginCoordinates', motoDeliveryOriginCoordinates)
  console.log(' aaaa motoDeliveryMaxDistanceInKms', motoDeliveryMaxDistanceInKms)
  console.log('aaa motoDeliveryBasePrice', motoDeliveryBasePrice)
  console.log('aaa motoDeliveryDistancePricing', motoDeliveryDistancePricing)


  let distancePickupPointToCustomerAddressInKms;
  let distanceMotoDeliveryToCustomerAddressInKms;
  let allowMotoDeliveryToCustomerAddress = false;
  let deliveryAmount;

  if (pickupPointCoordinates) {
    distancePickupPointToCustomerAddressInKms = getDistanceInKm(
      pickupPointCoordinates.lat,
      pickupPointCoordinates.lng,
      customerCoordinates.lat,
      customerCoordinates.lng
    ).toFixed(1);
  }

  if (motoDeliveryOriginCoordinates) {
    distanceMotoDeliveryToCustomerAddressInKms = getDistanceInKm(
      motoDeliveryOriginCoordinates.lat,
      motoDeliveryOriginCoordinates.lng,
      customerCoordinates.lat,
      customerCoordinates.lng
    ).toFixed(1);

    allowMotoDeliveryToCustomerAddress =
      distanceMotoDeliveryToCustomerAddressInKms <=
      motoDeliveryMaxDistanceInKms;

    const segmentoDePrecioCorrespondiente = motoDeliveryDistancePricing.find(
      (Item) =>
        Item.from <= distanceMotoDeliveryToCustomerAddressInKms &&
        Item.to >= distanceMotoDeliveryToCustomerAddressInKms
    );

    if (segmentoDePrecioCorrespondiente) {
      deliveryAmount =
        segmentoDePrecioCorrespondiente.addPrice + motoDeliveryBasePrice;
    }
  }

  return {
    distancePickupPointToCustomerAddressInKms,
    distanceMotoDeliveryToCustomerAddressInKms,
    allowMotoDeliveryToCustomerAddress,
    deliveryAmount,
  };
}
