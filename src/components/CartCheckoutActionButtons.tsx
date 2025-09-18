
import { Loader2 } from "lucide-react"

export default function CartCheckoutActionButtons({handleSubmit, isSubmitting, onClose}: {handleSubmit: () => void, isSubmitting: boolean, onClose: () => void}) {
    return (
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 pb-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size="sm" color="white" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl sm:text-2xl">📱</span>
                  Enviar por WhatsApp
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-gray-300 hover:border-gray-400 transform hover:scale-105 transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
    )
}