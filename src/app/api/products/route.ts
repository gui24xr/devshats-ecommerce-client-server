import { NextResponse } from "next/server";
import DataService from "@/lib/DataService";

export async function GET() {
    const productsData = await DataService.getProducts();
   
    return NextResponse.json({
        products: productsData.products,
        categories: productsData.categories.map((category) => ({
            ...category,
            itemsCount: productsData.products.filter((product: any) => product.categories.some((productCategory: any) => productCategory.id === category.id)).length
        })),
        stats: {
            totalProducts: productsData.products.length,
        }
    })
}

