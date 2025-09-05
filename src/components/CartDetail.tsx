"use client"
import { useEffect } from "react"

export default function CartDetails({itemsList}: any){

    useEffect(() => {
        console.log(itemsList)
    }, [itemsList])

    return (
      <div>
        <h1>Cart Details</h1>
       {itemsList.map((item: any) => (
        <div key={item.itemCartId}>
          <h2>{item.product.name}</h2>
          <p>{item.quantity}</p>
        </div>
       ))}
      </div>
    )
}