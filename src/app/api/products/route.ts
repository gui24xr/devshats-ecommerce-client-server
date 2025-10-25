import { NextResponse } from "next/server";
import DataService from "@/lib/DataService";
import { GetProductsResponse } from "@/types";

export async function GET(): Promise<NextResponse<GetProductsResponse>> {
    const productsData = await DataService.getProducts();

    return NextResponse.json({
        products: productsData.products,
        categories: productsData.categories.map((category) => ({
            ...category,
            itemsCount: productsData.products.filter((product) =>
                product.categories?.some((productCategory) => productCategory.id === category.id)
            ).length
        })),
        stats: {
            totalProducts: productsData.products.length,
        }
    })
}

