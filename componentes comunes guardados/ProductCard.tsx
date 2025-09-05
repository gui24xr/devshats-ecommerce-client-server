'use client'

import { useState, useEffect } from "react"
import { LayoutModal, ProductCustomizer, ProductCardBody } from "./index"
import { useProductBuilderStore } from "@/stores"

export default function ProductCard({ product, onAddItemToCart, defaultProductImage }: any) {

  const [currentProduct, setCurrentProduct] = useState(null)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)

  

  



  const onChangeVariant = (selectedVariantId: any) => {
    //Modifico el current product cambiando el is selected, pero primero le quito el isSelected y luego lo coloco en otro   
    /*const productWithSelectedVariantes = {
      ...product, templateVariant: {
        ...product.templateVariant,
        options: product.templateVariant.options.map((item) => ({ ...item, isSelected: (item.id == selectedVariantId) ? true : false }))
      }
    }
    return setCurrentProduct(productWithSelectedVariantes)
    */

  }

  //Este helper da el precio delproducto/variante a renerizar ya que si tiene variantes se debe tomar el precio de la variuante x default, si no el tiene se debe tomar del campo base price
  const getProductPrice = () => {
    if (product?.hasVariants) {
      const selectedVariant = product?.templateVariant.options.find(item => item.isSelected == true)
      console.log('Selected: ', selectedVariant)
      return selectedVariant.price
    }
    return product?.price
  }

  const handleAddProductToCart = async () => {
    setIsAdding(true)
    //Tenemos 4 casos posibles:
    //1. Producto personalizable y con variantes
    //2. Producto personalizable y sin variantes
    //3. Producto no personalizable y con variantes
    //4. Producto no personalizable y sin variantes
    try {
      if (product.isCustomizable && product.hasVariants) {
        //Queda todo en manos del customizador pero hay que darle la variante
        setIsCustomizerOpen(true)
      } 
      
      if (product.isCustomizable && !product.hasVariants) {

        setIsCustomizerOpen(true)
      }

      if (!product.isCustomizable && product.hasVariants) {
        //Faltaria enviar la variante seleccionada
        onAddItemToCart(product, 1)
      }

        if (!product.isCustomizable && !product.hasVariants) {
        onAddItemToCart(product, 1)
      }

      setTimeout(() => setIsAdding(false), 1000)
        
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
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
            product={product}
            getProductPrice={getProductPrice}
            handleAddProductToCart={handleAddProductToCart}
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

      {/* Modal productCustomizer */}
      {((product.isCustomizable) && isCustomizerOpen) && (
        <LayoutModal
          isOpen={isCustomizerOpen}
          onClose={setIsCustomizerOpen}
          title="Personaliza tu producto"
          description={product.name}
          minWidth="w-1/2"
          maxWidth="max-w-2xl"
          content={<ProductCustomizer productToCustomize={product} onAddToCart={onAddItemToCart} />}
          footer={<div>
            <h1>Footer</h1>
          </div>}
        />
      )}
    </>
  )
}

//content={<ProductCustomizer product={product} selectedVariant={selectedVariant} />}


