import { create } from "zustand";
import axios from "axios";



const baseUrl = 'http://localhost:3000';

const useProductsStore = create((set, get) => ({
    loading: true,
    error: null,
    loaded: false,
    products: [],
    productsOrderByCategories: [],
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
            console.log('data: ', data)
            set({
                loading: false,
                loaded: true,
                products: data.products,
                categories:data.categories,
                productsStats: data.stats,
                filteredProducts: data.products,
                productsOrderByCategories: getProductsOrderByCategories(data.categories, data.products)
            });
     
            
        } catch (error) {
            set({ error: error });
        } finally {
            set({ loading: false });
        }
    },

    filterProductsByCategories: (categoryId: string ) => {
        
        if (categoryId === 'all_categories') {
            set({
                filteredProducts: get().products,
                selectedCategory: get().categories.find((category: any) => category.id === 'all_categories')
            });
            return;
        }
        const filteredProducts = get().products.filter((product: any) => product.categories.some((category: any) => category.id === categoryId));
       
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






//---------------------- esto mas adelante venndra del server
function getProductsOrderByCategories(categories: any, products: any) {
  
    const productsOrderByCategories = categories.map((category: any) => ({
      ...category,
      products: products
        .filter((product: any) => product.categories.some((c: any) => c.id === category.id))
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        .map((product: any) => ({
          ...product,
          renderId: `${category.id}-${product.id}`
        }))
    }));

    //COmo muestro x categorias borro la categoria todas.
    delete productsOrderByCategories[0]
    console.log('productsOrderByCategories: ', productsOrderByCategories)
    return productsOrderByCategories
  };