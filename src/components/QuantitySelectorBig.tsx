export default function QuantitySelectorBig({ quantity, onChange, minQuantity = 0, maxQuantity = 99 }: any) {
    const handleIncrement = (e: any) => {
        e.stopPropagation() // Evitar que se active el click del botón padre
        if (quantity < maxQuantity) {
            onChange(quantity + 1)
        }
    }

    const handleDecrement = (e: any) => {
        e.stopPropagation() // Evitar que se active el click del botón padre
        if (quantity > minQuantity) {
            onChange(quantity - 1)
        }
    }

    return (
        <div className="flex items-center gap-12 bg-gray-50 rounded-md border border-gray-200 px-1 py-0.5">

            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= minQuantity}
                className={`w-8 h-8 rounded-sm flex items-center justify-center text-xl font-bold transition-colors ${quantity <= minQuantity
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
            >
                −
            </button>
            <span className="text-5xl font-extrabold text-gray-700 min-w-[12px] text-center">
                {quantity}
            </span>
            <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className={`w-8 h-8 rounded-sm flex items-center justify-center text-xl font-bold transition-colors ${quantity >= maxQuantity
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
            >
                +
            </button>
        </div>
    )
}


