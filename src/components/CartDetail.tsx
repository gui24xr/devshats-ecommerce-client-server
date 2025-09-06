"use client"
import { useEffect } from "react"

export default function CartDetails({itemsList}: any){

    useEffect(() => {
        console.log(itemsList)
    }, [itemsList])

    return (
      <div>
        <h1>Cart Details</h1>
       
      </div>
    )
}