"use client";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCartStore, useModalsStore } from "@/stores";
import { redirect } from "next/navigation";
import { StoreBanner } from "@/components";
export default function CartDetails() {
  const itemsList = useCartStore((state) => state.items);
  const hideCartModal = useModalsStore((state) => state.hideCartModal);
 


  
  return (
    <div className="flex flex-col h-full">
      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <StoreBanner />
        {itemsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 p-2">
            {itemsList.map((item) => (
              <CartItemDetail
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <CartEmpty/>
        )}
      </div>

      {/* Header fijo en la parte inferior */}
      {itemsList.length > 0 && <CartResultBar />}
    </div>
  );
}

function CartItemDetail({ item }: { item: any }) {


  const changeCartItemQuantity = useCartStore((state) => state.changeCartItemQuantity);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  
const handleChangeQuantity = (newQuantity: number) => {
  changeCartItemQuantity(item.id, newQuantity);  // 👈 item.id del scope
}
const handleRemoveItem = (itemId:string) => {
    removeCartItem(itemId);
};

  

  return (
    <div className="w-full bg-gray-100 rounded-lg flex flex-col items-start ">
       <div className="w-full flex flex-col">
        <div className="flex flex-row gap-4 ">
          <div className="min-w-[80px] max-w-[80px] flex flex-col">
            <img
              src={item?.productData?.image}
              alt={item?.productData?.title}
              className="w-24 h-24 object-cover"
            />
          </div>
          <div className="flex flex-col w-full min-h-[96px]">
             <h4 className="text-sm font-bold text-black bg-gray-200 px-2">
                {item.productData?.title}
              </h4>

           <div className="flex flex-col w-full px-4 pt-2 flex-1">
            <div>
              {item.productData?.type == 'SINGLE_VARIANT_PRODUCT' && (
                <div className="bg-white rounded-md p-2 border border-gray-200 mb-2">
                  <span className="text-sm text-gray-800 font-semibold block mb-1">
                    {item.productData?.variant?.label + ":"}
                  </span>
                  <span className="text-sm text-gray-700 italic">
                    {item?.productData?.variant?.selectedOption?.label}
                  </span>
                </div>
              )}
              {item.productData?.customizationFeatures && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {item.productData?.customizationFeatures?.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-md p-2 border border-gray-200">
                      <span className="text-sm font-semibold text-gray-800 block mb-1.5">
                        {feature?.name}:
                      </span>
                      <ul className="list-disc list-inside pl-2 space-y-0.5">
                        {feature?.selectedOptions?.map((selectedOption) => (
                          <li key={selectedOption.id} className="text-sm text-gray-700 italic">
                            <span className="font-medium">{selectedOption?.name}</span>
                            {selectedOption?.priceModifier > 0 && (
                              <span className="text-xs text-green-600 font-semibold ml-1">
                                {" "}(+${selectedOption?.priceModifier})
                              </span>
                            )}
                            {selectedOption?.selectedQuantity && selectedOption?.selectedQuantity > 0 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium ml-2">
                                {" "}x{selectedOption?.selectedQuantity}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full text-right pt-3 mt-auto">
              <span className="text-base font-bold text-green-600">
                Precio: ${item?.unitPriceData?.finalPrice}
              </span>
            </div>
          </div>
        </div>
        </div>
        <div className="flex items-end justify-end border-t border-blue-200 p-1.5">
          <div className="w-full flex flex-col self-end text-right">
           
            <div className="flex items-center justify-end gap-2">
            
              {/* justify-end para alinear a la derecha */}
              <span className="text-sm font-semibold text-blue-500 capitalize">
                Cantidad:
              </span>
              <ItemDetailQuantitySelector
                quantity={item.quantity}
                onChange={handleChangeQuantity}
                min={1}
                max={10}
              />
            </div>
            <span className="text-sm font-semibold text-gray-800 capitalize">
              subtotal: ${item?.subtotal}
            </span>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="text-right text-sm font-semibold text-red-600 capitalize"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Obtener variante seleccionada si existe
}

function CartResultBar() {

  const itemsCount = useCartStore((state) => state.itemsCount);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const hideCartModal = useModalsStore((state) => state.hideCartModal);

  const handleClickClearCart = () => {
    clearCart && clearCart()
  }

  const handleCheckout = () => {
    hideCartModal()
    redirect("/checkout");
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-2xl p-3 border-t-2 border-orange-600">
    <div className="sticky bottom-0 pb-2 md:px-4 md:pt-2 md:pb-4">
      {/* Título del carrito */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-white" />
          <h2 className="text-lg font-bold text-white">Mi Carrito</h2>
        </div>
        <div>
            <button
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition-all"
          onClick={handleClickClearCart}
          title="Vaciar carrito"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        </div>
        
      </div>

      {/* Información del carrito - Una línea */}
      <div className="bg-white/10 rounded-md px-3 py-2 mb-3">
       <div className="flex flex-row justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold">{itemsCount}</span>
            <span className="text-white/90 text-sm">Items</span>   
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/90 text-sm">Total:</span>
            <span className="text-white font-bold text-lg">${totalPrice}</span>
          </div>
        
       
       
          
        </div>
      </div>

      {/* Botones de acción - Una línea */}
      <div className="flex items-center gap-2">
         <button
              type="button"
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-lg transition-all text-sm"
              onClick={() => hideCartModal()}>
              Seguir Comprando
            </button>
        <button
          type="button"
          disabled={itemsCount === 0}
          className="flex-1 bg-white hover:bg-gray-100 text-orange-600 font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={handleCheckout}
        >
          Finalizar Compra
        </button>
      
      </div>
    </div>
    </div>
  );
}

function CartEmpty() {
   const hideCartModal = useModalsStore((state) => state.hideCartModal);
  const handleClick = () => {
    hideCartModal();
  };
  return (
    <div className="text-center py-16 px-6">
      <div className="bg-gradient-to-br from-orange-100 to-red-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
        <span className="text-6xl">🛒</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Tu carrito está vacío
      </h3>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
        Agrega algunos deliciosos hot dogs antes de hacer el pedido
      </p>
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        🚀 Seguir comprando
      </button>
    </div>
  );
}

function ItemDetailQuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: any) {
  const handleChange = (e: any) => {
    const newQuantity = parseInt(e.target.value, 10);
    onChange(newQuantity);
  };

  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return (
    <div>
      <select
        value={quantity}
        onChange={handleChange}
        className="text-black text-sm"
      >
        {options}
      </select>
    </div>
  );
}