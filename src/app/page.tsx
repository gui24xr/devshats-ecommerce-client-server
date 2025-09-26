import { Portrait, SocialProofs, ProductsContainer } from "@/components";
import { Suspense } from "react";
import DataService from "@/lib/DataService";

export default async function Home() {

  const { customizationTemplateSettings, planSettings } = await DataService.getStoreDataAndConfigs()

  return (
    <div>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <Portrait />
        </Suspense>
      </section>
      <section id="products-section">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsContainer planSettings={planSettings} renderConfig={customizationTemplateSettings.productsContainerRenderConfig} />
        </Suspense>
      </section>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <SocialProofs />
        </Suspense>
      </section>
    </div>
  );
}