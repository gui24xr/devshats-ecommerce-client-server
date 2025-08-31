import { ProductsPortraitContainer, ProductsContainer } from "@/components";
import { Suspense } from "react";


export default function Productos() {
    return (
        <>
            <section>
                <Suspense fallback={<div>Loading...</div>}>
                    <ProductsPortraitContainer />
                </Suspense>
            </section>
            <section>
              
            </section>
        </>
    );
}