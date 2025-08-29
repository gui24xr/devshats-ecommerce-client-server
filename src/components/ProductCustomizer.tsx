"use client"

import { useState } from "react"
import { ProductCardBody } from "./index"
export default function ProductCustomizer({ product, selectedVariant }: any) {
    const [selectedVariantInCustomizer, setSelectedVariantInCustomizer] = useState(selectedVariant || null)

    const getProductPrice = () => {
        if (product.hasVariants) {
            return selectedVariant.price
        }
        return product.price
    }
    
    const onChangeVariant = (variant: any) => {
        setSelectedVariantInCustomizer(variant)
    }

return (
    <div className="flex flex-col flex-grow">
        <ProductCardBody product={product} getProductPrice={getProductPrice} selectedVariant={selectedVariantInCustomizer} onChangeVariant={onChangeVariant} />
        <h1>ProductCustomizer</h1>
    </div>
)
}






























//----------------------------FORMA GENERAL DEL COMPONENTE -------------------------
/*
export default function ProductCustomizer({ product }: any) {
  
    const CustomizationPanel = () => <div>{product.name || 'No hay producto'}</div>
    const CustomizationConfirmWidget = () => <div>{product.name || 'No hay producto'}</div>
    const CustomizationPreview = () => <div>{product.name || 'No hay producto'}</div>

    return { CustomizationPanel, CustomizationPreview , CustomizationConfirmWidget}
}
    */