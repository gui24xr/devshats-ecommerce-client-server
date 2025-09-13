import { create } from "zustand";
import { useCartStore } from "@/stores";

const useProductBuilderStore = create((set, get) => ({
    productData: null,
    selectedVariant: null,
    customization: null,
    quantity: null,
    priceData: null,
    cartItem: null,

    customizerIsOpen: false,
    customizationError: null,

    closeCustomizer: () => {
        set({ customizerIsOpen: false })
    },

    setQuantity: (quantity: any) => {
        set({ quantity: quantity })
        get().setPriceData()
    },

    handlerProductToAddToCart: ({ product, selectedVariantId, quantity = 1, onSuccess, onError }: any) => {

        if (!product) throw new Error('No se ha seleccionado ningun producto.')
        if (product.hasVariants && !selectedVariantId) throw new Error('No se ha seleccionado ninguna variante.')
        if (product.hasVariants && !selectedVariantId && (!product.templateVariant.options.find((item: any) => item.id === selectedVariantId))) throw new Error('La variante seleccionada no existe.')
        //Sea customizable o no, si el producto es diferente al producto en customizacion hay que resetear los valores de customizacion
        if (
            (product.id !== get().productData?.id || !get().productData)) {
            set({
                productData: product,
                quantity: quantity,
                selectedVariant: product.hasVariants ? product.templateVariant.options.find((item: any) => item.id === selectedVariantId) : null,
                customization: product.isCustomizable ? product.customizationTemplate.features.map((item: any) => ({ ...item, options: [] })) : null,

            })
        }

        get().setPriceData()
        //Siempre abro el customizer
        set({ customizerIsOpen: true })

    },

    setPriceData: () => {
        set({
            priceData: calculateTotalPrice({
                productData: get().productData,
                selectedVariant: get().selectedVariant,
                customization: get().customization,
                quantity: get().quantity
            })
        })
    },

    

    setSelectedVariant: (selectedVariantId: any) => {
        if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
        if (!get().productData.hasVariants) throw new Error('El producto no tiene variantes')
        const selectedVariant = get().productData.templateVariant.options.find((item: any) => item.id === selectedVariantId)
        if (!selectedVariant) throw new Error('La variante seleccionada no existe')
        set({ selectedVariant: selectedVariant })
        get().setPriceData()
    },

    setCustomizationOptionsFeature: (featureId, newOptionsStateArray: any) => {
        //Busco la featureId si existe y si existe reemplazo las options por las nuevas
        const featureToModifyIndex = get().customization.findIndex((item: any) => item.id === featureId)
        if (featureToModifyIndex < 0) throw new Error('La feature no existe')
        set({ customization: get().customization.map((item: any, index: any) => index === featureToModifyIndex ? { ...item, options: newOptionsStateArray } : item) })
        console.log('customization modfied: ', get().customization)
        get().setPriceData()

    }

}))



const calculateTotalPrice = ({ productData, selectedVariant, customization, quantity }: any) => {
    const getBasePrice = () => {
        const productPrice = productData.hasVariants ? selectedVariant.price : productData.price
        return productPrice.finalPrice
    }

    const totalOfCustomizationOptions = (
        productData.isCustomizable ?
            customization.reduce((total: any, item: any) => total + item.options.reduce((total: any, option: any) => total + option.priceModifier, 0), 0) : 0
    )
    return {
        unitPrice: getBasePrice(),
        totalPrice: (getBasePrice() + totalOfCustomizationOptions) * quantity
    }

}





export default useProductBuilderStore;