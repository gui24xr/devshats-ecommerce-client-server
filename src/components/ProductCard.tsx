'use client'

import { useState, useEffect } from "react"
import { LayoutModal } from "./index"
import { Roboto, Anton, Archivo_Black } from "next/font/google"

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto'
})

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton'
})

const archivo_black = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black'
})

export default function ProductCard({ product, onAddItemToCart }: any) {

  useEffect(() => {
    console.log('LLego producto a ProductsCard', product)
  }, [])

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.hasVariants ? product.templateVariant.options.find((option: any) => option.isDefault) : null)
  const [isAdding, setIsAdding] = useState(false)

  const onChangeVariant = (variant: any) => {
    setSelectedVariant(variant)
  }

  //Este helper da el precio delproducto/variante a renerizar ya que si tiene variantes se debe tomar el precio de la variuante x default, si no el tiene se debe tomar del campo base price
  const getProductPrice = () => {
    if (product.hasVariants) {
      return selectedVariant.price
    }
    return product.price
  }

  const handleAddProductToCart = async () => {
    setIsAdding(true)
    try {
      if (product.isCustomizable) {
        setIsCustomizerOpen(true)
      } else {
        onAddItemToCart(product.id, 1)
      }
      setTimeout(() => setIsAdding(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 overflow-hidden h-full flex flex-col">
        
        {/* Image Container - Altura fija */}
        <div className="relative overflow-hidden h-56">
          <img
            src={"./images/hotdog.png"}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Popular Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🔥 Popular
            </div>
          </div>

          {/* Price Badge */}
          {getProductPrice().discount && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-green-500 text-white text-xs text-shadow-lg backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <div className="text-center flex flex-col items-center gap-1">
                  <p className="text-xl font-bold text-white shadow-lg">
                    ${`${getProductPrice().discount.toFixed(0)}% OFF`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content - flex-grow para ocupar espacio disponible */}
        <div className="flex flex-col flex-grow p-6">
          
          {/* Header */}
          <div className="mb-4">
            <h3 className={`${roboto.className} text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2`}>
              {product.name}
            </h3>
            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {product.description ||
                "Delicioso hot dog artesanal preparado con ingredientes frescos y de la más alta calidad."}
            </p>
          </div>

          {/* Rating and Price */}
          <div className="flex justify-between items-center mb-4">
            {/* Rating & Reviews */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</span>
                <span className="text-sm text-gray-600 ml-1">(4.8)</span>
              </div>
              <span className="text-xs text-gray-600">156 reseñas</span>
            </div>

            <div className="pr-2 text-end">
              <p>
                {getProductPrice().discount && (
                  <span className="text-sm text-gray-400 line-through">${getProductPrice().basePrice.toFixed(0)}</span>
                )}
                <span className={`${archivo_black.className} text-5xl font-bold text-gray-700 text-shadow-md`}>${getProductPrice().finalPrice.toFixed(0)}</span>
              </p>
            </div>
          </div>

          {/* Variants Section - Altura fija siempre */}
          <div className="h-12 mb-4">
            {product.hasVariants && (
              <>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Seleccionar una variante</h4>
                <div className="flex gap-2">
                  {product.templateVariant.options.map((option: any) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedVariant(option)}
                      disabled={isAdding}
                      className={`flex-1  px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm ${
                        (option.id === selectedVariant.id)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Info */}
          <div className="pt-4 border-t border-gray-100 mb-4">
            <div className="w-full flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">⏱️ {product.prepTime.min} - {product.prepTime.max} min</span>
              <span className="flex items-center gap-1">🚚 Delivery gratis</span>
              <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                <span>🔥</span>
                <span>Más pedido</span>
              </div>
            </div>
          </div>

          {/* Spacer para empujar el botón hacia abajo */}
          <div className="flex-grow"></div>

          {/* Action Buttons - Siempre al final */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => handleAddProductToCart()}
              disabled={isAdding}
              className={`flex-1 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                isAdding
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              }`}
            >
              {isAdding ? '✓ Agregado' : '🛒 Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal productCustomizer */}
      {(product.isCustomizable && isCustomizerOpen) && (
        <LayoutModal
          isOpen={isCustomizerOpen}
          onClose={setIsCustomizerOpen}
          title="Customizar producto"
          description="Customiza tu..."
          minWidth="w-1/2"
          maxWidth="max-w-2xl"
          content={<div>
            <h1>Customizer</h1>
          </div>}
          footer={<div>
            <h1>Footer</h1>
          </div>}
        />
      )}
    </>
  )
}

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