import { create } from "zustand";
import { Branch, MappedBranch } from "@/types";

interface BranchesStoreState {
    branches: MappedBranch[];
    selectedBranch: MappedBranch | null;
    loading: boolean;
    error: string | null;
    loaded: boolean;

    // Methods
    hydrateAndConfigBranches: (branchesData: Branch[]) => void;
    changeSelectedBranch: (branchId: string) => void;
}

const useBranchesStore = create<BranchesStoreState>((set, get) => ({
    branches: [],
    selectedBranch: null,
    loading: true,
    error: null,
    loaded: false,

    hydrateAndConfigBranches: (branchesData: Branch[]) => {
         set({loading: true})
        try{
           const mappedBrancheData: MappedBranch[] = branchesData.map((branchItem) => {
                const pickupMethod = branchItem.deliveryMethods.find((dm) => dm.type === "pickup");
                const motoMethod = branchItem.deliveryMethods.find((dm) => dm.type === "motoDelivery");

                return {
                    ...branchItem,
                    pickupPointCompleteAddress: pickupMethod?.type === 'pickup' ? pickupMethod.constraints.pickupPointCompleteAddress : undefined,
                    pickupPointCoordinates: pickupMethod?.type === 'pickup' ? pickupMethod.constraints.pickupCoordinates : undefined,
                    motoDeliveryOriginCoordinates: motoMethod?.type === 'motoDelivery' ? motoMethod.constraints.originCoordinates : undefined,
                    motoDeliveryMaxDistanceInKms: motoMethod?.type === 'motoDelivery' ? motoMethod.constraints.maxDistanceInKms : undefined,
                    motoDeliveryBasePrice: motoMethod?.type === 'motoDelivery' ? motoMethod.constraints.pricing.basePrice : undefined,
                    motoDeliveryDistancePricing: motoMethod?.type === 'motoDelivery' ? motoMethod.constraints.pricing.distancePricing : undefined,
                };
           })
            set({branches: mappedBrancheData})
            get().changeSelectedBranch(branchesData[0].id)
        }catch(error){
            console.error(error);
            throw error;
        }finally{
            set({loading: false})
        }
    },

    changeSelectedBranch: (branchId: string) => {
        set({loading: true})
        try{
            const foundedBranch = get().branches.find((branch) => branch.id === branchId)
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


export default useBranchesStore;