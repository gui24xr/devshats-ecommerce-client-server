'use client'
import { useProductsStore } from "@/stores"
import {  useEffect } from "react";
export default function ProductsStoreHydrator({productsData}) {

    const hydrateAndConfigProducts = useProductsStore(state => state.hydrateAndConfigProducts)
    useEffect(() => {
        hydrateAndConfigProducts(productsData)
    },[productsData])
    return null;
}