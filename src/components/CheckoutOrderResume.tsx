'use client'

import { useDeliveryAndPaymentStore, useCartStore  } from '@/stores'
import { useState, useEffect } from 'react'
import CheckoutService from '@/lib/CheckoutService'
export default function CheckoutOrderResume() {

  const cartTicket = useCartStore(state => state.totalPrice)
  const selectedDeliveryOption = useDeliveryAndPaymentStore(state => state.selectedDeliveryOption)

  const [currentOrderPreview, setCurrentOrderPreview] = useState({
    cartItemsCount: 0,
    cartTicketAmount: 0,
    deliveryAmount: 0,
    orderTax: 0,
    finalAmount: 0,
    currency: 'ARS'
  })
  
  useEffect(() => {
    const currentOrder = CheckoutService.getCurrentOrder()
    setCurrentOrderPreview(currentOrder)
  }, [cartTicket, selectedDeliveryOption])
  

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg">
      <h3 className="font-bold text-orange-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
        <span className="text-lg sm:text-xl">📋</span>
        Resumen del pedido
      </h3>
      <div className="space-y-1">
        <div className="flex justify-between items-center p-1 sm:p-3 hover:bg-orange-100 rounded-xl transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-orange-500 text-sm sm:text-base">🛒</span>
            <span className="whitespace-nowrap">{currentOrderPreview?.cartItemsCount} productos</span>
          </span>
          <span className="font-bold text-gray-900 text-xs sm:text-sm ml-2">${cartTicket.toFixed(2) || 0}</span>
        </div>
        {selectedDeliveryOption?.deliveryType === 'motoDelivery' && (    
        <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-orange-100 rounded-xl transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-green-500 text-sm sm:text-base">🚚</span>
            <span className="whitespace-nowrap">Envío</span>
          </span>
          <span className={`font-bold text-xs sm:text-sm ml-2 ${currentOrderPreview?.deliveryAmount === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {currentOrderPreview?.deliveryAmount === 0 ? "GRATIS" : `$${selectedDeliveryOption?.deliveryAmount.toFixed(2)}`}
          </span>
        </div>
        ) }
        <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-orange-100 rounded-xl transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-blue-500 text-sm sm:text-base">📊</span>
            <span className="whitespace-nowrap">IVA ({currentOrderPreview?.orderTax}%)</span>
          </span>
          <span className="font-bold text-gray-900 text-xs sm:text-sm ml-2">${currentOrderPreview?.orderTax.toFixed(2)}</span>
        </div>

        <div className="border-t-2 border-orange-300 pt-3">
          <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white p-3 sm:p-4 rounded-xl flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold">Total</span>
            <span className="text-lg sm:text-xl font-bold">${currentOrderPreview?.finalAmount.toFixed(2) || 0} {currentOrderPreview?.currency}</span>
          </div>
        </div>
      </div>
    </div>
  )
}