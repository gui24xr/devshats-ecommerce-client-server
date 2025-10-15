'use client'
export default function MotoDeliveryCard({ option, onSelect }) {

  const handleClickOption = () => {
    onSelect(option);
  }
  return (
    <button 
    onClick={handleClickOption}
    className="border-2 border-orange-300 rounded-xl p-4 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛵</span>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-gray-800">Envio a domicilio</h3>
            <p className="text-xs text-gray-500">
              Desde {option.name} {option.distanceMotoDeliveryToCustomerAddressInKms && `(${option.distanceMotoDeliveryToCustomerAddressInKms} kms)`}
            </p>
            {option.deliveryAmount > 0 && (
              <p className="mt-2 font-bold text-md text-blue-600 ">
                Costo de envio: ${option.deliveryAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        {option.deliveryAmount === 0 && (
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            "Gratis"
          </div>
        )}
      </div>
    </button>
  );
}

/**/