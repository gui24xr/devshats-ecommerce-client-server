import { create } from "zustand";

const useBranchesStore = create((set, get) => ({
    branches: [],
    selectedBranch: null,
    loading: true,
    error: null,
    loaded: false,
    
    hydrateAndConfigBranches: (branchesData: any) => {
         set({loading: true})
        try{
           
            set({branches: branchesData})
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
        set({
            selectedBranch:{
                id: foundedBranch.id,
                name: foundedBranch.name,
                active: foundedBranch.active,
                addressData: foundedBranch.addressData,
                contactData: foundedBranch.contactData,
                workingHours: foundedBranch.workingHours,
                waMessagePhone: foundedBranch.waMessagePhone,
                deliveryMethods: foundedBranch.deliveryMethods,
                paymentMethods: foundedBranch.paymentMethods,
                 

                pickupPointCompleteAddress: foundedBranch.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupPointCompleteAddress,

                pickupPointCoordinates: foundedBranch.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupCoordinates,

                motoDeliveryOriginCoordinates: foundedBranch.deliveryMethods?.find((dm) => dm.type === "motoDelivery")?.constraints?.originCoordinates, 

                motoDeliveryMaxDistanceInKms: foundedBranch.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.maxDistanceInKms,
                
                motoDeliveryBasePrice: foundedBranch.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.basePrice,

                motoDeliveryDistancePricing: foundedBranch.deliveryMethods.find((dm) => dm.type === "motoDelivery")?.constraints?.pricing?.distancePricing,

               

            }
        })
        }catch(error){
            console.error(error);
            throw error;
        }finally{
            set({loading: false})
        }
        
    }
}));

export default useBranchesStore;