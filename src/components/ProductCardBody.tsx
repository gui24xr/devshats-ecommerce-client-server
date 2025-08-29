import { StarRating } from "@/components";
import { Archivo_Black } from "next/font/google"
import { Roboto } from "next/font/google"


const archivo_black = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black'
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-roboto'
})
export default function ProductCardBody({ product, getProductPrice, selectedVariant, onChangeVariant }: any) {
  return (
    <>

      {/* Content - flex-grow para ocupar espacio disponible */}
      <div className="flex flex-col flex-grow border-b border-gray-100">

        {/* Header */}
        <div className="mb-4">
          <h3 className={`${roboto.className} text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2`}>
            {product.name}
          </h3>
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {product.description ||
              "Delicioso hot dog artesanal preparado con ingredientes frescos y de la más alta calidad."}
          </p>
        </div>

        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-4">
          {/* Rating & Reviews */}
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <StarRating rating={product.rating} />
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
            {product.reviewsCount && (
              <span className="text-xs text-gray-600">{product.reviewsCount} reseñas</span>
            )}
          </div>

          <div className="text-end">
            <p className="flex flex-row gap-1">
              {getProductPrice().discount && (
                <div className="flex flex-col gap-0">
                  <span className="text-sm text-gray-400 text-green-500 font-semibold">${`-${getProductPrice().discount.toFixed(0)}%`}</span>
                  <span className="text-sm text-gray-400 line-through">${getProductPrice().basePrice.toFixed(0)}</span>
                </div>
              )}
              <span className={`${archivo_black.className} text-4xl font-bold text-gray-700 text-shadow-md`}>${getProductPrice().finalPrice.toFixed(0)}</span>
            </p>
          </div>
        </div>

        {/* Variants Section - Altura fija siempre */}
        <div className="h-12 mb-4">
          {product.hasVariants && (
            <>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Seleccionar una variante</h4>
              <div className="flex gap-2">
                {product.templateVariant.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => onChangeVariant(option)}
                    className={`flex-1 py-0 px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm ${(option.id === selectedVariant.id)
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'border border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>



      

      </div>
    </>
  )
}