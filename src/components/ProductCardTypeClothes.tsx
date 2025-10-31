'use client'
import { useState, useEffect } from "react"
import { useProductBuilderStore } from "@/stores"
import { ProductsHelpers } from "@/utils"

export default function ProductCardTypeClothes({ product, defaultProductImage }: any) {
  const [imageError, setImageError] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState(ProductsHelpers.getInitialVariantId(product))
  const [priceData, setPriceData] = useState(ProductsHelpers.getProductPrice(product, selectedVariantId))

  const handlerProductToAddToCart = useProductBuilderStore(state => state.handlerProductToAddToCart)

  useEffect(() => {
    setPriceData(ProductsHelpers.getProductPrice(product, selectedVariantId))
  }, [selectedVariantId])

  const onSelectVariant = (variantId: any) => {
    setSelectedVariantId(variantId)
  }

  const handleAddToCart = () => {
    handlerProductToAddToCart({
      productId: product.id,
      selectedVariantId,
      quantity: 1,
      onSuccess: () => {},
      onError: (error: any) => console.error('Error adding to cart:', error)
    })
  }

  return (
    <div className="relative w-full bg-[#F5F5F5] shadow-[5px_5px_15px_rgba(186,126,126,0.5)] rounded-[10px] overflow-hidden flex flex-row h-[320px]">

      {/* Left Section - Image + Size Selector (55% width) */}
      <div className="w-[55%] h-full flex flex-col flex-shrink-0">

        {/* Image Container */}
        <div className="relative h-[70%] bg-gradient-to-br from-pink-50 to-pink-100">
          <img
            src={imageError ? defaultProductImage : (product?.images[0]?.url || defaultProductImage)}
            alt={product?.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />

          {/* Badge Popular - Esquina superior izquierda pequeño */}
          {product?.features?.isPopular && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <span>🔥</span>
                <span>Popular</span>
              </div>
            </div>
          )}

          {/* Badge NUEVO - Cintilla diagonal roja esquina superior izquierda */}
          {product?.features?.isNew && (
            <div className="absolute top-0 left-0 z-10 overflow-hidden w-24 h-24">
              <div className="absolute top-3 -left-8 bg-red-600 text-white text-center w-32 py-1 transform -rotate-45 shadow-lg">
                <span className="text-[10px] font-bold">NUEVO</span>
              </div>
            </div>
          )}

          {/* Descuento - Badge verde en esquina inferior derecha */}
          {priceData?.discount && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                -{priceData.discount.toFixed(0)}%
              </div>
            </div>
          )}
        </div>

        {/* Size Selector Below Image */}
        <div className="h-[30%] p-3 flex flex-col justify-center space-y-2">
          {/* Template Variant Label */}
          {product?.templateVariant?.options && (
            <>
              <p className="text-[10px] text-[#BA7E7E] tracking-wider uppercase">
                {product.templateVariant.name || 'choose size'}
              </p>

              {/* Size Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {product.templateVariant.options.map((option: any) => (
                  <div
                    key={option.id}
                    onClick={() => onSelectVariant(option.id)}
                    className={`py-1.5 px-1 border text-[10px] text-center cursor-pointer transition-all duration-[400ms] ease-in-out uppercase ${
                      selectedVariantId === option.id
                        ? 'bg-[#BA7E7E] text-white border-[#BA7E7E]'
                        : 'border-[#E0C9CB] text-[#D9AAB7] hover:bg-[#BA7E7E] hover:text-white'
                    }`}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Product Info */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">

        {/* Top content */}
        <div className="space-y-2">
          {/* Category */}
          {product?.category && (
            <p className="text-xs text-[#BA7E7E] tracking-wider uppercase">
              {product.category}
            </p>
          )}

          {/* Title */}
          <h1 className="text-base font-bold text-[#4E4E4E] uppercase leading-tight">
            {product?.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-2">
            {priceData?.discount && priceData?.basePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${priceData.basePrice.toFixed(0)}
              </span>
            )}
            <span className="text-xl font-bold text-[#C3A1A0]">
              ${priceData?.finalPrice?.toFixed(0)}
            </span>
          </div>

          {/* Description */}
          {product?.description && (
            <p className="normal-case tracking-normal text-[#4E4E4E] text-xs leading-relaxed text-justify line-clamp-5">
              {product.description}
            </p>
          )}
        </div>

        {/* Bottom content - Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm mt-4 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Agregar</span>
        </button>

      </div>
    </div>
  )
}
