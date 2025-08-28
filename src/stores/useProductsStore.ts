import { create } from "zustand";
import axios from "axios";



const baseUrl = 'http://localhost:3000';

const useProductsStore = create((set, get) => ({
    loading: true,
    error: null,
    loaded: false,
    products: [],
    productsLoaded: false,
    categories: [],
    productsStats: {
        totalProducts: 0,
    },
    filteredProducts: [],
    selectedCategory: null,


    getProducts: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.get(`${baseUrl}/api/products`);
            set({
                loading: false,
                loaded: true,
                products: data.products,
                categories: [...data.categories, {
                    id: SPECIAL_CATEGORIES.ALL_CATEGORIES,
                    name: 'Todos',
                    itemsCount: data.products.length,
                    slug: 'todos',
                    displayOrder: 0,
                }].sort((a: any, b: any) => a.displayOrder - b.displayOrder),
                productsStats: data.stats,
                filteredProducts: data.products,
                
            });
            console.log(data)
            
        } catch (error) {
            set({ error: error });
        } finally {
            set({ loading: false });
        }
    },

    filterProductsByCategories: (categoryId: string ) => {
        console.log('Se activo la funcion filterProducts del store, vino la categoria: ', categoryId)
        if (categoryId === SPECIAL_CATEGORIES.ALL_CATEGORIES) {
            set({
                filteredProducts: get().products,
                selectedCategory: get().categories.find((category: any) => category.id === SPECIAL_CATEGORIES.ALL_CATEGORIES)
            });
            console.log('filteredProducts: ', get().filteredProducts, 'selectedCategory: ', get().selectedCategory)
            return;
        }
        const filteredProducts = get().products.filter((product: any) => product.categories.some((category: any) => category.id === categoryId));
        console.log('filteredProducts: ', filteredProducts)
        set({
            filteredProducts: filteredProducts,
            selectedCategory: get().categories.find((category: any) => category.id === categoryId)
        });
    },


    filterProductsByPreparationTime: ({minInMinutes, maxInMinutes}: {minInMinutes: number, maxInMinutes: number}) => {
        const filteredProducts = get().products.filter((product: any) => product.prepTime.min >= minInMinutes && product.prepTime.max <= maxInMinutes);
        set({
            filteredProducts: filteredProducts
        });
    },
    
}))

export default useProductsStore;




export const SPECIAL_CATEGORIES = {
    ALL_CATEGORIES: 'all_categories',
    FAVORITES: 'favorites',
    RECENT: 'recent'

  } as const;