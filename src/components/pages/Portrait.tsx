import Link from "next/link";





export default function Portrait() {
  return (

    <div className="relative w-full bg-gradient-to-br from-orange-600 via-orange-500 to-red-500">
      <div className="absolute inset-0 bg-black/10"></div>
    
      <div className="max-w-5xl mx-auto p-4">


        {/* Hero Section - Más impactante y moderno */}
        <div className="relative  text-white py-24 px-12 lg:py-32">
          {/* Background Pattern */}


          {/* Floating Elements */}
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🌭</div>
          <div className="absolute top-32 right-16 text-4xl opacity-30 animate-pulse">🍟</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-bounce delay-1000">🥤</div>

          <div className="relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto flex flex-col space-y-12">
              <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  🌭{" "}
                  <span className="bg-gradient-to-r from-yellow-200 to-orange-100 bg-clip-text text-transparent">
                    HotDogs Paradise
                  </span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-orange-50">
                  Los mejores hot dogs artesanales con ingredientes frescos y sabores únicos.
                  <br className="hidden md:block" />
                  <span className="font-semibold text-yellow-200">Personaliza tu experiencia gastronómica perfecta.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

                <Link href="/productos">
                  <button className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-300 text-xl px-12 py-4 font-bold shadow-2xl ring-4 ring-white/20">
                    🚀 Explorar Productos
                  </button>
                </Link>

                <Link href="/productos#productos">
                  <button className="sm:w-auto bg-orange-700 hover:bg-orange-800 hover:scale-105 transition-all duration-300 shadow-xl text-lg px-8 py-4 font-bold ring-4 ring-orange-300/30">
                    🚀 Ordenar Ahora
                  </button>
                </Link>
              </div>


              <div className="mt-12 text-orange-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="">💳 Pago fácil por WhatsApp</span>
                <span className="">🚚 Entrega gratis en pedidos +$200</span>
                <span className="">🕐 Lun-Dom 11:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}