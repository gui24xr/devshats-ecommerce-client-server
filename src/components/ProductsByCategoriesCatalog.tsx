'use client'
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useProductsStore } from "@/stores";
import { StoreBanner } from "@/components";

export default function ProductsByCategoriesCatalog() {

    const productsOrderByCategories = useProductsStore(state => state.productsOrderByCategories)
    const [expandedCategories, setExpandedCategories] = useState(new Set());


    // Función para toggle de expansión de categorías
    const toggleCategory = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    return (
        <div className="flex flex-col h-full">
            {/* StoreBanner arriba con padding horizontal */}
            <div className="px-4 pt-4">
                <StoreBanner />
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {/* Mensaje informativo arriba */}
                <div className="mb-4 text-center text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm">Haz clic en las categorías para expandir/contraer los productos</p>
                </div>

                <div className="space-y-2">
                    {productsOrderByCategories.map((category) => (
                        <div key={category.id} className="bg-white shadow-md ">
                            {/* Header de categoría - clickeable */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-4 flex items-center justify-between bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-white font-semibold text-lg">
                                        {category.name}
                                    </span>
                                    <span className="bg-blue-800 text-white px-2 py-1 rounded-full text-sm">
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
                                <div className="space-y-2 bg-gray-50">
                                    {category.products.map((product) => (
                                        <div
                                            key={product.renderId}
                                            className="bg-white p-3 border-b border-gray-200 flex flex-col hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <h3 className="text-sm font-bold text-black bg-gray-200 px-2 py-1 mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm px-2 mb-3">
                                                {product.description || "Producto sin descripción"}
                                            </p>

                                            {/* Precio para productos básicos */}
                                            {product.type === 'BASIC_PRODUCT' && (
                                                <div className="px-2 flex justify-end">
                                                    <div className="bg-white rounded-md px-3 py-2 border border-gray-200 hover:border-green-500 transition-colors">
                                                        <span className="text-sm font-bold text-green-600">
                                                            ${product.price?.finalPrice || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Variantes */}
                                            {product.templateVariant && (
                                                <div className="px-2 flex justify-end">
                                                    <div className="flex flex-wrap gap-2 justify-end">
                                                        {product.templateVariant.options.map((option: any) => (
                                                            <div key={option.id} className="bg-white rounded-md px-3 py-2 border border-gray-200 hover:border-green-500 transition-colors flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-800">
                                                                    {option.label}
                                                                </span>
                                                                <span className="text-sm font-bold text-green-600">
                                                                    ${option.price.finalPrice}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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