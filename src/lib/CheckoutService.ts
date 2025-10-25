import { checkoutOrder } from "@/actions";
import { useDeliveryAndPaymentStore, useCartStore, useBranchesStore } from "@/stores";
import {
  CheckoutFormData,
  CheckoutPayload,
  CheckoutResponse,
  OrderTicket,
  PickupOption,
  MotoDeliveryOption,
  Coordinates,
  PaymentMethod
} from "@/types";

const CheckoutService = {
  async processCurrentOrder(dataFromCheckoutForm: CheckoutFormData): Promise<string> {
    try {
        //1- aca ira la futura capa de validacion

     
        const currentOrderData = this.getCurrentOrder();
        const selectedDeliveryOption = useDeliveryAndPaymentStore.getState().selectedDeliveryOption;
        const selectedPaymentMethodType = useDeliveryAndPaymentStore.getState().selectedPaymentMethodType;
        console.log("dataFromCheckoutForm", dataFromCheckoutForm);
        console.log("currentOrderDatat", currentOrderData);
        console.log("selectedDeliveryOption", selectedDeliveryOption);
        console.log("selectedPaymentMethodType", selectedPaymentMethodType);

        const checkoutPayload: CheckoutPayload = {
          customerData:{
            customerName: dataFromCheckoutForm.customerName,
            customerEmail: dataFromCheckoutForm.customerEmail,
            customerPhone: dataFromCheckoutForm.customerPhone,
            customerPhoneCountry: dataFromCheckoutForm.customerPhoneCountry,
            selectedPaymentMethodType: selectedPaymentMethodType,
            selectedDeliveryMethodType: selectedDeliveryOption?.deliveryType,
            pickupPointCompleteAddress: selectedDeliveryOption?.deliveryType === 'pickup' ? selectedDeliveryOption.branchData?.addressData?.formattedAddress || null : null,
            customerAddressData: selectedDeliveryOption?.deliveryType === 'motoDelivery' ? selectedDeliveryOption.customerAddressData : null,
            motoDeliverybetweenStreets: dataFromCheckoutForm.motoDeliverybetweenStreets || null,
            motoDeliveryReference: dataFromCheckoutForm.motoDeliveryReference || null,
            motoDeliveryExtraInfo: dataFromCheckoutForm.motoDeliveryExtraInfo || null,
            notes: 'Notas adicionales',
          },
          orderTicketPreview: this.getCurrentOrder(),
          branchId: selectedDeliveryOption?.branchId,

        }

          const response: CheckoutResponse = await checkoutOrder(checkoutPayload);
          console.log("Resultado action: ", response);

    if (response.success) {
      const encodeMessage = encodeURIComponent(response.message)
      const waLink = `https://wa.me/${response.phone}?text=${encodeMessage}`
      window.open(waLink, "_blank")
    }
    else {
      
    }

        return 'Respyestsafsss'
    } catch (error) {
      console.error(error);
      throw error
    }
    
   
  },

  getCurrentOrder(): OrderTicket {
    const cartTicket = useCartStore.getState().getCurrentCartTicket();
    if (!cartTicket) {
      return {
        cartDetail: [],
        cartItemsCount: 0,
        cartTicketAmount: 0,
        deliveryAmount: 0,
        orderTax: 0,
        finalAmount: 0,
        currency: "ARS"
      };
    }
    const { detail, itemsCount, totalPrice } = cartTicket;
    const deliveryAmount = useDeliveryAndPaymentStore.getState().selectedDeliveryOption?.deliveryAmount || 0;
    return {
      cartDetail: detail || [],
      cartItemsCount: itemsCount || 0,
      cartTicketAmount: Number(totalPrice || 0),
      deliveryAmount: Number(deliveryAmount || 0),
      orderTax: 0,
      finalAmount: Number(totalPrice || 0) + Number(deliveryAmount  || 0),
      currency: "ARS"
    }
  },

  getPickupOptions : (fromCoordinates: Coordinates | null): PickupOption[] => {
  try{
     const pickupOptions: PickupOption[] = useBranchesStore.getState().branches.map((item) => ({
      deliveryType: "pickup" as const,
      branchId: item.id,
      active: item.active,
      name: item.name,
      distancePickupPointToCustomerAddressInKms: fromCoordinates && item.pickupPointCoordinates
        ? getDistanceInKm(fromCoordinates.lat, fromCoordinates.lng, item.pickupPointCoordinates.lat, item.pickupPointCoordinates.lng).toFixed(1)
        : null,
      deliveryAmount: 0,
      branchData: {
        addressData: item.addressData,
        contactData: item.contactData,
        workingHours: item.workingHours,
      },
    }));

    if (!fromCoordinates)  return pickupOptions
    return pickupOptions.sort((a, b) => {
      const distA = a.distancePickupPointToCustomerAddressInKms ? parseFloat(a.distancePickupPointToCustomerAddressInKms) : 0;
      const distB = b.distancePickupPointToCustomerAddressInKms ? parseFloat(b.distancePickupPointToCustomerAddressInKms) : 0;
      return distA - distB;
    })
  }catch(error){
    console.error(error)
    throw error
  }
  
},


getMotoDeliveryOptions : (address: string, fromCoordinates: Coordinates | null): MotoDeliveryOption[] => {

  try{
     if (!address || !fromCoordinates) throw new Error("No se envio la direccion o las coordenadas");

     const motoDeliveryOptions: MotoDeliveryOption[] = []

    useBranchesStore.getState().branches.forEach((branchItem) => {
      if (!branchItem.motoDeliveryOriginCoordinates || !branchItem.motoDeliveryMaxDistanceInKms ||
          !branchItem.motoDeliveryBasePrice || !branchItem.motoDeliveryDistancePricing) return;

      const distanceMotoDeliveryToCustomerAddressInKms = parseFloat(
        getDistanceInKm(
          fromCoordinates.lat,
          fromCoordinates.lng,
          branchItem.motoDeliveryOriginCoordinates.lat,
          branchItem.motoDeliveryOriginCoordinates.lng
        ).toFixed(1)
      );

      if (distanceMotoDeliveryToCustomerAddressInKms > branchItem.motoDeliveryMaxDistanceInKms) return

      //Calculo precio
      const segmentPrice = branchItem.motoDeliveryDistancePricing.find((Item) =>
        Item.from <= distanceMotoDeliveryToCustomerAddressInKms && Item.to >= distanceMotoDeliveryToCustomerAddressInKms
      );

      if (!segmentPrice) throw new Error("No se encontro un segmento de precio para calcular el deliveryAmount");

      const deliveryAmount = segmentPrice.addPrice + branchItem.motoDeliveryBasePrice;

     motoDeliveryOptions.push({
          deliveryType: "motoDelivery" as const,
          branchId: branchItem.id,
          active: branchItem.active,
          name: branchItem.name,
          distanceMotoDeliveryToCustomerAddressInKms: distanceMotoDeliveryToCustomerAddressInKms.toString(),
          deliveryAmount: deliveryAmount,
          customerAddressData: {
            completeAddress: address,
            coordinates: fromCoordinates,
          },
        });

      })
     return motoDeliveryOptions
    }
  catch(error){
    console.error(error)
    throw error
  }
  
},


getBranchPaymenthMethods : (branchId: string): PaymentMethod[] | undefined => {
  try{
    const foundedBranch = useBranchesStore.getState().branches.find((item) => item.id === branchId)
    return foundedBranch?.paymentMethods
  }catch(error){
      console.error(error);
      throw error
  }

}





};

export default CheckoutService






const getDistanceInKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
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


