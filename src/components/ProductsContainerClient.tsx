'use client'
import { useState } from "react";
import { ProductFilters, ProductGrid, ProductsTopBar } from "./index";

export default function ProductsContainerClient() {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <>
      {/* Barra superior */}
      <ProductsTopBar
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Contenedor de filtros y grid */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Filtros a la izquierda - Controlado por estado */}
        {showFilters && (
          <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
            <ProductFilters />
          </div>
        )}

        {/* Grid a la derecha con scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto">
            <ProductGrid />
          </div>
        </div>
      </div>
    </>
  );
}