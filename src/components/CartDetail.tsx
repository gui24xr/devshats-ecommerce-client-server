"use client"
import { useEffect } from "react"
import { Table } from 'antd'
import { QuantitySelectorSmall, QuantitySelectorBig } from "@/components"
import { Trash2, Trash, X, XCircle, Minus, MinusCircle, ShoppingCart } from 'lucide-react';


export default function CartDetails({ itemsList, setQuantity }: any) {

  useEffect(() => {
    console.log('itemslist en cart detail: ', itemsList)
  }, [itemsList])

  if (!itemsList) return <div>No hay items en el carrito</div>

  const columns = [
    {
      title: ()=>{
        return <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2"> 
           
            <span>Mi Carrito</span>
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="flex flex-row gap-2">
            <span> Vaciar carrito </span>
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      },
      dataIndex: 'product',
      key: 'name',
      render: (text, record: any) => <ItemDetail productData={record.data?.product} selectedVariant={record.data?.selectedVariant} customization={record.data?.customization} priceData={record.data?.priceData} quantity={record.quantity} setQuantity={setQuantity} />,
    },

  ]

  return (
    <div className="p-4">
      
      <Table dataSource={itemsList} columns={columns} />
      <AddToCartSection onClick={() => {}} />
    </div>
  )
}


function ItemDetail({ productData, customization, selectedVariant, priceData, quantity, setQuantity }) {




  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col items-start gap-1">
      <div className="w-full flex justify-between ">
        <h4 className="text-lg font-semibold text-gray-800 ">
          {productData.name}
        </h4>
        <button className="text-sm font-semibold text-gray-800 underline decoration-solid"> <Trash2 className="w-4 h-4" /></button>
      </div>
      <div className="w-full flex flex-row  gap-1 mt-4">
        <div className="w-3/4 flex flex-col ">

        {selectedVariant && (

          <div className="flex flex-wrap items-start gap-2">
            <div className="flex flex-wrap gap-2">

              <span className="text-sm font-semibold text-gray-800 underline decoration-solid">
                {productData.templateVariant.label + ':'}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {selectedVariant.label}
              </span>
            </div>
          </div>

        )}
        {customization?.length > 0 && (
          <div className="w-full flex flex-col  gap-1">
            {customization?.map((feature, featureIndex) => (
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

        <QuantitySelectorSmall quantity={quantity} onChange={setQuantity} />
            <span className="text-sm font-semibold text-gray-800 uppercase">
              Precio Unitario:  ${priceData.unitPrice}
            </span>
           
        
        


          

        
        
            <span className="text-sm font-semibold text-gray-800 uppercase">
              Subtotal: ${priceData.totalPrice}
            </span>
           
         
        </div>
      </div>


    </div>
  )

  // Obtener variante seleccionada si existe

}





function AddToCartSection({ onClick }: any) {


 

  const handleAddToCart = () => {
      // Validar requisitos mínimos antes de agregar al carrito
      onClick();
  };

  return (
      <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-lg">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between gap-6 ">
                  {/* Selector de cantidad del producto */}
                  {/*
                  <div className="flex items-center gap-3">
                      <span className="text-base font-medium text-gray-700">Cantidad:</span>
                      <QuantitySelector
                          quantity={quantity}
                          onChange={handleQuantityChange}
                          minQuantity={1}
                          maxQuantity={10}
                      />
                  </div>

                  {/* Botón agregar al carrito */}
                  <button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                      onClick={handleAddToCart}
                  >
                      <span className="text-xl">🛒</span>
                      <span className="text-base">Finalizar compra</span>
                  </button>
              </div>
          </div>
      </div>
  )
}
