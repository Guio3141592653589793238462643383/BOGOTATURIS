import { useState, useEffect } from 'react';

const Inicio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const images = [
    { src: "/img/Monserrate_Santuario.JPG", alt: "Monserrate" },
    { src: "/img/La_Candelaria.jpg", alt: "La Candelaria" },
    { src: "/img/museo del oro.jpg", alt: "Museo del Oro" },
    { src: "/img/descarga.jpeg", alt: "Jardín Botánico" },
    { src: "/img/simon bolivar.jpeg", alt: "Simón Bolívar" },
    { src: "/img/virgilio barco.jpeg", alt: "Virgilio Barco" },
    { src: "/img/plaza bolivar.jpeg", alt: "Plaza Bolívar" },
    { src: "/img/usaquen.jpeg", alt: "Usaquén" },
    { src: "/img/planetario.jpeg", alt: "Planetario" },
    { src: "/img/maloka.jpeg", alt: "Maloka" },
    { src: "/img/cerro de guadalupe.jpeg", alt: "Cerro de Guadalupe" }
  ];

  const lugares = [
    { img: "./img/Salitre_Magico.jpeg", nombre: "Salitre Magico" },
    { img: "/img/La cueva de arco.jpeg", nombre: "La Cueva del Arco" },
    { img: "/img/Mundo_Aventura.jpeg", nombre: "Mundo Aventura" },
    { img: "/img/Parque Nacional.jpeg", nombre: "Parque Nacional" },
    { img: "/img/Plaza de Toros.jpeg", nombre: "Plaza de Toros" },
    { img: "/img/Museo Botero.jpeg", nombre: "Museo Botero" },
    { img: "/img/Teatro Julio Mario Santo Dominguez.jpeg", nombre: "Teatro Julio Mario Santo Dominguez" },
    { img: "/img/Parque de los Niños.jpeg", nombre: "Parque de los Niños" },
    { img: "/img/Museo del Mar.jpeg", nombre: "Museo del Mar" },
    { img: "/img/Teatro Colon.jpeg", nombre: "Teatro Colon" },
    { img: "/img/Jaime Duque.jpeg", nombre: "Jaime Duque" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    // Animación de entrada
    setIsVisible(true);

    return () => clearInterval(interval);
  }, [images.length]);

  const createPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Hero Section mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-600 py-16 sm:py-24 min-h-[70vh] flex items-center">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}></div>
        </div>
        
        {/* Elementos decorativos mejorados */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {/* Badge de bienvenida */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-white text-sm font-medium">Bienvenido a tu aventura</span>
            </div>
            
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-yellow-400 bg-300% animate-gradient">
              Descubre{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-300 to-yellow-400 bg-300% animate-gradient">
                  BogotáTuris
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 opacity-90 leading-relaxed">
              Una experiencia única te espera en la capital más fascinante de Colombia
            </p>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            </div>
            
            {/* Scroll indicator */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-blue-200 text-sm mb-2">Desliza para explorar</span>
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria decorativa */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </section>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>

      {/* Carrusel mejorado */}
      <section className="carrusel py-8 sm:py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="relative max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-blue-900/10">
              <div
                className="flex transition-all duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        console.log(`Error cargando imagen: ${image.src}`);
                        e.target.src = createPlaceholder();
                      }}
                      onLoad={() => {
                        console.log(`Imagen cargada correctamente: ${image.src}`);
                      }}
                    />
                    {/* Overlay con título */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-xl sm:text-2xl font-bold">{image.alt}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controles del carrusel */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            {/* Indicador y puntos de navegación */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <div className="bg-blue-900/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentSlide + 1} / {images.length}
              </div>
              <div className="flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-blue-300 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lugares destacados con animaciones */}
      <section className="destacados py-12 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-teal-600 mb-4">
              Lugares Imperdibles
            </h2>
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-600"></div>
                <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
              </div>
            </div>
            <p className="text-lg text-blue-800/80 max-w-2xl mx-auto">
              Explora los destinos más fascinantes que Bogotá tiene para ofrecerte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {lugares.map((lugar, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-blue-100/50"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={lugar.img}
                    alt={lugar.nombre}
                    className="w-full h-44 sm:h-52 object-cover transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      console.log(`Error cargando imagen de lugar: ${lugar.img}`);
                      e.target.src = createPlaceholder();
                    }}
                    onLoad={() => {
                      console.log(`Imagen de lugar cargada: ${lugar.img}`);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icono flotante */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 text-center group-hover:text-blue-700 transition-colors duration-300">
                    {lugar.nombre}
                  </h3>
                  <div className="mt-3 h-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Acerca de Bogotá Turis mejorado */}
      <section className="acerca py-12 sm:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8">
              Acerca de 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-300">
                Bogotá Turis
              </span>
            </h2>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border border-white/20">
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8">
                Bogotá Turis es una plataforma interactiva diseñada para turistas, locales y curiosos que desean explorar lo mejor de Bogotá. 
                Desde lugares emblemáticos como Monserrate y La Candelaria, hasta rincones menos conocidos como el Museo del Mar o el Parque de los Niños, 
                esta app ofrece una experiencia visual, intuitiva y útil para planear tu recorrido por la capital.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-yellow-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Exploración</h3>
                  <p className="text-blue-200 text-sm">Descubre lugares únicos y experiencias auténticas</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-pink-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Experiencia</h3>
                  <p className="text-blue-200 text-sm">Vive momentos inolvidables en cada rincón</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-teal-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Calidad</h3>
                  <p className="text-blue-200 text-sm">Información confiable y actualizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="footer bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 text-center py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Bogotá Turis</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.678-1.378l-.61 2.956c-.33 1.309-.823 2.947-1.234 3.94C8.85 23.77 10.404 24.001 12.017 24.001c6.624-.001 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.12.017.001z"/>
                </svg>
              </a>
            </div>
            
            <p className="text-sm text-blue-200">© 2025 Bogotá Turis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Inicio;