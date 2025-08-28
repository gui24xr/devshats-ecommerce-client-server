'use client';

export default function ProductsPortrait({ productsQuantity }: { productsQuantity: number }) {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">       
        <div className="mb-12 text-center space-y-16">

          <div className="flex flex-col items-center justify-center">
            <div className="text-center inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-6 shadow-xl">
              <span className="text-3xl">🌭</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Nuestros Productos
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra deliciosa selección de hot dogs artesanales y acompañamientos.
              <br className="hidden md:block" />
              <span className="font-semibold text-orange-600">¡Cada uno personalizable a tu gusto!</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-lg">🔥</span>
              <span className="font-medium">{productsQuantity} productos disponibles</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-lg">⚡</span>
              <span className="font-medium">Preparación 15-20 min</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-lg">🎨</span>
              <span className="font-medium">100% personalizable</span>
            </div>
          </div>
        </div>

        {/* Button go to armar pedido - CORREGIDO */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              //scrollToProducts();
            }}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Arma tu pedido ahora 🚀!!
          </button>
        </div>
        </div>
    );
}