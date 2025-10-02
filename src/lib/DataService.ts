//import data from "@/data/mock-tiendaropa.json";
import data from "@/data/mock-restaurant.json";
//import data from "@/data/mock-pizzeria.json";

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
    },
    getBranches: async () => {
        return data.store.branches
    },
    getBranchById: async (id: string) => {
        return data.store.branches.find((branch: any) => branch.id === id);
    },
}

export default DataService;


