'use client'
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DataService from "@/lib/DataService";
import { useProductsStore, useModalsStore } from "@/stores";

interface ProductsTopBarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function ProductsTopBar({ showFilters, onToggleFilters }: ProductsTopBarProps) {
  const [data, setData] = useState<{
    portrait: any;
    bussinessContent: any;
  } | null>(null);

  const filteredProductsCount = useProductsStore(state => state.filteredProducts.length);
  const toggleProductsFilterModal  = useModalsStore(state => state.toggleProductsFilterModal);

  useEffect(() => {
    DataService.getStoreDataAndConfigs().then(({ customizationTemplateSettings }) => {
      setData({
        portrait: customizationTemplateSettings.portrait,
        bussinessContent: customizationTemplateSettings.bussinessContent,
      });
    });
  }, []);

  if (!data) {
    return null;
  }

  const handleFiltersButton = () => {
    toggleProductsFilterModal();
  }
  const { portrait, bussinessContent } = data;

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{portrait.titleLogoIcon}</span>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white">
            {bussinessContent.general.name}
          </h1>
          <p className="text-sm text-white/90">
            {bussinessContent.general.tagline}
          </p>
        </div>
      </div>

      {/* Botón toggle filtros */}
      <button
        onClick={onToggleFilters}
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-2"
      >
        <div className="flex flex-col items-start leading-tight">
          <button className="text-xs font-medium flex items-center gap-1" onClick={handleFiltersButton}>
            {showFilters ? 'Ocultar filtros' : 'Ver filtros'}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <span className="text-xs opacity-90">{filteredProductsCount} productos</span>
        </div>
      </button>
    </div>
  );
}