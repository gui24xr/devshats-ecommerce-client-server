"use client"
import { useEffect } from "react"
import { CartCheckoutActionButtons, CheckoutForm, CheckoutOrderResume, PremiumTrustIndicators, CartEmpty } from "@/components"
import { useCartStore, useStoreCheckout } from "@/stores"


export default function CartCheckout() {

    const itemsCount = useCartStore(state => state.itemsCount)
    const ticket = useCartStore(state => state.ticket)

    if (itemsCount === 0) {
        return <CartEmpty onClose={() => { }} />
    }

    const orderInitialData = {
        itemsCount: itemsCount,
        ticket: ticket,
    }
    const initializeCheckout = useStoreCheckout(state => state.initializeCheckout)

    useEffect(() => {
        initializeCheckout()
    }, [])

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-12 lg:p-12 bg-gradient-to-b from-orange-50/50 to-white">
            {/* Premium Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Emoji a la izquierda */}
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-lg sm:text-2xl">🌭</span>
                    </div>

                    {/* Título y descripción a la derecha */}
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-1">
                            Finalizar Pedido
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm">
                            Completa tus datos para procesar tu orden
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                <div className="order-1 lg:order-1 px-2 sm:px-4 lg:px-8">
                    <CheckoutForm formData={{}} handleInputChange={(name, value) => { }} errors={{}} />
                </div>
                <div className="order-2 lg:order-2 px-2 sm:px-4 lg:px-8 flex flex-col gap-4">
                    <CheckoutOrderResume cartCount={0} subtotal={0} tax={0} deliveryFee={0} total={0} />
                    <PremiumTrustIndicators />
                    <CartCheckoutActionButtons ordersInitialData={orderInitialData} handleSubmit={() => { }} isSubmitting={false} onClose={() => { }} />
                </div>

            </div>
        </div>
    )
}



