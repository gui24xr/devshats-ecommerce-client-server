import { StarRating } from "@/components";


export default function ProductCardBody({ product, productPrice,  onChangeVariant, selectedVariantId }: any) {
  return (
    <>

      {/* Content - flex-grow para ocupar espacio disponible */}
      <div className="flex flex-col flex-grow border-b border-gray-100">

        {/* Header */}
        <div className="flex flex-col gap-1 mb-8">
          <h3 className={`text-xl font-bold text-gray-900 line-clamp- group-hover:text-orange-600 transition-colors duration-300`}>
            {product.name}
          </h3>
          {/* Description */}
          <p className="text-gray-600 text-sm text-justify line-clamp-3 leading-relaxed">
            {product.description || "Producto sin descripción"}
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
            <div className="flex flex-row gap-1">
              {productPrice?.discount && (
                <div className="flex flex-col gap-0">
                  <span className="text-sm text-gray-400 text-green-500 font-semibold">${`-${productPrice.discount.toFixed(0)}%`}</span>
                  <span className="text-sm text-gray-400 line-through">${productPrice.basePrice.toFixed(0)}</span>
                </div>
              )}
              <span className={`text-4xl font-bold text-gray-700 text-shadow-md`}>${productPrice.finalPrice?.toFixed(0)}</span>
            </div>
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
                    onClick={() => onChangeVariant(option.id)}
                    className={`flex-1 py-0 px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm ${(selectedVariantId == option.id)
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