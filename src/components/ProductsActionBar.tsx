'use client'
import { ShoppingCart, List } from 'lucide-react'
import { useCartStore, useModalsStore } from '@/stores'

export default function ProductsActionBar() {
  const itemsCount = useCartStore((state) => state.itemsCount)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const showCartModal = useModalsStore((state) => state.showCartModal)
  const showProductsByCategoriesCatalogModal = useModalsStore((state) => state.showProductsByCategoriesCatalogModal)

  return (
    <div className="sticky bottom-0 bg-gradient-to-r from-orange-500 to-red-500 shadow-2xl p-3 border-t-2 border-orange-600">
      <div className="flex items-center justify-between gap-3">
        {/* Botón Catálogo Rápido */}
        <button
          type="button"
          onClick={() => showProductsByCategoriesCatalogModal()}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <List className="w-5 h-5" />
          <span className="hidden sm:inline">Catálogo Rápido</span>
          <span className="sm:hidden">Catálogo</span>
        </button>

        {/* Info del Carrito */}
        <div className="bg-white/10 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="text-xs leading-tight">{itemsCount} items</span>
              <span className="text-sm font-bold leading-tight">${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Botón Ver Carrito */}
        <button
          type="button"
          onClick={() => showCartModal()}
          className="flex-1 bg-white hover:bg-gray-100 text-orange-600 font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Ver Carrito</span>
          <span className="sm:hidden">Carrito</span>
        </button>
      </div>
    </div>
  )
}