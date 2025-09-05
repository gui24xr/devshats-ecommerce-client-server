"use client"

import { useState, useEffect } from "react"
import {  Check } from 'lucide-react'


export default function ProductCustomizer({ productToCustomize, onAddToCart }: any) {

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
                                    // Si permite seleccionar cantidad y está en 0, poner en 1 automáticamente
                                    selectedQuantity: item.allowSelectQuantity
                                        ? (item.selectedQuantity === 0 ? 1 : item.selectedQuantity)
                                        : 1
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
                    // Si está seleccionado y permite cantidad y está en 0, poner en 1 automáticamente
                    selectedQuantity: item.id === customizationOptionId
                        ? (item.allowSelectQuantity
                            ? (item.selectedQuantity === 0 ? 1 : item.selectedQuantity)
                            : 1)
                        : 0
                }))
            }

            const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
            prevProduct.customizationTemplate.features[index] = modifiedFeature
        }

        console.log('Prev ofsfs', prevProduct)
        setCurrentProduct(prevProduct)
    }

    // Función para validar cantidad mínima requerida
    const validateMinimumRequired = (product) => {
        if (!product || !product.customizationTemplate) return true

        const errors = []
        
        product.customizationTemplate.features.forEach(feature => {
            if (feature.minSelectedRequired > 0) {
                const currentTotalQuantity = feature.options.reduce((total, option) => {
                    return total + (option.isSelected ? (option.selectedQuantity || 0) : 0)
                }, 0)

                if (currentTotalQuantity < feature.minSelectedRequired) {
                    errors.push(`${feature.label}: Necesitas seleccionar al menos ${feature.minSelectedRequired} elementos`)
                }
            }
        })

        if (errors.length > 0) {
            alert(`⚠️ Requisitos no cumplidos:\n\n${errors.join('\n')}`)
            return false
        }

        return true
    }

    const onChangeQuantity = (featureId, optionId, newQuantity) => {
        const prevProduct = { ...currentProduct }
        const featureToModified = prevProduct.customizationTemplate.features.find(feature => feature.id === featureId)
        const optionToModify = featureToModified.options.find(option => option.id === optionId)

        // Calcular cantidad total actual de elementos seleccionados en esta feature
        const currentTotalQuantity = featureToModified.options.reduce((total, option) => {
            return total + (option.isSelected ? (option.selectedQuantity || 0) : 0)
        }, 0)

        // Calcular nueva cantidad total si se aplica el cambio
        const newTotalQuantity = currentTotalQuantity - (optionToModify.selectedQuantity || 0) + newQuantity

        // Validar si excede el máximo permitido
        if (newTotalQuantity > featureToModified.maxSelectable) {
            alert(`⚠️ No puedes seleccionar más de ${featureToModified.maxSelectable} elementos en ${featureToModified.label}`)
            return // No hacer cambios
        }

        // Si la cantidad cambia de 0 a mayor que 0, seleccionar la opción automáticamente
        const shouldSelect = optionToModify.selectedQuantity === 0 && newQuantity > 0
        const shouldDeselect = optionToModify.selectedQuantity > 0 && newQuantity === 0

        const modifiedFeature = {
            ...featureToModified,
            options: featureToModified.options.map(item =>
                item.id === optionId
                    ? { 
                        ...item, 
                        selectedQuantity: newQuantity,
                        // Seleccionar automáticamente si se aumenta cantidad de 0
                        isSelected: shouldSelect ? true : (shouldDeselect ? false : item.isSelected)
                    }
                    : { ...item }
            )
        }

        const index = prevProduct.customizationTemplate.features.findIndex(item => item.id === featureToModified.id)
        prevProduct.customizationTemplate.features[index] = modifiedFeature

        setCurrentProduct(prevProduct)
    }





    if (!currentProduct) return ("No hay nada")

    return (
        <div className="h-[25vh]">

       
<div className="grid grid-cols-1 gap-4 md:grid-cols-2   ">
            


            <div className="flex flex-col gap-8 overflow-y-auto px-4 overflow-y-auto lg:h-[89vh]">
                <div className="flex flex-wrap">
            {(currentProduct?.hasVariants) && (
                <ProductVariantSelector
                    templateVariant={currentProduct.templateVariant}
                    onChangeSelectedVariant={onChangeSelectedVariant}
                />
            )}
                </div>
                <div className="flex flex-col gap-8">


            {(currentProduct?.isCustomizable) && (
                currentProduct.customizationTemplate?.features.map(item =>
                    <ProductFeaturesSelector
                        feature={{ ...item }}
                                onChangeCustomizationOptionState={onChangeCustomizationOptionState}
                                onChangeQuantity={onChangeQuantity}
                    />
                )
            )}

                   
                </div>
            </div>
            <div className="overflow-y-auto px-4">
            {(currentProduct && <ProductCustomizationPreview product={currentProduct} />)}
            </div>
        </div>

        {/* Botón flotante Agregar al carrito */}
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-md">
            <button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                onClick={() => {
                    // Validar requisitos mínimos antes de agregar al carrito
                    if (validateMinimumRequired(currentProduct)) {
                        onAddToCart(currentProduct, 1)
                    }
                }}
            >
                <span className="text-xl">🛒</span>
                <span>Agregar al carrito</span>
            </button>
        </div>
        </div>
    )
}



//-----------------------------------------------------------
function ProductCustomizationPreview({ product }) {
    if (!product || !product.customizationTemplate) {
        return <div className="text-gray-500 text-sm">No hay customización disponible</div>
    }

    // Obtener variante seleccionada si existe
    const selectedVariant = product.hasVariants && product.templateVariant 
        ? product.templateVariant.options.find(option => option.isSelected)
        : null

    // Recopilar información de features
    const featuresInfo = []
    
    product.customizationTemplate.features.forEach(feature => {
        const selectedOptions = feature.options.filter(option => option.isSelected)
        
        if (selectedOptions.length > 0) {
            featuresInfo.push({
                featureName: feature.label,
                options: selectedOptions.map(option => ({
                    name: option.name,
                    quantity: option.selectedQuantity || 1,
                    allowSelectQuantity: option.allowSelectQuantity
                }))
            })
        }
    })

    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-xl">👁️</span>
                Vista Previa
            </h4>

            {/* Variante seleccionada */}
            {selectedVariant && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">✓</span>
                            <span className="text-sm font-medium text-gray-800">
                                {product.templateVariant.label}: {selectedVariant.label}
                            </span>
                        </div>
                        {selectedVariant.price && selectedVariant.price.finalPrice > 0 && (
                            <span className="text-sm font-semibold text-green-600">
                                ${selectedVariant.price.finalPrice}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Features seleccionadas */}
            {featuresInfo.length === 0 ? (
                <p className="text-gray-500 text-sm">No has seleccionado ninguna opción adicional</p>
            ) : (
                <div className="space-y-3">
                    {featuresInfo.map((feature, featureIndex) => (
                        <div key={featureIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-base">{feature.featureName}</span>
                            </h5>
                            <div className="space-y-1">
                                {feature.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-sm text-gray-800">{option.name}</span>
                                        </div>
                                        {option.allowSelectQuantity && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                                x{option.quantity}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


function ProductFeaturesSelector({ feature, onChangeCustomizationOptionState, onChangeQuantity }: any): any {

    return (
        <div className="space-y-3">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-lg">{feature.emoji || '🌭'}</span>
                {feature.label || 'Seleccionar opciones...'}{(` (Max  ${feature.maxSelectable})`)}
            </h5>
            <div className="space-y-2">
                {feature.options.map((optionFeatureItem: any) => {

                    return (
                        <div
                            key={optionFeatureItem.id}
                            className={`w-full group relative flex items-center justify-between p-1 rounded-xl border-2 transition-all duration-300 ${optionFeatureItem.isSelected
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
                                <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                        {optionFeatureItem.emoji || '🌭'}
                                    </span>
                                    <span className="text-sm font-semibold">{optionFeatureItem.name}</span>
                                </div>
                                    {optionFeatureItem.affectPrice > 0 && (
                                        <span className="text-xs text-green-600 font-medium ml-7">
                                            +${optionFeatureItem.affectPrice}/unid
                                        </span>
                                    )}
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
                <span className="text-lg">{templateVariant.emoji}</span>
                {`Seleccionar ${templateVariant.label || 'una opcion...'}`}
            </h5>
            <div className="flex flex-wrap gap-2">
                {templateVariant.options.map((optionVariant: any) => {
                    const isSelected = optionVariant.isSelected
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
                                        {optionVariant.emoji || '🌭'}
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
        <div className="flex items-center space-x-1 bg-gray-50 rounded-md border border-gray-200 px-1 py-0.5">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 0}
                className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold transition-colors ${quantity <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
            >
                −
            </button>
            <span className="text-xs font-medium text-gray-700 min-w-[12px] text-center">
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            >
                +
            </button>
        </div>
    )
}















