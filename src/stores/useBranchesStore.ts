import { create } from "zustand";
import axios from "axios";

// URL base dinámica que funciona tanto en localhost como en ngrok
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // En el cliente, usar la URL actual
        return window.location.origin;
    }
    // En el servidor, usar localhost por defecto
    return 'http://localhost:3000';
};


const useBranchesStore = create((set, get) => ({
    branches: [],
    selectedBranch: null,
    loading: true,
    error: null,
    loaded: false,

    fetchBranches: async () => {
        set({ loading: true, error: null });
        try {
            const baseUrl = getBaseUrl();
            const { data } = await axios.get(`${baseUrl}/api/branches`);
            console.log('data branches : ', data.branches)
            set({ branches: data.branches });
        } catch (error) {
            set({ error: error });
        } finally {
            set({ loading: false });
        }
    },
    initializeBranchConfig: () => {
        set({ selectedBranch: get().branches[0] })
        console.log('selectedBranch : ', get().selectedBranch)
    },
    changeSelectedBranch: (branchId: any) => {
        const branch = get().branches.find((branch: any) => branch.id === branchId)
        if (!branch) {
            alert('Branch not found')
            return;
        }
        set({
            selectedBranch: {
                id: branch.id,
                name: branch.name,
                address: branch.address,
                coordinates: branch.coordinates,
                phones: branch.phones,
                waMessagePhone: branch.waMessagePhone,
                workingHours: branch.workingHours,
                deliveryMethods: branch.deliveryMethods,
            }
        })
    }
}));

export default useBranchesStore;