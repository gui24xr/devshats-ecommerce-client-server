'use client'
import { useProductsStore } from "@/stores"
import { ProductCard,ProductCardTypeClothes } from '@/components'
export default function ProductGrid() {
  
  const filteredProducts = useProductsStore(state => state.filteredProducts)
  const defaultProductImage = 'https://media.istockphoto.com/id/463075967/photo/e-commerce-shopping-cart-with-cardboard-boxes-on-laptop.jpg?s=2048x2048&w=is&k=20&c=ed0xkV4w7V9ZG3qadn_MWrj07cmD9jcYw5HuKefDaCE='
  return (
    <>
    {filteredProducts.length < 1 ? <NoProductsShowMessage /> :
    <div className="grid gap-12 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 px-8 pt-12 pb-24">
      {filteredProducts.map((product: any) => (
        <ProductCardTypeClothes
          key={product.id}
          product={product}
          defaultProductImage={defaultProductImage}
        />
      ))}
    </div>
    }
    </>
  )
}


//----------------- PARTSSS
const NoProductsShowMessage = () => {
  return (
      <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
              No hay productos disponibles
          </h3>
          <p className="text-gray-500">
              Vuelve pronto para ver nuestras deliciosas opciones
          </p>
      </div>
  )
}