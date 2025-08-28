import { Suspense } from "react";
import ProductsPortrait from "./ProductsPortrait";
import DataService from "@/lib/DataService";

export default async function ProductsPortraitContainer() {
    const { stats } = await DataService.getProducts();
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}> 
                <ProductsPortrait productsQuantity={25}/>
            </Suspense>
        </div>
    )
}