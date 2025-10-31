import { StarRating } from "@/components";


export default function ProductCardBody({ product, productPrice,  onChangeVariant, selectedVariantId }: any) {
  return (
    <>

      {/* Content - flex-grow para ocupar espacio disponible */}
      <div className="flex flex-col flex-grow border-b border-gray-100 pb-2">

        {/* Header */}
        <div className="flex flex-col gap-0.5 mb-3">
          <h3 className={`text-base font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300`}>
            {product.name}
          </h3>
          {/* Description */}
          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
            {product.description || "Producto sin descripción"}
          </p>
        </div>

        {/* Rating */}
        <div className="flex justify-start items-center mb-2">
          {/* Rating & Reviews */}
          <div className="flex items-center">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>
        </div>

        {/* Variants Section - Altura fija siempre */}
        <div className="min-h-[2rem] mb-2">
          {product.type == "SINGLE_VARIANT_PRODUCT" && (
            <>
              <h4 className="text-xs font-medium text-gray-500 mb-1">{product.templateVariant?.name || 'Variante'}</h4>
              <div className="flex gap-1.5">
                {product.templateVariant.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => onChangeVariant(option.id)}
                    className={`flex-1 py-1 px-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-xs ${(selectedVariantId == option.id)
                      ? 'bg-green-500 hover:bg-green-600 text-white font-medium'
                      : 'border border-gray-300 text-gray-600 hover:border-gray-400'
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

