'use client'
import { useModalsStore } from "@/stores"
import { LayoutModal, ProductFilters } from "@/components"
export default function ProductFiltersModal() {

    const productfilterModalIsOpen = useModalsStore(state => state.productsFilterModalIsOpen)
    const hideFilterModal = useModalsStore(state => state.hideProductsFilterModal)
    return (
        <LayoutModal
            isOpen={productfilterModalIsOpen}
            onClose={hideFilterModal}
            title="Filtros"
            content={<ProductFilters expandedMode={true} onFilterApplied={hideFilterModal} />}
            showHeader={false}
        />
    )
}