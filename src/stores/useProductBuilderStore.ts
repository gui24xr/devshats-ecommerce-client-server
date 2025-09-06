import { create } from "zustand";
import { useCartStore } from "@/stores";

const useProductBuilderStore = create((set, get) => ({
    productInCustomizationData: null,
    selectedVariant: null,
    customization: null,

    customizerIsOpen: false,
    customizationError: null,
    quantity: null,

    closeCustomizer: () => {
        set({customizerIsOpen: false})
    },

   handlerProductToAddToCart: ({ product, selectedVariantId, quantity = 1, onSuccess, onError }: any) => {
     console.log('Product En handler add to cart: ', product, selectedVariantId, quantity)
    if (!product.isCustomizable) {
        
        if(!product.hasVariants){
            const itemToAdd = getCartItemForProductsVariantFalseAndCustomizableFalse({ product, quantity })
            useCartStore.getState().addToCart(itemToAdd)
        }
        else {
            const itemToAdd = getCartItemForProductsVariantTrueAndCustomizableFalse({ product, quantity, selectedVariantId })
            useCartStore.getState().addToCart(itemToAdd)

        }
     }

     if(product.isCustomizable){
        console.log('Product In Customization  en caso 2: ', get().customizerIsOpen)
        if(!product.hasVariants){
            const itemToCustomize = getCartItemForProductsVariantFalseAndCustomizableTrue({ product, quantity })
            set({productInCustomizationData: itemToCustomize.product, quantity: itemToCustomize.quantity, selectedVariant: itemToCustomize.selectedVariant, customization: itemToCustomize.customization, customizerIsOpen: true})
           
        }
        else {
            const itemToCustomize = getCartItemForProductsVariantTrueAndCustomizableTrue({ product, quantity, selectedVariantId })
            set({productInCustomizationData: itemToCustomize.product, quantity: itemToCustomize.quantity, selectedVariant: itemToCustomize.selectedVariant, customization: itemToCustomize.customization, customizerIsOpen: true})
        }
     }
        
        

       
    },



    setSelectedVariant: (selectedVariantId: any) => {
        if(selectedVariantId && (get().productInCustomizationData.hasVariants)){
            const selectedVariant = get().productInCustomizationData.templateVariant.options.find(item => item.id === selectedVariantId)
            if(!selectedVariant) throw new Error('La variante seleccionada no existe')
            set({selectedVariant: selectedVariant})
            console.log('Selected Variant: ', selectedVariantId)
            console.log('Selected Variant: ', get().selectedVariant)
        }
        else {
            throw new Error('La variante seleccionada no existe')
        }
    },
 



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

function getCartItemForProductsVariantFalseAndCustomizableTrue({ product, quantity }: any) {
    return {
        product: product,
        quantity: quantity,
        selectedVariant: null,
        customizations: []
    }
}

function getCartItemForProductsVariantTrueAndCustomizableTrue({ product, quantity, selectedVariantId }: any) {
    if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
    const variantExists = product.templateVariant.options.find(item => item.id === selectedVariantId)
    if (!variantExists) throw new Error('La variante seleccionada no existe')

    return {
        product: product,
        quantity: quantity,
        selectedVariant: variantExists,
        customizations: []
    }
}



export default useProductBuilderStore;