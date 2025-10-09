'use client'
import { useProductsStore } from "@/stores"

export default function ProductsSkeleton(){

    const loading = useProductsStore(state => state.loading)
    
    return(<div className="w-full h-96 bg-blue-300 animate-pulse text-white"> Cargando perro...</div>)
}