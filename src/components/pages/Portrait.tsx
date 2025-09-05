import Link from "next/link";
import DataService from "@/lib/DataService";
import Image from "next/image";
import { Navbar } from "@/components";

const getRandom = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

export default async function Portrait() {
  const { customizationTemplateSettings } = await DataService.getStoreDataAndConfigs()
  const { portrait, bussinessContent, navBarConfig } = customizationTemplateSettings

  console.log('portrat', portrait)
  return (
    <div className="relative w-full overflow-hidden">
      
      {/* Background Image */}
      {portrait.background && portrait.background?.showImage ? (
        <>
          <Image
            src={portrait.background?.imageUrl}
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={80}
            className="absolute inset-0 z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </>
      ) : (
        <>
          <div className={`absolute inset-0 w-full ${portrait.background.color} z-0`}></div>
          <div className="absolute inset-0 bg-black/10 z-20"></div>
          
          
        </>
      )}

      {/* Floating Icons */}
      {portrait.floatingIcons && (
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">
            {getRandom(portrait.floatingIcons)}
          </div>
          <div className="absolute top-32 right-16 text-4xl opacity-30 animate-pulse">
            {getRandom(portrait.floatingIcons)}
          </div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-bounce delay-1000">
            {getRandom(portrait.floatingIcons)}
          </div>
        </div>
      )}

      {/* Layout Principal */}
      <div className="relative z-30 flex flex-col">
        
        {/* Navbar - Ancho completo */}
        <div className="w-full flex-shrink-0">
          <Navbar
            config={navBarConfig}
          />
        </div>

        {/* Hero Content - Centrado con contenedor limitado */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 lg:py-32 min-h-3/4">
          <div className="text-white text-center w-full max-w-7xl">
            
            {/* Contenedor con distribución vertical uniforme */}
            <div className="flex flex-col justify-between  max-w-6xl mx-auto">

              {/* Títulos - Parte superior */}
              <div className="flex flex-col mb-24">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  {portrait.titleLogoIcon}{" "}
                  <span className="bg-gradient-to-r from-yellow-200 to-orange-100 bg-clip-text text-transparent">
                    {bussinessContent.general.name}
                  </span>
                </h1>
                <h2 className="text-2xl font-semi-bold md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed text-orange-50">
                  {bussinessContent.general.tagline}
                </h2>
                <h3 className="font-semibold text-yellow-200 text-xl md:text-xl lg:text-2xl">
                  {bussinessContent.general.subTagline}
                </h3>
              </div>

              {/* Botones - Centro */}
              <div className="mb-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="#products-section">
                  <button className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-300 text-xl px-12 py-4 font-bold shadow-2xl ring-4 ring-white/20 rounded-lg">
                    🚀 Explorar Productos
                  </button>
                </Link>

                <Link href="/productos#productos">
                  <button className="sm:w-auto bg-orange-700 hover:bg-orange-800 hover:scale-105 transition-all duration-300 shadow-xl text-lg px-8 py-4 font-bold ring-4 ring-orange-300/30 rounded-lg">
                    🚀 Ordenar Ahora
                  </button>
                </Link>
              </div>

              {/* Info grid - Parte inferior */}
              <div className="mt-12 font-bold text-md text-orange-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                {portrait.showBusinessFeatures.contact.whatsappNumber && (
                  <span className="hover:scale-105 hover:text-yellow-200 transition-all duration-300 cursor-pointer">
                    {`⭐ ` + bussinessContent.contact.whatsappNumber}
                  </span>
                )}
                {portrait.showBusinessFeatures.delivery.tagline && (
                  <span className="hover:scale-105 hover:text-yellow-200 transition-all duration-300 cursor-pointer">
                     {`🚚 ` +bussinessContent.delivery.tagline}
                  </span>
                )}
                {portrait.showBusinessFeatures.contact.workingHours && (
                  <span className="hover:scale-105 hover:text-yellow-200 transition-all duration-300 cursor-pointer">
                    {bussinessContent.contact.workingHours}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}