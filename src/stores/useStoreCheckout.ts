import { create } from "zustand";
import { useBranchesStore, useCartStore } from "@/stores";
import { checkoutOrder } from "@/actions";

const useStoreCheckout = create((set, get) => ({
  selectedDeliveryMethodType: null,
  selectedPaymnentMethodType: null,
  customerName: null,
  customerPhone: null,
  customerEmail: null,
  currentCustomerAddress: {
    completeAddress: null,
    coordinates: null,
  },
  notes: null,

  cartItemsCount: 0,
  cartTicketAmount: 0,
  cartItems: [],
  orderDeliveryAmount: 0,
  orderTax: 0,
  orderCurrency: "ARS",
  orderFinalAmount: 0,

  showDeliveryAddressAndRadioForm: false,
  distancePickupPointToCustomerAddressInKms: null,
  distanceMotoDeliveryToCustomerAddressInKms: null,
  allowMotoDeliveryToCustomerAddress: false,

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

  selectDeliveryMethod: (deliveryMethodType: string) => {
    try {
      const foundDeliveryMethod =
        getCurrentBranchDeliveryMethodsByType(deliveryMethodType);
      switch (foundDeliveryMethod.type) {
        case "pickup":
          get().onSelectPickupDeliveryMethod();
          break;
        case "motoDelivery":
          get().onSelectMotoDeliveryDeliveryMethod();
          break;
      }
    } catch (error) {
      throw error;
    }
  },

  onSelectPickupDeliveryMethod: () => {

    set({
      selectedDeliveryMethodType: "pickup",
      
    });

    get().calculateOrderAmount()
  },

  onSelectMotoDeliveryDeliveryMethod: () => {
    set({
      
      selectedDeliveryMethodType: "motoDelivery",
    });
     get().calculateOrderAmount()
  },

  selectPaymentMethod: (paymentMethodType: string) => {
    try {
      const foundPaymentMethod =
        getCurrentBranchPaymentMethodsByType(paymentMethodType);
      set({
        selectedPaymentMethodType: foundPaymentMethod.type,
      });
    } catch (error) {
      throw error;
    }
  },

  setNotes: (notes: string) => {
    set({ notes: notes });
  },

  setShowDeliveryAddressAndRadioForm: (show: boolean) => {
    set({ showDeliveryAddressAndRadioForm: show });
  },

  setCustomerAddress: ({ completeAddress, customerCoordinates }) => {
    const {
      distanceMotoDeliveryToCustomerAddressInKms,
      distancePickupPointToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress,
      deliveryAmount,
    } = getDeliveryStatics(customerCoordinates);

    console.log("Statics : ", {
      distanceMotoDeliveryToCustomerAddressInKms:
        distanceMotoDeliveryToCustomerAddressInKms,
      distancePickupPointToCustomerAddressInKms:
        distancePickupPointToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress: allowMotoDeliveryToCustomerAddress,
      deliveryAmount: deliveryAmount,
    });

    if (!allowMotoDeliveryToCustomerAddress) {
      alert("La dirección está fuera del área de entrega en moto.");
      return;
    }

    set({
      currentCustomerAddress: {
        completeAddress: completeAddress,
        coordinates: customerCoordinates,
      },
      distancePickupPointToCustomerAddressInKms:
        distancePickupPointToCustomerAddressInKms,
      distanceMotoDeliveryToCustomerAddressInKms:
        distanceMotoDeliveryToCustomerAddressInKms,
      allowMotoDeliveryToCustomerAddress: allowMotoDeliveryToCustomerAddress,

      showDeliveryAddressAndRadioForm: false,
      orderDeliveryAmount: deliveryAmount,
    });

      get().calculateOrderAmount()

    //----------------------------------------------------------
  },

  submitOrder: async () => {
    console.log("estado", get());

    const orderData = {
      branchId: getSelectedBranchId(),
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
      cartCount: getCartCurrentData().cartCount,
      cartTotalPrice: getCartCurrentData().cartTotalPrice,
      cartItems: getCartCurrentData().cartItems,
    };

    const formData = new FormData();
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await checkoutOrder(formData);
    console.log("Resultado action: ", response);

    if (response.success && response.waLink) {
      window.open(response.waLink, "_blank");
    } else {
      alert("Error en el pedido... procesar error...");
    }
  },

  calculateOrderAmount: () => {
   
    const currentCartTicketAmount = get().cartTicketAmount 

    const deliveryAmount =
      get().selectedDeliveryMethodType === "motoDelivery"
        ? get().orderDeliveryAmount
        : 0;  

        console.log('DeliveryAmountJJJJ', deliveryAmount)

    set({
      orderFinalAmount: Number(currentCartTicketAmount) + Number(deliveryAmount),
      
    });
  },


}));

useCartStore.subscribe((state, prevState) => {
  
    console.log("El precio del carrito cambio", state.ticket.totalPrice);
    useStoreCheckout.setState({
      cartItemsCount: state.itemsCount,
      cartTicketAmount: state.ticket.totalPrice,
      cartItems: state.items,
    });

    useStoreCheckout.getState().calculateOrderAmount();

  
  
});

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

//helpers

function getDeliveryStatics(customerCoordinates) {
  const deliveryMethods = useBranchesStore.getState().deliveryMethods;
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
    );
  }

  if (motoDeliveryOriginCoordinates) {
    distanceMotoDeliveryToCustomerAddressInKms = getDistanceInKm(
      motoDeliveryOriginCoordinates.lat,
      motoDeliveryOriginCoordinates.lng,
      customerCoordinates.lat,
      customerCoordinates.lng
    );

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

function getCurrentBranchDeliveryMethodsByType(methodType) {
  const foundDeliveryMethod = useBranchesStore
    .getState()
    .deliveryMethods?.find((dm) => dm.type === methodType);

  if (!foundDeliveryMethod) throw new Error("Delivery method not found");
  return {
    type: foundDeliveryMethod.type,
    enabled: foundDeliveryMethod.enabled,
  };
}

function getCurrentBranchPaymentMethodsByType(methodType) {
  const foundPaymentMethod = useBranchesStore
    .getState()
    .paymentMethods?.find((pm) => pm.type === methodType);

  if (!foundPaymentMethod) throw new Error("Payment method not found");
  return {
    type: foundPaymentMethod.type,
    enabled: foundPaymentMethod.enabled,
  };
}

function getCartCurrentData() {
  const cartItemsCount = useCartStore.getState().itemsCount;
  const cartTotalPrice = useCartStore.getState().ticket.totalPrice;
  const cartItems = useCartStore.getState().items;
  return { cartItemsCount, cartTotalPrice, cartItems };
}

function getSelectedBranchId() {
  const foundedBranch = useBranchesStore.getState().id;
  if (!foundedBranch) throw new Error("Branch not found");
  return foundedBranch;
}
