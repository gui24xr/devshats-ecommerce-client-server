'use client'
import { useState } from "react";
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";
import { useProductsStore, useModalsStore, useProductBuilderStore } from "@/stores";
import { StoreBanner } from "@/components";


export default function ProductsByCategoriesCatalog() {

    const productsOrderByCategories = useProductsStore(state => state.productsOrderByCategories)
    const [expandedCategories, setExpandedCategories] = useState(new Set())
    const showProductCustomizerModal = useModalsStore(state => state.showProductCustomizerModal)
    const resetCurrentProduct = useProductBuilderStore(state => state._resetCurrentProduct)


    // Función para toggle de expansión de categorías
    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    // Función para abrir el customizer con un producto
    const handleAddToCart = (product: any) => {
        const variantId = product.templateVariant?.options?.[0]?.id || null
        resetCurrentProduct({ productId: product.id, selectedVariantId: variantId as any, quantity: 1 })
        showProductCustomizerModal()
    };

    return (
        <div className="flex flex-col h-full">
            {/* StoreBanner arriba con padding horizontal */}
            <div className="">
                <StoreBanner />
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 ">
                {/* Mensaje informativo arriba */}
                <div className="mb-4 text-center text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm">Haz clic en las categorías para expandir/contraer los productos</p>
                </div>

                <div className="space-y-3">
                    {productsOrderByCategories.map((category) => (
                        <div key={category.id} className="bg-white shadow-md ">
                            {/* Header de categoría - clickeable */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-white font-semibold text-lg">
                                        {category.name}
                                    </span>
                                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm font-medium">
                                        {category.products.length}
                                    </span>
                                </div>

                                <div className="text-white">
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown size={20} />
                                    ) : (
                                        <ChevronRight size={20} />
                                    )}
                                </div>
                            </button>

                            {/* Lista de productos - colapsable */}
                            {expandedCategories.has(category.id) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50  px-8 py-4 overflow-y-auto">
                                    {category.products.map((product: any) => (
                                        <div
                                            key={product.renderId}
                                            className="bg-white p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex gap-3">
                                                {/* Imagen del producto */}
                                                <div className="w-20 h-20 flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0]?.url || '/images/default-product.jpg'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-md shadow-sm"
                                                    />
                                                </div>

                                                {/* Contenido del producto */}
                                                <div className="flex-1 flex flex-col">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                                        {product.description || "Producto sin descripción"}
                                                    </p>

                                                    {/* Precio para productos básicos */}
                                                    {product.type === 'BASIC_PRODUCT' && (
                                                        <div className="flex justify-end">
                                                            <div className="bg-white rounded-md px-3 py-1.5 border border-gray-200 hover:border-green-500 transition-colors">
                                                                <span className="text-sm font-bold text-green-600">
                                                                    ${product.price?.finalPrice || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Variantes */}
                                                    {product.type == 'SINGLE_VARIANT_PRODUCT' && (
                                                        <div className="flex justify-end">
                                                            <div className="flex flex-wrap gap-1.5 justify-end">
                                                                {product.templateVariant.options.map((option: any) => (
                                                                    <div key={option.id} className="bg-white rounded-md px-2 py-1 border border-gray-200 hover:border-green-500 transition-colors flex items-center gap-1.5">
                                                                        <span className="text-xs font-medium text-gray-800">
                                                                            {option.label}
                                                                        </span>
                                                                        {product.priceStrategy == 'TEMPLATE_VARIANT_PRICE' && 
                                                                        <span className="text-xs font-bold text-green-600">
                                                                            ${option.price.finalPrice}
                                                                        </span>
}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Botón Agregar al carrito */}
                                                    {/*}
                                                    <div className="mt-2 flex justify-end">
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
                                                        >
                                                            <ShoppingCart className="w-3.5 h-3.5" />
                                                            <span>Agregar al carrito</span>
                                                        </button>
                                                    </div>
                                                    }   */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}