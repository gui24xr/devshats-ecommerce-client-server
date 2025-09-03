"use client"

import { useState, useEffect } from "react"
import { X, Check } from 'lucide-react'

// En lugar de:
// import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

// Usas:


export default function ProductCustomizer({ product, selectedVariant: selectedVariantInProductCard }: any) {

    //Vopy a meter al state el json del producto y en est estado lo voy a modificar para enviarle al carro una copia del json original pero modificao con lo customizado
    const [customizedProduct, setCustomizedProduct] = useState(null)
    
     const getProductPrice = () => {
        if (product.hasVariants) {
            return selectedVariantInProductCard.price
        }
        return product.price
    }



    useEffect(() => {
        if (product) {
            //Primero para poner lo seleccionado en la feature de la card pongo un isSelected a las variants(si las tiene)
            if(product.hasVariants){
                // Aquí puedes agregar la lógica que necesites
            }
        }
    }, [product])

    useEffect(() => {
        console.log(customizedProduct)
    }, [customizedProduct])

    const onChangeVariant = (selectedVariant: any) => {
        setCustomizedProduct(state => ({ ...state, variant: selectedVariant }))
    }


    const CUSTOMIZATION_OPTIONS = {
        sizes: [
            { id: 'Small', name: 'Pequeño', price: 0, emoji: '🌭' },
            { id: 'Medium', name: 'Mediano', price: 15, emoji: '🌭🌭' },
            { id: 'Large', name: 'Grande', price: 30, emoji: '🌭🌭🌭' }
        ],
        breads: [
            { id: 'Blanco', name: 'Pan Blanco', price: 0, emoji: '🍞' },
            { id: 'Integral', name: 'Pan Integral', price: 5, emoji: '🥖' },
            { id: 'Pretzel', name: 'Pan Pretzel', price: 10, emoji: '🥨' }
        ],
        ingredients: [
            { id: 'queso', name: 'Queso Cheddar', price: 12, emoji: '🧀' },
            { id: 'tocino', name: 'Tocino Crujiente', price: 18, emoji: '🥓' },
            { id: 'cebolla', name: 'Cebolla Caramelizada', price: 8, emoji: '🧅' },
            { id: 'jalapeños', name: 'Jalapeños', price: 6, emoji: '🌶️' },
            { id: 'aguacate', name: 'Aguacate', price: 15, emoji: '🥑' },
            { id: 'champiñones', name: 'Champiñones', price: 10, emoji: '🍄' }
        ],
        sauces: [
            { id: 'ketchup', name: 'Ketchup', price: 0, emoji: '🍅' },
            { id: 'mostaza', name: 'Mostaza', price: 0, emoji: '🟡' },
            { id: 'mayo', name: 'Mayonesa', price: 0, emoji: '⚪' },
            { id: 'bbq', name: 'Salsa BBQ', price: 5, emoji: '🔥' },
            { id: 'chipotle', name: 'Chipotle', price: 8, emoji: '🌶️' },
            { id: 'sriracha', name: 'Sriracha', price: 6, emoji: '🔴' }
        ]
    }

    return (
    <div>productCustomizer






        </div>
    )
}




function ProductFeaturesSelector({ feature, customizationState, }: any): any {

    const onChangeFeatureItem = () => {

    }

    return (
        <div className="space-y-3">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-lg">🌭</span>
                {feature.label || 'Seleccionar opciones...'}
            </h5>
            <div className="space-y-2">
                {feature.options.map((optionFeatureItem: any) => {
                    
                    return (
                        <button
                            key={optionFeatureItem.id}
                            type="button"
                            onClick={() => onChangeFeatureItem()}
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
                                        {optionFeatureItem.emoji || '🌭'}
                                    </span>
                                    <span className="text-sm font-semibold">{optionFeatureItem.name}</span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}



//--------------------------------------------------------------------------------------------------

function ProductVariantSelector({ templateVariant, customizationState, onChangeVariant }: any): any {
    return (
        <div className="space-y-3">
            <h5 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-lg">🌭</span>
                {templateVariant.label || 'Seleccionar una opcion...'}
            </h5>
            <div className="space-y-2">
                {templateVariant.options.map((optionVariant: any) => {
                    const isSelected = optionVariant.id == (customizationState.variant?.id)
                    return (
                        <button
                            key={optionVariant.id}
                            type="button"
                            onClick={() => onChangeVariant(optionVariant)}
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















