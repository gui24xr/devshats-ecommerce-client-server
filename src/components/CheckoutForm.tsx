"use client";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDeliveryAndPaymentStore, useModalsStore, } from "@/stores";
import  CheckoutService  from "@/lib/CheckoutService";

import {
  CheckoutOrderResume,
  PremiumTrustIndicators,
  CartCheckoutActionButtons,
  AddressMapSelectorModal,
  MotoDeliveryCard,
  PickupOptionCard,
} from "@/components";

export default function CheckoutForm() {

  

  const handleSubmit = async (event) => {
    try{
      event.preventDefault();
      const formValues = new FormData(event.target);
      const formData = Object.fromEntries(formValues);
      console.log("Form datasss EN CHECKOUT FORM:", formData);

      const response =await CheckoutService.processCurrentOrder(formData);
      console.log('Response en formulario de checkout', response);
    }catch(error){
      console.error(error);
      throw error
    }
   
    
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-3 sm:p-12 lg:p-12 bg-gradient-to-b from-orange-50/50 to-white">
        <CheckoutFormHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="order-1 lg:order-1 px-2 sm:px-4 lg:px-8">
            <div className="space-y-6">
           <StandardInput
            labelEmoji="👤"
            label="Nombre completo"
            name="customerName"
            required={true}
            placeholder="Tu nombre completo"
          />
          <StandardInput
            labelEmoji="📧"
            label="Email"
            type="email"
            name="customerEmail"
            required={true}
            placeholder="tu@email.com"
          />
          <CustomerPhoneInput />
              <hr className="border-gray-300" />
              <DeliveryMethodsSelector />
              <hr className="border-gray-300" />
              <PaymentMethodSelector />
              <hr className="border-gray-300" />
              <StandardInput
                labelEmoji="💭"
                label="Notas adicionales"
                name="notes"
                as="textarea"
                rows={2}
                placeholder="Instrucciones especiales, alergias, etc..."
            />
            </div>
          </div>
          <div className="order-2 lg:order-2 px-2 sm:px-4 lg:px-8 flex flex-col gap-8">
            {<CheckoutOrderResume />}
            <PremiumTrustIndicators />
            <div className="space-y-8 mt-8">
              {/*<OrderPreview /> */}
              <CartCheckoutActionButtons />
            </div>
          </div>
        </div>
      </form>
      <AddressMapSelectorModal />
    </>
  );
}

//------------------------------------------------------------------------------------------------------

function CheckoutFormHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-end gap-3 sm:gap-6">
        {/* Emoji a la izquierda */}
        <div className="bg-gradient-to-br from-orange-100 to-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-end justify-center shadow-lg flex-shrink-0">
          <span className="text-lg sm:text-2xl">🌭</span>
        </div>

        {/* Título y descripción a la derecha */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-1">
            Finalizar Pedido
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Completa tus datos para procesar tu orden
          </p>
        </div>
      </div>
    </div>
  );
}
function StandardInput({
  labelEmoji,
  label,
  type = "text",
  name,
  required = false,
  placeholder,
  defaultValue = "",
  as = "input",
  rows = 3
}: {
  labelEmoji: string;
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder: string;
  defaultValue?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const baseClassName = "w-full px-4 py-3 border-2 border-gray-300 hover:border-orange-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500";
  
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-end gap-2">
        <span>{labelEmoji}</span>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          defaultValue={defaultValue}
          className={baseClassName}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={defaultValue}
          className={baseClassName}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function CustomerPhoneInput() {
  const setCustomerPhone = (value) => {}
  const errors = (value) => {}
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState("MX");
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-end gap-2">
        <span>📞</span>
        Teléfono *
      </label>

      <PhoneInput
        className="w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
        international={false}
        defaultCountry="MX"
        required
        name="customerPhone"
        onChange={(value) => setCustomerPhone(value || "")}
        onCountryChange={(country) => setSelectedPhoneCountry(country || "MX")}
        placeholder={getPhonePlaceholder(selectedPhoneCountry)}
        countries={[
          "AR",
          "BR",
          "CL",
          "CO",
          "PE",
          "VE",
          "EC",
          "UY",
          "PY",
          "BO",
          "MX",
        ]}
      />

      {/* Texto de ayuda */}
      <div className="flex flex-col gap-2 px-2">
        <p className="text-gray-500 text-xs mt-2 flex items-end gap-1">
          <span>💡</span>
          Formato: {getPhonePlaceholder(selectedPhoneCountry)} - Solo números,
          sin espacios ni guiones
        </p>
        <p className="text-gray-500 text-xs flex items-end gap-1">
          <span>🌍</span>
          El código del país se selecciona automáticamente arriba
        </p>

        {errors.customerPhone && (
          <p className="text-red-500 text-sm mt-2 flex items-end gap-1">
            <span>⚠️</span>
            {errors.customerPhone}
          </p>
        )}
      </div>
    </div>
  );
}

// Función para obtener el placeholder según el país (solo número local)
const getPhonePlaceholder = (countryCode: string) => {
  const placeholders: Record<string, string> = {
    // América del Norte
    MX: "Ej: 81 1234 5678",
    US: "Ej: 555 123 4567",
    CA: "Ej: 416 123 4567",
    // América Central
    GT: "Ej: 5123 4567",
    BZ: "Ej: 612 3456",
    SV: "Ej: 7123 4567",
    HN: "Ej: 9123 4567",
    NI: "Ej: 8123 4567",
    CR: "Ej: 8888 8888",
    PA: "Ej: 6123 4567",
    // América del Sur
    AR: "Ej: 11 1234 5678",
    BR: "Ej: 11 99999 9999",
    CL: "Ej: 9 1234 5678",
    CO: "Ej: 300 123 4567",
    PE: "Ej: 999 123 456",
    VE: "Ej: 412 123 4567",
    EC: "Ej: 99 123 4567",
    UY: "Ej: 99 123 456",
    PY: "Ej: 981 123 456",
    BO: "Ej: 712 123 45",
    GY: "Ej: 612 3456",
    SR: "Ej: 612 3456",
    GF: "Ej: 612 3456",
  };

  return placeholders[countryCode] || "Ej: Ingresa tu número";
};

function DeliveryMethodsSelector() {
  const selectedDeliveryOption = useDeliveryAndPaymentStore(
    (state) => state.selectedDeliveryOption
  );
  const showAddressMapSelectorModal = useModalsStore(
    (state) => state.showAddressMapSelectorModal
  );

  return (
    <div className="flex flex-col ">
      <label className="block text-sm font-bold text-gray-700  flex items-end gap-2">
        <span>🚀</span>
        Forma de entrega *
      </label>
      <div className="w-full p-4 flex flex-col gap-4">
        {selectedDeliveryOption?.deliveryType == "motoDelivery" && (
          <div className="w-full flex flex-col gap-2">
            <MotoDeliveryCard  option={selectedDeliveryOption} onSelect={() => {}}/>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-gray-700 flex items-end gap-2">
                <span>🏠</span>
                Entregar en:
              </h3>
              <div className="flex space-between">
                <p className="text-sm text-gray-600">
                  {selectedDeliveryOption?.customerAddressData?.completeAddress ||
                    "No se informo la direccion."}
                </p>
              </div>
              <div className="w-full space-y-6">
                <StandardInput
                  labelEmoji="📌"
                  label="Entre calles"
                  type="text"
                  name="motoDeliverybetweenStreets"
                  required={true}
                  placeholder="Entre calles"
                />

                 <StandardInput
                  labelEmoji="📌"
                  label="Referencia"
                  type="text"
                  name="motoDeliveryReference"
                  required={false}
                  placeholder="EJ: Mi numero exacto de casa es 2354... Departanento 3..."
                />

                
                <StandardInput
                  labelEmoji="📌"
                  label="Informacion adicional"
                  type="text"
                  name="motoDeliveryExtraInfo"
                  required={false}
                  placeholder="EJ: tocar la puerta de la casa..."
                />
              </div>
 
            </div>
            
          </div>
        )}
        {selectedDeliveryOption?.deliveryType == "pickup" && (
          <div className="w-full flex flex-col gap-2">
            <PickupOptionCard
              option={selectedDeliveryOption}
              onSelect={() => {}}
            />
            {selectedDeliveryOption?.customerAddressData && (
              <div className="p-4 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-gray-700 flex items-end gap-2">
                <span>🏠</span>
                Tu Domicilio
              </h3>
              <div className="flex space-between">
                <p className="text-sm text-gray-600">
                  {selectedDeliveryOption?.customerAddressData?.completeAddress ||
                    "No se informo la direccion."}
                </p>
              </div>
              <div className="w-full space-y-6">
                 <StandardInput
                  labelEmoji="📌"
                  label="Informacion adicional"
                  type="text"
                  name="pickupExtraInfo"
                  required={false}
                  placeholder="EJ: paso en media hora..."
                />
              </div>
            </div>
            )}
             
          </div>
        )}
       
 <button
          onClick={() => showAddressMapSelectorModal()}
          className="w-full  py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
          type="button"
        >
          <span>🔄</span>
          {!selectedDeliveryOption?  "Elegir metodo de entrega" : "Cambiar domicilio o metodo de entrega"}
        
        </button>
     
      </div>
    </div>
  );
}


function PaymentMethodSelector() {

  const selectPaymentMethodType = useDeliveryAndPaymentStore(
    (state) => state.selectPaymentMethodType
  );
  const selectedPaymentMethodType = useDeliveryAndPaymentStore(
    (state) => state.selectedPaymentMethodType
  );

  // Early return si no hay branch


  const paymentMethods = useDeliveryAndPaymentStore((state) => state.allowedPaymentMethods);

  const handleClick = (paymentMethodType: string) => {
    selectPaymentMethodType(paymentMethodType);
  };

  if (paymentMethods?.length == 0) {
    return <div>Metodos de pago cargando</div>;
  }
 console.log('paymentMethods aaaa',paymentMethods)
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-bold text-gray-700  flex items-end gap-2">
        <span>🚀</span>
        Metodo de pago *
      </label>
      <div className="grid grid-cols-1 gap-3 p-2">
        {paymentMethods?.map((paymentMethod: any) => (
          <button
            type="button"
            onClick={() => handleClick(paymentMethod.type)}
            className={`flex flex-row group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
              paymentMethod?.type === selectedPaymentMethodType
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg"
                : "border-gray-300 hover:border-orange-300 hover:shadow-md"
            }`}
          >
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {paymentMethod.uiData?.emoji}
            </div>
            <div className="flex flex-col ml-4 text-left">
              <div className="text-sm font-bold text-gray-900 mb-1">
                {paymentMethod.uiData?.label}
              </div>
              <div className="text-xs text-gray-600">
                {paymentMethod.uiData?.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
