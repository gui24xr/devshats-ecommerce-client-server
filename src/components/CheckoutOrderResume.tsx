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
    <div className="sticky bottom-0 bg-gradient-to-br from-orange-50 to-red-50 border-t-2 border-orange-600 p-2 sm:p-3 shadow-2xl">
      <h3 className="font-bold text-orange-900 mb-2 text-sm sm:text-base flex items-center gap-1.5">
        <span className="text-base sm:text-lg">📋</span>
        Resumen del pedido
      </h3>
      <div className="space-y-0">
        <div className="flex justify-between items-center py-1 px-2 hover:bg-orange-100 rounded-md transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1.5 text-xs">
            <span className="text-orange-500 text-sm">🛒</span>
            <span className="whitespace-nowrap">{currentOrderPreview?.cartItemsCount} productos</span>
          </span>
          <span className="font-bold text-gray-900 text-xs ml-2">${cartTicket.toFixed(2) || 0}</span>
        </div>
        {selectedDeliveryOption?.deliveryType === 'motoDelivery' && (
        <div className="flex justify-between items-center py-1 px-2 hover:bg-orange-100 rounded-md transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1.5 text-xs">
            <span className="text-green-500 text-sm">🚚</span>
            <span className="whitespace-nowrap">Envío</span>
          </span>
          <span className={`font-bold text-xs ml-2 ${currentOrderPreview?.deliveryAmount === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {currentOrderPreview?.deliveryAmount === 0 ? "GRATIS" : `$${selectedDeliveryOption?.deliveryAmount.toFixed(2)}`}
          </span>
        </div>
        ) }
        <div className="flex justify-between items-center py-1 px-2 hover:bg-orange-100 rounded-md transition-all duration-300">
          <span className="text-gray-700 flex items-center gap-1.5 text-xs">
            <span className="text-blue-500 text-sm">📊</span>
            <span className="whitespace-nowrap">IVA ({currentOrderPreview?.orderTax}%)</span>
          </span>
          <span className="font-bold text-gray-900 text-xs ml-2">${currentOrderPreview?.orderTax.toFixed(2)}</span>
        </div>

        <div className="border-t border-orange-300 pt-2 mt-1">
          <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white py-2 px-3 rounded-lg flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold">Total</span>
            <span className="text-sm sm:text-base font-bold">${currentOrderPreview?.finalAmount.toFixed(2) || 0} {currentOrderPreview?.currency}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>❌</span>
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>📱</span>
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function handleCancel() {
  // Navigate back or close checkout
  window.history.back()
}