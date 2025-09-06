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
        //El producto si es customizable pero es otro producto para personalizar reseteamos los valores de customizacion
        if (
            (get().productInCustomizationData?.id !== product.id) || (!get().productInCustomizationData)){
            set({
                productInCustomizationData: product, 
                quantity: quantity, 
                selectedVariant: product.hasVariants ? product.templateVariant.options.find(item => item.id === selectedVariantId) : null, 
                customization: null, 
                customizerIsOpen: true})
            }
            else {
                set({customizerIsOpen: true})
            }
        }

        if(selectedVariantId && (selectedVariantId !== get().selectedVariant?.id)){
            set({selectedVariant: product.hasVariants ? product.templateVariant.options.find((item: any) => item.id === selectedVariantId) : null})
        }
    },
       
       
        setSelectedVariant: (selectedVariantId: any) => {
            if(!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
            if(!get().productInCustomizationData.hasVariants) throw new Error('El producto no tiene variantes')
            const selectedVariant = get().productInCustomizationData.templateVariant.options.find((item: any) => item.id === selectedVariantId)
            if(!selectedVariant) throw new Error('La variante seleccionada no existe')
            set({selectedVariant: selectedVariant})
        console.log('Selected Variant en store: ', selectedVariant)
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






export default useProductBuilderStore;