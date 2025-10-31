'use client'
import { useState, useEffect } from "react"
import { ProductCardBody } from "./index"
import { useProductBuilderStore } from "@/stores"
import { ProductsHelpers } from "@/utils"


export default function ProductCard({ product, defaultProductImage }: any) {

  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState(ProductsHelpers.getInitialVariantId(product))
  const [priceData, setPriceData] = useState(ProductsHelpers.getProductPrice(product, selectedVariantId))

  const handlerProductToAddToCart = useProductBuilderStore(state => state.handlerProductToAddToCart)
  
  useEffect(() => {
    setPriceData(ProductsHelpers.getProductPrice(product, selectedVariantId))
  }, [selectedVariantId])

  const onSelectVariant = (selectedVariantId: any) => {
    setSelectedVariantId(selectedVariantId)
  }

  const handleAddProductToCart = () => {
    handlerProductToAddToCart({ 
      productId: product.id, 
      selectedVariantId, 
      quantity: 1,
      onSuccess: () => setIsAdding(false), 
      onError: (error: any) => console.error('Error adding to cart:', error) })
  }

  return (
    <>
      <div className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden h-full flex flex-row md:flex-col">

        {/* Image Container - Responsive */}
        <div className="relative overflow-hidden w-32 md:w-full flex-shrink-0">
          <img
            src={imageError ? defaultProductImage : (product?.images[0].url || defaultProductImage)}
            alt={product?.name}
            className="w-full h-full md:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
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

          {/* Price y Descuento - Juntos en esquina inferior derecha */}
          <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
            {/* Descuento - Badge verde pegadito arriba del precio */}
            {priceData?.discount && (
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                -{priceData.discount.toFixed(0)}%
              </div>
            )}

            {/* Price Badge - Fondo negro */}
            <div className="bg-black/90 text-white px-2 py-1 rounded flex items-center gap-1.5">
              {priceData?.discount && priceData?.basePrice && (
                <span className="text-xs line-through opacity-60">
                  ${priceData.basePrice.toFixed(0)}
                </span>
              )}
              <span className="text-base font-bold">
                ${priceData?.finalPrice?.toFixed(0)}
              </span>
            </div>
          </div>

        </div>

        {/* Body del card y button */}
        <div className="flex flex-col flex-grow p-3 md:p-4">
          <ProductCardBody
            product={product}
            productPrice={priceData}
            handleAddProductToCart={handleAddProductToCart}
            selectedVariantId={selectedVariantId}
            onChangeVariant={onSelectVariant}
          />

          {/* Quick Info - Compacto */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 mb-3">
            {product?.prepTime && (
              <span className="flex items-center gap-1">
                <span>🕐</span>
                {product?.prepTime?.min}-{product?.prepTime?.max}min
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>🚚</span>
              Gratis
            </span>
          </div>

          {/* Button - Azul como en la captura */}
          <button
            onClick={() => handleAddProductToCart()}
            disabled={isAdding}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all text-sm ${isAdding
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isAdding ? '✓ Agregado' : '🛒 Agregar'}
          </button>
        </div>
      </div>

     
    </>
  )
}

//content={<ProductCustomizer product={product} selectedVariant={selectedVariant} />}


// QuantitySelector component remains the same
const QuantitySelector = ({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 w-fit">
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-sm">−</span>
      </button>

      <span className="w-8 text-center text-sm font-medium text-gray-700 select-none">
        {quantity}
      </span>

      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="text-sm">+</span>
      </button>
    </div>
  );
};