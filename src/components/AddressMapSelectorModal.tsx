"use client";
import { useStoreCheckout, useModalsStore, useBranchesStore } from "@/stores";
import { LayoutModal, AddressMapSelector, DeliveryPreview } from "@/components";
import { useState } from "react";


export default function AddressMapSelectorModal() {
  const addressMapSelectorModalIsOpen = useModalsStore(
    (state) => state.addressMapSelectorModalIsOpen
  );
  const hideAddressMapSelectorModal = useModalsStore(
    (state) => state.hideAddressMapSelectorModal
  );
/*
  const motoDeliveryOriginCoordinates = useBranchesStore(
    (state) => state.selectedBranch?.motoDeliveryOriginCoordinates
  );

  const [currentAddressData, setCurrentAddressData] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const onChangeAddress = (addressData) => {
    if (!addressData) {
      alert("No se selecciono ninguna direccion...");
      return;
    }
    setCurrentAddressData(addressData);
    setShowMap(false);
  };
*/
 return (
  <LayoutModal
    isOpen={addressMapSelectorModalIsOpen}
    onClose={hideAddressMapSelectorModal}
    title="Selecciona tu dirección"
    content={
      <div className="max-w-2xl mx-auto p-6 mb-24">
        <DeliveryPreview/>
      </div>
    }
  />
);
}