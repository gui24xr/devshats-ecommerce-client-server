// stores/useModalsStore.ts
import { create } from 'zustand'

interface ModalsStore {
  // Estados de los modals
  cartModalIsOpen: boolean
  catalogModalIsOpen: boolean
  productCustomizerModalIsOpen: boolean
  
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
}

const useModalsStore = create<ModalsStore>((set) => ({
  // Estados iniciales
  cartModalIsOpen: false,
  catalogModalIsOpen: false,
  productCustomizerModalIsOpen: false,
  
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
}))

export default useModalsStore