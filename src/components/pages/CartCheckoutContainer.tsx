"use client"
import React from 'react'
import { CheckoutForm, CartCheckoutHeader } from '@/components'
import { useRouter } from 'next/navigation'

export default async function CartCheckoutContainer() {
    const router = useRouter()

    const handleClose = () => {
        router.push("/")
    }


  return (
    <div className="min-h-screen bg-gray-50">
        
        <CartCheckoutHeader onClose={handleClose} />
        <CheckoutForm />
    </div>
  )
}