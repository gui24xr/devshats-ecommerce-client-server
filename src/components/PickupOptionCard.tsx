'use client'
export default function PickupOptionCard({ option, onSelect }) {
  const handleClickOption = () => {
    onSelect(option);
  }
  return (
    <button 
    onClick={handleClickOption}
    className="border-2 border-blue-300 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-gray-800">
              Retiro en {option.name}
              {option.distancePickupPointToCustomerAddressInKms &&
                ` (${option.distancePickupPointToCustomerAddressInKms} kms)`}
            </h3>
            <p className="text-xs text-gray-500">
              {option.branchData.addressData.formattedAddress}
            </p>
            <p className="text-xs text-gray-500">
              {option.branchData.contactData.phones[0]}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
