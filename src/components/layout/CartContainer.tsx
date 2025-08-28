"use client"
import { useEffect, useMemo, useState } from "react";
import { LayoutModal, FloatingCartWidget, CartDetails } from '../index'
import { useCartStore } from "@/stores";

export default function CartContainer(){

    const cartItems = useCartStore(state => state.items)
    const itemsCount = useCartStore(state => state.itemsCount)

    const [cartModalIsOpen, setCartModalIsOpen] = useState(false)

    const {PartA,PartB} = MyComponent()

    return(
        <>
            <FloatingCartWidget itemCount={itemsCount} showCartDetail={setCartModalIsOpen}/>
            

            <LayoutModal
              isOpen={cartModalIsOpen}
              onClose={setCartModalIsOpen}
              title="Mi Carrito"
              description="Detalle de carrito."
              minWidth="w-1/2"
              maxWidth="max-w-2xl"
              content={<PartA/>}
              footer={<PartB/>}
            />
        </>
    )
}



function MyComponent(){

    const PartA = () => <div>Part A</div>
    const PartB = () => <div>Part B</div>

    return { PartA, PartB}
}

/*
<CartDetails 
              itemsList={cartItems}
              isOpen={cartModalIsOpen}
              onClose={setCartModalIsOpen}
            />



*/