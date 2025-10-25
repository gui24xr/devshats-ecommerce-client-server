import { Product, Category, Branch } from "@/types";
//import data from "@/data/mock-tiendaropa.json";
import data from "@/data/mock-restaurant.json";
//import data from "@/data/mock-pizzeria.json";
//import data from "@/data/mock-restaurant-nuevo.json";


interface IDataService {
    getProducts: () => Promise<{ products: Product[], categories: Category[], stats: { totalProducts: number }}>
    getStoreDataAndConfigs: () => Promise<any>
    getBranches: () => Promise<Branch[]>
    getBranchById: (id: string) => Promise<Branch | undefined>
}


const DataService : IDataService = {
    getProducts: async () => {
        return {
            products: data.store.products as Product[],
            categories: data.store.categories as Category[],
            stats: {
                totalProducts: data.store.products.length,
            }
        }
    },
    getStoreDataAndConfigs: async () => {
        return data.store
    },
    getBranches: async () => {
        return data.store.branches as Branch[]
    },
    getBranchById: async (id: string) => {
        return (data.store.branches as Branch[]).find((branch) => branch.id === id);
    },
}

export default DataService;


