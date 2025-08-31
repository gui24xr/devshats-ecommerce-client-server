'use client'
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Archivo_Black, Roboto } from "next/font/google";

const archivo_black = Archivo_Black({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-archivo-black'
})

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-roboto'
})

export default function ProductsByCategoriesCatalog({ productsOrderByCategories }: any) {
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
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Catálogo de Productos
            </h1>

            <div className="space-y-4">
                {productsOrderByCategories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                            <div className="p-4 space-y-3 bg-gray-50">
                                {category.products.map((product) => (
                                    <div
                                        key={product.renderId}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <h3 className={`${roboto.className} text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300`}>
                                                {product.name}
                                            </h3>
                                            {/* Description */}
                                            <p className="text-gray-600 text-sm text-justify">
                                                {product.description || "Producto sin descripción"}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <span className="text-xl font-bold text-green-600">
                                                {product.price}
                                            </span>
                                        </div>



                                        <div className="h-12 mb-4">
                                            {product.hasVariants && (
                                                <>
                                                    <h4 className="text-xs font-medium text-gray-500 mb-2">Vriantes</h4>
                                                    <div className="flex gap-2">
                                                        {product.templateVariant.options.map((option: any) => (
                                                            <div className="flex flex-col gap-1 bg-green-500 hover:bg-green-600 text-white flex-1 py-1 px-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm">

                                                            <span>
                                                                
                                                                {option.label}
                                                            </span>
                                                            <span >
                                                                {option.price.finalPrice}
                                                            </span>

                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>


                                    </div>


                                ))










                                }


                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer informativo */}
            <div className="mt-8 text-center text-gray-600">
                <p>Haz clic en las categorías para expandir/contraer los productos</p>
            </div>
        </div>
    );
}

