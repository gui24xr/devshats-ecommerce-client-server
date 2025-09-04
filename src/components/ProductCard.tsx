'use client'

import { useState, useEffect } from "react"
import { LayoutModal, ProductCustomizer, ProductCardBody } from "./index"


export default function ProductCard({ product, onAddItemToCart, defaultProductImage }: any) {

  const [currentProduct, setCurrentProduct] = useState(null)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)


  useEffect(() => {
    if (product) {
      if (product.hasVariants) {
        const productWithSelectedVariantes = {
          ...product, templateVariant: {
            ...product.templateVariant,
            options: product.templateVariant.options.map((item) => ({ ...item, isSelected: item.isDefault }))
          }
        }
        return setCurrentProduct(productWithSelectedVariantes)
      }
      return setCurrentProduct(product)

    }
  }, [product])



  const onChangeVariant = (selectedVariantId: any) => {
    //Modifico el current product cambiando el is selected, pero primero le quito el isSelected y luego lo coloco en otro   
    const productWithSelectedVariantes = {
      ...product, templateVariant: {
        ...product.templateVariant,
        options: product.templateVariant.options.map((item) => ({ ...item, isSelected: (item.id == selectedVariantId) ? true : false }))
      }
    }
    return setCurrentProduct(productWithSelectedVariantes)

  }

  //Este helper da el precio delproducto/variante a renerizar ya que si tiene variantes se debe tomar el precio de la variuante x default, si no el tiene se debe tomar del campo base price
  const getProductPrice = () => {
    if (currentProduct?.hasVariants) {
      const selectedVariant = currentProduct?.templateVariant.options.find(item => item.isSelected == true)
      console.log('Selected: ', selectedVariant)
      return selectedVariant.price
    }
    return currentProduct?.price
  }

  const handleAddProductToCart = async () => {
    setIsAdding(true)
    try {
      if (currentProduct.isCustomizable || currentProduct.hasVariants) {
        setIsCustomizerOpen(true)
      } else {
        onAddItemToCart(currentProduct, 1)
      }
      setTimeout(() => setIsAdding(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
  }


  if (!currentProduct) return ("No hay nada")
  return (
    <>
      <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 overflow-hidden h-full flex flex-col">

        {/* Image Container - Altura fija */}
        <div className="relative overflow-hidden h-56">
          <img
            src={imageError ? defaultProductImage : (currentProduct?.images[0].url || defaultProductImage)}
            alt={currentProduct?.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


          {/* Badge Cintilla Diagonal - Superior Derecha */}
          {currentProduct?.features?.isNew && (
            <div className="absolute top-1 -right-2 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-16  transform rotate-12 shadow-lg">
                <span className="text-xs font-bold">NUEVO</span>
              </div>
            </div>
          )}
          {/* Popular Badge */}
          {currentProduct?.features?.isPopular && (
            <div className="absolute top-4 left-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                🔥 Popular
              </div>
            </div>
          )}

          {/* Price Badge */}
          {getProductPrice().discount && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-green-500 text-white text-xs text-shadow-lg  rounded-full px-3 py-1 shadow-lg">
                <div className="text-center flex flex-col items-center gap-1">
                  <p className="text-sm font-bold text-white ">
                    ${`${getProductPrice().discount.toFixed(0)}% OFF`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Body del card y button */}
        <div className="flex flex-col flex-grow p-6">
          <ProductCardBody
            product={currentProduct}
            getProductPrice={getProductPrice}
            handleAddProductToCart={handleAddProductToCart}
            onChangeVariant={onChangeVariant}
          />


          <div className="flex flex-col gap-4">

            {/* Quick Info */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="w-full flex justify-between items-center text-xs text-gray-500 ">
                {currentProduct?.prepTime && (
                  <span className="flex items-center gap-1">⏱️ {currentProduct?.prepTime?.min}-{currentProduct?.prepTime?.max} min</span>
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

      {/* Modal productCustomizer */}
      {((currentProduct.isCustomizable || currentProduct.hasVariants) && isCustomizerOpen) && (
        <LayoutModal
          isOpen={isCustomizerOpen}
          onClose={setIsCustomizerOpen}
          title="Personaliza tu producto"
          description={currentProduct.name}
          minWidth="w-1/2"
          maxWidth="max-w-2xl"
          content={<ProductCustomizer productToCustomize={currentProduct} />}
          footer={<div>
            <h1>Footer</h1>
          </div>}
        />
      )}
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