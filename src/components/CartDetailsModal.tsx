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
            titleIcon={'🛒'}
            description="Detalle de carrito."
            content={<CartDetails/>}
            showHeader={false}
        />)
}