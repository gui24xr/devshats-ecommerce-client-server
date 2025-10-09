'use client'
import { useStoreCheckout, useModalsStore, useBranchesStore } from "@/stores";
import {LayoutModal, AddressMapSelector, DeliveryPreview } from "@/components";
import { useState,} from "react";

export default function AddressMapSelectorModal() {
  const  addressMapSelectorModalIsOpen = useModalsStore(state => state.addressMapSelectorModalIsOpen)
  
  const hideAddressMapSelectorModal = useModalsStore(state => state.hideAddressMapSelectorModal)

  const validateCustomerAddress = useStoreCheckout( 
    (state) => state.validateCustomerAddress)

  const motoDeliveryOriginCoordinates = useBranchesStore(
    (state) => state.selectedBranch?.motoDeliveryOriginCoordinates)



  const [previewData, setPreviewData] = useState({
    currentCustomerAddress: { completeAddress: 'sfsfsfs', coordinates: null },
    distanceMotoDeliveryToCustomerAddressInKms: 0,
    distancePickupPointToCustomerAddressInKms: 0,
    allowMotoDeliveryToCustomerAddress: false,
    orderDeliveryAmount: 0
  });


  const onChangeAddress = (addressData) => {
    if (!addressData) {
        alert("No se selecciono ninguna direccion...");
       return
    }

    validateCustomerAddress({
      completeAddress: addressData.address,
      customerCoordinates: addressData.coordinates,
      onSuccess: (data) => {
        console.log('Data de on succedss', data)
        setPreviewData(data)
      },
      onError: (error) => {
        console.log('Data de on error', error)
      }
    });
  };

  return (
    <LayoutModal
      isOpen={addressMapSelectorModalIsOpen}
      onClose={hideAddressMapSelectorModal}
      title="Selecciona tu dirección"
      content={
        <div className="w-full h-full">
            <div className="flex">
            <AddressMapSelector
                onAddressSelect={onChangeAddress}
                centerCoordinates={motoDeliveryOriginCoordinates}
            />
            
                <DeliveryPreview previewData={previewData}/>
            
            </div>
       
        </div>
      }
    />
  )
}