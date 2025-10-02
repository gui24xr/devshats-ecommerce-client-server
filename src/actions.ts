'use server'
import DataService from "./lib/DataService"

async function checkoutOrder(orderData: any){
    //Hay que validar los precios , costos, stock, todo de la compra
    //SI todo lo anterior salio bien entonces ponerlo en la base de datos de la serverAPP,
    //Hacer que esta app o la server app envien el email
    //Saliendo todo ok devuelvo el wa.me

 const { branchId, customerName, customerPhone, customerEmail, notes, selectedDeliveryMethodType, selectedPaymentMethodType, customerCompleteAddress, customerCoordinates, cartItems } = orderData
 
 const selectedBranch = await DataService.getBranchById(branchId)
 if (!selectedBranch) return {success: false}
 const waMessagePhone = selectedBranch?.waMessageConfig.waPhoneNumber?.trim()
 const chatMessageConfig = selectedBranch?.waMessageConfig.chatMessageConfig
 const pickupPointCompleteAddress = selectedBranch?.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupPointCompleteAddress 
 const orderNumber = Math.floor(Math.random() * 1000000)

const stringMessage = getOrderMessage({
    chatMessageConfig: chatMessageConfig, 
    orderItems: cartItems, //Revisar despues
    orderNumber,
    customerName, 
    customerPhone, 
    customerEmail, 
    notes, 
    selectedDeliveryMethodType, 
    selectedPaymentMethodType, 
    customerCompleteAddress, 
    pickupPointCompleteAddress: pickupPointCompleteAddress 
})

 return {
    success: true,
    phone: waMessagePhone,
    message: stringMessage, 
  }

}


export {
    checkoutOrder
}





//---------HELPERS
 function getOrderMessage({
    chatMessageConfig,
    orderItems = [],
    orderNumber,
    customerName,
    customerPhone,
    customerEmail,
    notes,
    selectedDeliveryMethodType,
    selectedPaymentMethodType,
    customerCompleteAddress,
    pickupPointCompleteAddress,
 }){

    const headerMessageSection = getMessageHeaderSection(chatMessageConfig)
    const footerMessageSection =  getMessageFooterSection(chatMessageConfig)
    const clientDataItems = getClientDataItems({customerName,customerPhone,customerEmail,notes,selectedDeliveryMethodType,  selectedPaymentMethodType, customerCompleteAddress, pickupPointCompleteAddress})
    const orderMessageListLines = getMessageClientSection(clientDataItems)
    return [...headerMessageSection,...orderMessageListLines,...footerMessageSection].join('')
       
 }

 

function getMessageHeaderSection(chatMessageConfig: any){
    const headerMessageListLines = []
    if(chatMessageConfig?.header) {
        headerMessageListLines.push('*' + chatMessageConfig?.header + '*' + '\n')
        headerMessageListLines.push('━'.repeat(24) + '\n')
    }

    if(chatMessageConfig?.welcomeMessage) {
        headerMessageListLines.push(chatMessageConfig?.welcomeMessage + '\n\n')
    }

    return headerMessageListLines
}


function getMessageFooterSection(chatMessageConfig: any){
    const footerMessageListLines = []
    
    if (chatMessageConfig?.footerMessage || chatMessageConfig?.footerTitle || chatMessageConfig?.contactData?.whatsappNumbers || chatMessageConfig?.contactData?.phones || chatMessageConfig?.contactData?.emails || chatMessageConfig?.workingHoursText) {
        footerMessageListLines.push('\n' + '━'.repeat(24) + '\n')
    }

    if (chatMessageConfig?.footerTitle) {
        footerMessageListLines.push(chatMessageConfig?.footerTitle + '\n\n')
    }

    if (chatMessageConfig?.contactData?.whatsappNumbers || chatMessageConfig?.contactData?.phones || chatMessageConfig?.contactData?.emails ) {
        footerMessageListLines.push(`*Nuestros datos de contacto:* \n`)
        
        chatMessageConfig?.contactData?.whatsappNumbers && footerMessageListLines.push(`_Whatsapp:_ ${chatMessageConfig?.contactData?.whatsappNumbers.join(', ')}.\n`)
        chatMessageConfig?.contactData?.phones && footerMessageListLines.push(`_Telefono:_ ${chatMessageConfig?.contactData?.phones.join(', ')}.\n`)
        chatMessageConfig?.contactData?.emails && footerMessageListLines.push(`_Email:_ ${chatMessageConfig?.contactData?.emails.join(', ')}.\n`)
    }

    if (chatMessageConfig?.ubicationText) {
        footerMessageListLines.push(`\n *Nuestra ubicacion:* \n`)
        footerMessageListLines.push('_' + chatMessageConfig?.ubicationText + '_' + '\n')
    }
    

    if (chatMessageConfig.workingHoursText) {
        footerMessageListLines.push('*Nuestros horarios de atencion:*' + '\n' + '_' + chatMessageConfig?.workingHoursText + '_' + '.\n')
    }

    if (chatMessageConfig?.footerMessage) {
        footerMessageListLines.push('\n' + chatMessageConfig?.footerMessage + '\n')
    }

    return footerMessageListLines
}

function getMessageClientSection(clientDataItems){
    const clientMessageListLines = []
if (clientDataItems.length > 0){
        clientMessageListLines.push('━'.repeat(24) + '\n') && clientMessageListLines.push('*' + 'Datos del cliente' + '*' + '\n')
        clientDataItems.forEach((item) => {
            clientMessageListLines.push('•' + item.emoji + ' ' + item.label + ': ' + item.value + '\n')
    })   
    }

    return clientMessageListLines
}

 function getClientDataItems({customerName,customerPhone,customerEmail,notes,selectedDeliveryMethodType,  selectedPaymentMethodType, customerCompleteAddress, pickupPointCompleteAddress: pickupPointCompleteAddress}){
     
    const clientDataItems = []
    clientDataItems.push({emoji:'👤', label: 'Nombre', value: (customerName || 'Completar nombre.')})
    clientDataItems.push({emoji:'📧', label: 'Email', value: (customerEmail || 'Completar email.')})
    clientDataItems.push({emoji:'📞', label: 'Telefono', value: (customerPhone || 'Completar telefono.')})
    clientDataItems.push({emoji:'💳', label: 'Forma de pago', value: getSelectedPaymentMethodTypeText(selectedPaymentMethodType)})
    clientDataItems.push({emoji:'🚀', label: 'Forma de retiro/entrega', value: getSelectedDeliveryMethodTypeText(selectedDeliveryMethodType)})
    selectedDeliveryMethodType === 'pickup' && clientDataItems.push({emoji:'🏠', label: 'Dirección de retiro', value: (pickupPointCompleteAddress || 'Consultar direccion de retiro.')})
    selectedDeliveryMethodType === 'motoDelivery' && clientDataItems.push({emoji:'🏠', label: 'Dirección de entrega', value: (customerCompleteAddress || 'Completar direccion de entrega.')})
    clientDataItems.push({emoji:'💭', label: 'Nota', value: (notes || 'Sin notas adicionales.')})
    return clientDataItems
 }

 function getSelectedDeliveryMethodTypeText(selectedDeliveryMethodType: string) {
     switch (selectedDeliveryMethodType) {
         case 'motoDelivery':
             return 'Entrega a domicilio por delivery.';
         case 'pickup':
             return 'Retiro en sucursal.';
         default:
             return 'Completar forma de retiro/entrega.';
     }
 }

 function getSelectedPaymentMethodTypeText(selectedPaymentMethodType: string) {
     switch (selectedPaymentMethodType) {
         case 'CASH_PAYMENT':
             return 'Efectivo';
         case 'CREDIT_CARD_PAYMENT':
             return 'Tarjeta';
         case 'BANK_TRANSFER_PAYMENT':
             return 'Tarjeta';
         default:
             return'Completar forma de pago.';
     }
 }