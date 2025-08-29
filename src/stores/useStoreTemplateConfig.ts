import { create } from "zustand";
import DataService from "@/lib/DataService";


const defaultConfig = {
    clientConfig: {
        plan: "plan_medium"
    },
    portrait: {
        name: "Mi Tienda",
        logoIcon: "🛒",
        slogan: "Slogan de la tienda",
        backgroundColor: "bg-cyan-500",
        subtitle: "Subtitulo de la tienda"
    },
    backgroundProductContainerColor: "bg-green-500",
    defaultProductImage: "https://media.istockphoto.com/id/463075967/photo/e-commerce-shopping-cart-with-cardboard-boxes-on-laptop.jpg?s=2048x2048&w=is&k=20&c=ed0xkV4w7V9ZG3qadn_MWrj07cmD9jcYw5HuKefDaCE=",
}

const useStoreTemplateConfig = create((set, get) => ({
    clientConfig: defaultConfig.clientConfig,
    portrait: defaultConfig.portrait,
    backgroundProductContainerColor: defaultConfig.backgroundProductContainerColor,
    defaultProductImage: defaultConfig.defaultProductImage,
    setBackgroundProductContainerColor: (backgroundProductContainerColor: string) => set({ backgroundProductContainerColor }),
    setDefaultProductImage: (defaultProductImage: string) => set({ defaultProductImage }),

    setTemplateConfig: async () => {
        try {

            const templateConfig = await DataService.getStoreDataAndConfigs()
            set({ 
                backgroundProductContainerColor: templateConfig.settings.productsContainerRenderConfig.backgroundProductContainerColor,
                defaultProductImage: templateConfig.settings.productsContainerRenderConfig.defaultProductImage,
                portrait: {
                    name: templateConfig.settings.portrait.name,
                    slogan: templateConfig.settings.portrait.slogan,
                    subtitle: templateConfig.settings.portrait.subtitle,
                    icon: templateConfig.settings.portrait.logoIcon,
                    backgroundColor: templateConfig.settings.portrait.backgroundColor
                },
                clientConfig: templateConfig.settings.clientConfig
            })
        } catch (error) {
            console.error('Error al obtener la configuración del template', error)
        }
    }
}))

export default useStoreTemplateConfig;

