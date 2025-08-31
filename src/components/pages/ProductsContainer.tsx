'use client'
import { useEffect, useState } from "react";
import { LayoutModal, ProductFilters, ProductGrid, ProductsByCategoriesCatalog, FloatingRapidCatalogWidget } from "../index";
import { useCartStore, useProductsStore } from "@/stores";

export default function ProductsContainer({ planSettings, renderConfig }: { planSettings: any, renderConfig: any }) {

    const { backgroundProductContainerColor, defaultProductImage } = renderConfig
 
    const getProducts = useProductsStore(state => state.getProducts)
    const categories = useProductsStore(state => state.categories)
    const selectedCategory = useProductsStore(state => state.selectedCategory)
    const filteredProducts = useProductsStore(state => state.filteredProducts)
    const filteredProductsCount = useProductsStore(state => state.filteredProducts.length)
    const filterProductsByCategories = useProductsStore(state => state.filterProductsByCategories)
    const productsOrderByCategories = useProductsStore(state => state.productsOrderByCategories)
    const loading = useProductsStore(state => state.loading)
    const error = useProductsStore(state => state.error)

    const addToCart = useCartStore(state => state.addToCart)

    const [rapidCatalogModalIsOpen, setRapidCatalogModalIsOpen] = useState(false)

    useEffect(() => {
        getProducts()
    }, [])

    if (loading) return <div className=" text-black text-center text-gray-500 py-4">Cargando...</div>
    if (error) return <div className=" text-black text-center text-gray-500 py-4">Error: {error.message}</div>

    return (
        <>
            <div className={`w-full min-h-screen ${backgroundProductContainerColor}`}>

                <div className="container mx-auto py-16">
                    {(planSettings.type === "plan_medium" || planSettings.type === "plan_large") && (
                        <>
                            <ProductFilters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                foundedProductsQuantity={filteredProductsCount}
                                filterProductsByCategories={filterProductsByCategories}
                            />
                            <ProductGrid
                                products={filteredProducts}
                                onAddItemToCart={addToCart}
                                defaultProductImage={defaultProductImage}
                            />
                        </>
                    )}

                    {planSettings.type === "plan_small" && (
                         <ProductsByCategoriesCatalog productsOrderByCategories={productsOrderByCategories} />
                    )}
                </div>
            </div>

            {(planSettings.type === "plan_medium" || planSettings.type === "plan_large") && (
            <>
            <FloatingRapidCatalogWidget productsQuantity={filteredProductsCount} showRapidCatalogDetail={setRapidCatalogModalIsOpen} />

            <LayoutModal
                isOpen={rapidCatalogModalIsOpen}
                onClose={setRapidCatalogModalIsOpen}
                title="Catálogo"
                description="Catálogo de productos."
                minWidth="w-1/2"
                maxWidth="max-w-2xl"
                content={<ProductsByCategoriesCatalog productsOrderByCategories={productsOrderByCategories} />}
                footer={<div></div>}
            />
            </>
            )}
        </>
    )
}





//------------------------------



