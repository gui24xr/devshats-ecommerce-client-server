"use client";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores";

export default function CartDetails({ onCheckout, onClose }: any) {
  const itemsList = useCartStore((state) => state.items);
  const itemsCount = useCartStore((state) => state.itemsCount);
  const changeCartItemQuantity = useCartStore((state) => state.changeCartItemQuantity);
  const totalPrice = useCartStore((state) => state.ticket.totalPrice);
  const removeCartItemFromCart = useCartStore((state) => state.removeCartItemFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="p-4 mb-20">
      {itemsList.length > 0 ? (
        <>
          <CartDetailHeader onClearCart={clearCart} />

          <div className="grid grid-cols-1 gap-2 p-2">
            {itemsList.map((item) => (
              <CartItemDetail
                item={item}
                changeCartItemQuantity={changeCartItemQuantity}
                removeCartItemFromCart={removeCartItemFromCart}
              />
            ))}
          </div>
        </>
      ) : (
        <CartEmpty onFollowShopping={onClose} />
      )}
      {itemsCount > 0 && (
        <AddToCartSection
          totalPrice={totalPrice}
          itemsCount={itemsCount}
          onClick={onCheckout}
        />
      )}
    </div>
  );
}

function CartItemDetail({ item, changeCartItemQuantity, removeCartItemFromCart }) {
  const onChangeQuantity = (quantity) => {
    changeCartItemQuantity(item.id, quantity);
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg flex flex-col items-start px-4 pt-6  pb-2">
      

      <div className="w-full flex flex-col">
        <div className="flex flex-row gap-4 border-t border-blue-200 pt-2 ">
          <div className="min-w-[80px] flex flex-col">
            <img
              src={item?.productData?.image}
              alt={item?.productData?.title}
              className="w-24 h-24 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <h4 className="text-sm font-bold text-black ">
                {item.productData?.title}
              </h4>
            </div>

            {item.productData?.variant && (
              <div className="flex flex-wrap items-start gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-800 ">
                    {item.productData?.variant?.label + ":"}
                  </span>
                  <span className="text-sm  text-gray-800">
                    {item?.productData?.variant?.selectedOption?.label}
                  </span>
                </div>
              </div>
            )}
            {item.productData?.customizationFeatures && (
              <div className="w-full flex flex-col gap-0.5">
                {item.productData?.customizationFeatures?.map((feature) =>
                      <div className="w-full flex ">
                        <div className="flex flex-wrap ">
                          <div className="flex flex-wrap ">
                            <span className="text-sm  text-gray-800 ">
                              {feature?.name + ":"}
                            </span>
                            {feature?.selectedOptions?.map((selectedOption,) => (
                              <div className="flex">
                                <span className="text-sm text-gray-800">
                                  {selectedOption?.name}{" "}
                                  {selectedOption?.priceModifier ? (
                                    <span className="text-xs text-green-600 font-medium">
                                      (+${selectedOption?.priceModifier})
                                    </span>
                                  ) : null}{" "}
                                </span>
                                {selectedOption?.selectedQuantity > 0 && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                    x{selectedOption?.selectedQuantity}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    
                )}
              </div>
            )}
            <span className="text-sm font-semibold text-green-600 capitalize">
              Precio: ${item?.unitPriceData?.finalPrice}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-end border-t border-blue-200 mt-2 p-1.5">
          <div className="w-full flex flex-col self-end text-right">
            {" "}
            <div className="flex items-center justify-end gap-2">
              {" "}
              {/* justify-end para alinear a la derecha */}
              <span className="text-sm font-semibold text-blue-500 capitalize">
                Cantidad:
              </span>
              <ItemDetailQuantitySelector
                quantity={item.quantity}
                onChange={onChangeQuantity}
                min={1}
                max={10}
              />
            </div>
            <span className="text-sm font-semibold text-gray-800 capitalize">
              subtotal: ${item?.subtotal}
            </span>
            <button
              onClick={() => removeCartItemFromCart(item.id)}
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

function AddToCartSection({ totalPrice, itemsCount, onClick }: any) {
  const handleCheckoutButton = () => {
    // Validar requisitos mínimos antes de agregar al carrito
    onClick();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-lg">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
        <div className="flex flex-col items-center justify-between gap-2 ">
          <span className="text-sm font-semibold text-gray-800 uppercase">
            Cantidad de items: {itemsCount}
          </span>
          <span className="text-sm font-semibold text-gray-800 uppercase">
            Total: ${totalPrice}
          </span>
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
  );
}

function CartDetailHeader({ onClearCart }: any) {
  return (
    <div className="flex flex-row justify-between bg-orange-500 font-semibold text-white rounded-md px-2 py-1">
      <div className="flex flex-row items-center justify-center gap-2">
        <span>Mi Carrito</span>
        <ShoppingCart className="w-4 h-4" />
      </div>
      <button
        className="flex flex-row gap-2 bg-purple-500 text-white rounded-md px-2 py-1"
        onClick={() => onClearCart && onClearCart()}
      >
        <span> Vaciar carrito </span>
        <Trash2 className="self-center w-4 h-4" />
      </button>
    </div>
  );
}

function CartEmpty({ onFollowShopping }: any) {
  const handleClick = () => {
    onFollowShopping && onFollowShopping();
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
