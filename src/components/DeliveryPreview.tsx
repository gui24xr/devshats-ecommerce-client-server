"use client";
import { useState  } from "react";
import {  useModalsStore } from "@/stores";
import {  AddressMapSelector, MotoDeliveryCard, PickupOptionCard } from "@/components";
import { useStoreCheckout } from "@/stores";

export default function DeliveryPreview() {
  
  const hideAddressMapSelectorModal = useModalsStore((state) => state.hideAddressMapSelectorModal);

  const setCustomerAddressData =  useStoreCheckout((state) => state.setCustomerAddressData);
  const motoDeliveryOptions =  useStoreCheckout((state) => state.motoDeliveryOptions)
  const pickupDeliveryOptions =  useStoreCheckout((state) => state.pickupDeliveryOptions)
  const customerAddressData =  useStoreCheckout((state) => state.customerAddressData);
  const selectDeliveryOption =  useStoreCheckout((state) => state.selectDeliveryOption);
  const setMapRadioData = useStoreCheckout((state) => state.setMapRadioData);

  const [mapIsVisible, setMapIsVisible] = useState(false);

  const handleClickOption = (option) => {
    selectDeliveryOption(option);
    hideAddressMapSelectorModal();
  }
  const onChangeAddressInMap = (mapData: any) => {
    console.log("onChangeAddressInMap", mapData);
    if (!mapData) {
      alert("No se selecciono ninguna direccion...");
      return;
    }

    setMapRadioData({ address: mapData.address, coordinates: mapData.coordinates });
    setMapIsVisible(false);
  };

  const handleClickChangeAddress = () => {
    mapIsVisible ? setMapIsVisible(false) : setMapIsVisible(true);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 gap-12">
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-2">
          <h5 className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <span>🏪</span> Opciones de retiro/entrega para la ubicacion seleccionada.
            </h5>
          <div className="w-full px-8 flex flex-col space-between gap-4">
            <p className="text-sm text-gray-600">
              {customerAddressData?.address || 'Elegir una sucursal para retirar o Seleccionar una direccion de entrega para calcular el costo y si hacemos delivery a domicilio'}.
               </p>
               <div className="ml-auto flex flex-wrap gap-4">
              <button
                className="  text-sm text-blue-600 underline text-right"
                type="button"
                onClick={handleClickChangeAddress}>
                {mapIsVisible ? "Ocultar mapa" : `${customerAddressData ? 'Cambiar direccion' :  'Ingresar otra direccion'}`}
              </button>
              {customerAddressData && (
                <button
                className="ml-auto text-sm text-blue-600 underline text-right"
                type="button"
                onClick={() => setCustomerAddressData(null)}>
                Borrar direccion
              </button>
              
              )}
              </div>
           
          </div>
          <hr className="border-gray-300 mt-2 mb-2" />
           {/* Mapa - Arriba en mobile, izquierda en desktop */}
        {mapIsVisible && (
          <>
          <AddressMapSelector
            onAddressSelect={onChangeAddressInMap}
            //centerCoordinates={motoDeliveryOriginCoordinates}
            />
            <hr className="border-gray-300 mt-8 mb-8" />

            </>
          
          
          )}
       
        </div>
      </div>

      

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto space-y-8">
        {/* Opciones de entrega */}

        <div className="flex flex-col gap-1">
          <h5 className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <span>🛵</span> Entrega a domicilio
          </h5>

          {(motoDeliveryOptions?.length > 0) ? (
            <div className="w-full px-4 grid grid-cols-1 gap-3">
              {motoDeliveryOptions.map((option, index) => (
                <MotoDeliveryCard
                  key={option.branchId || index}
                  option={option}
                  onSelect={handleClickOption}
                />
              ))}
            </div>
          ) : (
            <div className="w-full px-8 flex flex-col gap-4">
            <p className="text-gray-600 text-sm">{customerAddressData ? "No hay opciones disponibles" : "No se ha seleccionado ninguna direccion. Ingrese una direccion de entrega para calcular el costo y si hacemos delivery a domicilio."}</p>
             <button
                className="  text-sm text-blue-600 underline text-right"
                type="button"
                onClick={handleClickChangeAddress}>
                Ingresar otra direccion
              </button>
            </div>
          )}
        </div>

        {/* Opciones de recogida */}
        {pickupDeliveryOptions?.length > 0 && (
          <div className="flex flex-col gap-1">
            <h5 className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <span>🏪</span> Retiro en sucursal
            </h5>
            <div className="w-full px-4 grid grid-cols-1 gap-3">
              {pickupDeliveryOptions.map((option, index) => (
                <PickupOptionCard
                  key={option.branchId || index}
                  option={option}
                  onSelect={handleClickOption}
                />
              ))}
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
}

