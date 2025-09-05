import { create } from "zustand";

const useProductBuilderStore = create((set, get) => ({
    currentProduct: null,
    resetCurrentProduct: (product: any,) => {
        set({ currentProduct: product })
    },



    
}))

export default useProductBuilderStore;