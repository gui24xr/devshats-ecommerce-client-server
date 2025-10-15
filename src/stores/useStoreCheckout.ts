import { create } from "zustand";
import {  useBranchesStore } from "@/stores";
import { checkoutOrder } from "@/actions";



const useStoreCheckout = create((set, get) => ({
  isSubmitting: false,
  mapRadioData: null,
  motoDeliveryOptions: [],
  pickupDeliveryOptions: [],
  allowedPaymentMethods: [],
  customerAddressData: null,
  customerName: null,
  customerPhone: null,
  customerEmail: null,
  notes: null,
  selectedDeliveryOption: null,
  selectedPaymentMethodType: null, 
  cartTicket: null,
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

  setMapRadioData: ({address, coordinates}:{address: string, coordinates: {lat: number, lng: number}}) => {
    if (!address || !coordinates){
      const pickupOptionsWithoutDistance = getPickupOptions(null)          
      set({ motoDeliveryOptions: [] });
      set({ pickupDeliveryOptions: pickupOptionsWithoutDistance });
      set({ mapRadioData: null });
      return;
    }
    const pickupOptionsWithDistance = getPickupOptions(coordinates) 
    const motoDeliveryOptionsWithDistance = getMotoDeliveryOptions(address,coordinates)         
    set({ motoDeliveryOptions: motoDeliveryOptionsWithDistance }); //falta calcular esto
    set({ pickupDeliveryOptions: pickupOptionsWithDistance });
    set({ mapRadioData: null });
    set({ mapRadioData: { address, coordinates} });

  },
  setCustomerName: (customerName: string) => {
    set({ customerName: customerName });
  },
  
  setCustomerPhone: (customerPhone: string) => {
    set({ customerPhone: customerPhone });
  },

  setCustomerEmail: (customerEmail: string) => {
    set({ customerEmail: customerEmail });
  },
  
  setNotes: (notes: string) => {
    set({ notes: notes });
  },

  selectDeliveryOption: (deliveryOption: any) => {
      set({ selectedDeliveryOption: deliveryOption, });
      const allowedPaymentMethods = getBranchPaymenthMethods(deliveryOption?.branchId);
      set({ allowedPaymentMethods: allowedPaymentMethods || [] });
      get().calculateOrderAmount();
  },
/*
  setCustomerAddressData: (customerAddress: any) => {
    set({ customerAddressData: customerAddress });
      if (!customerAddress) {
          // Si no hay dirección, limpiar moto y mostrar pickup sin distancia
          const pickupOptionsWithoutDistance = getBranchesOptionsWithoutsDistance();
          set({ motoDeliveryOptions: [] });
          set({ pickupDeliveryOptions: pickupOptionsWithoutDistance });
      } else {
          // Si hay dirección, calcular todo con distancias
          const { motoDeliveryOptions, pickupDeliveryOptions} = getOptionsWithDistanceAndPriceAndOrder(customerAddress);
          set({ motoDeliveryOptions: motoDeliveryOptions });
          set({ pickupDeliveryOptions: pickupDeliveryOptions });
      }
      //get().selectDeliveryOption(null);
  },
*/
  selectPaymentMethodType: (paymentMethodType: string) => {
    try {
      set({ selectedPaymentMethodType: paymentMethodType})
    } catch (error) {
      throw error;
    }
  },

  calculateOrderAmount: () => {
    const currentCartTicketAmount = get().cartTicket?.totalPrice;
    const deliveryAmount = get().selectedDeliveryOption?.deliveryAmount || 0;
    set({ orderFinalAmount: Number(currentCartTicketAmount) + Number(deliveryAmount)});
  },

  onChangeCart(cartTicket: any) {
    set({cartTicket: cartTicket});
    get().calculateOrderAmount();
  },

  onChangeBranches: () => {
    const pickupOptionsWithoutDistance =  getPickupOptions(null) 
    set({ motoDeliveryOptions: [] });
    set({ pickupDeliveryOptions: pickupOptionsWithoutDistance });
    get().selectDeliveryOption(null);
  },


  submitOrder: async () => {
    const checkoutData = {
      branchId: get().selectedDeliveryOption?.branchId,
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


}));



export default useStoreCheckout;

//Helpers ---------------------------------------------------------------


const getPickupOptions = (fromCoordinates:{lat: number, lng: number} | null) => {
  try{
     const pickupOptions = useBranchesStore.getState().branches.map((item) => ({
      deliveryType: "pickup",
      branchId: item.id, 
      active: item.active,
      name: item.name,
      distancePickupPointToCustomerAddressInKms: fromCoordinates ? getDistanceInKm(fromCoordinates.lat, fromCoordinates.lng, item.pickupPointCoordinates.lat, item.pickupPointCoordinates.lng).toFixed(1) : null,
      deliveryAmount: 0,
      branchData: {
        addressData: item.addressData,
        contactData: item.contactData,
        workingHours: item.workingHours,
      },
    }));
    
    if (!fromCoordinates)  return pickupOptions
    return pickupOptions.sort((a, b) => a.distancePickupPointToCustomerAddressInKms - b.distancePickupPointToCustomerAddressInKms)
  }catch(error){
    console.error(error)
    throw error
  }
  
}

const getMotoDeliveryOptions = (address:string,fromCoordinates:{lat: number, lng: number} | null) => {

  try{
     if (!address || !fromCoordinates) throw new Error("No se envio la direccion o las coordenadas");
    
     const motoDeliveryOptions = []
  
    useBranchesStore.getState().branches.forEach((branchItem) => {
      
      const distanceMotoDeliveryToCustomerAddressInKms =getDistanceInKm(fromCoordinates.lat, fromCoordinates.lng, branchItem.motoDeliveryOriginCoordinates.lat, branchItem.motoDeliveryOriginCoordinates.lng).toFixed(1)
    
      if (!(distanceMotoDeliveryToCustomerAddressInKms <= branchItem.motoDeliveryMaxDistanceInKms)) return
      
      //Calculo precio  
      const segmentPrice = branchItem.motoDeliveryDistancePricing.find((Item) => Item.from <= distanceMotoDeliveryToCustomerAddressInKms && Item.to >= distanceMotoDeliveryToCustomerAddressInKms);

      if (!segmentPrice) throw new Error("No se encontro un segmento de precio para calcular el deliveryAmount");
      
      const deliveryAmount = segmentPrice.addPrice + branchItem.motoDeliveryBasePrice;
    
     motoDeliveryOptions.push({
          deliveryType: "motoDelivery",
          branchId: branchItem.id, 
          active: branchItem.active,
          name: branchItem.name,
          distanceMotoDeliveryToCustomerAddressInKms: distanceMotoDeliveryToCustomerAddressInKms,
          deliveryAmount: deliveryAmount,
          customerAddressData: {
            completeAddress: address,
            coordinates: fromCoordinates,
            betweenStreets: null,
            extraInfo: null,
          },
        });

      })
     return motoDeliveryOptions
    }
  catch(error){
    console.error(error)
    throw error
  }
  
}




 const getOptionsWithDistanceAndPriceAndOrder = (selectedPointInMap: any) => {
        const newData = useBranchesStore.getState().branches.map((branchItem: any) => {
          return {
            branchId: branchItem.id,
            name: branchItem.name,
            active: branchItem.active,
            addressData: branchItem.addressData,
            contactData: branchItem.contactData,
            workingHours: branchItem.workingHours,
            waMessagePhone: branchItem.waMessagePhone,
            deliveryData: getDeliveryStatics({
              customerCoordinates: selectedPointInMap.coordinates,
              pickupPointCoordinates: branchItem.pickupPointCoordinates,
              motoDeliveryOriginCoordinates: branchItem.motoDeliveryOriginCoordinates,
              motoDeliveryMaxDistanceInKms: branchItem.motoDeliveryMaxDistanceInKms,
              motoDeliveryBasePrice: branchItem.motoDeliveryBasePrice,
              motoDeliveryDistancePricing: branchItem.motoDeliveryDistancePricing,
            }),
          };
        });
    
        const sortedData = newData
          .sort(
            (a, b) =>
              a.deliveryData.distanceMotoDeliveryToCustomerAddressInKms -
              b.deliveryData.distanceMotoDeliveryToCustomerAddressInKms
          )
          .filter((item) => item.active === true);
    
        const motoDeliveryTypeOptions = sortedData
          .filter((item) => item.deliveryData.allowMotoDeliveryToCustomerAddress)
          .map((item) => ({
            deliveryType: "motoDelivery",
            branchId: item.branchId,
            name: item.name,
            deliveryAmount: item.deliveryData.deliveryAmount,
            distanceMotoDeliveryToCustomerAddressInKms:item.deliveryData.distanceMotoDeliveryToCustomerAddressInKms,
            customerAddressData: {
              coordinates: selectedPointInMap.coordinates,
              completeAddress: selectedPointInMap.address,
            }
          }));
    
        const pickUpDeliveryTypeOptions = sortedData.map((item) => ({
          deliveryType: "pickup",
          branchId: item.branchId,
          name: item.name,
          deliveryAmount: 0,
          distancePickupPointToCustomerAddressInKms: item.deliveryData.distancePickupPointToCustomerAddressInKms,
          branchData: {
            addressData: item.addressData,
            contactData: item.contactData,
            workingHours: item.workingHours,
          },
          customerAddressData: {
              coordinates: selectedPointInMap.coordinates,
              completeAddress: selectedPointInMap.address,
          }
        }));
       

        return {
          motoDeliveryOptions: motoDeliveryTypeOptions,
          pickupDeliveryOptions: pickUpDeliveryTypeOptions,
        };
      
      }
    


    const getBranchPaymenthMethods = (branchId) => {
      try{
        const foundedBranch = useBranchesStore.getState().branches.find((item) => item.id === branchId)
        return foundedBranch?.paymentMethods 
      }catch(error){
          console.error(error);
          throw error
      }
      
    }


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
