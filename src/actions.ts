'use server'
import DataService from "./lib/DataService"

async function checkoutOrder(checkoutData: any){
    //Hay que validar los precios , costos, stock, todo de la compra
    //SI todo lo anterior salio bien entonces ponerlo en la base de datos de la serverAPP,
    //Hacer que esta app o la server app envien el email
    //Saliendo todo ok devuelvo el wa.me

 const { branchId, customerCkeckoutData, cartTicket } = checkoutData
 
 const selectedBranch = await DataService.getBranchById(branchId)
 if (!selectedBranch) return {success: false}
 const waMessagePhone = selectedBranch?.waMessageConfig.waPhoneNumber?.trim()
 const chatMessageConfig = selectedBranch?.waMessageConfig.chatMessageConfig
 const pickupPointCompleteAddress = selectedBranch?.deliveryMethods.find((dm) => dm.type === "pickup")?.constraints?.pickupPointCompleteAddress 
 const orderNumber = Math.floor(Math.random() * 1000000)

const stringMessage = getOrderMessage({
    chatMessageConfig: chatMessageConfig, 
    cartTicket: cartTicket, //Revisar despues
    orderNumber,
    customerCheckoutData: customerCkeckoutData,
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
    cartTicket,
    orderNumber,
    customerCheckoutData,    
    pickupPointCompleteAddress,
 }){

    const headerMessageSection = getMessageHeaderSection(chatMessageConfig)
    const footerMessageSection =  getMessageFooterSection(chatMessageConfig)
    const clientDataItems = getClientDataItems(customerCheckoutData)
    const orderMessageListLines = getMessageClientSection(clientDataItems)
    const orderMessageCartSection = getOrderMessagesCartSection(cartTicket)

    return [...headerMessageSection,
            wtspMessagesConverter.getLineBreak(),
            ...orderMessageListLines,
            wtspMessagesConverter.getLineBreak(),
            ... orderMessageCartSection,
            wtspMessagesConverter.getLineBreak(),
            ...footerMessageSection].join('')
 }

 
 function getOrderMessagesCartSection(cartTicket: any){
    const { detail:details, itemsCount, totalPrice} = cartTicket
    const fragments = []
    fragments.push(wtspMessagesConverter.getBoldText('Mi Pedido:'))
    fragments.push(wtspMessagesConverter.getLineBreak())
    details.forEach((detail: any) => {
        fragments.push(wtspMessagesConverter.getBoldText('• '  + detail.quantity + ' X ' + detail.productData?.title))
        fragments.push(wtspMessagesConverter.getLineBreak())
    if (detail.productData.variant) {
        fragments.push(wtspMessagesConverter.getCommonText('  ◦ '))
        fragments.push(wtspMessagesConverter.getItalicText(detail.productData.variant.name))
        fragments.push(wtspMessagesConverter.getCommonText(': '))
        fragments.push(wtspMessagesConverter.getCommonText(detail.productData.variant.selectedOption.name))
        fragments.push(wtspMessagesConverter.getLineBreak())
    }
    if (detail.productData.customizationFeatures) {
        detail.productData.customizationFeatures.forEach((customizationFeature: any) => {
            fragments.push(wtspMessagesConverter.getCommonText('  ◦ '))
            fragments.push(wtspMessagesConverter.getItalicText(customizationFeature.name))
            fragments.push(wtspMessagesConverter.getCommonText(':'))
            fragments.push(wtspMessagesConverter.getLineBreak())
            customizationFeature.selectedOptions.forEach((selectedOption: any) => {
                fragments.push(wtspMessagesConverter.getCommonText('     -  ' + ''))
                fragments.push(wtspMessagesConverter.getCommonText(selectedOption.name))
                fragments.push(wtspMessagesConverter.getLineBreak())
            })
        })
    }})
    fragments.push(wtspMessagesConverter.getSimpleLine())
    fragments.push(wtspMessagesConverter.getBoldText('   ' + itemsCount + ' productos' + '  -  Total: $ ' + totalPrice ))
    fragments.push(wtspMessagesConverter.getLineBreak())
    fragments.push(wtspMessagesConverter.getSimpleLine())
    return fragments.join('')
 }

function getMessageHeaderSection(chatMessageConfig: any){
    const fragments = []
    if(chatMessageConfig?.header) {
        fragments.push(wtspMessagesConverter.getBoldText(chatMessageConfig?.header))
        fragments.push(wtspMessagesConverter.getLineBreak())
        fragments.push(wtspMessagesConverter.getSimpleLine())
    }
    if(chatMessageConfig?.welcomeMessage) {
        fragments.push(wtspMessagesConverter.getItalicText(chatMessageConfig?.welcomeMessage))
        fragments.push(wtspMessagesConverter.getLineBreak())
    }
    return fragments
}


function getMessageFooterSection(chatMessageConfig: any){
    const fragments = []
    
      if (chatMessageConfig?.footerTitle) {
       fragments.push(wtspMessagesConverter.getBoldText(chatMessageConfig?.footerTitle))
       fragments.push(wtspMessagesConverter.getLineBreak())
    }

    if (chatMessageConfig?.contactData?.whatsappNumbers || chatMessageConfig?.contactData?.phones || chatMessageConfig?.contactData?.emails ) {
          
        if(chatMessageConfig?.contactData?.whatsappNumbers){
            fragments.push(wtspMessagesConverter.getItalicText('Whatsapp'))
            fragments.push(wtspMessagesConverter.getCommonText(': '))
            fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.contactData?.whatsappNumbers.join(', ')))
            fragments.push(wtspMessagesConverter.getLineBreak())
        }
        if(chatMessageConfig?.contactData?.phones){
            fragments.push(wtspMessagesConverter.getItalicText('Telefono'))
            fragments.push(wtspMessagesConverter.getCommonText(': '))
            fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.contactData?.phones.join(', ')))
            fragments.push(wtspMessagesConverter.getLineBreak())
        }
        if(chatMessageConfig?.contactData?.emails){
            fragments.push(wtspMessagesConverter.getItalicText('Email'))
            fragments.push(wtspMessagesConverter.getCommonText(': '))
            fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.contactData?.emails.join(', ')))
            fragments.push(wtspMessagesConverter.getLineBreak())
        }
    }
    if (chatMessageConfig?.ubicationText) {
        fragments.push(wtspMessagesConverter.getItalicText('Nuestra ubicacion'))
        fragments.push(wtspMessagesConverter.getCommonText(': '))
        fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.ubicationText))
        fragments.push(wtspMessagesConverter.getLineBreak())
    }
    if (chatMessageConfig?.workingHoursText) {
        fragments.push(wtspMessagesConverter.getItalicText('Nuestros horarios de atencion'))
        fragments.push(wtspMessagesConverter.getCommonText(': '))
        fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.workingHoursText))
        fragments.push(wtspMessagesConverter.getLineBreak())
    }
    if (chatMessageConfig?.footerMessage) {
        fragments.push(wtspMessagesConverter.getLineBreak())
        fragments.push(wtspMessagesConverter.getCommonText(chatMessageConfig?.footerMessage))
    }
    return fragments
}

function getMessageClientSection(clientDataItems){
    const fragments = []
    if (clientDataItems.length > 0){
        fragments.push(wtspMessagesConverter.getBoldText('Datos del cliente'))
        fragments.push(wtspMessagesConverter.getLineBreak())
        clientDataItems.forEach((item) => {
            fragments.push(wtspMessagesConverter.getCommonText('• '))
            fragments.push(wtspMessagesConverter.getItalicText(item.label))
            fragments.push(wtspMessagesConverter.getCommonText(': '))
            fragments.push(wtspMessagesConverter.getCommonText(item.value))
            fragments.push(wtspMessagesConverter.getLineBreak())
        })   
    }
    return fragments
}

 function getClientDataItems(customerCheckoutData: any){
     const {customerName, customerEmail, customerPhone, selectedPaymentMethodType, selectedDeliveryMethodType, pickupPointCompleteAddress, customerCompleteAddress, notes} = customerCheckoutData
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



 //--------------------------------------------------
 const wtspMessagesConverter = {
    getLineBreak: () => '\n',
    getEmoji: (emoji) => `:${emoji}:`,
    getBoldText: (text) => `*${text}*`,
    getItalicText: (text) => `_${text}_`,
    getUnderlinedText: (text) => `__${text}__`,
    getCommonText: (text) => `${text}`,
    getSimpleLine: () => '━'.repeat(24) + '\n'
 }