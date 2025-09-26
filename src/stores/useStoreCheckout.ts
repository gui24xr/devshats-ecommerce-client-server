import { create } from "zustand";
import { useBranchesStore, useCartStore } from "@/stores";
import { checkoutOrder } from "@/actions";


const useStoreCheckout = create((set, get) => ({
  selectedBranchData: {
    id: null,
    name: null,
    active: null,
    addressData: {
      completeAddress: null,
      coordinates: null,
    },
    contactData: {
      phones: [],
      email: null,
    },
    waMessagePhone: null,
    deliveryMethods: [],
    paymentMethods: [],
    pickupPointCompleteAddress: null,
    pickupPointCoordinates: null,
    motoDeliveryOriginCoordinates: null,
    motoDeliveryMaxDistanceInKms: null,
    motoDeliveryPricing: null,
  },

  customerName: null,
  customerPhone: null,
  customerEmail: null,
  currentCustomerAddress: {
    completeAddress: null,
    coordinates: null,
  },
  notes: null,
  selectedDeliveryMethod: null,
  selectedPaymentMethod: null,
  showDeliveryAddressAndRadioForm: false,

  distancePickupPointToCustomerAddressInKms: null,
  distanceMotoDeliveryToCustomerAddressInKms: null,
  allowMotoDeliveryToCustomerAddress: false,
  currentMotoDeliveryAmount: 0,

  orderFinalAmount: 0,
  orderTax: 0,
  orderCurrency: "ARS",
  cartCount: 0,
  cartTotalPrice: 0,
  cartItems: null,

  errors: {
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    customerAddress: null,
    notes: null,
  },
  
  

  initializeCheckout: () => {
    const selectedBranchData = useBranchesStore.getState().selectedBranch;
    const cartItemsCount = useCartStore.getState().itemsCount
    const cartTotalPrice = useCartStore.getState().ticket.totalPrice
    const cartItems = useCartStore.getState().items
    
    set({
      selectedBranchData: {
        id: selectedBranchData?.id,
        name: selectedBranchData.name,
        active: selectedBranchData.active,
        addressData: {
          completeAddress: selectedBranchData.address,
          coordinates: selectedBranchData.coordinates,
        },
        contactData: {
          phones: selectedBranchData.phones,
          email: selectedBranchData.email,
        },
        waMessagePhone: selectedBranchData.waMessagePhone,
        deliveryMethods: selectedBranchData.deliveryMethods,
        paymentMethods: selectedBranchData.paymentMethods,
        pickupPointCompleteAddress: selectedBranchData?.deliveryMethods?.find(
          (dm) => dm.type === "pickup"
        )?.constraints?.pickupPointCompleteAddress,
        pickupPointCoordinates: selectedBranchData?.deliveryMethods?.find(
          (dm) => dm.type === "pickup"
        )?.constraints?.pickupPointCoordinates,
        motoDeliveryOriginCoordinates:
          selectedBranchData?.deliveryMethods?.find(
            (dm) => dm.type === "motoDelivery"
          )?.constraints?.originCoordinates,
        motoDeliveryPricing: selectedBranchData?.deliveryMethods?.find(
          (dm) => dm.type === "motoDelivery"
        )?.constraints?.pricing,
        motoDeliveryMaxDistanceInKms: selectedBranchData?.deliveryMethods?.find(
          (dm) => dm.type === "motoDelivery"
        )?.constraints?.maxDistanceInKms,
      },

      cartCount: cartItemsCount,
      cartTotalPrice: cartTotalPrice,
      cartItems: cartItems
    });
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

  selectDeliveryMethod: (deliveryMethodType: string) => {
    const foundDeliveryMethod = get().selectedBranchData?.deliveryMethods?.find(
      (dm) => dm.type === deliveryMethodType
    );
    if (!foundDeliveryMethod) throw new Error("Delivery method not found");

    set({
      selectedDeliveryMethod: foundDeliveryMethod,
      showDeliveryAddressAndRadioForm:
        foundDeliveryMethod.type === "motoDelivery" ? true : false,
    });

    if (foundDeliveryMethod.type === "pickup") {
      set({ 
        currentDeliveryAmount: 0,
        orderFinalAmount: get().cartTotalPrice
      });
    }
  },

  selectPaymentMethod: (paymentMethodType: string) => {
    const foundPaymentMethod = get().selectedBranchData?.paymentMethods?.find(
      (pm) => pm.type === paymentMethodType
    );
    if (!foundPaymentMethod) throw new Error("Payment method not found");

    set({ selectedPaymentMethod: foundPaymentMethod });
  },

  setNotes: (notes: string) => {
    set({ notes: notes });
  },

  
  setShowDeliveryAddressAndRadioForm: (show: boolean) => {
    set({ showDeliveryAddressAndRadioForm: show });
  },

  setCustomerAddress: ({ completeAddress, customerCoordinates }) => {
    
    const { distanceMotoDeliveryToCustomerAddressInKms
      , distancePickupPointToCustomerAddressInKms
      , allowMotoDeliveryToCustomerAddress
      , deliveryAmount
    } = getDeliveryStatics(get().selectedBranchData?.deliveryMethods, customerCoordinates)

    console.log("Statics : ", {
      "distanceMotoDeliveryToCustomerAddressInKms":   distanceMotoDeliveryToCustomerAddressInKms,
      "distancePickupPointToCustomerAddressInKms": distancePickupPointToCustomerAddressInKms,
      "allowMotoDeliveryToCustomerAddress": allowMotoDeliveryToCustomerAddress,
      "deliveryAmount": deliveryAmount
    })

    if (!allowMotoDeliveryToCustomerAddress) {
      alert("La dirección está fuera del área de entrega en moto.");
      return;
    }

    set({
      currentCustomerAddress: {
        completeAddress: completeAddress,
        coordinates: customerCoordinates,
      },
      distancePickupPointToCustomerAddressInKms: distancePickupPointToCustomerAddressInKms,
      distanceMotoDeliveryToCustomerAddressInKms: distanceMotoDeliveryToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress: allowMotoDeliveryToCustomerAddress,
      currentMotoDeliveryAmount: deliveryAmount,
      showDeliveryAddressAndRadioForm: false,
      orderFinalAmount: get().cartTotalPrice +  deliveryAmount

    });

    

    //----------------------------------------------------------
  },

  

  submitOrder: async () => {
    console.log("estado", get());

    const orderData = {
      branchId: get().selectedBranchData.id,
      customerName: get().customerName,
      customerPhone: get().customerPhone,
      customerEmail: get().customerEmail,
      notes: get().notes,
      deliveryMethodType: get().selectedDeliveryMethod?.type,
      deliveryAmount: get().currentMotoDeliveryAmount,
      paymentMethodType: get().selectedPaymentMethod?.type,
      customerAddress: JSON.stringify(get().currentCustomerAddress),
      orderAmount: get().orderFinalAmount,
      orderTax: get().orderTax,
      orderCurrency: get().orderCurrency,
      cartCount: get().cartCount,
      cartTotalPrice: get().cartTotalPrice,
      cartItems: get().cartItems
    };

    const formData = new FormData();
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await checkoutOrder(formData);
    console.log('Resultado action: ', response);

    if (response.success && response.waLink){
      window.open(response.waLink, '_blank')
    }
    else{
      alert('Error en el pedido... procesar error...')
    }
    
  },
}));

export default useStoreCheckout;


//------------------------------------------UTILS----------------

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

//-------------------------------------------
function getDeliveryStatics(deliveryMethods, customerCoordinates) {
  const pickupPointCoordinates = deliveryMethods.find(
    (dm) => dm.type === "pickup"
  )?.constraints?.pickupCoordinates;
  const motoDeliveryOriginCoordinates = deliveryMethods.find(
    (dm) => dm.type === "motoDelivery"
  )?.constraints?.originCoordinates;
  const motoDeliveryMaxDistanceInKms = deliveryMethods.find(
    (dm) => dm.type === "motoDelivery"
  )?.constraints?.maxDistanceInKms;
  const motoDeliveryBasePrice = deliveryMethods.find(
    (dm) => dm.type === "motoDelivery"
  )?.constraints?.pricing?.basePrice;
  const motoDeliveryDistancePricing = deliveryMethods.find(
    (dm) => dm.type === "motoDelivery"
  )?.constraints?.pricing?.distancePricing;

  
    let distancePickupPointToCustomerAddressInKms
    let distanceMotoDeliveryToCustomerAddressInKms
    let allowMotoDeliveryToCustomerAddress = false
    let deliveryAmount


  if (pickupPointCoordinates) {
    distancePickupPointToCustomerAddressInKms = getDistanceInKm(
      pickupPointCoordinates.lat,
      pickupPointCoordinates.lng,
      customerCoordinates.lat,
      customerCoordinates.lng
    );
  }

  if (motoDeliveryOriginCoordinates) {
    distanceMotoDeliveryToCustomerAddressInKms = getDistanceInKm(
      motoDeliveryOriginCoordinates.lat,
      motoDeliveryOriginCoordinates.lng,
      customerCoordinates.lat,
      customerCoordinates.lng
    );

    allowMotoDeliveryToCustomerAddress =  distanceMotoDeliveryToCustomerAddressInKms <= motoDeliveryMaxDistanceInKms;

    const segmentoDePrecioCorrespondiente = motoDeliveryDistancePricing.find((Item) => Item.from <= distanceMotoDeliveryToCustomerAddressInKms && Item.to >= distanceMotoDeliveryToCustomerAddressInKms);

    if(segmentoDePrecioCorrespondiente){
        deliveryAmount = segmentoDePrecioCorrespondiente.addPrice + motoDeliveryBasePrice;
    }
  }

  return {  
    distancePickupPointToCustomerAddressInKms,
    distanceMotoDeliveryToCustomerAddressInKms,
    allowMotoDeliveryToCustomerAddress,
    deliveryAmount
  };
}


