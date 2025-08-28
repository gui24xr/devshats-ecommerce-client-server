"use client"
import { useState } from 'react'
export default function ProductCustomizer({ product }: any) {

    console.log('product en el customizer', product)
    if (!product) return { CustomizationPanel: null, CustomizationPreview: null, CustomizationConfirmWidget: null }

    const [features, setFeatures] = useState(product.customizationTemplate.features)
    
    const CustomizationPanel = () => <div>{product.name || 'No hay producto'}</div>
    const CustomizationConfirmWidget = () => <div>{product.name || 'No hay producto'}</div>
    const CustomizationPreview = () => <div>{product.name || 'No hay producto'}</div>

    return { CustomizationPanel, CustomizationPreview, CustomizationConfirmWidget }
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