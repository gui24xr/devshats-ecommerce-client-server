import { create } from "zustand";
import DataService from "@/lib/DataService";


const defaultConfig = {
    planSettings: {
        type: "plan_medium"
    },
    bussinessContent: {
        general: {
            name: "Mi Tienda",
            logo: "https://media.istockphoto.com/id/463075967/photo/e-commerce-shopping-cart-with-cardboard-boxes-on-laptop.jpg?s=2048x2048&w=is&k=20&c=ed0xkV4w7V9ZG3qadn_MWrj07cmD9jcYw5HuKefDaCE="
        },
        contact: {
            whatsapp: "+5491123456789",
            phone: "+5491123456789",
            email: "ventas@modaurbana.com",
            address: "Av. Santa Fe 1234, CABA",
            workingHours: "🕐 Lun-Vie 10:00 AM - 8:00 PM, Sáb 10:00 AM - 6:00 PM"
        },
        delivery: {
            slogan: "Envío gratis en compras superiores a $50.000",
            time: "Delivery en 24-48 horas",
    clientConfig: {     
        plan: "plan_medium"
        },
        socialProof: {
            reviews: 234,
            rating: 4.6,
            testimonials: [
                "Excelente calidad de ropa",
                "Muy buena atención"
            ],
            certifications: [
                "Mercado Pago",
                "Verified Store",
                "Fashion Certified"
            ]
        }
    },
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
    loading: true,
    error: null,
    planSettings: defaultConfig.planSettings,
    bussinessContent: defaultConfig.bussinessContent,
    backgroundProductContainerColor: defaultConfig.backgroundProductContainerColor,
    defaultProductImage: defaultConfig.defaultProductImage,
   
    setTemplateConfig: async () => {
        set({ loading: true, error: null })
        try {

            const storeDataAndConfigs = await DataService.getStoreDataAndConfigs()
            set({ 
                planSettings: storeDataAndConfigs.planSettings,
                bussinessContent: storeDataAndConfigs.customizationTemplateSettings.bussinessContent,
                backgroundProductContainerColor: storeDataAndConfigs.customizationTemplateSettings.productsContainerRenderConfig.backgroundProductContainerColor,
                defaultProductImage: storeDataAndConfigs.customizationTemplateSettings.productsContainerRenderConfig.defaultProductImage,
                portrait: storeDataAndConfigs.customizationTemplateSettings.portrait,
                whyChooseUs: storeDataAndConfigs.customizationTemplateSettings.whyChooseUs,
            })
            set({ loading: false })
        } catch (error) {
            console.error('Error al obtener la configuración del template', error)
            set({ loading: false, error: error })
        }
    }
}))

export default useStoreTemplateConfig;

