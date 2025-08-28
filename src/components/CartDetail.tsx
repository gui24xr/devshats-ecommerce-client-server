"use client"
import { LayoutModal } from "@/components"

export default function CartDetails({itemsList, isOpen, onClose}){
    return (
        <LayoutModal
            isOpen={isOpen}
            onClose={onClose}
            title="Mi Carrito"
            description="Detalle de carrito."
            minWidth="50%"
            maxWidth="50%"
        />
    )
}