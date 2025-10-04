import { create } from "zustand";
import { useCartStore, useProductsStore } from "@/stores";

interface ProductBuilderState {
  currentProduct: any;
  quantity: number;
  customizerIsOpen: boolean;
  customizationError: string | null;
  selectedVariant: any;
  customization: any;
  priceData: any;
  cartItem: any;


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
    productPreview: null,


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
                    currentProduct: getProductBuilderTemplate(productToBuild),
                    quantity: quantity,
                    selectedVariant: productToBuild.hasVariants ? productToBuild.templateVariant.options.find((item: any) => item.id === selectedVariantId) : null,
                    customization: productToBuild.isCustomizable ? productToBuild.customizationTemplate.features.map((item: any) => ({ ...item, options: [] })) : null,
                })
            
            get().setPriceData()    
            get().setProductPreview()
                
            
        }
        catch(error: any){
            console.error('Error al resetear producto:', error.message)
            get().setError(error.message)
            throw error
        }
    },

    setProductPreview: () => {
        alert('setProductPreview')
        set({ productPreview: getCurrentProductPreview(get().currentProduct) })
    },

    

    setSelectedVariant: ({selectedVariantId, onError}) => {
        try{
            if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
             const modifiedCurrentProduct = getProductBuilderTemplateWithVariantModified(get().currentProduct, selectedVariantId)
             set({ currentProduct: modifiedCurrentProduct })   
            get().setPriceData()
            get().setProductPreview()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)
        }
    },

    setCustomizationFeatureTypeVariant: ({featureId, selectedOptionId, onError}: {featureId: string, selectedOptionId: string, onError: (errorMessage: string) => void}) => {
        try{ 
            if (!featureId || !selectedOptionId) throw new Error('No se ha seleccionado ninguna caracteristica o opcion para la variante.')
             const modifiedCurrentProduct = getProductBuilderTemplateWithCustomizationTypeVariantModified(get().currentProduct, featureId, selectedOptionId)
             set({ currentProduct: modifiedCurrentProduct })   
            get().setPriceData()
            get().setProductPreview()
            
        }catch(error: any){
           
            get().setError(error.message)
            onError?.(error.message)
        }
    },

    setCustomizationFeatureTypeCheck: ({featureId, selectedOptionId, onError}: {featureId: string, selectedOptionId: string, onError: (errorMessage: string) => void}) => {
        try{ 
            if (!featureId || !selectedOptionId) throw new Error('No se ha seleccionado ninguna caracteristica o opcion para la variante.')
             const modifiedCurrentProduct = getProductBuilderTemplateWithCustomizationTypeCheckModified(get().currentProduct, featureId, selectedOptionId)
             set({ currentProduct: modifiedCurrentProduct })   
            get().setPriceData()
            get().setProductPreview()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)
        }
    },

    setCustomizationFeatureTypeCombo: ({featureId, selectedOptionId, newSelectedQuantity, onError}: {featureId: string, selectedOptionId: string, newSelectedQuantity: number, onError: (errorMessage: string) => void}) => {
        try{ 
            if (!featureId || !selectedOptionId) throw new Error('No se ha seleccionado ninguna caracteristica o opcion para la variante.')
             const modifiedCurrentProduct = getProductBuilderTemplateWithCustomizationTypeComboModified(get().currentProduct, featureId, selectedOptionId, newSelectedQuantity)
             set({ currentProduct: modifiedCurrentProduct })   
            get().setPriceData()
            get().setProductPreview()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)
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

    /*
    setCustomizationOptionsFeature: (featureId: string, newOptionsStateArray: any[]) => {
        //Busco la featureId si existe y si existe reemplazo las options por las nuevas
        const featureToModifyIndex = get().customization.findIndex((item: any) => item.id === featureId)
        if (featureToModifyIndex < 0) throw new Error('La feature no existe')
        set({ customization: get().customization.map((item: any, index: any) => index === featureToModifyIndex ? { ...item, options: newOptionsStateArray } : item) })
        console.log('customization modfied: ', get().customization)
        get().setPriceData()
    },
    */
    

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


function getProductBuilderTemplate(product: any): any {
    try{

        function getProductBuilderFeatureTemplate (feature: any){
            if (feature.type == 'variant'){
                return {
                    ...feature,
                    options: feature.options.map((item: any) => ({...item, isSelected: false}))
                }
            }
        
            if (feature.type == 'check'){
                return {
                    ...feature,
                    options: feature.options.map((item: any) => ({...item, isSelected: false}))
                }
            }

            if (feature.type == 'combo'){
                return {
                    ...feature,
                    options: feature.options.map((item: any) => ({...item, isSelected: false, selectedQuantity: 0}))
                }
            }
        }
        


        if (!product) throw new Error('El producto no existe.')
        const productBuilderTemplate = {
            ...product,
            templateVariant: product.hasVariants ? {
                ...product.templateVariant,
                options: product.templateVariant.options.map((item: any) => ({...item, isSelected: false}))
            } : null, 
            customizationTemplate: product?.isCustomizable ? {
                ...product?.customizationTemplate,
                features:product?.customizationTemplate.features.map((item: any) => getProductBuilderFeatureTemplate(item)) 
            }: null,
        }

    

        return productBuilderTemplate
    }catch(error: any){
        throw error
    }
}


function getProductBuilderTemplateWithVariantModified(product: any, selectedVariantId: any): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.hasVariants) throw new Error('El producto no tiene variantes.')
        const variantIndex = product.templateVariant.options.findIndex((item: any) => item.id === selectedVariantId)
        if (variantIndex < 0) throw new Error('La variante seleccionada no existe.')
        //Pongo todas en false excepecta la seleccionada
        const newOptionsArray = product.templateVariant.options.map((item: any) => ({...item, isSelected: item.id == selectedVariantId ? true : false}))


        return {
            ...product,
            templateVariant: {
                ...product.templateVariant,
                options: newOptionsArray
            }
        }
    }catch(error: any){
        throw error
    }
  
}



function getProductBuilderTemplateWithCustomizationTypeVariantModified(product: any, featureId: string, selectedOptionId: string): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.isCustomizable) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationTemplate?.features?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
        //Pongo todas en false excepecta la seleccionada
        const newOptionsArray = product.customizationTemplate.features[featureIndex].options.map((item: any) => ({...item, isSelected: item.id == selectedOptionId ? true : false}))
        
        
        const customization = product.customizationTemplate.features.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)
        return {
            ...product,
            customizationTemplate: {
                ...product.customizationTemplate,
                features: customization
            }
        }
    }catch(error: any){
        throw error
    }
  
}


function getProductBuilderTemplateWithCustomizationTypeCheckModified(product: any, featureId: string, selectedOptionId: string): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.isCustomizable) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationTemplate?.features?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
        
        //SI esta desmarcada la desmarco y viceversa
        const optionIndex = product.customizationTemplate.features[featureIndex].options.findIndex((item: any) => item.id === selectedOptionId)
        if (optionIndex < 0) throw new Error('La option seleccionada no existe.')
            
        const newOptionsArray = product.customizationTemplate.features[featureIndex].options.map((item: any) => {
            if (item.id == selectedOptionId) return {...item, isSelected: !item.isSelected}
            return {...item}
        })
                
        const customization = product.customizationTemplate.features.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)
        return {
            ...product,
            customizationTemplate: {
                ...product.customizationTemplate,
                features: customization
            }
        }
    }catch(error: any){
        throw error
    }
  
}



function getProductBuilderTemplateWithCustomizationTypeComboModified(product: any, featureId: string, selectedOptionId: string, newSelectedQuantity: number): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.isCustomizable) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationTemplate?.features?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
        
        //SI esta desmarcada la desmarco y viceversa
        const optionIndex = product.customizationTemplate.features[featureIndex].options.findIndex((item: any) => item.id === selectedOptionId)
        if (optionIndex < 0) throw new Error('La option seleccionada no existe.')
            
        const newOptionsArray = product.customizationTemplate.features[featureIndex].options.map((item: any) => {
            if (item.id == selectedOptionId) 
                return {...item, isSelected: newSelectedQuantity > 0  ? true: false,         selectedQuantity: newSelectedQuantity}
            return {...item}
        })
                
        const customization = product.customizationTemplate.features.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)
        return {
            ...product,
            customizationTemplate: {
                ...product.customizationTemplate,
                features: customization
            }
        }
    }catch(error: any){
        throw error
    }

    //Comportamientos esperados
  
}

 const getCurrentProductPreview = (currentProduct: any) => {
    return {
       title: currentProduct?.name,
       image: currentProduct?.images?.[0]?.url,
       variant: {
           label: currentProduct?.templateVariant?.label,
           selectedOption: currentProduct?.templateVariant?.options?.find((option: any) => option?.isSelected),
        },
        customizationFeatures: currentProduct?.customizationTemplate?.features?.map((feature) => 
            ({
                ...feature,
                options: feature?.options?.filter((option: any) => option?.isSelected)
            })
        )
    }
}

