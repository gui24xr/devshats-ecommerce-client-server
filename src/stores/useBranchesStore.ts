import { create } from "zustand";
import  {useDeliveryAndPaymentOptionsStore, useStoreCheckout } from "@/stores";

const useBranchesStore = create((set, get) => ({
    branches: [],
    selectedBranch: null,
    loading: true,
    error: null,
    loaded: false,
    
    hydrateAndConfigBranches: (branchesData: any) => {
         set({loading: true})
        try{
           const mappedBrancheData = branchesData.map((branchItem: any) => ({
                id: branchItem.id,
                name: branchItem.name,
                active: branchItem.active,
                addressData: branchItem.addressData,
                contactData: branchItem.contactData,
                workingHours: branchItem.workingHours,
                waMessagePhone: branchItem.waMessagePhone,
                deliveryMethods: branchItem.deliveryMethods,
                paymentMethods: branchItem.paymentMethods,
                pickupPointCompleteAddress: branchItem.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupPointCompleteAddress,
                pickupPointCoordinates: branchItem.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupCoordinates,
                motoDeliveryOriginCoordinates: branchItem.deliveryMethods?.find((dm) => dm.type === "motoDelivery")?.constraints?.originCoordinates, 
                motoDeliveryMaxDistanceInKms: branchItem.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.maxDistanceInKms,
                motoDeliveryBasePrice: branchItem.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.basePrice,
                motoDeliveryDistancePricing: branchItem.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.distancePricing,

                
           })) 
            set({branches: mappedBrancheData})
            get().changeSelectedBranch(branchesData[0].id)
        }catch(error){
            console.error(error);
            throw error;
        }finally{
            set({loading: false})
        }
    },

    changeSelectedBranch: (branchId: any) => {
        set({loading: true})
        try{
            const foundedBranch = get().branches.find((branch: any) => branch.id === branchId)
        if (!foundedBranch) {
            alert('Branch not found')
            return;
        }
        set({selectedBranch: foundedBranch})
        }catch(error){
            console.error(error);
            throw error;
        }finally{
            set({loading: false})
        }
        
    }
}));


useBranchesStore.subscribe((state, prevState) => {
    console.log("Store delivery options reaccionando a cambio de store branches's state");
    useStoreCheckout.getState().onChangeBranches();
});

export default useBranchesStore;