'use client'
import { LayoutModal, ProductCustomizer } from '@/components'
import { useModalsStore } from "@/stores"

export default function ProductCustomizerModal() {
 
    const productCustomizerModalIsOpen = useModalsStore(state => state.productCustomizerModalIsOpen)
    const hideProductCustomizerModal = useModalsStore(state => state.hideProductCustomizerModal)

    return (
        <LayoutModal
            isOpen={productCustomizerModalIsOpen}
            onClose={hideProductCustomizerModal}
            title="Customizer"
            content={ <ProductCustomizer />}
        />
    )
}

