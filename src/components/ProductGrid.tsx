import { ProductCard } from "./index"


export default function ProductGrid({ products, onAddItemToCart, defaultProductImage }: any) {
  return (
    <>
    {products.length < 1 ? <NoProductsShowMessage /> :
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddItemToCart={onAddItemToCart}
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