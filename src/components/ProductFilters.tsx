'use client'
import { useState, useEffect } from 'react'




export default function ProductFilters({ categories, selectedCategory, foundedProductsQuantity, filterProductsByCategories,  }: any) {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        'Al iniciar el componente se seleccionan por default todas las categorias...'
        filterProductsByCategories('all_categories')   
    }, [])

    /*--------------------------------------------------------------------------------*/
    const onCategoryChange = (category: string) => {
        filterProductsByCategories(category)
        setIsExpanded(false)
    }
    /****************************************************************************************/
    return (
        <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden mb-4 md:mb-6">
            <div className="p-6 grid grid-cols-1">
                {/* Compact Header - Always Visible on ALL devices */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Header */}
                    <CompactHeader foundedProductsQuantity={foundedProductsQuantity} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
                    <ShowSelectedCategory categories={categories} selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
                </div>

                {/* Expanded Filters Content - Hidden by DEFAULT on ALL devices */}
                   <div className={`transition-all duration-150 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-4">
                            <CategoriesSelector categories={categories} selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <AdditionalFiltersSection />
                        </div>
                        <div className="flex flex-col gap-4">
                            <QuickActionsSection />
                        </div>

                    </div>
                
            </div>
        </div>
    )
}



//----PARTS------------------------------------------------------------------------------------------------

function CompactHeader({ foundedProductsQuantity, setIsExpanded, isExpanded }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm md:text-lg">🔍</span>
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Filtros</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                        <span>{foundedProductsQuantity < 1 ? 'No se encontraron productos.'
                            : foundedProductsQuantity + ' producto' + (foundedProductsQuantity !== 1 ? 's' : '')}
                        </span>
                    </p>
                </div>
            </div>
            {/* Toggle Button - NOW VISIBLE ON ALL DEVICES */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                <span className="text-sm md:text-base font-bold transform transition-transform duration-300">{isExpanded ? '✕' : '⚙️'}</span>
            </button>
            {/* Show Selected Category */}

        </div>
    )
}

function ShowSelectedCategory({ categories, selectedCategory, onCategoryChange }: any) {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category: any) => {
                return (
                    <button
                        key={category.id}
                        onClick={() => { onCategoryChange(category.id) }}
                        className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${selectedCategory?.id === category.id
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                            }`}>
                        <span className="mr-1">{category.emoji} {category.label}</span>
                    </button>
                )
            })}
        </div>
    )
}


//-----------------------------------------------------------

function CategoriesSelector({ categories, selectedCategory, onCategoryChange }: any) {
    return (
        <div>
            <span className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2 pt-6 border-t border-gray-100">
                <span className="text-lg">🏷️</span>
                Todas las Categorías
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {/* Category Buttons */}
                {categories.map((category: any) => {
                    return (
                        <button
                            key={category.name}
                            onClick={() => { onCategoryChange(category.id) }}
                            className={`group relative overflow-hidden rounded-xl p-3 md:p-4 text-center transition-all duration-300 transform hover:scale-105 ${selectedCategory?.id === category.id
                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl ring-4 ring-orange-200'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 shadow-md hover:shadow-lg'
                                }`}>

                            <div className="text-sm font-semibold truncate">
                                <div className="flex flex-col items-center justify-center text-2xl">
                                    <span>{category.emoji}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">

                                    <span>
                                        {category.label}
                                    </span>
                                    <span className="text-xs opacity-75">
                                        ({category.itemsCount})
                                    </span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function AdditionalFiltersSection() {
    return (
        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 ">
            {/* Preparation Time */}
            <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    Tiempo de Prep.
                </h4>
                <div className="space-y-2">
                    {['5-15 min', '15-25 min', '25+ min'].map((time) => (
                        <button
                            key={time}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Special Features */}
            <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    Características
                </h4>
                <div className="space-y-2">
                    {['🔥 Popular', '✨ Nuevo', '🌱 Vegetariano'].map((feature) => (
                        <button
                            key={feature}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        >
                            {feature}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}


function QuickActionsSection() {
    return (
        <>
            {/* Quick Actions */}
            <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    Acciones Rápidas
                </h4>
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
                        <span>🔥</span>
                        Más Populares
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105">
                        <span>⚡</span>
                        Preparación Rápida
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105">
                        <span>✨</span>
                        Nuevos
                    </button>
                </div>
            </div>
        </>
    )
}


