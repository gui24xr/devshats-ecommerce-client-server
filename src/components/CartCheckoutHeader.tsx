import { ArrowLeft, X } from "lucide-react";

export default function CartCheckoutHeader({onClose}: {onClose: () => void}) {
    return (
        <div className="bg-blue-500 shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al inicio</span>
            </button>
            
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar checkout"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    </div>

    )
}