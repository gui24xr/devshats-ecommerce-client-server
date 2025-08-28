import data from "@/data/mock-restaurant.json";


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
  
}

export default DataService;

