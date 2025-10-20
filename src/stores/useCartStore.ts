import { create } from "zustand";
import { persist } from "zustand/middleware";


const cartStoreConfig = (set, get) => ({
  items: [],
  itemsCount: 0,
  totalPrice: 0,
  error: null,  
  
  addToCart: ({ itemForCart, quantity }: any) => {
    try{
      const { priceData: newItemPriceData,...newItemProductData } = itemForCart;
      const foundedCartItem = get()._getItemByProductData(newItemProductData);
      if (!foundedCartItem) {
        const newCartitem = {
          id: generateItemCartId(),
          productData: newItemProductData,
          unitPriceData: newItemPriceData,
          quantity: quantity,
          subtotal: newItemPriceData.finalPrice * quantity
        }
        get()._createCartItem(newCartitem)
    }
    else{
       //Solo actualiza cantidad, total price
       const newQuantity = foundedCartItem.quantity + quantity
       const newSubtotal = foundedCartItem.unitPriceData.finalPrice * newQuantity
       const updatedCartItem = {...foundedCartItem,quantity: newQuantity,subtotal: newSubtotal};
       get()._updateCartItem(foundedCartItem.id, updatedCartItem)
    }
    }catch(error){
        get()._setError(error);
    }
  },

  changeCartItemQuantity: (itemId: any, newQuantity: number) => {
    try{
      if (!(newQuantity>0)) throw new Error("La cantidad debe ser mayor a 0");
      const foundedCartItem = get()._getCartItemById(itemId);
      if (!foundedCartItem) throw new Error("El item no existe en el carrito"); 
      const updatedCartItem = {
        ...foundedCartItem,
        quantity: newQuantity,
        subtotal: foundedCartItem.unitPriceData.finalPrice * newQuantity,
      };
      get()._updateCartItem(itemId, updatedCartItem);
    }catch(error){
       get()._setError(error);
    }
  },

  _createCartItem: (newItemForCart: any) => {
    try{
      if (!newItemForCart) throw new Error("Ingrese un item valido");
      const currentItemsList = get().items;
      set({ items: [...currentItemsList, newItemForCart] });
      get()._recalculateCart()
    }catch(error){
       console.error(error);
       throw error;
    }
  },

  _updateCartItem: (itemId : string, updatedCartItem: any) => {
    console.log("updatedCartItem", updatedCartItem)
    try{
     const currentItemsList = get().items;
    const searchedItemIndex = currentItemsList.findIndex((item: any) => item.id === itemId);
    if (searchedItemIndex === -1) throw new Error("El item no existe en el carrito");
    
    const newItemsList = [...currentItemsList];
    newItemsList[searchedItemIndex] = updatedCartItem;
    set({ items: newItemsList });
    get()._recalculateCart()
    }catch(error){
       console.error(error);
       throw error;
    }
  },

    removeCartItem: (itemId: any) => {
      try{
        if (!itemId) throw new Error("itemId es requerido.");
        const  foundedItem = get()._getCartItemById(itemId);
        if (!foundedItem) throw new Error("El item no existe en el carrito");
        const currentItemsList = get().items;
        const updatedItemList = currentItemsList.filter((item: any) => item.id !== itemId);
        set({ items: updatedItemList });
        get()._recalculateCart()
      }catch(error){
         get()._setError(error);
      }
  },

    clearCart: () => {
      try{
         set({ items: [] });
         get()._recalculateCart()
      }catch(error){
         get()._setError(error);
      }
    },

    _recalculateCart: () => {
      try{
        const currentItemsList = get().items;
        const newCartCount =currentItemsList.reduce((total: any, item: any) => total + item.quantity, 0);
        const newTotalPrice = currentItemsList.reduce((total: any, item: any) => total + item.subtotal, 0);

        set({ 
          itemsCount: newCartCount,
          totalPrice: newTotalPrice,
         
        });
      }catch(error){
         console.error(error);
         throw error;
      }
    },

    getCurrentCartTicket: () => {
      try{
        const currentItemsList = get().items;
        const newTotalPrice = get().totalPrice
        return {
            detail: currentItemsList,
            itemsCount: get().itemsCount,
            totalPrice: newTotalPrice,
          }
      } catch(error){
         //get()._setError(error);
      }
    },


  _getCartItemById: (itemId: any) => {
    const currentItemsList = get().items;
    return currentItemsList.find((item: any) => item.id === itemId);
  },

  _getItemByProductData: (productData: any) => {
    const currentItemsList = get().items;
    return currentItemsList.find((item: any) => objetosIguales(item.productData, productData));
  },

  clearError: () => set({ error: null }),
  
_setError: (error: any) => {
  const message = error?.message || String(error); 
  console.error('Cart Error:', message);
  set({ error: message });
},
  

})
const useCartStore = create(persist(cartStoreConfig, { 
  name: "cartStore",
  onRehydrateStorage: () => {
    console.log("Rehidratación iniciando...")
    return (state) => {
      console.log("Store Checkout reaccionando a rehydrate de store cart's state");
      if (state) {
        state._recalculateCart();
        //useStoreCheckout.getState().onChangeCart(state.getCurrentCartTicket())
      }
    }
  } 
}));
/*
useCartStore.subscribe((state, prevState) => {
  console.log("Store Checkout reaccionando a cambio de store cart's state");
  useStoreCheckout.getState().onChangeCart(state.getCurrentCartTicket())
});
*/

export default useCartStore;



//--------------------------------Helpers
function generateItemCartId() {
  return Date.now() + Math.random().toString(36);
}

function objetosIguales(obj1: any, obj2: any) {
  // Misma referencia
  if (obj1 === obj2) return true;
  // Null o undefined
  if (obj1 == null || obj2 == null) return false;
  // Diferentes tipos
  if (typeof obj1 !== typeof obj2) return false;
  // Primitivos
  if (typeof obj1 !== "object") return obj1 === obj2;
  // Arrays
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!objetosIguales(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  // Dates
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  // RegExp
  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }
  // Objetos
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!objetosIguales(obj1[key], obj2[key])) return false;
  }

  return true;
}




