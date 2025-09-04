"use client"

import { useState, useEffect } from "react"
import { X, Check } from 'lucide-react'


export default function ProductCustomizer({ productToCustomize }: any) {

    //Vopy a meter al state el json del producto y en est estado lo voy a modificar para enviarle al carro una copia del json original pero modificao con lo customizado
    const [currentProduct, setCurrentProduct] = useState(null)


    useEffect(() => {
        console.log('PP: ', productToCustomize)
        if (productToCustomize) setCurrentProduct(productToCustomize)
    }, [productToCustomize])

    useEffect(() => {
        console.log('Customizer: ', currentProduct)
    }, [currentProduct])

    const onChangeSelectedVariant = (selectedVariantId: any) => {
        setCurrentProduct(prevProduct => ({
            ...prevProduct,
            templateVariant: {
                ...prevProduct.templateVariant,
                options: prevProduct.templateVariant.options.map(item => ({
                    ...item,
                    isSelected: item.id === selectedVariantId
                }))
            }
        }))
    }

    const onChangeCustomizationOptionState = (featureId, customizationOptionId) => {
        //Busco la caracteristica y la option para reemplazar su estado
        const prevProduct = { ...currentProduct }
        const featureToModified = prevProduct.customizationTemplate.features.find(feature => feature.id === featureId)
        const optionToModify = featureToModified.options.find(option => option.id === customizationOptionId)

        // Determino el comportamiento basado en maxSelectable en lugar de type
        if (featureToModified.maxSelectable > 1) {
            // Para features con maxSelectable > 1: toggle del estado (múltiple selección)
            const currentlySelectedCount = featureToModified.options.filter(option => option.isSelected).length
            const isOptionCurrentlySelected = optionToModify.isSelected

            // Si la opción ya está seleccionada, siempre permitir deseleccionar
            if (isOptionCurrentlySelected) {
                const modifiedFeature = {
                    ...featureToModified,
                    options: featureToModified.options.map(item =>
                        item.id === customizationOptionId
                            ? { 
                                ...item, 
                                isSelected: false,
                                // Si no permite seleccionar cantidad, resetear a 0
                                selectedQuantity: item.allowSelectQuantity ? 0 : 0
                            }
                            : { ...item } // Mantener estado actual
                    )
                }

                const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
                prevProduct.customizationTemplate.features[index] = modifiedFeature
            } else {
                // Si la opción no está seleccionada, solo permitir seleccionar si no se ha alcanzado el límite
                if (currentlySelectedCount < featureToModified.maxSelectable) {
                    const modifiedFeature = {
                        ...featureToModified,
                        options: featureToModified.options.map(item =>
                            item.id === customizationOptionId
                                ? { 
                                    ...item, 
                                    isSelected: true,
                                    // Si no permite seleccionar cantidad, poner en 1
                                    selectedQuantity: item.allowSelectQuantity ? item.selectedQuantity : 1
                                }
                                : { ...item } // Mantener estado actual
                        )
                    }

                    const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
                    prevProduct.customizationTemplate.features[index] = modifiedFeature
                } else {
                    console.log(`⚠️ No se puede seleccionar más opciones. Máximo permitido: ${featureToModified.maxSelectable}`)
                    return // No hacer cambios si se alcanzó el límite
                }
            }
        } else if (featureToModified.maxSelectable === 1) {
            // Para features con maxSelectable = 1: solo una selección (radio button)
            const modifiedFeature = {
                ...featureToModified,
                options: featureToModified.options.map(item => ({
                    ...item,
                    isSelected: item.id === customizationOptionId,
                    // Si no permite seleccionar cantidad, poner en 1 cuando está seleccionado, 0 cuando no
                    selectedQuantity: item.id === customizationOptionId 
                        ? (item.allowSelectQuantity ? item.selectedQuantity : 1)
                        : 0
                }))
            }

            const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
            prevProduct.customizationTemplate.features[index] = modifiedFeature
        }

        console.log('Prev ofsfs', prevProduct)
        setCurrentProduct(prevProduct)
    }

    const onChangeQuantity = (featureId, optionId, newQuantity) => {
        const prevProduct = { ...currentProduct }
        const featureToModified = prevProduct.customizationTemplate.features.find(feature => feature.id === featureId)
        
        const modifiedFeature = {
            ...featureToModified,
            options: featureToModified.options.map(item =>
                item.id === optionId
                    ? { ...item, selectedQuantity: newQuantity }
                    : { ...item }
            )
        }

        const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
        prevProduct.customizationTemplate.features[index] = modifiedFeature
        
        setCurrentProduct(prevProduct)
    }





    if (!currentProduct) return ("No hay nada")

    return (
        <div className="grid grid-cols-2 gap 4">
            {(currentProduct?.hasVariants) && (
                <ProductVariantSelector
                    templateVariant={currentProduct.templateVariant}
                    onChangeSelectedVariant={onChangeSelectedVariant}
                />
            )}

            {(currentProduct?.isCustomizable) && (
                currentProduct.customizationTemplate?.features.map(item =>
                    <ProductFeaturesSelector
                        feature={{ ...item }}
                        onChangeCustomizationOptionState={onChangeCustomizationOptionState}
                        onChangeQuantity={onChangeQuantity}
                    />
                )
            )}

            {(currentProduct && <ProductCustomizationPreview product={currentProduct}/>)}
        </div>
    )
}



//-----------------------------------------------------------
function ProductCustomizationPreview({product}){
    if (!product || !product.customizationTemplate) {
        return <div className="text-gray-500 text-sm">No hay customización disponible</div>
    }

    const selectedOptions = []
    
    // Recopilar todas las opciones seleccionadas
    product.customizationTemplate.features.forEach(feature => {
        feature.options.forEach(option => {
            if (option.isSelected) {
                selectedOptions.push({
                    featureName: feature.label,
                    optionName: option.name,
                    quantity: option.selectedQuantity || 1
                })
            }
        })
    })

    return(
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-xl">🍽️</span>
                Tu Pedido Personalizado
            </h4>
            
            {selectedOptions.length === 0 ? (
                <p className="text-gray-500 text-sm">No has seleccionado ninguna opción adicional</p>
            ) : (
                <div className="space-y-2">
                    {selectedOptions.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500">✓</span>
                                <span className="text-sm font-medium text-gray-800">{item.optionName}</span>
                            </div>
                            {item.quantity > 1 && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                    x{item.quantity}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Total de opciones seleccionadas: <span className="font-medium">{selectedOptions.length}</span>
                </p>
            </div>
        </div>
    )
}


function ProductFeaturesSelector({ feature, onChangeCustomizationOptionState, onChangeQuantity }: any): any {

    return (
        <div className="space-y-3">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-lg">🌭</span>
                {feature.label || 'Seleccionar opciones...'}{(` (Max  ${feature.maxSelectable})`)}
            </h5>
            <div className="space-y-2">
                {feature.options.map((optionFeatureItem: any) => {

                    return (
                        <div
                            key={optionFeatureItem.id}
                            className={`w-full group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${optionFeatureItem.isSelected
                                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-900 shadow-lg ring-2 ring-orange-200/50'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 shadow-md hover:shadow-lg'
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => onChangeCustomizationOptionState(feature.id, optionFeatureItem.id)}
                                className="flex items-center space-x-3 flex-1"
                            >
                                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300 ${optionFeatureItem.isSelected
                                    ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg'
                                    : 'border-gray-300 group-hover:border-orange-400'
                                    }`}>
                                    {optionFeatureItem.isSelected && (
                                        <Check className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                        {optionFeatureItem.emoji || '🌭'}
                                    </span>
                                    <span className="text-sm font-semibold">{optionFeatureItem.name}</span>
                                </div>
                            </button>
                            
                            {/* Selector de cantidad - se muestra siempre si allowSelectQuantity es true */}
                            {optionFeatureItem.allowSelectQuantity && (
                                <QuantitySelector
                                    quantity={optionFeatureItem.selectedQuantity || 0}
                                    onChange={(newQuantity) => onChangeQuantity(feature.id, optionFeatureItem.id, newQuantity)}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}



//--------------------------------------------------------------------------------------------------

function ProductVariantSelector({ templateVariant, onChangeSelectedVariant }: any): any {
    return (
        <div className="space-y-3">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-lg">🌭</span>
                {templateVariant.label || 'Seleccionar una opcion...'}
            </h5>
            <div className="space-y-2">
                {templateVariant.options.map((optionVariant: any) => {
                    const isSelected = optionVariant.isSelected
                    return (
                        <button
                            key={optionVariant.id}
                            type="button"
                            onClick={() => onChangeSelectedVariant(optionVariant.id)}
                            className={`w-full group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${isSelected
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
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                        {optionVariant.emoji || '🌭'}
                                    </span>
                                    <span className="text-sm font-semibold">{optionVariant.label}</span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}


//------------------------------------------------------------------------------------------------------------

function QuantitySelector({ quantity, onChange }: any) {
    const handleIncrement = (e: any) => {
        e.stopPropagation() // Evitar que se active el click del botón padre
        onChange(quantity + 1)
    }

    const handleDecrement = (e: any) => {
        e.stopPropagation() // Evitar que se active el click del botón padre
        if (quantity > 0) {
            onChange(quantity - 1)
        }
    }

    return (
        <div className="flex items-center space-x-2 bg-white rounded-lg border border-orange-200 p-1">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 0}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    quantity <= 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
            >
                −
            </button>
            <span className="text-sm font-semibold text-orange-800 min-w-[20px] text-center">
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            >
                +
            </button>
        </div>
    )
}















