import { create } from "zustand";
import { useCartStore, useProductsStore } from "@/stores";


interface ProductBuilderState {
  currentProduct: any;
  selectedVariant: any;
  customization: any;
  quantity: number;
  priceData: any;
  cartItem: any;
  customizerIsOpen: boolean;
  customizationError: string | null;

  openCustomizer: () => void;
  closeCustomizer: () => void;
  setError: (errorMessage: string) => void;
  setQuantity: (quantity: number) => void;
  handlerProductToAddToCart: ({ productId, selectedVariantId, quantity, onError }: {productId: string, selectedVariantId: string, quantity?: number, onError?: (errorMessage: string) => void}) => void;
  _resetCurrentProduct: ({ productId, selectedVariantId, quantity }: {productId: string, selectedVariantId: string, quantity?: number}) => void;
  setPriceData: () => void;
  setSelectedVariant: ({ selectedVariantId, onError }: {selectedVariantId: string, onError: (errorMessage: string) => void}) => void;
}


const useProductBuilderStore = create<ProductBuilderState>((set, get) => ({
    currentProduct: null,
    selectedVariant: null,
    customization: null,
    quantity: 0,
    priceData: null,
    cartItem: null,

    customizerIsOpen: false,
    customizationError: null,

    
    openCustomizer: () => {
        set({ customizerIsOpen: true })
    },
    closeCustomizer: () => {
        set({ customizerIsOpen: false })
    },

    setQuantity: (quantity: any) => {
        set({ quantity: quantity })
        get().setPriceData()
    },

    setError: (errorMessage: string) => {
        console.error('Error al resetear producto:', error.message)
        set({ customizationError: errorMessage })
    },

   
    handlerProductToAddToCart: ({ productId, selectedVariantId, quantity = 1, onError }) => {
        try {
            if (!productId) throw new Error('No se ha seleccionado ningun producto.')    
            if ((productId !== get().currentProduct?.id || !get().currentProduct)) get()._resetCurrentProduct({productId, selectedVariantId, quantity })
            get().openCustomizer()
        }  catch(error : any) {
            get().setError(error.message)
            onError?.(error.message)
        }
    },

    _resetCurrentProduct: ({productId, selectedVariantId, quantity = 1}) => {
        try{
             const productToBuild = useProductsStore.getState().getProductById(productId)
             if (!productToBuild) throw new Error('El producto seleccionado no existe.')
             checkProductVariant({ product: productToBuild, selectedVariantId })
             set({
                    currentProduct: productToBuild,
                    quantity: quantity,
                    selectedVariant: productToBuild.hasVariants ? productToBuild.templateVariant.options.find((item: any) => item.id === selectedVariantId) : null,
                    customization: productToBuild.isCustomizable ? productToBuild.customizationTemplate.features.map((item: any) => ({ ...item, options: [] })) : null,
                })
            get().setPriceData()      
        }
        catch(error: any){
            console.error('Error al resetear producto:', error.message)
            get().setError(error.message)
            throw error
        }
    },

    //Revisar despuees.
    setPriceData: () => {
        set({
            priceData: calculateTotalPrice({
            currentProduct: get().currentProduct,
            selectedVariant: get().selectedVariant,
            customization: get().customization,
            quantity: get().quantity
        })})
    },
    

    setSelectedVariant: ({selectedVariantId, onError}) => {
        try{
            if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
            const selectedVariant = getProductVariant({product: get().currentProduct, selectedVariantId: selectedVariantId})
            set({ selectedVariant: selectedVariant })
            get().setPriceData()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)
        }
       
    },

    setCustomizationOptionsFeature: (featureId: string, newOptionsStateArray: any[]) => {
        //Busco la featureId si existe y si existe reemplazo las options por las nuevas
        const featureToModifyIndex = get().customization.findIndex((item: any) => item.id === featureId)
        if (featureToModifyIndex < 0) throw new Error('La feature no existe')
        set({ customization: get().customization.map((item: any, index: any) => index === featureToModifyIndex ? { ...item, options: newOptionsStateArray } : item) })
        console.log('customization modfied: ', get().customization)
        get().setPriceData()
    },
    

    addProductToCart: () => {
        useCartStore.getState().addToCart({
            product: get().currentProduct,
            quantity: get().quantity,
            selectedVariant: get().selectedVariant,
            customization: get().customization,
            priceData: get().priceData,
        })
        get().closeCustomizer()
    }

}))

export default useProductBuilderStore;


//--------------------------------------------------------------------------------------------------------------------------------------
//Helpers
interface calculateTotalPriceProps{
    currentProduct: any;
    selectedVariant: any;
    customization: any;
    quantity: number;
}


const calculateTotalPrice = ({ currentProduct, selectedVariant, customization, quantity }: calculateTotalPriceProps) => {
    const getBasePrice = () => {
        const productPrice = currentProduct.hasVariants ? selectedVariant.price : currentProduct.price
        return productPrice.finalPrice
    }

    const totalOfCustomizationOptions = (
        currentProduct.isCustomizable ?
            customization.reduce((total: any, item: any) => total + item.options.reduce((total: any, option: any) => total + option.priceModifier, 0), 0) : 0
    )
    return {
        unitPrice: getBasePrice(),
        totalPrice: (getBasePrice() + totalOfCustomizationOptions) * quantity
    }
}

 function checkProductVariant({product, selectedVariantId}: {product: any, selectedVariantId: any}): void {
    if (product.hasVariants && !selectedVariantId) throw new Error('No se ha seleccionado ninguna variante.')
    if (product.hasVariants && (!product.templateVariant.options.find((item: any) => item.id === selectedVariantId))) throw new Error('La variante seleccionada no existe.')
}


interface ProductVariant {
  id: string;
  name: string;
  label: string;
  price: {
    basePrice: number;
    discount: number | null;
    finalPrice: number;
  };
  sku: string;
  prepTime: {
    min: number;
    max: number;
  };
  isDefault: boolean;
  isActive: boolean;
}
function getProductVariant({product, selectedVariantId}: {product: any, selectedVariantId: string}): ProductVariant | null {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.hasVariants) throw new Error('El producto no tiene variantes.')
        const selectedVariant = product.templateVariant.options.find((item: any) => item.id === selectedVariantId)
        return selectedVariant || null
    }catch(error: any){
        throw error
    }
  
}