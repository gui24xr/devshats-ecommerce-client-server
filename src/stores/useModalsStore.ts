// stores/useModalsStore.ts
import { create } from 'zustand'

interface ModalsStore {
  // Estados de los modals
  cartModalIsOpen: boolean
  catalogModalIsOpen: boolean
  productCustomizerModalIsOpen: boolean
  addressMapSelectorModalIsOpen: boolean
  productsFilterModalIsOpen: boolean

  // Métodos para Cart Modal
  showCartModal: () => void
  hideCartModal: () => void
  toggleCartModal: () => void

  // Métodos para Catalog Modal
  showCatalogModal: () => void
  hideCatalogModal: () => void
  toggleCatalogModal: () => void

  // Métodos para Product Customizer Modal
  showProductCustomizerModal: () => void
  hideProductCustomizerModal: () => void
  toggleProductCustomizerModal: () => void

  // Metodos para Address Map Selector Modal
  showAddressMapSelectorModal: () => void
  hideAddressMapSelectorModal: () => void
  toggleAddressMapSelectorModal: () => void

  // Metodos para Products Filter Modal
  showProductsFilterModal: () => void
  hideProductsFilterModal: () => void
  toggleProductsFilterModal: () => void
}

const useModalsStore = create<ModalsStore>((set) => ({
  // Estados iniciales
  cartModalIsOpen: false,
  catalogModalIsOpen: false,
  productCustomizerModalIsOpen: false,
  addressMapSelectorModalIsOpen: false,
  productsFilterModalIsOpen: false,


  // Cart Modal
  showCartModal: () => set({ cartModalIsOpen: true }),
  hideCartModal: () => set({ cartModalIsOpen: false }),
  toggleCartModal: () => set((state) => ({ cartModalIsOpen: !state.cartModalIsOpen })),

  // Catalog Modal
  showCatalogModal: () => set({ catalogModalIsOpen: true }),
  hideCatalogModal: () => set({ catalogModalIsOpen: false }),
  toggleCatalogModal: () => set((state) => ({ catalogModalIsOpen: !state.catalogModalIsOpen })),

  // Product Customizer Modal
  showProductCustomizerModal: () => set({ productCustomizerModalIsOpen: true }),
  hideProductCustomizerModal: () => set({ productCustomizerModalIsOpen: false }),
  toggleProductCustomizerModal: () => set((state) => ({ productCustomizerModalIsOpen: !state.productCustomizerModalIsOpen })),

  // Address Map Selector Modal
  showAddressMapSelectorModal: () => set({ addressMapSelectorModalIsOpen: true }),
  hideAddressMapSelectorModal: () => set({ addressMapSelectorModalIsOpen: false }),
  toggleAddressMapSelectorModal: () => set((state) => ({ addressMapSelectorModalIsOpen: !state.addressMapSelectorModalIsOpen })),

  // Products Filter Modal
  showProductsFilterModal: () => set({ productsFilterModalIsOpen: true }),
  hideProductsFilterModal: () => set({ productsFilterModalIsOpen: false }),
  toggleProductsFilterModal: () => set((state) => ({ productsFilterModalIsOpen: !state.productsFilterModalIsOpen }))

}))

export default useModalsStore