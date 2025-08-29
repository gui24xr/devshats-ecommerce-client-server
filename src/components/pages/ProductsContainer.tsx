'use client'
import { useEffect, useMemo, useState } from "react";
import { LayoutModal, ProductFilters, ProductCard,  } from "../index";
import { useCartStore, useProductsStore, useStoreTemplateConfig } from "@/stores";

export default function ProductsContainer() {


    const backgroundProductContainerColor = useStoreTemplateConfig(state => state.backgroundProductContainerColor)
    const defaultProductImage = useStoreTemplateConfig(state => state.defaultProductImage)

    const getProducts = useProductsStore(state => state.getProducts)
    const categories = useProductsStore(state => state.categories)
    const selectedCategory = useProductsStore(state => state.selectedCategory)
    const products = useProductsStore(state => state.products)
    const filteredProducts = useProductsStore(state => state.filteredProducts)
    const filteredProductsCount = useProductsStore(state => state.filteredProducts.length)
    const filterProductsByCategories = useProductsStore(state => state.filterProductsByCategories)
    const loading = useProductsStore(state => state.loading)
    const error = useProductsStore(state => state.error)

    const addToCart = useCartStore(state => state.addToCart)
 
    useEffect(() => {
        getProducts()
    }, [])


    const categoriesWithUI = useMemo(() => {
        if (!categories || categories.length === 0) return []

        return categories.map((category: any) => ({
            ...category,
            ...getCategoryUIData(category)
        }))
    }, [categories])



    if (loading) return <div className=" text-black text-center text-gray-500 py-4">Cargando...</div>
    if (error) return <div className=" text-black text-center text-gray-500 py-4">Error: {error.message}</div>

    return (
        <>
            <div className={`w-full min-h-screen ${backgroundProductContainerColor}`}>
                <div className="container mx-auto py-16">
                    <ProductFilters
                        categories={categoriesWithUI}
                        selectedCategory={selectedCategory}
                        foundedProductsQuantity={filteredProductsCount}
                        filterProductsByCategories={filterProductsByCategories}
                    />



                    {(filteredProducts.length < 1) ? <NoProductsShowMessage /> :
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddItemToCart={addToCart}
                                    defaultProductImage={defaultProductImage}
                                />
                            ))}
                        </div>}
                </div>
            </div>

          
        </>
    )
}


//----------------- PARTSSS
const NoProductsShowMessage = () => {
    return (
        <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                No hay productos disponibles
            </h3>
            <p className="text-gray-500">
                Vuelve pronto para ver nuestras deliciosas opciones
            </p>
        </div>
    )
}


//------------------------------


function getCategoryUIData(category: any): any {
    switch (category.id) {
        case SPECIAL_CATEGORIES.ALL_CATEGORIES:
            return { label: 'Todos', emoji: '🍽️' }
        case SPECIAL_CATEGORIES.FAVORITES:
            return { label: 'Favoritos', emoji: '🌟' }
        case SPECIAL_CATEGORIES.RECENT:
            return { label: 'Recientes', emoji: '🕒' }
        case 'cat_001':
            return { label: capitalize(category.name), emoji: '🌭' }
        case 'cat_002':
            return { label: capitalize(category.name), emoji: '🍟' }
        case 'cat_003':
            return { label: capitalize(category.name), emoji: '🥤' }
        default:
            return { label: category.name, emoji: '🍽️' }
    }
}

export const SPECIAL_CATEGORIES = {
    ALL_CATEGORIES: 'all_categories',
    FAVORITES: 'favorites',
    RECENT: 'recent'

} as const;


const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  