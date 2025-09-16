import { useState, useEffect } from 'react';

const Inicio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    { img: "/img/Salitre_Magico.jpeg", nombre: "Salitre Magico" },
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

    return () => clearInterval(interval);
  }, [images.length]);

  const createPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <>
      {/* Carrusel */}
      <section className="carrusel py-8 sm:py-12 bg-gray-100">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                      onError={(e) => {
                        console.log(`Error cargando imagen: ${image.src}`);
                        e.target.src = createPlaceholder();
                      }}
                      onLoad={() => {
                        console.log(`Imagen cargada correctamente: ${image.src}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentSlide + 1} / {images.length}
            </div>
          </div>
        </div>
      </section>

      {/* Lugares destacados */}
      <section className="destacados py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-gray-800">
            <svg className="inline w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Lugares Recomendados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {lugares.map((lugar, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={lugar.img}
                    alt={lugar.nombre}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      console.log(`Error cargando imagen de lugar: ${lugar.img}`);
                      e.target.src = createPlaceholder();
                    }}
                    onLoad={() => {
                      console.log(`Imagen de lugar cargada: ${lugar.img}`);
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                    {lugar.nombre}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

           {/* Acerca de Bogotá Turis */}
      <section className="acerca py-10 sm:py-16 bg-gradient-to-r from-blue-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Acerca de Bogotá Turis
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            Bogotá Turis es una plataforma interactiva diseñada para turistas, locales y curiosos que desean explorar lo mejor de Bogotá. 
            Desde lugares emblemáticos como Monserrate y La Candelaria, hasta rincones menos conocidos como el Museo del Mar o el Parque de los Niños, 
            esta app ofrece una experiencia visual, intuitiva y útil para planear tu recorrido por la capital. 
            Cada sección ha sido pensada con detalle para que el usuario se sienta acompañado, informado y motivado a descubrir.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-gradient-to-r from-pink-200 to-blue-200 text-center py-6 mt-10 shadow-inner">
        

        <p className="text-sm text-gray-700">© 2025 Bogotá Turis. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Inicio;