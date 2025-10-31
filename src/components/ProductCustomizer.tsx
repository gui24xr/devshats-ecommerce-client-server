"use client"
import { Check, ShoppingCart, X } from 'lucide-react'
import { useProductBuilderStore, useModalsStore } from "@/stores"
import { QuantitySelectorSmall, QuantitySelectorBig } from "@/components"

export default function ProductCustomizer() {

    const currentProduct = useProductBuilderStore(state => state.currentProduct)

    return (
        <div className="flex flex-col h-full">
            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-2 py-2 pb-32 space-y-4">
                <ProductDetail />

                {/* Leyenda instructiva */}
                <div className="flex flex-col gap-4">
                <div className="text-center py-4 px-4 gap-8">
                    <p className="text-gray-700 font-semibold text-sm md:text-base">
                        Personaliza tu pedido
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Selecciona la cantidad y las opciones que desees
                    </p>
                </div>

                <div className="flex items-center justify-center px-1 lg:px-4">
                    <div className="w-full">
                        <div className="flex flex-col gap-2 lg:px-32">
                            <ProductCustomizerQuantitySelector/>
                            <div className="flex flex-wrap">
                                {(currentProduct?.type === 'SINGLE_VARIANT_PRODUCT') && (
                                    <>
                                    <ProductVariantSelector/>
                                    <hr  className="w-full border-1 "/>
                                    </>
                                    )}
                            </div>
                            {(currentProduct?.customizationFeaturesTemplate) && (
                                currentProduct?.customizationFeaturesTemplate?.map(item => {
                                    return (
                                        <div key={item.id} className="flex flex-col px-4 mt-8">
                                            {item.type === 'variant' && <ProductFeaturesSelectorTypeVariant feature={{ ...item }} />}
                                            {item.type === 'check' && <ProductFeaturesSelectorTypeCheck feature={{ ...item }} />}
                                            {item.type === 'combo' && <ProductFeaturesSelectorTypeCombo feature={{ ...item }}  />}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview sticky en la parte inferior */}
            <ProductCustomizationPreview/>
        </div>
    )
}



function ProductCustomizerQuantitySelector() {
        const quantity = useProductBuilderStore(state => state.quantity)
    const setQuantity = useProductBuilderStore(state => state.setQuantity)
    return (
         <div className="w-full flex flex-row items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg">
                                <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    Cantidad
                                </p>
                                <div className="flex items-center gap-3 ">
                                    <QuantitySelectorBig
                                        quantity={quantity}
                                        onChange={setQuantity}
                                        minQuantity={1}
                                        maxQuantity={10}
                                    />
                                </div>
                            </div>
    )
}
function AddToCartSection() {
   const addProductToCart = useProductBuilderStore(state => state.addProductToCart)
    const handleAddToCart = () => {
        addProductToCart({ onError: (errorMessage) => { alert(errorMessage)} })
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-lg">
            <div className="bg-white rounded-xl shadow-lg  ">
                <div className="flex items-center justify-between gap-6 ">
                    <button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                        onClick={handleAddToCart}
                    >
                        <span className="text-xl">🛒</span>
                        <span className="text-base">Agregar al carrito</span>
                    </button>
                </div>
            </div>
        </div>
    )
}





function OptionFeatureItemButton({ onClick, optionData, showQuantitySelector, onChangeQuantity }: any) {
    const { id, name, icon,  isSelected, selectedQuantity, priceModifier, minQuantity, maxQuantity } = optionData

    const handleChangeQuantity = (quantity: any) => {
        onChangeQuantity && onChangeQuantity(id, quantity)
    }

    
    const handleClick = (id: any, quantity: any) => {
        onClick && onClick(id, quantity)
    }


    return (
        <div
            key={id}
            className={`w-full group relative flex items-center justify-between p-1 rounded-xl border-2 transition-all duration-300 ${isSelected
                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-900 shadow-lg ring-2 ring-orange-200/50'
                : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 shadow-md hover:shadow-lg'
                }`}>
            <button
                type="button"
                onClick={() => handleClick(id, selectedQuantity || 0)}
                className="flex items-center space-x-3 flex-1">
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg' : 'border-gray-300 group-hover:border-orange-400'}`}>
                    {isSelected && <Check className="w-6 h-6" />}
                </div>
                <div className="flex flex-row justify-between w-full">
                    <div className="self-start">
                        <span className="text-sm font-semibold">{icon + ' '} {name} {priceModifier > 0 && (
                            <span className="text-sm text-green-600 font-medium ">
                                +${priceModifier}
                            </span>
                        )}</span>
                    </div>
                    <div>

                    </div>

                    {showQuantitySelector &&
                         <QuantitySelectorSmall
                            quantity={selectedQuantity}
                            onChange={handleChangeQuantity}
                            minQuantity={0}
                            maxQuantity={10}
                        />
                    }
                </div>

            </button>
        </div>
    )
}

const ProductFeaturesSelectorTypeVariant = ({ feature }: any) => {

    const setCustomizationFeatureTypeVariant = useProductBuilderStore(state => state.setCustomizationFeatureTypeVariant)
    const handleClick = (optionId: string, quantity: number) => {
        setCustomizationFeatureTypeVariant({ featureId: feature?.id, selectedOptionId: optionId, onError: () => { } })
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature?.emoji + ' ' + feature?.name}
            </h5>
            <div className="space-y-2">
                {feature?.options?.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton onClick={handleClick} optionData={optionFeatureItem} />
                    )
                })}
            </div>
        </div>
    )
}

const ProductFeaturesSelectorTypeCombo = ({ feature }: any) => {
    
    const setCustomizationFeatureTypeCombo = useProductBuilderStore(state => state.setCustomizationFeatureTypeCombo)
   
    const handleChangeQuantity = (optionId: string, quantity: number) => {
        setCustomizationFeatureTypeCombo({ 
            featureId: feature?.id, 
            selectedOptionId: optionId, 
            newSelectedQuantity: quantity, 
            onError: () => {} 
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature?.emoji + ' ' + feature?.name}
            </h5>
            <div className="space-y-2">
                {feature?.options?.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton  optionData={optionFeatureItem} showQuantitySelector={true} onChangeQuantity={handleChangeQuantity}/>
                    )
                })}
            </div>
        </div>
    )
}

const ProductFeaturesSelectorTypeCheck = ({ feature }: any) => {

    const setCustomizationFeatureTypeCheck = useProductBuilderStore(state => state.setCustomizationFeatureTypeCheck)
    const handleClick = (optionId: string, quantity: number) => {
        setCustomizationFeatureTypeCheck({ 
            featureId: feature?.id, 
            selectedOptionId: 
            optionId, 
            onError: () => { } 
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature?.emoji + ' ' + feature?.name}
            </h5>
            <div className="space-y-2">
                {feature?.options?.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton onClick={handleClick} optionData={optionFeatureItem} />
                    )
                })}
            </div>
        </div>
    )
}



//-----------------------------------------------------------
function ProductCustomizationPreview() {
    const quantity = useProductBuilderStore(state => state.quantity)
    const setQuantity = useProductBuilderStore(state => state.setQuantity)
    const currentProduct = useProductBuilderStore(state => state.currentProduct)
    const itemForCart = useProductBuilderStore(state => state.itemForCart)
    const totalForThisProduct = useProductBuilderStore(state => state.totalForThisProduct)
    const addProductToCart = useProductBuilderStore(state => state.addProductToCart)
    const hideProductCustomizerModal = useModalsStore(state => state.hideProductCustomizerModal)

    const handleAddToCart = () => {
        addProductToCart({
            onError: (errorMessage) => { alert(errorMessage) }
        })
        // Si no hay error, cerrar el modal
        hideProductCustomizerModal()
    };

    const handleCancel = () => {
        hideProductCustomizerModal()
    };

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-2xl p-3 border-t-2 border-orange-600">

        <div className="sticky bottom-0 md:px-4 md:pt-2 md:pb-4">
            {/* Título del producto */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">

                    <h2 className="text-lg font-bold text-white">{itemForCart?.title}</h2>
                </div>
            </div>

            {/* Variante y Customizaciones seleccionadas - Solo mostrar si hay contenido */}
            {(itemForCart?.variant || (currentProduct?.customizationFeaturesTemplate && currentProduct?.customizationFeaturesTemplate.length > 0)) && (
                <div className="bg-white/10 rounded-md px-3 py-2 mb-3 max-h-32 overflow-y-auto leading-tight">
                    {/* Variante - Mostrar seleccionada o mensaje para seleccionar */}
                    {itemForCart?.variant && (
                        <div>
                            {itemForCart?.variant?.selectedOption ? (
                                <>
                                    <span className="text-white/90 text-xs font-semibold">
                                        {itemForCart?.variant?.label}:{" "}
                                    </span>
                                    <span className="text-white text-xs">
                                        {itemForCart?.variant?.selectedOption?.label}
                                    </span>
                                </>
                            ) : (
                                <span className="text-yellow-200 text-xs font-semibold italic">
                                    Seleccionar {itemForCart?.variant?.label}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Customization Features - Mostrar todas desde el template */}
                    {currentProduct?.customizationFeaturesTemplate?.map((featureTemplate: any) => {
                        const selectedFeature = itemForCart?.customizationFeatures?.find((f: any) => f.id === featureTemplate.id);
                        return (
                            <div key={featureTemplate.id}>
                                <span className="text-white/90 text-xs font-semibold">
                                    {featureTemplate?.name}:{" "}
                                </span>
                                {selectedFeature?.selectedOptions && selectedFeature?.selectedOptions.length > 0 ? (
                                    <span className="text-white text-xs">
                                        {selectedFeature?.selectedOptions?.map((opt: any) => {
                                            let display = opt?.name;
                                            if (opt?.selectedQuantity && opt?.selectedQuantity > 0) {
                                                display += ` x${opt?.selectedQuantity}`;
                                            }
                                            return display;
                                        }).join(", ")}
                                    </span>
                                ) : (
                                    <span className="text-yellow-200 text-xs italic">
                                        No seleccionado
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Información del producto - Una línea */}
            <div className="bg-white/10 rounded-md px-3 py-2 mb-3">
                <div className="flex items-center justify-between text-white w-full">
                    {/* Precio */}
                    <div className="flex flex-col items-center">
                        <span className="text-white/90 text-xs">Precio</span>
                        <span className="text-white font-bold text-base">
                            {itemForCart?.priceData?.finalPrice ? `$${itemForCart?.priceData?.finalPrice}` : '-'}
                        </span>
                    </div>

                    {/* Cantidad con selector */}
                    <div className="flex flex-col items-center">
                        <span className="text-white/90 text-xs mb-1">Cantidad</span>
                        <QuantitySelectorSmall
                            quantity={quantity}
                            onChange={setQuantity}
                            min={1}
                            max={10}
                        />
                    </div>

                    {/* Total */}
                    <div className="flex flex-col items-center">
                        <span className="text-white/90 text-xs">Total</span>
                        <span className="text-white font-bold text-lg">
                            {totalForThisProduct ? `$${totalForThisProduct}` : '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Botones de acción - Una línea */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                    onClick={handleCancel}
                >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                </button>
                <button
                    type="button"
                    disabled={!totalForThisProduct}
                    className="flex-1 bg-white hover:bg-gray-100 text-orange-600 font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar al Carrito</span>
                </button>
            </div>
        </div>
        </div>
    )
}



function ProductVariantSelector() {
  
    const currentProduct = useProductBuilderStore(state => state.currentProduct)
    const setSelectedVariant = useProductBuilderStore(state => state.setSelectedVariant)

    const handleClickVariant = (variantId: any) => {
        setSelectedVariant({
            selectedVariantId: variantId, 
            onError: () => {}
        })
    }
    return (
        <div className="w-full flex flex-col  gap-3  rounded-lg p-4">
            <p className="text-base font-semibold text-gray-800 flex items-center gap-2 b">
                <span className="text-lg">{currentProduct?.templateVariant?.emoji}</span>
                {`Seleccionar ${currentProduct?.templateVariant?.label || 'una opcion...'}`}
            </p>
            <div className="grid grid-cols-1 gap-2">
                {currentProduct?.templateVariant?.options?.map((optionVariant: any) => {
                    const isSelected = optionVariant?.isSelected
                    return (
                        <button
                            key={optionVariant?.id}
                            type="button"
                            onClick={() => handleClickVariant(optionVariant.id)}
                            className={`group relative flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all duration-300 ${isSelected
                                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-900 shadow-lg ring-2 ring-orange-200/50'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 shadow-md hover:shadow-lg'
                                }`}>
                            <div className="flex items-center space-x-3">
                                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${isSelected
                                    ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg'
                                    : 'border-gray-300 group-hover:border-orange-400'
                                    }`}>
                                    {isSelected && (
                                        <Check className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {optionVariant?.emoji}
                                        </span>
                                        <span className="text-sm font-semibold">{optionVariant?.label}</span>
                                        {currentProduct.priceStrategy === "TEMPLATE_VARIANT_PRICE" && (
                                        <span className="text-sm text-green-600 font-medium ">
                                             ${optionVariant?.price?.finalPrice}
                                         </span>
                                        )}

                                    </div>
                                    {optionVariant.affectPrice > 0 && (
                                        <span className="text-xs text-green-600 font-medium ml-7">
                                            +${optionVariant?.affectPrice}/unid
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}




function ProductDetail() {

    const currentProduct = useProductBuilderStore(state => state.currentProduct)

    return (
        <div className="bg-white shadow-md overflow-hidden flex flex-row max-w-2xl mx-auto">
            {/* Image Container */}
            <div className="w-28 h-28 md:w-32 md:h-32 relative overflow-hidden flex-shrink-0">
                <img
                    src={currentProduct?.images?.[0]?.url || '/images/default-product.jpg'}
                    alt={currentProduct?.name}
                    className="w-full h-full object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-grow px-3 py-2 justify-center">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2">
                        {currentProduct?.name}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {currentProduct?.description || "Producto sin descripción"}
                    </p>
                </div>
            </div>
        </div>
    )
}











