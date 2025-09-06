import { create } from "zustand";


const useCartStore = create((set, get) => ({
    items: [],
    itemsCount: 0,

    addToCart: ({ product, quantity, selectedVariant, customization, onSuccess, onError }: any) => {
        try {
           
            const currentItemsList = get().items
            const newItemData = {
                product,
                selectedVariant,
                customization
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

            set((state: any) => {
                const updatedItemsList = [...currentItemsList]
                return {
                    items: updatedItemsList,
                    itemsCount: state.itemsCount + quantity
                }
            })
            if (onSuccess) onSuccess()
        } catch (error) {
            if (onError) onError(error)
        }
    },


    removeFromCart: null,

    addToCartProductWithoutVariantAndWithoutCustomizable: () => {

    },

    addToCartProductWithVariantAndWithoutCustomizable: () => {

    },

    addToCartProductWithoutVariantAndWithCustomizable: () => {

    },

    addToCartProductWithVariantAndCustomizable: () => {

    },
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