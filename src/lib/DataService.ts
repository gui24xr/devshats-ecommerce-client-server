import data from "@/data/mock-tiendaropa.json";
//import data from "@/data/mock-restaurant.json";
//import data from "@/data/mock-pizzeria.json";


const DataService = {
    getProducts: async () => {
        
        return {
            products: data.products,
            categories: data.categories,
            customizationTemplates: data.customizationTemplates,
            stats: {
                totalProducts: data.products.length,
            }
        }
    },

    getStoreDataAndConfigs: async () => {
        return data.store
    }
  
}

export default DataService;

