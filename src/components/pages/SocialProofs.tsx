import DataService from "@/lib/DataService";

export default async function SocialProofs() {

  const { customizationTemplateSettings } = await DataService.getStoreDataAndConfigs()
  const { whyChooseUs, bussinessContent } = customizationTemplateSettings
    return (
        <div>
         {/* Features Section - Más visual y atractivo */}
       
          <div className="px-12 py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{whyChooseUs.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                 
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{whyChooseUs.features[0].icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{whyChooseUs.features[0].title}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {whyChooseUs.features[0].description}
                  </p>
                </div>

                <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{whyChooseUs.features[1].icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{whyChooseUs.features[1].title}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {whyChooseUs.features[1].description}
                  </p>
                </div>

                <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{whyChooseUs.features[2].icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{whyChooseUs.features[2].title}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {whyChooseUs.features[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Section - Nueva sección */}
          <div className="px-12 pt-12 pb-24 bg-gradient-to-r from-gray-50 to-orange-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "Los mejores hot dogs que he probado. La personalización es increíble y llegan súper rápido."
                  </p>
                  <div className="font-semibold text-gray-900">- María González</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "Calidad premium a precio justo. Mi familia y yo somos clientes frecuentes."
                  </p>
                  <div className="font-semibold text-gray-900">- Carlos Ruiz</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "La app es súper fácil de usar y los sabores son únicos. ¡Recomendado 100%!"
                  </p>
                  <div className="font-semibold text-gray-900">- Ana López</div>
                </div>
              </div>
            </div>
          </div>
        </div>
       );
}