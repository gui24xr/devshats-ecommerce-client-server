'use server'

async function checkoutOrder(formData:FormData){
    //Hay que validar los precios , costos, stock, todo de la compra
    //SI todo lo anterior salio bien entonces ponerlo en la base de datos de la serverAPP,
    //Hacer que esta app o la server app envien el email
    //Saliendo todo ok devuelvo el wa.me
 console.log(formData)
 const branchPhone = '+5491159149165'
 const messageText = `Hola, mi nombre es ${formData.get('customerName')} y quiero hacer el siguiente pedido... }`
 return {
    success: true,
    waLink: `https://wa.me/${branchPhone}?text=${messageText}`,
    orderId: '233553'
 }
}

export {
    checkoutOrder
}