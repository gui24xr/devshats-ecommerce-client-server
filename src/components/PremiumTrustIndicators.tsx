export default function PremiumTrustIndicators() {
    return (

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg">
                <div className="text-lg mb-1">🔒</div>
                <div className="text-xs font-medium text-blue-800">Pago Seguro</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg">
                <div className="text-lg mb-1">⚡</div>
                <div className="text-xs font-medium text-green-800">Entrega Rápida</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg">
                <div className="text-lg mb-1">⭐</div>
                <div className="text-xs font-medium text-purple-800">Garantizado</div>
            </div>
        </div>
    )
}