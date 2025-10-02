import { create } from "zustand";
import { useBranchesStore, useCartStore } from "@/stores";
import { checkoutOrder } from "@/actions";

const useStoreCheckout = create((set, get) => ({
  isSubmitting: false,
  
  branchId: null,
  deliveryMethods: [],
  paymentMethods: [],
  motoDeliveryOriginCoordinates: null,
  pickupPointCompleteAddress: null,
  pickupPointCoordinates: null,
  motoDeliveryMaxDistanceInKms: null,
  motoDeliveryBasePrice:null,
  motoDeliveryDistancePricing: null,
  
  
  selectedDeliveryMethod: null,
  selectedPaymentMethod: null,
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
  /*
  resumeObject:  {
      orderData: [
        {
          id: 1,
          label: "Nombre",
          emoji: "👤",
          value: get().customerName || "Completar nombre.",
        },
        {
          id: 2,
          label: "Teléfono",
          emoji: "📞",
          value: get().customerPhone || "Completar telefono.",
        },
        {
          id: 3,
          label: "Email",
          emoji: "📧",
          value: get().customerEmail || "Completar email.",
        },
        {
          id: 4,
          label: "Forma de retiro/entrega",
          emoji: "🚚",
          value:
            getDeliveryMethodLabel(get().selectedDeliveryMethodType) ||
            "Completar forma de retiro/entrega.",
        },
        {
          id: 5,
          label: "Forma de pago",
          emoji: "💳",
          value:
            getPaymenthMethodLabel(get().selectedPaymentMethodType) ||
            "Completar forma de pago.",
        },
        {
          id: 6,
          label:
            get().selectedDeliveryMethodType === "motoDelivery"
              ? "Dirección de entrega"
              : get().selectedDeliveryMethodType === "pickup"
              ? "Dirección de retiro"
              : "Dirección de entrega/retiro",
          emoji: "📍",
          value:
            get().selectedDeliveryMethodType === "motoDelivery"
              ? get().currentCustomerAddress.completeAddress ||
                "Completar dirección de entrega."
              : get().selectedDeliveryMethodType === "pickup"
              ? getPickupPointCompleteAddress() ||
                "Consultar dirección de retiro."
              : "Completar dirección de entrega/retiro.",
        },
        {
          id: 7,
          label: "Notas",
          emoji: "📝",
          value: get().notes || "Sin notas adicionales.",
        },
      ],
    },
  */

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
      const foundDeliveryMethod = get().deliveryMethods.find(
        (deliveryMethod) => deliveryMethod.type === deliveryMethodType
      );
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
      selectedDeliveryMethod: get().deliveryMethods.find(
        (deliveryMethod) => deliveryMethod.type === "pickup"
      ),
    });

    get().calculateOrderAmount();
  },

  onSelectMotoDeliveryDeliveryMethod: () => {
    set({
      selectedDeliveryMethod: get().deliveryMethods.find(
        (deliveryMethod) => deliveryMethod.type === "motoDelivery"
      ),
    });
    get().calculateOrderAmount();
  },

  selectPaymentMethod: (paymentMethodType: string) => {
    try {
      const foundPaymentMethod = get().paymentMethods.find(
        (paymentMethod) => paymentMethod.type === paymentMethodType
      );
      set({
        selectedPaymentMethod: foundPaymentMethod,
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
    } = getDeliveryStatics({ 
      customerCoordinates: customerCoordinates,
      pickupPointCoordinates: get().pickupPointCoordinates,
      motoDeliveryOriginCoordinates: get().motoDeliveryOriginCoordinates,
      motoDeliveryMaxDistanceInKms: get().motoDeliveryMaxDistanceInKms,
      motoDeliveryBasePrice: get().motoDeliveryBasePrice,
      motoDeliveryDistancePricing: get().motoDeliveryDistancePricing
  });

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

    get().calculateOrderAmount();

    //----------------------------------------------------------
  },

  onChangeCart({ cartItemsCount, cartTicketAmount, cartItems }) {
    set({
      cartItemsCount: cartItemsCount,
      cartTicketAmount: cartTicketAmount,
      cartItems: cartItems,
    });
    get().calculateOrderAmount();
  },

  submitOrder: async () => {
    
   
    const orderData = {
      branchId: get().branchId,
      customerName: get().customerName,
      customerPhone: get().customerPhone,
      customerEmail: get().customerEmail,
      notes: get().notes,
      selectedDeliveryMethodType: get().selectedDeliveryMethod?.type,
      selectedPaymentMethodType: get().selectedPaymentMethod?.type,
      customerCompleteAddress: get().currentCustomerAddress?.completeAddress,
      customerCoordinates: get().currentCustomerAddress?.coordinates,
      cartItems: get().cartItems,
    }

   

    const response = await checkoutOrder(orderData);
    console.log("Resultado action: ", response);
    console.log("Resultado action emonki: ", '📞');

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
    const currentCartTicketAmount = get().cartTicketAmount;

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


useCartStore.subscribe((state, prevState) => {
  console.log("El precio del carrito cambio", state.ticket.totalPrice);
  useStoreCheckout.getState().onChangeCart({
    cartItemsCount: state.itemsCount,
    cartTicketAmount: state.ticket.totalPrice,
    cartItems: state.items,
  });
});


useBranchesStore.subscribe((state, prevState) => {
  useStoreCheckout.setState({
    branchId: state.id,
    deliveryMethods: state.deliveryMethods,
    paymentMethods: state.paymentMethods,
    motoDeliveryOriginCoordinates: state.deliveryMethods?.find(
      (dm) => dm.type === "motoDelivery"
    )?.constraints?.originCoordinates,
    pickupPointCompleteAddress: state.deliveryMethods.find(
      (dm) => dm.type === "pickup"
    )?.constraints?.pickupPointCompleteAddress,
    motoDeliveryMaxDistanceInKms : state.deliveryMethods.find(
    (dm) => dm.type === "motoDelivery")?.constraints?.maxDistanceInKms,
    motoDeliveryBasePrice : state.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.basePrice,
    motoDeliveryDistancePricing : state.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.distancePricing
  });
});

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
