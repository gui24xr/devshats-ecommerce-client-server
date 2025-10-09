import { Portrait, SocialProofs, ProductsContainer, ProductsSkeleton } from "@/components";
import { Suspense } from "react";

export default async function Home() {

  return (
    <div>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <Portrait />
        </Suspense>
      </section>
      <section id="products-section">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsContainer/>
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