"use client"
import { useEffect, useMemo, useState } from "react";
import { LayoutModal, FloatingCartWidget, CartDetails } from '../index'
import { useCartStore, useStoreTemplateConfig } from "@/stores";

export default function CartContainer(){


    const planSettings = useStoreTemplateConfig(state => state.planSettings)
    const cartItems = useCartStore(state => state.items)
    const itemsCount = useCartStore(state => state.itemsCount)
    const setQuantity = useCartStore(state => state.setQuantity)
    const [cartModalIsOpen, setCartModalIsOpen] = useState(false)

    const {PartA,PartB} = MyComponent()

    if(planSettings.type === "plan_small"){
        return null
    }

    return(
        <>
            <FloatingCartWidget itemCount={itemsCount} showCartDetail={setCartModalIsOpen}/>
            

            <LayoutModal
              isOpen={cartModalIsOpen}
              onClose={setCartModalIsOpen}
              title="Mi Carrito"
              description="Detalle de carrito."
              minWidth="w-full"
              maxWidth="max-w-full"
              content={<CartDetails itemsList={cartItems} setQuantity={setQuantity} />}
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