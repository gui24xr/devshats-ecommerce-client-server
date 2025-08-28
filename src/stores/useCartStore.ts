import { MenuItems } from "@headlessui/react";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
    items: [],
    itemsCount: 0,

    addToCart: ({ product, quantity, onSuccess, onError }:any) => {
        try {
            set((state:any) => {
                const updatedItemsList = [...state.items, {product, quantity}]
                return { 
                    items: updatedItemsList,
                    itemsCount: updatedItemsList.length 
                }
            })
            if (onSuccess) onSuccess()
        } catch (error) {
            if (onError) onError(error)
        }
    },
    removeFromCart: null
}));

export default useCartStore;