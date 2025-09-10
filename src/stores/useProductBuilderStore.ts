import { create } from "zustand";
import { useCartStore } from "@/stores";

const useProductBuilderStore = create((set, get) => ({
    productInCustomizationData: null,
    selectedVariant: null,
    customization: null,
    quantity: null,

    customizerIsOpen: false,
    customizationError: null,
  
    
    closeCustomizer: () => {
        set({ customizerIsOpen: false })
    },

    setQuantity: (quantity: any) => {
        set({ quantity: quantity })
    },

    handlerProductToAddToCart: ({ product, selectedVariantId, quantity = 1, onSuccess, onError }: any) => {

        //Sea customizable o no, si el producto es diferente al producto en customizacion hay que resetear los valores de customizacion
        if (
            (product.id !== get().productInCustomizationData?.id || !get().productInCustomizationData) ||
            ((product.hasVariants) && (selectedVariantId !== get().selectedVariant?.id))) {
            set({
                customization: product.isCustomizable ? product.customizationTemplate.features.map((item: any) => ({ ...item, options: [] })) : null,
                selectedVariant: product.hasVariants ? product.templateVariant.options.find((item: any) => item.id === selectedVariantId) : null,
                quantity: quantity,
                productInCustomizationData: product,
                customizerIsOpen: true
            })
        }

        //Si es customizble abro el customizer, si no, agrego al carro si se cumple la validacion de variante
        
                
    },


    setSelectedVariant: (selectedVariantId: any) => {
        if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
        if (!get().productInCustomizationData.hasVariants) throw new Error('El producto no tiene variantes')
        const selectedVariant = get().productInCustomizationData.templateVariant.options.find((item: any) => item.id === selectedVariantId)
        if (!selectedVariant) throw new Error('La variante seleccionada no existe')
        set({ selectedVariant: selectedVariant })

    },

    setCustomizationOptionsFeature: (featureId, newOptionsStateArray: any) => {
        //Busco la featureId si existe y si existe reemplazo las options por las nuevas
        const featureToModifyIndex = get().customization.findIndex((item: any) => item.id === featureId)
        if (featureToModifyIndex < 0) throw new Error('La feature no existe')
        set({ customization: get().customization.map((item: any, index: any) => index === featureToModifyIndex ? { ...item, options: newOptionsStateArray } : item) })
        console.log('customization modfied: ', get().customization)

    }


}))




function getCartItemForProductsVariantFalseAndCustomizableFalse({ product, quantity }: any) {
    return {
        product: product,
        quantity: quantity,
        selectedVariant: null,
        customization: null
    }
}

function getCartItemForProductsVariantTrueAndCustomizableFalse({ product, quantity, selectedVariantId }: any) {
    if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
    const variantExists = product.templateVariant.options.find(item => item.id === selectedVariantId)
    if (!variantExists) throw new Error('La variante seleccionada no existe')

    return {
        product: product,
        quantity: quantity,
        selectedVariant: variantExists,
        customization: null
    }
}






export default useProductBuilderStore;