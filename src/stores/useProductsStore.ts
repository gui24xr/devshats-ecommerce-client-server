import { create } from "zustand";
import axios from "axios";



// URL base dinámica que funciona tanto en localhost como en ngrok
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // En el cliente, usar la URL actual
        return window.location.origin;
    }
    // En el servidor, usar localhost por defecto
    return 'http://localhost:3000';
};

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


    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {

            const baseUrl = getBaseUrl();
            console.log('Fetching from:', baseUrl);
            
            const { data } = await axios.get(`${baseUrl}/api/products`);
            console.log('data: ', data)
            set({
                loading: false,
                loaded: true,
                products: data.products,
                categories:[CATEGORY_ALL,...data.categories],
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

    mapProductsCategories:(products: any) => {

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


  const CATEGORY_ALL =   {
    id: "all_categories",
    name: "Todos",
    displayOrder: 0,
    slug: "todos",
    itemsCount: 19,
    label: "Todos",
    emoji: "⚡ "
  }
