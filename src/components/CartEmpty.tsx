export default function CartEmpty({ onClose }: { onClose: () => void }) {
    return (
        <div className="text-center py-16 px-6">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-6xl">🛒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
                Agrega algunos deliciosos hot dogs antes de hacer el pedido
            </p>
            <button
                onClick={onClose}

                className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
                🚀 Seguir comprando
            </button>
        </div>
    )
} 