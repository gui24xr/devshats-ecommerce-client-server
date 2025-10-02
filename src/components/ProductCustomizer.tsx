"use client"
import { useState, useEffect } from "react"
import { Check } from 'lucide-react'
import { useProductBuilderStore } from "@/stores"
import { QuantitySelectorSmall, QuantitySelectorBig, StarRating } from "@/components"

export default function ProductCustomizer({ onAddToCart, onClose }: any) {

    // Todo el estado global viene del store
    const productInCustomizationData = useProductBuilderStore(state => state.currentProduct)
    const selectedVariant = useProductBuilderStore(state => state.selectedVariant)
    const setSelectedVariant = useProductBuilderStore(state => state.setSelectedVariant)
    const customization = useProductBuilderStore(state => state.customization)
    const setCustomizationOptionsFeature = useProductBuilderStore(state => state.setCustomizationOptionsFeature)
    const quantity = useProductBuilderStore(state => state.quantity)
    const setQuantity = useProductBuilderStore(state => state.setQuantity)
    const priceData = useProductBuilderStore(state => state.priceData)
    const addProductToCart = useProductBuilderStore(state => state.addProductToCart)
    // Inicializar el producto de trabajo cuando cambie el producto en customización


    const onChangeCustomizationOptionState = (featureId: any, newOptionsStateArray: any) => {
        setCustomizationOptionsFeature(featureId, newOptionsStateArray)
    }

    const onChangeSelectedVariant = (selectedVariantId: any) => {
        setSelectedVariant({selectedVariantId})
    }





    return (
        <div className="h-[90vh] flex flex-col gap-8 bg-gray-50">
            <div>
                <ProductDetail productInCustomizationData={productInCustomizationData} />
            </div>
            <div>
                <div className="flex items-center justify-center px-1 lg:px-4 pb-48">
                    <div className={`w-full grid grid-cols-1 gap-4 md:${productInCustomizationData.isCustomizable ? 'grid-cols-1' : 'grid-cols-1'} h-full overflow-y-auto`}>

                        <div className="flex flex-col  gap-4   lg:px-32 ">
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
                            {/* variant selector */}
                            <div className="flex flex-wrap">
                                {(productInCustomizationData?.hasVariants) && (
                                    <ProductVariantSelector
                                        templateVariant={productInCustomizationData.templateVariant}
                                        selectedVariant={selectedVariant}
                                        onChangeSelectedVariant={onChangeSelectedVariant}
                                    />
                                )}
                            </div>
                            {/* features selectors */}

                            {(productInCustomizationData?.isCustomizable) && (
                                productInCustomizationData.customizationTemplate?.features.map(item => {
                                    return (
                                        <div className="flex flex-col px-4 mt-8">
                                            {item.type === 'variant' && <ProductFeaturesSelectorTypeVariant feature={{ ...item }} onChangeCustomizationOptionState={onChangeCustomizationOptionState} />}
                                            {item.type === 'check' && <ProductFeaturesSelectorTypeCheck feature={{ ...item }} onChangeCustomizationOptionState={onChangeCustomizationOptionState} />}
                                            {item.type === 'combo' && <ProductFeaturesSelectorTypeCombo feature={{ ...item }} onChangeCustomizationOptionState={onChangeCustomizationOptionState} />}
                                        </div>
                                    )
                                })
                            )}


                            <div className="mt-16 mb-32 ">
                                <ProductCustomizationPreview
                                    productInCustomizationData={productInCustomizationData}
                                    customization={customization}
                                    selectedVariant={selectedVariant}
                                    quantity={quantity}
                                    priceData={priceData}
                                />

                            </div>


                            <div>
                                <textarea className="w-full h-24 p-2 border border-gray-200 rounded-lg" placeholder="Agregar un comentario" />
                            </div>

                        </div>


                    </div>

                    {/* Sección flotante Agregar al carrito */}
                    <AddToCartSection onAddToCart={addProductToCart} />
                </div>
            </div>


        </div>
    )
}

function AddToCartSection({ onAddToCart }: any) {


 

    const handleAddToCart = () => {
        // Validar requisitos mínimos antes de agregar al carrito
        onAddToCart();
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-lg">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between gap-6 ">
                    {/* Selector de cantidad del producto */}
                    {/*
                    <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-gray-700">Cantidad:</span>
                        <QuantitySelector
                            quantity={quantity}
                            onChange={handleQuantityChange}
                            minQuantity={1}
                            maxQuantity={10}
                        />
                    </div>

                    {/* Botón agregar al carrito */}
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





function OptionFeatureItemButton({ onClick, optionData, isSelected, onChangeQuantity }: any) {
    const { id, optionLabel, priceModifier, showQuantitySelector, selectedQuantity, minQuantity, maxQuantity } = optionData


    const handleChangeQuantity = (quantity: any) => {
        onChangeQuantity(id, quantity)
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
                onClick={() => onClick(id, selectedQuantity || 0)}
                className="flex items-center space-x-3 flex-1">
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg' : 'border-gray-300 group-hover:border-orange-400'}`}>
                    {isSelected && <Check className="w-6 h-6" />}
                </div>
                <div className="flex flex-row justify-between w-full">
                    <div className="self-start">
                        <span className="text-sm font-semibold">{optionLabel} {priceModifier > 0 && (
                            <span className="text-sm text-green-600 font-medium ">
                                +${priceModifier}
                            </span>
                        )}</span>
                    </div>
                    <div>

                    </div>

                    {showQuantitySelector && (
                        <QuantitySelectorSmall
                            quantity={selectedQuantity}
                            onChange={handleChangeQuantity}
                            minQuantity={minQuantity}
                            maxQuantity={maxQuantity}
                        />
                    )}

                </div>

            </button>
        </div>
    )
}

const ProductFeaturesSelectorTypeVariant = ({ feature, onChangeCustomizationOptionState }: any) => {

    const [featureOptionsState, setFeatureOptionsState] = useState([])


    useEffect(() => {
        setFeatureOptionsState(feature.options.map(item => ({
            id: item.id,
            optionLabel: item.emoji + ' ' + item.name,
            priceModifier: item.priceModifier,
            isSelected: item.default ? true : false,
            showQuantitySelector: item.allowSelectQuantity,
            selectedQuantity: null,
            onChangeQuantity: null
        })))
    }, [])

    useEffect(() => {
        onChangeCustomizationOptionState(feature.id, featureOptionsState.filter(item => item.isSelected))
    }, [featureOptionsState])

    const handleClick = (optionId: any) => {
        //Como se puede elegir solo una mapeo y pongo todas es isSelected false excepto la que se eligio.
        setFeatureOptionsState(featureOptionsState.map(item => ({ ...item, isSelected: item.id === optionId ? true : false })))
    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature.emoji + ' ' + feature.name}
            </h5>
            <div className="space-y-2">
                {featureOptionsState.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton onClick={handleClick} optionData={optionFeatureItem} isSelected={optionFeatureItem.isSelected} />
                    )
                })}
            </div>
        </div>
    )
}

const ProductFeaturesSelectorTypeCombo = ({ feature, onChangeCustomizationOptionState }: any) => {

    const [featureOptionsState, setFeatureOptionsState] = useState([])

    useEffect(() => {
        setFeatureOptionsState(feature.options.map(item => ({
            id: item.id,
            optionLabel: item.emoji + ' ' + item.name,
            priceModifier: item.priceModifier,
            showQuantitySelector: true,
            selectedQuantity: 0,
            isSelected: item.defaultQuantity > 0 ? true : false,
            minQuantity: item.minQuantity,
            maxQuantity: item.maxQuantity
        })))
    }, [])

    useEffect(() => {
        console.log('featureOptionsState elegida deberia reflejarlo en el store: ', featureOptionsState)
        onChangeCustomizationOptionState(feature.id, featureOptionsState.filter(item => item.selectedQuantity > 0))
    }, [featureOptionsState])

    const handleClick = (optionId: any) => {
        // Cambiar el estado de la opción seleccionada
        setFeatureOptionsState(featureOptionsState.map(item => {
            if (item.id === optionId) {
                // Si está seleccionada, deseleccionar y poner cantidad en 0
                if (item.isSelected) {
                    return {
                        ...item,
                        isSelected: false,
                        selectedQuantity: 0
                    }
                } else {
                    // Si no está seleccionada, seleccionar y poner cantidad en 1
                    return {
                        ...item,
                        isSelected: true,
                        selectedQuantity: 1
                    }
                }
            }
            return item
        }))
    }
    const handleChangeQuantity = (optionId: any, quantity: any) => {

        //1- Que opcion cambio? puede cambiar??

        setFeatureOptionsState(featureOptionsState.map(item => ({
            ...item,
            selectedQuantity: item.id === optionId ? quantity : item.selectedQuantity,
            isSelected: item.id === optionId ? (quantity > 0) : item.isSelected
        })))

    }

    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature.emoji + ' ' + feature.name}
            </h5>
            <div className="space-y-2">
                {featureOptionsState.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton
                            isSelected={optionFeatureItem.isSelected}
                            optionData={optionFeatureItem}
                            onClick={handleClick}
                            onChangeQuantity={handleChangeQuantity}
                        />
                    )
                })}
            </div>
        </div>
    )
}

const ProductFeaturesSelectorTypeCheck = ({ feature, onChangeCustomizationOptionState }: any) => {
    //Aca puede haber un grupo de opciones chequedas asique varias pueden ser defaultt

    const [featureOptionsState, setFeatureOptionsState] = useState([])

    useEffect(() => {
        setFeatureOptionsState(feature.options.map(item => ({
            id: item.id,
            optionLabel: item.emoji + ' ' + item.name,
            priceModifier: item.priceModifier,
            showQuantitySelector: item.allowSelectQuantity,
            selectedQuantity: null,
            isSelected: item.default ? true : false
        })))
    }, [])

    useEffect(() => {
        console.log('featureOptionsState elegida deberia reflejarlo en el store: ', featureOptionsState)
        //Filtro solo las chequeadas y se las paso al store.
        onChangeCustomizationOptionState(feature.id, featureOptionsState.filter(item => item.isSelected))
    }, [featureOptionsState])

    const handleClick = (optionId: any) => {
        //En este caso debo cambiar el state de la opcion seleccionada pero antes ver las constraints

        setFeatureOptionsState(featureOptionsState.map(item => ({ ...item, isSelected: item.id === optionId ? !item.isSelected : item.isSelected })))
    }



    return (
        <div className="flex flex-col gap-6">
            <h5 className="text-base font-semibold text-gray-800 self-center flex items-center gap-4">
                {feature.emoji + ' ' + feature.name}
            </h5>
            <div className="space-y-2">
                {featureOptionsState.map((optionFeatureItem: any) => {
                    return (
                        <OptionFeatureItemButton
                            isSelected={optionFeatureItem.isSelected}
                            optionData={optionFeatureItem}
                            onClick={handleClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}



//-----------------------------------------------------------
function ProductCustomizationPreview({ productInCustomizationData, customization, selectedVariant, priceData, quantity }) {

    console.log('productInCustomizationData en preview  : ', productInCustomizationData)
    console.log('customization en preview: ', customization)
    console.log('selectedVariant en preview: ', selectedVariant)



    return (
        <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-3">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 self-center">
               {productInCustomizationData.name}
            </h4>
            {selectedVariant && (
                <div className="w-full flex items-center justify-center bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">

                            <span className="text-sm font-semibold text-gray-800 underline decoration-solid">
                                {productInCustomizationData.templateVariant.label + ':'}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                                {selectedVariant.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {customization?.length > 0 && (
                <div className="w-full flex flex-col  gap-3">
                    {customization?.map((feature, featureIndex) => (
                        feature.options.length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="w-full flex items-center justify-center">
                                    <div className="flex flex-wrap gap-2 ">


                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-sm font-semibold text-gray-800 underline decoration-solid self-center">
                                                {feature.name + ':'}
                                            </span>
                                            {feature.options.map((option, optionIndex) => (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-800">{option.optionLabel} {option.priceModifier ? <span className="text-xs text-green-600 font-medium">
                                                        (+${option.priceModifier})
                                                    </span> : null} </span>
                                                    {option.selectedQuantity > 0 && (
                                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                                            x{option.selectedQuantity}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            <div className="w-full flex justify-between bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800 uppercase">
                        Precio Unitario
                    </span>
                    <span className="text-xl text-center font-medium text-gray-800">
                        ${priceData.unitPrice}
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
                        ${priceData.totalPrice}
                    </span>
                </div>
            </div>
        </div>
    )

    // Obtener variante seleccionada si existe

}







//--------------------------------------------------------------------------------------------------

function ProductVariantSelector({ templateVariant, selectedVariant, onChangeSelectedVariant }: any): any {

    return (
        <div className="w-full flex flex-col items-center gap-3 border border-gray-200 rounded-lg p-4">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2 b">
                <span className="text-lg">{templateVariant.emoji}</span>
                {`Seleccionar ${templateVariant.label || 'una opcion...'}`}
            </h5>
            <div className="grid grid-cols-2 gap-2">
                {templateVariant.options.map((optionVariant: any) => {
                    const isSelected = optionVariant.id === selectedVariant.id
                    return (
                        <button
                            key={optionVariant.id}
                            type="button"
                            onClick={() => onChangeSelectedVariant(optionVariant.id)}
                            className={`group relative flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all duration-300 ${isSelected
                                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-900 shadow-lg ring-2 ring-orange-200/50'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 shadow-md hover:shadow-lg'
                                }`}
                        >
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
                                            {optionVariant.emoji || '📌'}
                                        </span>
                                        <span className="text-sm font-semibold">{optionVariant.label}</span>
                                    </div>
                                    {optionVariant.affectPrice > 0 && (
                                        <span className="text-xs text-green-600 font-medium ml-7">
                                            +${optionVariant.affectPrice}/unid
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




function ProductDetail({ productInCustomizationData }) {

    if (!productInCustomizationData) {
        return <div className="text-gray-500 text-sm">No hay producto para mostrar</div>
    }

    return (
        <div className="bg-white shadow-lg border-0 overflow-hidden flex flex-row">
            {/* Image Container */}
            <div className="w-2/6 relative overflow-hidden h-56">
                <img
                    src={productInCustomizationData?.images?.[0]?.url || '/images/default-product.jpg'}
                    alt={productInCustomizationData?.name}
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
                        {productInCustomizationData.name}
                    </h3>
                    <p className="text-gray-600 text-sm text-justify line-clamp-3 leading-relaxed">
                        {productInCustomizationData.description || "Producto sin descripción"}
                    </p>
                </div>



            </div>
        </div>
    )
}











