//import data from "@/data/mock-tiendaropa.json";
//import data from "@/data/mock-restaurant.json";
import data from "@/data/mock-pizzeria.json";

const DataService = {
    getProducts: async () => {
        return {
            products: data.store.products,
            categories: data.store.categories,
           
            stats: {
                totalProducts: data.store.products.length,
            }
        }
    },
    getStoreDataAndConfigs: async () => {
        return data.store
    }
}

export default DataService;


