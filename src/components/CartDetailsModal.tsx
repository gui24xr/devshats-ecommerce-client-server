'use client'
import { LayoutModal, CartDetails } from "./index";
import { useModalsStore } from "@/stores";

export default function CartDetailsModal() {
    
    const cartModalIsOpen = useModalsStore(state => state.cartModalIsOpen)
    const hideCartModal = useModalsStore(state => state.hideCartModal)
    return ( 
        <LayoutModal
            isOpen={cartModalIsOpen}
            onClose={hideCartModal}
            title="Mi Carrito"
            description="Detalle de carrito."
            minWidth="w-full"
            maxWidth="max-w-full"
            content={<CartDetails/>}
        />)
}