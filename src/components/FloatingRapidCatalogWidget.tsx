"use client"
import { useProductsStore, useModalsStore } from "../stores";


export default function FloatingRapidCatalogWidget() {

    const productsQuantity = useProductsStore(state => state.filteredProducts.length)
    const showCatalogModal = useModalsStore((state) => state.showCatalogModal);

    const handleClick = () => { 
      showCatalogModal()
    }
    return (
      <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-50">
        <button
          onClick={handleClick}
          className="relative bg-cyan-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group touch-manipulation"
        >
          {/* Emoji del catálogo */}
          <span className="text-xl sm:text-2xl group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
            📋
          </span>
          
          {/* Badge con contador */}
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-xs font-bold rounded-full min-w-5 h-5 sm:min-w-6 sm:h-6 flex items-center justify-center px-1 shadow-md">
            <span className="text-xs sm:text-xs">
              {productsQuantity > 99 ? '99+' : productsQuantity}
            </span>
          </span>
        </button>
      </div>
    );
  }