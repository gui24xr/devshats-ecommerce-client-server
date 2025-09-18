"use client"
import { useState } from "react"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

// Estilos personalizados para react-phone-number-input
const phoneInputStyles = `
  .PhoneInput {
    width: 100%;
  }
  .PhoneInputInput {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #d1d5db;
    border-radius: 16px;
    background: white;
    color: #111827;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  .PhoneInputInput:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
  }
  .PhoneInputCountry {
    margin-right: 12px;
  }
  .PhoneInputCountrySelect {
    background: transparent;
    border: none;
    outline: none;
    color: #111827 !important;
    font-weight: 500;
  }
  .PhoneInputCountrySelect option {
    color: #111827 !important;
    background: white;
  }
  .PhoneInputCountryIcon {
    width: 20px;
    height: 20px;
  }
  .PhoneInputInput::placeholder {
    color: #6b7280;
  }
`

export default function CheckoutForm({ formData, handleInputChange, errors }: { formData: any, handleInputChange: (name: string, value: string) => void, errors: any }) {

    // Estado para el país del teléfono
    const [selectedPhoneCountry, setSelectedPhoneCountry] = useState('MX')



    return (
        <>


            {/* Premium Form */}
            <form className="space-y-6">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>👤</span>
                        Nombre completo *
                    </label>
                    <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 ${errors.customerName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-orange-300'
                            }`}
                        placeholder="Tu nombre completo"
                    />
                    <div className="flex flex-col gap-2 px-2">
                        {errors.customerName && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>{errors.customerName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Teléfono con react-phone-number-input */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📞</span>
                        Teléfono *
                    </label>

                    <PhoneInput
                        className="w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                        international={false}
                        defaultCountry="MX"
                        value={formData.customerPhone}
                        onChange={(value) => handleInputChange('customerPhone', value || '')}
                        onCountryChange={(country) => setSelectedPhoneCountry(country || 'MX')}
                        placeholder={getPhonePlaceholder(selectedPhoneCountry)}
                        countries={[
                            // América del Norte
                            'US', 'CA', 'MX',
                            // América Central
                            'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA',
                            // América del Sur
                            'AR', 'BR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO', 'GY', 'SR', 'GF',
                            // Caribe
                            'CU', 'JM', 'HT', 'DO', 'PR', 'TT', 'BB', 'GD', 'LC', 'VC', 'AG', 'KN', 'DM',
                            // Europa Occidental
                            'ES', 'PT', 'FR', 'DE', 'IT', 'NL', 'BE', 'CH', 'AT', 'GB', 'IE',
                            // Europa del Este
                            'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT'
                        ]}
                    />

                    {/* Texto de ayuda */}
                    <div className="flex flex-col gap-2 px-2">
                        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <span>💡</span>
                            Formato: {getPhonePlaceholder(selectedPhoneCountry)} - Solo números, sin espacios ni guiones
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                            <span>🌍</span>
                            El código del país se selecciona automáticamente arriba
                        </p>

                        {errors.customerPhone && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>{errors.customerPhone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Premium Order Type Toggle */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-bold text-gray-700  flex items-center gap-2">
                        <span>🚀</span>
                        Forma de entrega *
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-2">
                        <button
                            type="button"
                            onClick={() => handleInputChange('orderType', 'pickup')}
                            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${formData.orderType === 'pickup'
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">🏪</div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Recoger en tienda</div>
                            <div className="text-xs text-gray-600">Sin costo adicional</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('orderType', 'delivery')}
                            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${formData.orderType === 'delivery'
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">🚚</div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Envío</div>
                            <div className="text-xs text-gray-600">$35 (Gratis {'>'} $200)</div>
                        </button>
                    </div>
                </div>

                {/* Método de Pago */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                        <span>💳</span>
                        Método de pago *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2">
                        <button
                            type="button"
                            onClick={() => handleInputChange('paymentMethod', 'efectivo')}
                            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${formData.paymentMethod === 'efectivo'
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">💵</div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Efectivo</div>
                            <div className="text-xs text-gray-600">Al recibir</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('paymentMethod', 'transferencia')}
                            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${formData.paymentMethod === 'transferencia'
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">🏦</div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Transferencia</div>
                            <div className="text-xs text-gray-600">Banco</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('paymentMethod', 'qr')}
                            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${formData.paymentMethod === 'qr'
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                                : 'border-gray-300 hover:border-orange-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</div>
                            <div className="text-sm font-bold text-gray-900 mb-1">QR</div>
                            <div className="text-xs text-gray-600">Móvil</div>
                        </button>
                    </div>

                    {/* Error display for payment method */}
                    {errors.paymentMethod && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <span>⚠️</span>{errors.paymentMethod}
                        </p>
                    )}
                </div>

                {/* Premium Address Field (conditional) */}
                {formData.orderType === 'delivery' && (
                    <div className="animate-fadeIn">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📍</span>
                            Dirección de envío *
                        </label>
                        <textarea
                            value={formData.customerAddress}
                            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 ${errors.customerAddress ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-orange-300'
                                }`}
                            placeholder="Calle, número, colonia, ciudad..."
                            rows={3}
                        />
                        {errors.customerAddress && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <span>⚠️</span>{errors.customerAddress}
                            </p>
                        )}
                    </div>
                )}

                {/* Premium Notes Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>💭</span>
                        Notas adicionales
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Instrucciones especiales, alergias, etc..."
                        rows={2}
                    />
                </div>
            </form>
        </>
    )
}



// Función para obtener el placeholder según el país (solo número local)
const getPhonePlaceholder = (countryCode: string) => {
    const placeholders: Record<string, string> = {
        // América del Norte
        'MX': 'Ej: 81 1234 5678',
        'US': 'Ej: 555 123 4567',
        'CA': 'Ej: 416 123 4567',

        // América Central
        'GT': 'Ej: 5123 4567',
        'BZ': 'Ej: 612 3456',
        'SV': 'Ej: 7123 4567',
        'HN': 'Ej: 9123 4567',
        'NI': 'Ej: 8123 4567',
        'CR': 'Ej: 8888 8888',
        'PA': 'Ej: 6123 4567',

        // América del Sur
        'AR': 'Ej: 11 1234 5678',
        'BR': 'Ej: 11 99999 9999',
        'CL': 'Ej: 9 1234 5678',
        'CO': 'Ej: 300 123 4567',
        'PE': 'Ej: 999 123 456',
        'VE': 'Ej: 412 123 4567',
        'EC': 'Ej: 99 123 4567',
        'UY': 'Ej: 99 123 456',
        'PY': 'Ej: 981 123 456',
        'BO': 'Ej: 712 123 45',
        'GY': 'Ej: 612 3456',
        'SR': 'Ej: 612 3456',
        'GF': 'Ej: 612 3456',

        // Caribe
        'CU': 'Ej: 5 123 4567',
        'JM': 'Ej: 876 123 4567',
        'HT': 'Ej: 34 12 3456',
        'DO': 'Ej: 809 123 4567',
        'PR': 'Ej: 787 123 4567',
        'TT': 'Ej: 868 123 4567',
        'BB': 'Ej: 246 123 4567',
        'GD': 'Ej: 473 123 4567',
        'LC': 'Ej: 758 123 4567',
        'VC': 'Ej: 784 123 4567',
        'AG': 'Ej: 268 123 4567',
        'KN': 'Ej: 869 123 4567',
        'DM': 'Ej: 767 123 4567',

        // Europa Occidental
        'ES': 'Ej: 612 345 678',
        'PT': 'Ej: 912 345 678',
        'FR': 'Ej: 6 12 34 56 78',
        'DE': 'Ej: 151 123 45678',
        'IT': 'Ej: 312 123 4567',
        'NL': 'Ej: 6 123 45678',
        'BE': 'Ej: 470 123 456',
        'CH': 'Ej: 76 123 45 67',
        'AT': 'Ej: 660 123 456',
        'GB': 'Ej: 7700 123 456',
        'IE': 'Ej: 87 123 4567',

        // Europa del Este
        'PL': 'Ej: 512 123 456',
        'CZ': 'Ej: 601 123 456',
        'SK': 'Ej: 901 123 456',
        'HU': 'Ej: 20 123 4567',
        'RO': 'Ej: 712 123 456',
        'BG': 'Ej: 88 123 4567',
        'HR': 'Ej: 91 123 4567',
        'SI': 'Ej: 31 123 456',
        'EE': 'Ej: 5123 4567',
        'LV': 'Ej: 2123 4567',
        'LT': 'Ej: 6123 4567'
    }

    return placeholders[countryCode] || 'Ej: Ingresa tu número'
}