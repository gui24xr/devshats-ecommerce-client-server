"use client"
import { Check } from 'lucide-react'
import { useProductBuilderStore } from "@/stores"
import { QuantitySelectorSmall, QuantitySelectorBig } from "@/components"

export default function ProductCustomizer() {

    const currentProduct = useProductBuilderStore(state => state.currentProduct)
    
    return (
        <div className="min-h-[90vh] flex flex-col gap-8 bg-gray-50">
            <div>
                <ProductDetail />
            </div>
            <div>
                <div className="flex items-center justify-center px-1 lg:px-4 pb-48">
                    <div className={`w-full grid grid-cols-1 gap-4 md:${currentProduct?.customizationFeaturesTemplate ? 'grid-cols-1' : 'grid-cols-1'} h-full overflow-y-auto`}>
                        <div className="flex flex-col  gap-4   lg:px-32 ">
                            <ProductCustomizerQuantitySelector/>
                            <div className="flex flex-wrap">
                                {(currentProduct?.templateVariant) && (<ProductVariantSelector/>)} 
                            </div>
                            {(currentProduct?.customizationFeaturesTemplate) && (
                                currentProduct?.customizationFeaturesTemplate?.map(item => {
                                    return (
                                        <div className="flex flex-col px-4 mt-8">
                                            {item.type === 'variant' && <ProductFeaturesSelectorTypeVariant feature={{ ...item }} />}
                                            {item.type === 'check' && <ProductFeaturesSelectorTypeCheck feature={{ ...item }} />}
                                            {item.type === 'combo' && <ProductFeaturesSelectorTypeCombo feature={{ ...item }}  />}
                                        </div>
                                    )
                                })
                            )}
                            <div className="mt-16 mb-32 ">
                                <ProductCustomizationPreview/>
                            </div>
                            
                        </div>
                        </div>
                    {/* Sección flotante Agregar al carrito */}
                    <AddToCartSection/>
                </div>
            </div>
        </div>
    )
}



function ProductCustomizerQuantitySelector() {
        const quantity = useProductBuilderStore(state => state.quantity)
    const setQuantity = useProductBuilderStore(state => state.setQuantity)
    return (
         <div className="flex flex-col items-center gap-3 border border-gray-200 rounded-lg p-4">
                                <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    Seleccionar cantidad
                                </h5>
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
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
    const itemForCart = useProductBuilderStore(state => state.itemForCart)
    const totalForThisProduct = useProductBuilderStore(state => state.totalForThisProduct)

    return (
        <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-3">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 self-center">
               {itemForCart?.title}
            </h4>
            {itemForCart?.variant && (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">

                            <span className="text-sm font-semibold text-gray-800 underline decoration-solid">
                                {itemForCart?.variant?.selectedOption ? (itemForCart?.variant?.label + ':') : 'Seleccionar una variante'} 
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                                {itemForCart?.variant?.selectedOption?.label}
                            </span>
                        </div>
                    </div>
            )}
            {
                itemForCart?.customizationFeatures?.map((item: any) => {
                    return (
                    
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-semibold text-gray-800 underline decoration-solid">
                                        {item?.name + ':'}
                                    </span>
                                <ul>{
                                        item?.selectedOptions?.map((option: any) => {
                                            return (
                                                <li className="text-sm font-medium text-gray-800">
                                                    {option?.name}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                </div>
                            </div>
                    )
                })

            }
            <div className="w-full flex justify-between bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800 uppercase">
                        Precio Unitario
                    </span>
                    <span className="text-xl text-center font-medium text-gray-800">
                        {itemForCart?.priceData?.finalPrice ?('$' + itemForCart?.priceData?.finalPrice ) : 'Seleccionar variante.'}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800 uppercase">
                        Cantidad
                    </span>
                    <span className="text-xl text-center font-medium text-gray-800">
                        {quantity}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800 uppercase">
                        Precio Total
                    </span>
                    <span className="text-xl text-center font-medium text-gray-800">
                       {totalForThisProduct ? ('$' + totalForThisProduct) :  'Seleccionar variante.'}
                    </span>
                </div>
            </div>
        </div>
    )
}



function ProductVariantSelector() {
  
    const templateVariant = useProductBuilderStore(state => state.currentProduct.templateVariant)
    const setSelectedVariant = useProductBuilderStore(state => state.setSelectedVariant)

    const handleClickVariant = (variantId: any) => {
        setSelectedVariant({
            selectedVariantId: variantId, 
            onError: () => {}
        })
    }
    return (
        <div className="w-full flex flex-col items-center gap-3 border border-gray-200 rounded-lg p-4">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2 b">
                <span className="text-lg">{templateVariant.emoji}</span>
                {`Seleccionar ${templateVariant?.label || 'una opcion...'}`}
            </h5>
            <div className="grid grid-cols-2 gap-2">
                {templateVariant?.options?.map((optionVariant: any) => {
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
                                        <span className="text-sm text-green-600 font-medium ">
                                             ${optionVariant?.price?.finalPrice}
                                         </span>
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
        <div className="bg-white shadow-lg border-0 overflow-hidden flex flex-row">
            {/* Image Container */}
            <div className="w-2/6 relative overflow-hidden h-56">
                <img
                    src={currentProduct?.images?.[0]?.url || '/images/default-product.jpg'}
                    alt={currentProduct?.name}
                    className="w-full h-56 object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-grow p-6 w-4/6">
                {/* Header */}
                <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                        {currentProduct?.name}
                    </h3>
                    <p className="text-gray-600 text-sm text-justify line-clamp-3 leading-relaxed">
                        {currentProduct?.description || "Producto sin descripción"}
                    </p>
                </div>
            </div>
        </div>
    )
}











