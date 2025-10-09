
import DataService from "@/lib/DataService";
import { 
    ProductsStoreHydrator,
    ProductFilters, 
    ProductGrid, 
    ProductsByCategoriesCatalog, 
    ProductCustomizerModal,
    FloatingRapidCatalogWidget,
    ProductsByCategoriesCatalogModal 
} from "../index";

export default async function ProductsContainer() {

    const { customizationTemplateSettings, planSettings } = await DataService.getStoreDataAndConfigs()
    const { backgroundProductContainerColor, defaultProductImage } = customizationTemplateSettings.productsContainerRenderConfig

    const productsData = await DataService.getProducts();
   
    return (
     
        <>
            <ProductsStoreHydrator productsData={productsData}/>
            <ProductCustomizerModal/>
            <div className={`w-full min-h-screen ${backgroundProductContainerColor}`}>
                <div className="container mx-auto py-16">
                    {(planSettings.type === "plan_medium" || planSettings.type === "plan_large") && (
                        <>
                            <ProductFilters/>
                            <ProductGrid/>
                        </>
                    )}

                    {planSettings.type === "plan_small" && (
                        <ProductsByCategoriesCatalog />
                    )}
                </div>
            </div>
            

            {(planSettings.type === "plan_medium" || planSettings.type === "plan_large") && (
                <>
                    <FloatingRapidCatalogWidget/>
                    <ProductsByCategoriesCatalogModal/>
                </>
            )}
        </>
    )
}








