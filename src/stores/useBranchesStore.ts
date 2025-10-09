import { create } from "zustand";

const useBranchesStore = create((set, get) => ({
    branches: [],
    selectedBranch: null,
    loading: true,
    error: null,
    loaded: false,

    id: null,
    name: null,
    active: null,
    addressData: null,
    contactData: null,
    workingHours: null,
    waMessagePhone: null,
    deliveryMethods: [],
    paymentMethods: [],
    
    hydrateAndConfigBranches: (branchesData: any) => {
        try{
            set({branches: branchesData})
            set({
                id: branchesData[0].id,
                name: branchesData[0].name,
                active: branchesData[0].active,
                addressData: branchesData[0].addressData,
                contactData: branchesData[0].contactData,
                workingHours: branchesData[0].workingHours,
                waMessagePhone: branchesData[0].waMessagePhone,
                deliveryMethods: branchesData[0].deliveryMethods,
                paymentMethods: branchesData[0].paymentMethods,
            })
        }catch(error){
            console.error(error);
            throw error;
        }
    },

    changeSelectedBranch: (branchId: any) => {
        const foundedBranch = get().branches.find((branch: any) => branch.id === branchId)
        if (!foundedBranch) {
            alert('Branch not found')
            return;
        }
        set({
            selectedBranch: {
                id: foundedBranch.id,
                name: foundedBranch.name,
                address: foundedBranch.address,
                coordinates: foundedBranch.coordinates,
                phones: foundedBranch.phones,
                waMessagePhone: foundedBranch.waMessagePhone,
                workingHours: foundedBranch.workingHours,
                deliveryMethods: foundedBranch.deliveryMethods,
            }
        })
    }
}));

export default useBranchesStore;