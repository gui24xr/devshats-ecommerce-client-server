import { Product, ProductTypeBasic, ProductTypeSingleVariant } from "@/types";
import { create } from "zustand";
import { useCartStore, useProductsStore, useModalsStore } from "@/stores";
// ============================================
// CURRENT PRODUCT (Producto en construcción)
// ============================================

interface VariantOptionBuilder {
  id: string;
  name: string;
  label: string;
  price: {
    basePrice?: number | null;
    discount?: number | null;
    finalPrice: number;
  };
  sku?: string;
  prepTime: {
    min: number;
    max: number;
  };
  isDefault: boolean;
  isActive: boolean;
  isSelected: boolean; // ← Campo añadido para builder
}

interface TemplateVariantBuilder {
  name: string;
  label: string;
  options: VariantOptionBuilder[];
}

interface CustomizationOptionBuilder {
  id: string;
  name: string;
  description: string | null;
  priceModifier: number;
  available: boolean;
  minQuantity?: number; // para combo
  maxQuantity?: number; // para combo
  default?: boolean; // para check/variant
  sortOrder?: number;
  category?: string;
  emoji?: string;
  icon?: string;
  imgUrl?: string | null;
  // Campos añadidos para builder
  isSelected: boolean;
  selectedQuantity?: number; // solo para combo
}

interface CustomizationFeatureBuilder {
  id: string;
  name: string;
  description: string | null;
  type: "combo" | "check" | "variant";
  emoji?: string;
  icon?: string;
  imgUrl?: string;
  constraints: any; // puedes especificar mejor según el tipo
  options: CustomizationOptionBuilder[];
}

// Current Product = Product + campos de estado del builder
interface CurrentProduct extends Omit<Product, 'templateVariant' | 'customizationFeaturesTemplate'> {
  templateVariant: TemplateVariantBuilder | null;
  customizationFeaturesTemplate: CustomizationFeatureBuilder[] | null;
}

// ============================================
// ITEM FOR CART (Producto listo para carrito)
// ============================================

interface SelectedVariantOption {
  id: string;
  name: string;
  label: string;
  sku?: string;
  priceData: {
    basePrice?: number | null;
    discount?: number | null;
    finalPrice: number;
  };
}

interface VariantForCart {
  name: string;
  label: string;
  selectedOption: SelectedVariantOption | null;
}

interface SelectedCustomizationOption {
  id: string;
  name: string;
  description: string | null;
  priceModifier: number;
  available: boolean;
  sortOrder?: number;
  category?: string;
  emoji?: string;
  icon?: string;
  imgUrl?: string | null;
  isSelected: boolean;
  selectedQuantity?: number; // solo para combo
}

interface CustomizationFeatureForCart {
  id: string;
  name: string;
  description: string | null;
  type: "combo" | "check" | "variant";
  emoji?: string;
  icon?: string;
  imgUrl?: string;
  constraints: any;
  selectedOptions: SelectedCustomizationOption[];
}

interface ItemForCart {
  id: string;
  type: 'BASIC_PRODUCT' | 'SINGLE_VARIANT_PRODUCT';
  title: string;
  image?: string;
  variant: VariantForCart | null;
  customizationFeatures: CustomizationFeatureForCart[] | null;
  priceData: {
    basePrice: {
      basePrice?: number | null;
      discount?: number | null;
      finalPrice: number;
    } | null;
    extraForCustomizations: number;
    finalPrice: number;
  };
}

// ============================================
// STATE INTERFACE
// ============================================

interface ProductBuilderState {
  currentProduct: CurrentProduct | null;
  itemForCart: ItemForCart | null;
  quantity: number;
  totalForThisProduct: number | null;

  setError: (errorMessage: string) => void;
  setQuantity: (quantity: number) => void;
  handlerProductToAddToCart: ({ productId, selectedVariantId, quantity, onError }: {
    productId: string, 
    selectedVariantId: string, 
    quantity?: number, 
    onError?: (errorMessage: string) => void
  }) => void;
  _resetCurrentProduct: ({ productId, selectedVariantId, quantity }: {
    productId: string, 
    selectedVariantId: string, 
    quantity?: number
  }) => void;
  setItemForCart: () => void;
  setTotalForThisProduct: () => void;
  setSelectedVariant: ({ selectedVariantId, onError }: {
    selectedVariantId: string, 
    onError: (errorMessage: string) => void
  }) => void;
  setCustomizationFeatureTypeVariant: ({featureId, selectedOptionId, onError}: {
    featureId: string, 
    selectedOptionId: string, 
    onError: (errorMessage: string) => void
  }) => void;
  setCustomizationFeatureTypeCheck: ({featureId, selectedOptionId, onError}: {
    featureId: string, 
    selectedOptionId: string, 
    onError: (errorMessage: string) => void
  }) => void;
  setCustomizationFeatureTypeCombo: ({featureId, selectedOptionId, newSelectedQuantity, onError}: {
    featureId: string, 
    selectedOptionId: string, 
    newSelectedQuantity: number, 
    onError: (errorMessage: string) => void
  }) => void;
  addProductToCart: ({onError}: {onError?: (errorMessage: string) => void}) => void;
}

const useProductBuilderStore = create<ProductBuilderState>((set, get) => ({
    currentProduct: null,
    itemForCart: null,
    quantity: 0,
    totalForThisProduct: null,
    
    setQuantity: (quantity: any) => {
        set({ quantity: quantity })
        get().setTotalForThisProduct()
    },

    setError: (errorMessage: string) => {
        console.error('Error al resetear producto:', errorMessage)
        set({ customizationError: errorMessage })
    },
    handlerProductToAddToCart: ({ productId, selectedVariantId, quantity = 1, onError }) => {
        try {
            if (!productId) throw new Error('No se ha seleccionado ningun producto.')    
            if ((productId !== get().currentProduct?.id || !get().currentProduct)) get()._resetCurrentProduct({productId, selectedVariantId, quantity })
             useModalsStore.getState().showProductCustomizerModal()
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
                    totalForThisProduct: null
                }) 
            get().setItemForCart()
        }
        catch(error: any){
            get().setError(error.message)
            throw error
        }
    },
    setItemForCart: () => {
        set({ itemForCart: getItemforCart(get().currentProduct) })
        get().setTotalForThisProduct()
    },

    setTotalForThisProduct: () => {
       if (!get().itemForCart) return
       const totalForThisProduct = get().itemForCart?.priceData?.finalPrice * get().quantity
       set({ totalForThisProduct })
    },

    setSelectedVariant: ({selectedVariantId, onError}) => {
        try{
            if (!selectedVariantId) throw new Error('No se ha seleccionado ninguna variante')
             const modifiedCurrentProduct = getProductBuilderTemplateWithVariantModified(get().currentProduct, selectedVariantId)
             set({ currentProduct: modifiedCurrentProduct })   
             get().setItemForCart()
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
             get().setItemForCart()
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
             get().setItemForCart()
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
             get().setItemForCart()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)
        }
    },

    addProductToCart: ({onError}) => {
        try{
            if (!get().totalForThisProduct) throw new Error('No se ha seleccionado ningun producto.')
            useCartStore.getState().addToCart({
            itemForCart: get().itemForCart,
            quantity: get().quantity
            })
            useModalsStore.getState().hideProductCustomizerModal()
        }catch(error: any){
            get().setError(error.message)
            onError?.(error.message)    
        }
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


 function checkProductVariant({product, selectedVariantId}: {product: any, selectedVariantId: any}): void {
    if (product.type == 'SINGLE_VARIANT_PRODUCT' && !selectedVariantId) throw new Error('No se ha seleccionado ninguna variante.')
    if (product.type == 'SINGLE_VARIANT_PRODUCT' && (!product.templateVariant.options.find((item: any) => item.id === selectedVariantId))) throw new Error('La variante seleccionada no existe.')
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
            templateVariant: product.type == 'SINGLE_VARIANT_PRODUCT' ? {
                ...product.templateVariant,
                options: product.templateVariant.options.map((item: any) => ({...item, isSelected: false}))
            } : null, 
            customizationFeaturesTemplate: product?.customizationFeaturesTemplate ? 
                product?.customizationFeaturesTemplate?.map((item: any) => getProductBuilderFeatureTemplate(item)) 
            : null,
        }
        return productBuilderTemplate
    }catch(error: any){
        throw error
    }
}


function getProductBuilderTemplateWithVariantModified(product: any, selectedVariantId: any): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!(product.type == 'SINGLE_VARIANT_PRODUCT')) throw new Error('El producto no tiene variantes.')
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
        if (!product.customizationFeaturesTemplate) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationFeaturesTemplate?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
         //Pongo todas en false excepecta la seleccionada
        const newOptionsArray = product?.customizationFeaturesTemplate[featureIndex].options.map((item: any) => ({...item, isSelected: item.id == selectedOptionId ? true : false}))
        
        const updatedCustomizationFeaturesTemplate = product?.customizationFeaturesTemplate?.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)

        return {
            ...product,
            customizationFeaturesTemplate: updatedCustomizationFeaturesTemplate
        }
    }catch(error: any){
       throw error
    }
  
}


function getProductBuilderTemplateWithCustomizationTypeCheckModified(product: any, featureId: string, selectedOptionId: string): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.customizationFeaturesTemplate) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationFeaturesTemplate?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
        
        //SI esta desmarcada la desmarco y viceversa
        const optionIndex = product.customizationFeaturesTemplate[featureIndex]?.options.findIndex((item: any) => item.id === selectedOptionId)
        if (optionIndex < 0) throw new Error('La option seleccionada no existe.')
            
        const newOptionsArray = product.customizationFeaturesTemplate[featureIndex].options.map((item: any) => {
            if (item.id == selectedOptionId) return {...item, isSelected: !item.isSelected}
            return {...item}
        })
                
        const updatedCustomizationFeaturesTemplate = product.customizationFeaturesTemplate?.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)
        return {
            ...product,
            customizationFeaturesTemplate: updatedCustomizationFeaturesTemplate
        }
    }catch(error: any){
       
        throw error
    }
  
}



function getProductBuilderTemplateWithCustomizationTypeComboModified(product: any, featureId: string, selectedOptionId: string, newSelectedQuantity: number): any {
    try{
        if (!product) throw new Error('El producto no existe.')
        if (!product.customizationFeaturesTemplate) throw new Error('El producto no es configurable.')
        const featureIndex = product?.customizationFeaturesTemplate?.findIndex((item: any) => item.id === featureId)
        if (featureIndex < 0) throw new Error('La feature seleccionada no existe.')
        
        //SI esta desmarcada la desmarco y viceversa
        const optionIndex = product.customizationFeaturesTemplate[featureIndex]?.options.findIndex((item: any) => item.id === selectedOptionId)
        if (optionIndex < 0) throw new Error('La option seleccionada no existe.')
            
        const newOptionsArray = product.customizationFeaturesTemplate[featureIndex]?.options.map((item: any) => {
            if (item.id == selectedOptionId) 
                return {...item, isSelected: newSelectedQuantity > 0  ? true: false,         selectedQuantity: newSelectedQuantity}
            return {...item}
        })
                
        const updatedCustomizationFeaturesTemplate = product.customizationFeaturesTemplate.map((item: any, index: any) => index == featureIndex ? {...item, options: newOptionsArray} : item)
        return {
            ...product,
            customizationFeaturesTemplate: updatedCustomizationFeaturesTemplate
        }
    }catch(error: any){
        throw error
    }

  
}


 //--------------------------------

 const mapVariantToCartItem = (variant: any) => {
    const selectedVariant = variant.options.find((item: any) => item.isSelected)
    const { options, ...variantWithoutOptions } = variant
    return {
        ...variantWithoutOptions,
        selectedOption: selectedVariant ?{
            id: selectedVariant?.id,
            name: selectedVariant?.name,
            label: selectedVariant?.label,
            sku: selectedVariant?.sku,
            priceData: selectedVariant?.price

        } : null
    }
 }

const mapCustomizationToCartItem = (customizationFeaturesTemplate: any) => {
     const featuresWithSelectedOptions = customizationFeaturesTemplate.map((feature: any) => {
        const selectedOptions = feature.options.filter((item: any) => item.isSelected)
        const { options, ...featureWithoutOptions } = feature
        return {
            ...featureWithoutOptions, 
            selectedOptions: selectedOptions
        }
     })

     return featuresWithSelectedOptions.filter((item: any) => item.selectedOptions.length > 0)
 }


 const getCurrentProductBasePrice = (currentProduct: any) => {
     if (!currentProduct) throw new Error('El producto no existe.')
     
     if (currentProduct.templateVariant) {
         const selectedVariant = currentProduct?.templateVariant?.options?.find((item: any) => item.isSelected)
         if (!selectedVariant) return null
         return selectedVariant.price
     } else {
         return currentProduct.price
     }
 }

const getCurrentProductExtraForCustomizations = (features: any[]) => {
    if (!features || features.length === 0) return 0
    
    return features.reduce((total, feature) => {
        const featureTotal = feature.selectedOptions?.reduce((sum: number, option: any) => {
            return sum + (option.priceModifier || 0) * (option.selectedQuantity || 1)
        }, 0) || 0
        
        return total + featureTotal
    }, 0)
}


 const getItemforCart = (currentProduct: any) => {
    const basePrice = getCurrentProductBasePrice(currentProduct)
    const customization =  currentProduct?.customizationFeaturesTemplate ? mapCustomizationToCartItem(currentProduct?.customizationFeaturesTemplate):null
    const extraForCustomizations = getCurrentProductExtraForCustomizations(customization)

    const getFinalPrice = () => {
        return basePrice?.finalPrice + extraForCustomizations
    }

    const finalPrice = getFinalPrice()
  
    return {
       id: currentProduct?.id,
       type: currentProduct?.type,
       title: currentProduct?.name,
       image: currentProduct?.images?.[0]?.url,
       variant: currentProduct?.type === 'SINGLE_VARIANT_PRODUCT' ? mapVariantToCartItem(currentProduct?.templateVariant):null,
       customizationFeatures: customization,
       priceData: {
           basePrice: basePrice,
           extraForCustomizations:extraForCustomizations,
           finalPrice: finalPrice
       }
    }
}

