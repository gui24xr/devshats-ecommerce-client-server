import { create } from "zustand";


const useCartStore = create((set, get) => ({
    items: [],
    itemsCount: 0,
    ticket: {
        totalPrice: 0,
    },

    addToCart: ({ product, quantity, selectedVariant, customization, priceData, onSuccess, onError }: any) => {
        try {
            const currentItemsList = get().items
            const newItemData = {
                product,
                selectedVariant,
                customization,
                priceData
            }
            //Existe un item en la lista que sea un producto exactamente igual customizado y con variantes?? Los junto en uno solo
            const itemExists = currentItemsList.findIndex((itemInList: any) => objetosIguales(itemInList.data, newItemData))
            if (itemExists !== -1) {
                //Actualizo la cantidad
                currentItemsList[itemExists].quantity += quantity
            } else {
                //Agrego el item a la lista
                currentItemsList.push({ id: generateItemCartId(), data: newItemData, quantity })
            }

            set({items: currentItemsList})
            get().calculateItemsCount()
            get().calculateTotalPrice()
            if (onSuccess) onSuccess()
        } catch (error) {
            if (onError) onError(error)
        }
    },

    setQuantity: (itemId: any, quantity: any) => {
        const currentItemsList = get().items
        const searchedItemIndex = currentItemsList.findIndex((item: any) => item.id === itemId)
        if (searchedItemIndex !== -1) {
            currentItemsList[searchedItemIndex].quantity = quantity
            set({items: currentItemsList})
            get().calculateItemsCount()
            get().calculateTotalPrice()
        }
       
    },
    

    clearCart: () => {
        set({items: []})
        get().calculateItemsCount()
        get().calculateTotalPrice()
    },

    removeFromCart: (itemId: any) => {
        const currentItemsList = get().items
        const searchedItemIndex = currentItemsList.findIndex((item: any) => item.id === itemId)
        if (searchedItemIndex !== -1) {
            currentItemsList.splice(searchedItemIndex, 1)
            set({items: currentItemsList})
            get().calculateItemsCount()
            get().calculateTotalPrice()
        }
    },

    calculateItemsCount: () => {
        const currentItemsList = get().items
        const itemsCount = currentItemsList.reduce((total: any, item: any) => total + item.quantity, 0)
        set({itemsCount: itemsCount})
    },

    calculateTotalPrice: () => {
        const currentItemsList = get().items
        const totalPrice = currentItemsList.reduce((total: any, item: any) => total + item.data.priceData.totalPrice, 0)
        set({ticket: {totalPrice: totalPrice}})
    },

    getCartData: () => {
        const currentItemsList = get().items
        return {
            itemsCount: get().itemsCount,
            totalPrice: get().ticket.totalPrice,
            items: currentItemsList.map((item: any) => ({
                productId: item.data.product.id,
                variantId: item.data.selectedVariant ? item.data.selectedVariant.id : null,
                customization: item.data.customization,
                quantity: item.quantity,
                unitPrice: item.data.priceData.unitPrice,
                totalPrice: item.data.priceData.totalPrice,
            }))
        }
    }

   
}));

export default useCartStore;






function generateItemCartId() {
    return Date.now() + Math.random().toString(36)
}

function objetosIguales(obj1: any, obj2: any) {
    // Misma referencia
    if (obj1 === obj2) return true;

    // Null o undefined
    if (obj1 == null || obj2 == null) return false;

    // Diferentes tipos
    if (typeof obj1 !== typeof obj2) return false;

    // Primitivos
    if (typeof obj1 !== 'object') return obj1 === obj2;

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