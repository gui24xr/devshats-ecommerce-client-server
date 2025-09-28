"use client"
import { useState } from "react"
import { Table } from 'antd'
import { QuantitySelectorSmall, } from "@/components"
import { Trash2,  ShoppingCart } from 'lucide-react';



export default function CartDetails({ itemsList, setQuantity, removeFromCart, clearCart, totalPrice, itemsCount, onClose }: any) {

  if (!itemsList) return <div>No hay items en el carrito</div>

  const columns = [
    {
      title: () => {
        return <div className="flex flex-row justify-between bg-orange-500 font-semibold text-white rounded-md px-2 py-1">
          <div className="flex flex-row items-center justify-center gap-2">
            <span>Mi Carrito</span>
            <ShoppingCart className="w-4 h-4" />
          </div>
          <button className="flex flex-row gap-2 bg-purple-500 text-white rounded-md px-2 py-1" onClick={() => clearCart()} >
            <span> Vaciar carrito </span>
            <Trash2 className="self-center w-4 h-4" />
          </button>
        </div>
      },
      dataIndex: 'product',
      key: 'name',
      render: (text, record: any) => <ItemDetail item={record} setQuantity={setQuantity} removeFromCart={removeFromCart} />,
    },

  ]

  return (
    <div className="p-4 mb-20">
      <Table dataSource={itemsList} columns={columns} />
      <AddToCartSection totalPrice={totalPrice} itemsCount={itemsCount} onClick={onClose} />
    </div>
  )
}


function ItemDetail({ item, setQuantity, removeFromCart }) {
    const [quantity, setQuantityState] = useState(item.quantity)

    const handleQuantityChange = (quantity: any) => {
        console.log('handleQuantityChangeddd: ', quantity)
        setQuantityState(quantity)
        setQuantity(item.id, quantity)
    }

  return (
    <div className="w-full bg-gray-50 rounded-lg flex flex-col items-start gap-1">
      <div className="w-full flex justify-between bg-blue-500 px-1.5 ">
        <h4 className="text-lg text-white font-semibold text-gray-800 ">
          {item.data.product.name}
        </h4>
        <button className="text-sm font-semibold text-gray-800 underline decoration-solid"> <Trash2 onClick={() => removeFromCart(item.id)} className="w-4 h-4 text-white" /></button>
      </div>
      <div className="w-full flex flex-row  mt-4">
        <div className="w-3/4 flex flex-col ">

          {item.data.selectedVariant && (

            <div className="flex flex-wrap items-start gap-2">
              <div className="flex flex-wrap gap-2">

                <span className="text-sm font-semibold text-gray-800 underline decoration-solid">
                  {item.data.product.templateVariant.label + ':'}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {item.data.selectedVariant.label}
                </span>
              </div>
            </div>

          )}
          {item.data.customization?.length > 0 && (
            <div className="w-full flex flex-col  gap-1">
              {item.data.customization?.map((feature, featureIndex) => (
                feature.options.length > 0 && (

                  <div className="w-full flex ">
                    <div className="flex flex-wrap gap-2 ">


                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-semibold text-gray-800 underline decoration-solid self-center">
                          {feature.name + ':'}
                        </span>
                        {feature.options.map((option, optionIndex) => (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">{option.optionLabel} {option.priceModifier ? <span className="text-xs text-green-600 font-medium">
                              (+${option.priceModifier})
                            </span> : null} </span>
                            {option.selectedQuantity > 0 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                x{option.selectedQuantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                )
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">

          <QuantitySelectorSmall quantity={quantity} onChange={handleQuantityChange} />
          <span className="text-sm font-semibold text-gray-800 uppercase">
            Precio Unitario:  ${item.data.priceData.unitPrice}
          </span>









          <span className="text-sm font-semibold text-gray-800 uppercase">
            Subtotal: ${item.data.priceData.totalPrice}
          </span>


        </div>
      </div>


    </div>
  )

  // Obtener variante seleccionada si existe

}





function AddToCartSection({ totalPrice, itemsCount, onClick }: any) {




  const handleCheckoutButton = () => {
    // Validar requisitos mínimos antes de agregar al carrito
    onClick();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-lg">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
        <div className="flex flex-col items-center justify-between gap-2 ">
          <span className="text-sm font-semibold text-gray-800 uppercase">Cantidad de items: {itemsCount}</span>
          <span className="text-sm font-semibold text-gray-800 uppercase">Total: ${totalPrice}</span>
          <button
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            onClick={handleCheckoutButton}
          >
            <span className="text-xl">🛒</span>
            <span className="text-base">Finalizar compra</span>
          </button>
        </div>
      </div>
    </div>
  )
}
