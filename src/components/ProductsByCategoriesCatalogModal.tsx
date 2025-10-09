'use client'
import { LayoutModal } from "./index";
import { useModalsStore } from "@/stores";
import { ProductsByCategoriesCatalog } from "./index";

export default function ProductsByCategoriesCatalogModal() {
  const catalogModalIsOpen = useModalsStore(
    (state) => state.catalogModalIsOpen
  )
  const hideCatalogModal = useModalsStore((state) => state.hideCatalogModal);

  return (
    <LayoutModal
      isOpen={catalogModalIsOpen}
      onClose={hideCatalogModal}
      title="Catálogo"
      description="Catálogo de productos."
      minWidth="w-1/2"
      maxWidth="max-w-2xl"
      content={<ProductsByCategoriesCatalog />}
      footer={<div></div>}
    />
  );
}
