"use client";
import { useState, useEffect, use } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useStoreCheckout, useBranchesStore } from "@/stores";
import { useRouter } from "next/navigation";
import {
  LayoutModal,
  AddressMapSelector,
  CheckoutOrderResume,
  PremiumTrustIndicators,
  CartCheckoutActionButtons,
} from "@/components";

export default function CheckoutForm({}) {
  const router = useRouter();


  const showDeliveryAddressAndRadioForm = useStoreCheckout(
    (state) => state.showDeliveryAddressAndRadioForm
  );
  const setCustomerAddress = useStoreCheckout(
    (state) => state.setCustomerAddress
  );
  const setShowDeliveryAddressAndRadioForm = useStoreCheckout(
    (state) => state.setShowDeliveryAddressAndRadioForm
  );

  const selectedDeliveryMethodType = useStoreCheckout(
    (state) => state.selectedDeliveryMethodType
  );

  const submitOrder = useStoreCheckout((state) => state.submitOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeCustomerAddress = (addressData) => {
    console.log("addressData selected:", addressData);
    setCustomerAddress({
      completeAddress: addressData.address,
      customerCoordinates: addressData.coordinates,
    });
  };


  return (
    <>
      <div className="max-w-7xl mx-auto p-3 sm:p-12 lg:p-12 bg-gradient-to-b from-orange-50/50 to-white">
        <CheckoutFormHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="order-1 lg:order-1 px-2 sm:px-4 lg:px-8">
            <div className="space-y-6">
              <CustomerNameInput />
              <CustomerEmailInput />
              <CustomerPhoneInput />
              <DeliveryMethodsSelector />
              <PaymentMethodSelector />
              <NotesInput />
              <input
                type="text"
                name="deliveryMethodType"
                value={selectedDeliveryMethodType}
              />
            </div>
          </div>
          <div className="order-2 lg:order-2 px-2 sm:px-4 lg:px-8 flex flex-col gap-4">
            <CheckoutOrderResume />
            <PremiumTrustIndicators />
            <OrderPreview />
            <CartCheckoutActionButtons
              onSubmit={submitOrder}
              isSubmitting={isSubmitting}
              onClose={() => router.push("/")}
            />
          </div>
        </div>
      </div>
      <LayoutModal
        isOpen={showDeliveryAddressAndRadioForm}
        onClose={() => setShowDeliveryAddressAndRadioForm(false)}
        title="Selecciona tu dirección"
        content={
          <AddressMapSelector onAddressSelect={onChangeCustomerAddress} />
        }
      />
    </>
  );
}

//------------------------------------------------------------------------------------------------------

function CheckoutFormHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Emoji a la izquierda */}
        <div className="bg-gradient-to-br from-orange-100 to-red-100 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
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

function CustomerNameInput() {
  const setCustomerName = useStoreCheckout((state) => state.setCustomerName);
  const errors = useStoreCheckout((state) => state.errors);

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <span>👤</span>
        Nombre completo *
      </label>
      <input
        type="text"
        name="customerName"
        required
        onChange={(e) => setCustomerName(e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 ${
          errors.customerName
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-orange-300"
        }`}
        placeholder="Tu nombre completo"
      />
      <div className="flex flex-col gap-2 px-2">
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span>
            {errors.customerName}
          </p>
        )}
      </div>
    </div>
  );
}

function CustomerEmailInput() {
  const setCustomerEmail = useStoreCheckout((state) => state.setCustomerEmail);
  const errors = useStoreCheckout((state) => state.errors);
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <span>📧</span>
        Email *
      </label>
      <input
        type="email"
        required
        name="customerEmail"
        onChange={(e) => setCustomerEmail(e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 ${
          errors.customerName
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-orange-300"
        }`}
        placeholder="Tu email"
      />
      <div className="flex flex-col gap-2 px-2">
        {errors.customerEmail && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span>
            {errors.customerEmail}
          </p>
        )}
      </div>
    </div>
  );
}

function CustomerPhoneInput() {
  const setCustomerPhone = useStoreCheckout((state) => state.setCustomerPhone);
  const errors = useStoreCheckout((state) => state.errors);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState("MX");
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
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
        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
          <span>💡</span>
          Formato: {getPhonePlaceholder(selectedPhoneCountry)} - Solo números,
          sin espacios ni guiones
        </p>
        <p className="text-gray-500 text-xs flex items-center gap-1">
          <span>🌍</span>
          El código del país se selecciona automáticamente arriba
        </p>

        {errors.customerPhone && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
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

    // Caribe
    CU: "Ej: 5 123 4567",
    JM: "Ej: 876 123 4567",
    HT: "Ej: 34 12 3456",
    DO: "Ej: 809 123 4567",
    PR: "Ej: 787 123 4567",
    TT: "Ej: 868 123 4567",
    BB: "Ej: 246 123 4567",
    GD: "Ej: 473 123 4567",
    LC: "Ej: 758 123 4567",
    VC: "Ej: 784 123 4567",
    AG: "Ej: 268 123 4567",
    KN: "Ej: 869 123 4567",
    DM: "Ej: 767 123 4567",

    // Europa Occidental
    ES: "Ej: 612 345 678",
    PT: "Ej: 912 345 678",
    FR: "Ej: 6 12 34 56 78",
    DE: "Ej: 151 123 45678",
    IT: "Ej: 312 123 4567",
    NL: "Ej: 6 123 45678",
    BE: "Ej: 470 123 456",
    CH: "Ej: 76 123 45 67",
    AT: "Ej: 660 123 456",
    GB: "Ej: 7700 123 456",
    IE: "Ej: 87 123 4567",

    // Europa del Este
    PL: "Ej: 512 123 456",
    CZ: "Ej: 601 123 456",
    SK: "Ej: 901 123 456",
    HU: "Ej: 20 123 4567",
    RO: "Ej: 712 123 456",
    BG: "Ej: 88 123 4567",
    HR: "Ej: 91 123 4567",
    SI: "Ej: 31 123 456",
    EE: "Ej: 5123 4567",
    LV: "Ej: 2123 4567",
    LT: "Ej: 6123 4567",
  };

  return placeholders[countryCode] || "Ej: Ingresa tu número";
};

function DeliveryMethodsSelector() {

  const setShowDeliveryAddressAndRadioForm = useStoreCheckout((state) => state.setShowDeliveryAddressAndRadioForm);

  const distanceMotoDeliveryToCustomerAddressInKms = useStoreCheckout((state) => state.distanceMotoDeliveryToCustomerAddressInKms);

  const deliveryMethods = useBranchesStore(
    (state) => state.deliveryMethods || []
  );
  const selectDeliveryMethod = useStoreCheckout(
    (state) => state.selectDeliveryMethod
  );
  const selectedDeliveryMethodType = useStoreCheckout(
    (state) => state.selectedDeliveryMethodType
  );

  const customerCompleteAddress = useStoreCheckout(
    (state) => state.currentCustomerAddress?.completeAddress
  )

    const pickupPointCompleteAddress = deliveryMethods.find((dm => dm.type === "pickup"))?.constraints?.pickupPointCompleteAddress;  
  const handleClick = (deliveryMethodType: string) => {
    selectDeliveryMethod(deliveryMethodType);
  };



  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-bold text-gray-700  flex items-center gap-2">
        <span>🚀</span>
        Forma de entrega *
      </label>
      <div className="grid grid-cols-2 gap-3 p-2">
        {deliveryMethods.map((deliveryMethod: any) => (
          <button
            type="button"
            onClick={() => handleClick(deliveryMethod.type)}
            className={`group p-3 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
              deliveryMethod?.type === selectedDeliveryMethodType
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg"
                : "border-gray-300 hover:border-orange-300 hover:shadow-md"
            }`}
          >
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {deliveryMethod.uiData?.emoji}
            </div>
            <div className="text-sm font-bold text-gray-900 mb-1">
              {deliveryMethod.uiData?.label}
            </div>
            <div className="text-xs text-gray-600">
              {deliveryMethod.uiData?.estimatedTime}
            </div>
          </button>
        ))}
      </div>
      {selectedDeliveryMethodType === "motoDelivery" && (
         <div className="p-4 flex flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>🏠</span>
            Entregar en:
          </h3>
        
            <p className="text-sm text-gray-600">
              {customerCompleteAddress  && customerCompleteAddress }
            </p>
                   
          
            <button
              onClick={() => setShowDeliveryAddressAndRadioForm(true)}
              className="text-sm text-blue-600 underline"
              type="button">
              {customerCompleteAddress ? "Cambiar direccion" : "Ingresar direccion"}
            </button>
          
        </div>
      )}
      {selectedDeliveryMethodType === "pickup" && (
         <div className="p-4 flex flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>🏠</span>
            Retirar en:
          </h3>
        
            <p className="text-sm text-gray-600">
              {pickupPointCompleteAddress  && pickupPointCompleteAddress }
            </p>
                           
           
          
        </div>
      )}
    </div>
  );
}

function OrderPreview() {
  const customerName = useStoreCheckout((state) => state.customerName);
  const customerEmail = useStoreCheckout((state) => state.customerEmail);
  const customerPhone = useStoreCheckout((state) => state.customerPhone);
  const notes = useStoreCheckout((state) => state.notes);

  const customerCompleteAddress = useStoreCheckout(
    (state) => state.currentCustomerAddress?.completeAddress
  );

  const selectedDeliveryMethodType = useStoreCheckout(
    (state) => state.selectedDeliveryMethodType
  );
  const selectedPaymentMethodType = useStoreCheckout(
    (state) => state.selectedPaymentMethodType
  );

    const paymentMethods = useBranchesStore((state) => state.paymentMethods);
  const deliveryMethods = useBranchesStore((state) => state.deliveryMethods);

  const [selectedDeliveryMethodLabel, setSelectedDeliveryMethodLabel] = useState('');
  const [selectedPaymentMethodLabel, setSelectedPaymentMethodLabel] = useState(''); 
  

  useEffect(() => {
    const deliveryMethod = deliveryMethods.find((method) => method.type === selectedDeliveryMethodType);
    setSelectedDeliveryMethodLabel(deliveryMethod?.uiData?.label);    
  }, [selectedDeliveryMethodType]);

  useEffect(() => {
    const paymentMethod = paymentMethods.find((method) => method.type === selectedPaymentMethodType);
    setSelectedPaymentMethodLabel(paymentMethod?.uiData?.label);
  }, [selectedPaymentMethodType]);
  
  
  const pickupPointCompleteAddress = deliveryMethods.find((dm => dm.type === "pickup"))?.constraints?.pickupPointCompleteAddress;  
    


  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <span>🛒</span>
        Vista previa de tu pedido
      </h3>
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Nombre:
        </h3>
        <p className="text-sm text-gray-600">
          {customerName || "Completa tu nombre."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Email:
        </h3>
        <p className="text-sm text-gray-600">
          {customerEmail || "Completa tu email."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Telefono:
        </h3>
        <p className="text-sm text-gray-600">
          {customerPhone || "Completa tu telefono."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Forma de retiro/entrega:
        </h3>
        <p className="text-sm text-gray-600">
           {selectedDeliveryMethodLabel || "Completa tu forma de entrega."}
        </p>
      </div>
      {selectedDeliveryMethodType === "motoDelivery" && (
        <div className="flex flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>🏠</span>
            Dirección de entrega:
          </h3>
          <p className="text-sm text-gray-600">
            {customerCompleteAddress || "Completa tu dirección."}
          </p>
        </div>
      )}
      {selectedDeliveryMethodType === "pickup" && (
        <div className="flex flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>🏠</span>
            Dirección de retiro:
          </h3>
          <p className="text-sm text-gray-600">
            {pickupPointCompleteAddress || "Consulta la direccion de retiro."}
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Forma de pago:
        </h3>
        <p className="text-sm text-gray-600">
      
            { selectedPaymentMethodLabel || "Seleccione un método de pago."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>🏠</span>
          Nota:
        </h3>
        <p className="text-sm text-gray-600">
          {notes || "Sin notas adicionales."}
        </p>
      </div>
    </div>
  );
}

function PaymentMethodSelector() {

  const selectPaymentMethod = useStoreCheckout(
    (state) => state.selectPaymentMethod
  );
  const selectedPaymentMethodType = useStoreCheckout(
    (state) => state.selectedPaymentMethodType
  );

  const paymentMethods = useBranchesStore((state) => state.paymentMethods);
  const handleClick = (paymentMethodType: string) => {
    selectPaymentMethod(paymentMethodType);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-bold text-gray-700  flex items-center gap-2">
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

function NotesInput() {
  const setNotes = useStoreCheckout((state) => state.setNotes);
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        <span>💭</span>
        Notas adicionales
      </label>
      <textarea
        name="notes"
        onChange={(e) => setNotes(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
        placeholder="Instrucciones especiales, alergias, etc..."
        rows={2}
      />
    </div>
  );
}
