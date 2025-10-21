import { create } from "zustand";

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

    hydrateAndConfigProducts: (data: any) => {
        try{
             set({
                loading: false,
                loaded: true,
                products: data.products,
                categories:[CATEGORY_ALL,...data.categories],
                productsStats: data.stats,
                filteredProducts: data.products,
                productsOrderByCategories: getProductsOrderByCategories(data.categories, data.products)
            })
        }catch(error){
            console.error(error);
            throw error;
        }
    },

    filterProductsByCategories: (categoryId: string ) => {
        if (categoryId === 'all_categories') {
            set({
                filteredProducts: get().products,
                selectedCategory: get().categories.find((category: any) => category.id === 'all_categories')
            })
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
    getProductById: (productId: string) => {
        return get().products.find((product: any) => product.id === productId);
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
