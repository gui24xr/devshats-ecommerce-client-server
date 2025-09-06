'use client'
import { LayoutModal, ProductCustomizer } from '@/components'
import { useProductBuilderStore } from "@/stores"

export default function ProductCustomizerContainer() {
    const productInCustomizationData = useProductBuilderStore(state => state.productInCustomizationData)
    const customizerIsOpen = useProductBuilderStore(state => state.customizerIsOpen)
    const closeCustomizer = useProductBuilderStore(state => state.closeCustomizer)

    return (
        <LayoutModal
            isOpen={customizerIsOpen}
            onClose={closeCustomizer}
            title="Customizer"
            content={<ProductCustomizer 
                productToCustomize={productInCustomizationData} 
                onAddToCart={()=> console.log('add to cart')} 
                setIsCustomizerOpen={closeCustomizer} 
                />}
        />
    )
}

