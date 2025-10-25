import { 
  ItemForCart,  
  CartStoreState, 
  CartItem, 
  CartItemProductData,
  CartTicket  } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const cartStoreConfig = (set: any, get: any): CartStoreState => ({
  items: [],
  itemsCount: 0,
  totalPrice: 0,
  error: null,  
  
  addToCart: ({ itemForCart, quantity }: { itemForCart: ItemForCart; quantity: number }) => {
    try{
      const { priceData: newItemPriceData,...newItemProductData } = itemForCart;
      const foundedCartItem = get()._getItemByProductData(newItemProductData);
      if (!foundedCartItem) {
        const newCartitem: CartItem = {
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
       const updatedCartItem: CartItem = {...foundedCartItem,quantity: newQuantity,subtotal: newSubtotal};
       get()._updateCartItem(foundedCartItem.id, updatedCartItem)
    }
    }catch(error){
        get()._setError(error);
    }
  },

  changeCartItemQuantity: (itemId: string, newQuantity: number) => {
    try{
      if (!(newQuantity>0)) throw new Error("La cantidad debe ser mayor a 0");
      const foundedCartItem = get()._getCartItemById(itemId);
      if (!foundedCartItem) throw new Error("El item no existe en el carrito"); 
      const updatedCartItem: CartItem = {
        ...foundedCartItem,
        quantity: newQuantity,
        subtotal: foundedCartItem.unitPriceData.finalPrice * newQuantity,
      };
      get()._updateCartItem(itemId, updatedCartItem);
    }catch(error){
       get()._setError(error);
    }
  },

  _createCartItem: (newItemForCart: CartItem) => {
    try{
      if (!newItemForCart) throw new Error("Ingrese un item valido");
      const currentItemsList: CartItem[] = get().items;
      set({ items: [...currentItemsList, newItemForCart] });
      get()._recalculateCart()
    }catch(error){
       console.error(error);
       throw error;
    }
  },

  _updateCartItem: (itemId: string, updatedCartItem: CartItem) => {
    console.log("updatedCartItem", updatedCartItem)
    try{
     const currentItemsList: CartItem[] = get().items;
    const searchedItemIndex = currentItemsList.findIndex((item) => item.id === itemId);
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

    removeCartItem: (itemId: string) => {
      try{
        if (!itemId) throw new Error("itemId es requerido.");
        const  foundedItem = get()._getCartItemById(itemId);
        if (!foundedItem) throw new Error("El item no existe en el carrito");
        const currentItemsList: CartItem[] = get().items;
        const updatedItemList = currentItemsList.filter((item) => item.id !== itemId);
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
        const currentItemsList: CartItem[] = get().items;
        const newCartCount = currentItemsList.reduce((total, item) => total + item.quantity, 0);
        const newTotalPrice = currentItemsList.reduce((total, item) => total + item.subtotal, 0);

        set({ 
          itemsCount: newCartCount,
          totalPrice: newTotalPrice,
        });
      }catch(error){
         console.error(error);
         throw error;
      }
    },

    getCurrentCartTicket: (): CartTicket | undefined => {
      try{
        const currentItemsList: CartItem[] = get().items;
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

  _getCartItemById: (itemId: string): CartItem | undefined => {
    const currentItemsList: CartItem[] = get().items;
    return currentItemsList.find((item) => item.id === itemId);
  },

  _getItemByProductData: (productData: CartItemProductData): CartItem | undefined => {
    const currentItemsList: CartItem[] = get().items;
    return currentItemsList.find((item) => objetosIguales(item.productData, productData));
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
      }
    }
  } 
}));

export default useCartStore;

//--------------------------------Helpers
function generateItemCartId(): string {
  return Date.now() + Math.random().toString(36);
}

function objetosIguales(obj1: any, obj2: any): boolean {
  // ... mismo código
}