import { create } from "zustand";
import { useBranchesStore } from "@/stores";

const useStoreCheckout = create((set, get) => ({
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    customerAddress: null,
    notes: null,
    deliveryMethods: [], //Se refiere al metodo de entrega
    selectedDeliveryMethod: null,
    allowedDeliveryMethodsTypes: [],
    allowedPaymentMethodsTypes: [],
    selectedBranch: null,
    selectedPaymentMethod: null,
    showDeliveryRadioForm: false,
    formData: {
        customerName: null,
        customerPhone: null,
        customerEmail: null,
        customerAddress: null,
        notes: null,
        deliveryMethod: null,
        branch: null,
        
    },

    initializeCheckout: () => {
        //console.log('initializeCheckout',useBranchesStore.getState().selectedBranch)
        const { deliveryMethods, allowedDeliveryMethodsTypes } = useBranchesStore.getState().selectedBranch
        set({ 
            deliveryMethods: deliveryMethods, 
            selectedDeliveryMethod: deliveryMethods[0], 
            allowedDeliveryMethodsTypes: allowedDeliveryMethodsTypes
            
        })

    },

    setSelectedDeliveryMethod: (deliveryMethodType: any) => {
        const selectedDeliveryMethod = get().deliveryMethods.find((deliveryMethod: any) => deliveryMethod.type === deliveryMethodType)
        set({ selectedDeliveryMethod: selectedDeliveryMethod})
        
        if (selectedDeliveryMethod.type === "moto_delivery") {
            set({ showDeliveryRadioForm: true, })
        } 
        if (selectedDeliveryMethod.type === "pickup") {
            set({ showDeliveryRadioForm: false,  })
            set({ formData: { ...get().formData, deliveryMethod: selectedDeliveryMethod.type, branch: get().selectedBranch } })
            console.log('formData : ', get().formData)
        } 
    },

    setCustomerAddress: (address: string) => {
        console.log('address : ', address)
        set({ formData: { ...get().formData, customerAddress: address } })
    }

}))

export default useStoreCheckout;