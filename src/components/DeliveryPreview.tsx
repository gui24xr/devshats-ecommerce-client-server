'use client'
import { Bike } from 'lucide-react';
import { useStoreCheckout, useModalsStore } from '@/stores';


export default function DeliveryPreview({previewData}) {


      const setCustomerAddress = useStoreCheckout(
    (state) => state.setCustomerAddress
  );

    const { currentCustomerAddress, distanceMotoDeliveryToCustomerAddressInKms, distancePickupPointToCustomerAddressInKms, allowMotoDeliveryToCustomerAddress, orderDeliveryAmount } = previewData
    const handleClickAcept = () => {
        setCustomerAddress({
            completeAddress: currentCustomerAddress.completeAddress,
            customerCoordinates: currentCustomerAddress.coordinates,
          });
    }

    const handleClickCancel = () => {
        useModalsStore.getState().hideAddressMapSelectorModal();
    }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Dirección */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-1">
          Dirección de entrega seleccionada
        </h3>
        <p className="text-gray-800">
          {currentCustomerAddress.completeAddress || 'No se ha seleccionado ninguna dirección'}
        </p>
      </div>

      {/* Contenedor con moto, precio y distancia */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
        {/* Icono de moto */}
        <div className="flex-shrink-0">
          <Bike className="w-8 h-8 text-blue-600" />
        </div>

        {/* Precio de envío */}
        { allowMotoDeliveryToCustomerAddress ?
        <div className="text-center">
          <p className="text-xs text-gray-500">Precio de envío</p>
          <p className="text-lg font-bold text-gray-800">${orderDeliveryAmount}</p>
        </div>
        :
         <div className="text-center">
          <p className="text-xs text-gray-500">No realizamos envio</p>
         
        </div>
        }

        {/* Distancia */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Distancia</p>
          <p className="text-lg font-bold text-gray-800">{distanceMotoDeliveryToCustomerAddressInKms ? `${distanceMotoDeliveryToCustomerAddressInKms} km` : 'No disponible'}</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
         <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        onClick={handleClickAcept}
        >
          Aceptar
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
        onClick={handleClickCancel}
        >
          Cancelar
        </button>
       
      </div>
    </div>
  );
}