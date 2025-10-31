import DataService from "@/lib/DataService";
import {
  ProductsStoreHydrator,
  ProductsByCategoriesCatalog,
  ProductCustomizerModal,
  FloatingRapidCatalogWidget,
  ProductsByCategoriesCatalogModal,
  ProductFiltersModal
} from "../index";
import ProductsContainerClient from "../ProductsContainerClient";

export default async function ProductsContainer() {
  const { customizationTemplateSettings, planSettings } =
    await DataService.getStoreDataAndConfigs();
  const { backgroundProductContainerColor, defaultProductImage } =
    customizationTemplateSettings.productsContainerRenderConfig;

  const productsData = await DataService.getProducts();

  return (
    <>
      <ProductsStoreHydrator productsData={productsData} />
      <ProductCustomizerModal />
          <div className={`w-full  flex flex-col bg-orange-50`}>
            {(planSettings.type === "plan_medium" ||
              planSettings.type === "plan_large") && (
              <ProductsContainerClient />
            )}

            {planSettings.type === "plan_small" && (
              <div className={`container mx-auto min-h-screen flex flex-col ${backgroundProductContainerColor}`}>
              <ProductsByCategoriesCatalog />
              </div>
            )}
          </div>

          {(planSettings.type === "plan_medium" ||
            planSettings.type === "plan_large") && (
            <>
              <FloatingRapidCatalogWidget />
              <ProductsByCategoriesCatalogModal />
              <ProductFiltersModal />
            </>
          )}
        </>
  );
}
