import { Product, Category, GetProductsResponse } from "@/types";
import { create } from "zustand";


interface CategoryWithProducts extends Category { products: Product[] }

interface ProductsStoreState {
    loading: boolean;
    error: string | null;
    loaded: boolean;
    products: Product[];
    productsOrderByCategories: CategoryWithProducts[];
    productsLoaded: boolean;
    categories: Category[];
    productsStats: {
        totalProducts: number;
    };
    filteredProducts: Product[];
    selectedCategory: Category | null;

    // Methods
    hydrateAndConfigProducts: (data: GetProductsResponse) => void;
    filterProductsByCategories: (categoryId: string) => void;
    filterProductsByPreparationTime: (params: { minInMinutes: number; maxInMinutes: number }) => void;
    getProductById: (productId: string) => Product | undefined;
}

const useProductsStore = create<ProductsStoreState>((set, get) => ({
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

    hydrateAndConfigProducts: (data: GetProductsResponse) => {
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
                selectedCategory: get().categories.find((category) => category.id === 'all_categories')
            })
            return;
        }

        const filteredProducts = get().products.filter((product) =>
            product.categories?.some((category) => category.id === categoryId)
        );
        set({
            filteredProducts: filteredProducts,
            selectedCategory: get().categories.find((category) => category.id === categoryId)
        });
    },


    filterProductsByPreparationTime: ({minInMinutes, maxInMinutes}: {minInMinutes: number, maxInMinutes: number}) => {
        const filteredProducts = get().products.filter((product) =>
            product.prepTime && product.prepTime.min >= minInMinutes && product.prepTime.max <= maxInMinutes
        );
        set({
            filteredProducts: filteredProducts
        });
    },
    getProductById: (productId: string) => {
        return get().products.find((product) => product.id === productId);
    },
    
}))

export default useProductsStore;




//---------------------- esto mas adelante venndra del server
function getProductsOrderByCategories(categories: Category[], products: Product[]): CategoryWithProducts[] {

    const productsOrderByCategories = categories.map((category) => ({
      ...category,
      products: products
        .filter((product) => product.categories?.some((c) => c.id === category.id))
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((product) => ({
          ...product,
          renderId: `${category.id}-${product.id}`
        }))
    }));

    //Como muestro por categorías, filtro la categoría "todas"
    const filteredCategories = productsOrderByCategories.filter(cat => cat.id !== 'all_categories');
    console.log('productsOrderByCategories: ', filteredCategories)
    return filteredCategories
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
