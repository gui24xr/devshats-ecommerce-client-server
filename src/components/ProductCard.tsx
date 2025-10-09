'use client'
import { useState, useEffect } from "react"
import { ProductCardBody } from "./index"
import { useProductBuilderStore } from "@/stores"


const getInitialVariantId = (product: any) => {
  if (product.templateVariant) {
    const selectedVariant = product?.templateVariant.options.find(item => item.isDefault == true)
    return selectedVariant?.id
  }
  return null
}

const getProductPrice = (product: any, selectedVariantId: any) => {
  if (product?.templateVariant) {
    const selectedVariant = product?.templateVariant.options.find(item => item.id == selectedVariantId)
    return selectedVariant?.price
  }
  return product?.price
}


export default function ProductCard({ product, defaultProductImage }: any) {


  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState(getInitialVariantId(product))
  const [priceData, setPriceData] = useState(getProductPrice(product, selectedVariantId))

  const handlerProductToAddToCart = useProductBuilderStore(state => state.handlerProductToAddToCart)
  
  useEffect(() => {
    setPriceData(getProductPrice(product, selectedVariantId))
  }, [selectedVariantId])

  const onChangeVariant = (selectedVariantId: any) => {
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




  if (!product) return ("No hay nada")
  return (
    <>
      <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 overflow-hidden h-full flex flex-col">

        {/* Image Container - Altura fija */}
        <div className="relative overflow-hidden h-56">
          <img
            src={imageError ? defaultProductImage : (product?.images[0].url || defaultProductImage)}
            alt={product?.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


          {/* Badge Cintilla Diagonal - Superior Derecha */}
          {product?.features?.isNew && (
            <div className="absolute top-1 -right-2 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-16  transform rotate-12 shadow-lg">
                <span className="text-xs font-bold">NUEVO</span>
              </div>
            </div>
          )}
          {/* Popular Badge */}
          {product?.features?.isPopular && (
            <div className="absolute top-4 left-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                🔥 Popular
              </div>
            </div>
          )}

          {/* Price Badge */}
          {priceData.discount && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-green-500 text-white text-xs text-shadow-lg  rounded-full px-3 py-1 shadow-lg">
                <div className="text-center flex flex-col items-center gap-1">
                  <p className="text-sm font-bold text-white ">
                    ${`${priceData.discount.toFixed(0)}% OFF`}
                  </p>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Body del card y button */}
        <div className="flex flex-col flex-grow p-6">
          <ProductCardBody
            product={product}
            productPrice={priceData}
            handleAddProductToCart={handleAddProductToCart}
            selectedVariantId={selectedVariantId}
            onChangeVariant={onChangeVariant}
          />


          <div className="flex flex-col gap-4">

            {/* Quick Info */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="w-full flex justify-between items-center text-xs text-gray-500 ">
                {product?.prepTime && (
                  <span className="flex items-center gap-1">⏱️ {product?.prepTime?.min}-{product?.prepTime?.max} min</span>
                )}
                <span className="flex items-center gap-1">🚚 Delivery gratis</span>
                <span className="flex items-center gap-1">🔥 Más pedido</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => handleAddProductToCart()}
              disabled={isAdding}
              className={`flex-1 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${isAdding
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
            >
              {isAdding ? '✓ Agregado' : '🛒 Agregar al Carrito'}
            </button>
          </div>
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