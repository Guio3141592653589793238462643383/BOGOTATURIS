/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import backgroundVideo from '../assets/img/Bogota2.mp4';
import Footer from "../components/Footer";
import ChatMapFull from "../components/ChatMapFull";

const Inicio = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar la fuente Lobster Two
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const lugares = {
    historia: [
      { img: "/img/Catedral y Capilla del Sagrario_ Bogotá.jpeg", nombre: "Capilla del Sagrario", descripcion: "Capilla adjunta a la Catedral Primada.", direccion: "Plaza de Bolívar, Bogotá" },
      { img: "/img/Iglesia de la Orden Tercera  – Bogotá Colombia.jpeg", nombre: "Iglesia de La Tercera", descripcion: "Iglesia franciscana del siglo XVII.", direccion: "Calle 16 #7-35, Bogotá" },
      { img: "/img/San Agustin.jpeg", nombre: "Claustro de San Agustín", descripcion: "Antiguo convento agustino del siglo XVII.", direccion: "Carrera 7 #7-51, Bogotá" },
      { img: "/img/Casa del florero.jpeg", nombre: "Casa del Florero", descripcion: "Lugar del Grito de Independencia de 1810.", direccion: "Calle 11 #6-94, Bogotá" },
      { img: "/img/Plaza de bolivar.jpg", nombre: "Plaza de Bolívar", descripcion: "Plaza principal de Bogotá, corazón histórico.", direccion: "Plaza de Bolívar, Bogotá" },
      { img: "/img/palacio-lievano-05.jpg", nombre: "Edificio Liévano", descripcion: "Sede de la Alcaldía Mayor de Bogotá.", direccion: "Calle 10 #8-77, Bogotá" },
      { img: "/img/Palacio de justicia.jpg", nombre: "Palacio de Justicia", descripcion: "Sede de la Corte Suprema de Justicia.", direccion: "Plaza de Bolívar, Bogotá" },
      { img: "/img/Archivo general de la nacion.jpg", nombre: "Archivo General de la Nación", descripcion: "Depósito documental histórico nacional.", direccion: "Calle 24 #5-60, Bogotá" },
      { img: "/img/Poesia silva.jpg", nombre: "Casa de Poesía Silva", descripcion: "Casa del poeta José Asunción Silva.", direccion: "Calle 14 #3-41, Bogotá" },
      { img: "/img/iglesia-de-la-conception.jpg", nombre: "Convento de La Concepción", descripcion: "Antiguo convento del siglo XVI.", direccion: "Calle 10 #9-84, Bogotá" },
      { img: "/img/Candelaria.jpg", nombre: "Iglesia de La Candelaria", descripcion: "Templo que da nombre al barrio histórico.", direccion: "Calle 11 #3-63, Bogotá" },
      { img: "/img/Plaza Santander_25082021_Ricardo Báez_9-300kb.jpg", nombre: "Plaza Santander", descripcion: "Plaza en honor a Francisco de Paula Santander.", direccion: "Carrera 7 con Calle 16, Bogotá" },
      { img: "/img/casa de nariño.jpeg", nombre: "Casa de Nariño", descripcion: "Palacio presidencial de Colombia.", direccion: "Carrera 8 #7-26, Bogotá" },
      { img: "/img/Capitalio_National_de_Colombia,_Bogotá.jpg", nombre: "Capitolio Nacional", descripcion: "Sede del Congreso de la República.", direccion: "Carrera 7 #8-68, Bogotá" },
      { img: "/img/iglesia-san-ignacio-loyola-01.jpeg", nombre: "Iglesia de San Ignacio", descripcion: "Iglesia jesuita del siglo XVII.", direccion: "Calle 10 #6-23, Bogotá" },
      { img: "/img/plaza-toros-historia_0.jpg", nombre: "Plaza de Toros La Santamaría", descripcion: "Plaza de toros de estilo mudéjar.", direccion: "Carrera 6 #26-50, Bogotá" },
      { img: "/img/estacion de la sabada.jpeg", nombre: "Estación de la Sabana", descripcion: "Estación de tren histórica.", direccion: "Calle 13 #18-24, Bogotá" },
      { img: "/img/Sede_Claustro_Universidad_del_Rosario.jpg", nombre: "Universidad del Rosario", descripcion: "Una de las universidades más antiguas de América.", direccion: "Calle 14 #6-25, Bogotá" },
      { img: "/img/colegio san bartolome.jpg", nombre: "Colegio Mayor de San Bartolomé", descripcion: "Colegio más antiguo de Colombia.", direccion: "Calle 10 #6-57, Bogotá" },
      { img: "/img/iglesia-de-san-francisco-de-asis-bogota.jpg", nombre: "Iglesia de San Francisco", descripcion: "Iglesia colonial del siglo XVI.", direccion: "Calle 12 #7-41, Bogotá" }
    ],
    teatros: [
      { img: "/img/teatro colon.jpeg", nombre: "Teatro Colón", descripcion: "Joya arquitectónica neoclásica.", direccion: "Calle 10 #5-32, Bogotá" },
      { img: "/img/teatro julio santo domingo.jpeg", nombre: "Teatro Julio Mario", descripcion: "Moderno centro cultural.", direccion: "Calle 170 #67-51, Bogotá" },
    {img: "/img/teatro jorge elierce gaitan.jpeg", nombre: "Teatro Jorge Eliécer Gaitán", descripcion: "Importante teatro en el centro.", direccion: "Calle 10 #5-32, Bogotá" },
      { img: "/img/Teatro nacional 3 (1) (1).jpg", nombre: "Teatro Nacional", descripcion: "Centro cultural y artístico.", direccion: "Calle 10 #5-32, Bogotá" },
      { img: "/img/teatro cafam.jpeg", nombre: "Teatro Cafam", descripcion: "Variedad de espectáculos.", direccion: "Av. 68 #63-85, Bogotá" },
      { img: "/img/teatro libre de bogota.jpeg", nombre: "Teatro Libre", descripcion: "Producciones teatrales innovadoras.", direccion: "Calle 63 #10-20, Bogotá" },
      { img: "/img/teatro nacional la castellana.jpeg", nombre: "Teatro Nacional La Castellana", descripcion: "Espacio cultural en La Castellana.", direccion: "Calle 100 #15-20, Bogotá" },
      { img: "/img/teatro la candelaria.jpeg", nombre: "Teatro La Candelaria", descripcion: "Producciones teatrales contemporáneas.", direccion: "Calle 12 #3-16, Bogotá" },
      { img: "/img/teatro santa fe.jpeg", nombre: "Teatro Santa Fe", descripcion: "Variedad de espectáculos culturales.", direccion: "Calle 22 #2-51, Bogotá" },
      { img: "/img/teatro el ensueño.jpeg", nombre: "Teatro El Ensueño", descripcion: "Producciones teatrales innovadoras.", direccion: "Calle 45 #16-20, Bogotá" },
      {img: "/img/teatro media torta.jpeg", nombre: "Teatro La Media Torta", descripcion: "Centro cultural y artístico.", direccion: "Calle 10 #5-32, Bogotá" },
      { img: "/img/teatro libre chapinero.jpeg", nombre: "Teatro Libre Chapinero", descripcion: "Producciones teatrales innovadoras.", direccion: "Calle 63 #10-20, Bogotá" },
      {img: "/img/teatro casa e becerro.jpeg", nombre: "Teatro Casa E Becerro", descripcion: "Espacio para teatro independiente.", direccion: "Calle 57 #8-45, Bogotá" },
      { img: "/img/teatro metro.jpeg", nombre: "Teatro Metro", descripcion: "Sala de teatro independiente.", direccion: "Carrera 24 #41-35, Bogotá" },
      {img: "/img/teatro guillermo.jpeg", nombre: "Auditorio y Teatro Guillermo Valencia", descripcion: "Espacio cultural y artístico.", direccion: "Calle 63 #8-20, Bogotá" },
      { img: "/img/teatro casa mayor.jpeg", nombre: "Teatro Casa Mayor", descripcion: "Teatro comunitario y cultural.", direccion: "Calle 63 #9-60, Bogotá" },
      { img: "/img/teatro la victoria.jpeg", nombre: "Teatro La Victoria", descripcion: "Espacio para teatro experimental.", direccion: "Carrera 15 #32-20, Bogotá" }
    ],
    museos: [
      { img: "/img/museo botero.jpeg", nombre: "Museo Botero", descripcion: "Colección de Fernando Botero.", direccion: "Calle 11 #4-41, Bogotá" },
      { img: "/img/museo del mar.jpeg", nombre: "Museo del Mar", descripcion: "Vida marina fascinante.", direccion: "Centro Comercial Santafé, Bogotá" },
      { img: "/img/museo del oro.jpeg", nombre: "Museo del Oro", descripcion: "La colección de oro prehispánico más grande del mundo.", direccion: "Parque de Santander, Bogotá" },
      { img: "/img/museo colonial.jpeg", nombre: "Museo de Arte Colonial", descripcion: "Arte colonial latinoamericano.", direccion: "Carrera 6 #9-77, Bogotá" },
      { img: "/img/museo quinta de bolivar.jpeg", nombre: "Museo Quinta de Bolívar", descripcion: "Casa museo del libertador.", direccion: "Calle 20 #2-91 Este, Bogotá" },
      { img: "/img/museo nacional de colombia.jpeg", nombre: "Museo Nacional de Colombia", descripcion: "Museo más antiguo del país.", direccion: "Carrera 7 #28-66, Bogotá" },
      { img: "/img/museo militar.jpeg", nombre: "Museo Militar", descripcion: "Historia militar colombiana.", direccion: "Carrera 7 #8-54, Bogotá" },
      { img: "/img/museo arqueologico.jpeg", nombre: "Museo Arqueológico", descripcion: "Artefactos precolombinos.", direccion: "Carrera 6 #7-43, Bogotá" },
      { img: "/img/museo de trajes regionales.jpeg", nombre: "Museo de Trajes Regionales", descripcion: "Vestimenta tradicional colombiana.", direccion: "Calle 10 #6-18, Bogotá" },
      { img: "/img/museo de bogota.jpeg", nombre: "Museo de Bogotá", descripcion: "Historia de la ciudad capital.", direccion: "Carrera 4 #10-18, Bogotá" },
      { img: "/img/museo de los niños.jpeg", nombre: "Museo de los Niños", descripcion: "Museo interactivo para niños.", direccion: "Carrera 60 #63-27, Bogotá" },
      { img: "/img/museo de ciencias naturales.jpeg", nombre: "Museo de Ciencias Naturales", descripcion: "Exhibiciones de historia natural.", direccion: "Carrera 7 #28-66, Bogotá" },
      { img: "/img/museo de fotografias.jpg", nombre: "Museo de Fotografía", descripcion: "Arte fotográfico colombiano.", direccion: "Calle 11 #4-41, Bogotá" },
      { img: "/img/museo contemporaneo.jpeg", nombre: "Museo de Arte Contemporáneo", descripcion: "Arte contemporáneo latinoamericano.", direccion: "Carrera 74 #82A-81, Bogotá" },
      { img: "/img/museo del transporte.jpeg", nombre: "Museo del Transporte", descripcion: "Historia del transporte en Colombia.", direccion: "Calle 26 #13-45, Bogotá" },
      { img: "/img/museo numismatico.jpeg", nombre: "Museo Numismático", descripcion: "Historia del dinero en Colombia.", direccion: "Calle 11 #4-93, Bogotá" },
      { img: "/img/museo santa clara.jpeg", nombre: "Museo Santa Clara", descripcion: "Arte religioso colonial.", direccion: "Carrera 8 #8-91, Bogotá" },
      { img: "/img/museo de la policia.jpeg", nombre: "Museo de la Policía", descripcion: "Historia de la policía nacional.", direccion: "Calle 9 #9-27, Bogotá" },
      { img: "/img/museo de arte popular.jpeg", nombre: "Museo de Arte Popular", descripcion: "Arte tradicional colombiano.", direccion: "Calle 10 #6-25, Bogotá" }
    ],
    entretenimiento: [
      { img: "/img/salitre magico.jpeg", nombre: "Salitre Mágico", descripcion: "Parque de atracciones.", direccion: "Cra. 68 #63-85, Bogotá" },
      { img: "/img/mundo aventura.jpeg", nombre: "Mundo Aventura", descripcion: "Diversión para toda la familia.", direccion: "Av. Esperanza #68-80, Bogotá" },
      { img: "/img/jaime duque.jpeg", nombre: "Parque Jaime Duque", descripcion: "Parque temático familiar.", direccion: "Km 7 Autopista Norte, Tocancipá" },
      { img: "/img/maloka.jpeg", nombre: "Maloka", descripcion: "Centro interactivo de ciencia.", direccion: "Cra. 68D #24A-51, Bogotá" },
      { img: "/img/cinemateca distrital.jpeg", nombre: "Cinemateca Distrital", descripcion: "Sala de cine alternativo.", direccion: "Carrera 7 #22-79, Bogotá" },
      { img: "/img/simon bolivar.jpeg", nombre: "Parque Simón Bolívar", descripcion: "Parque metropolitano para eventos.", direccion: "Calle 63 y 53, Bogotá" },
      { img: "/img/center.jpeg", nombre: "Bowling Center", descripcion: "Centro de bowling y juegos.", direccion: "Centro Comercial Andino, Bogotá" },
      { img: "/img/indoor-karts.jpg", nombre: "Kartdromo Bogotá", descripcion: "Pista de karts profesional.", direccion: "Autopista Norte #245-60, Bogotá" },
      { img: "/img/escape room.jpeg", nombre: "Escape Room Bogotá", descripcion: "Juegos de escape en vivo.", direccion: "Calle 85 #11-53, Bogotá" },
     {img: "/img/parque de la 93.jpeg", nombre: "Parque de la 93", descripcion: "Zona de entretenimiento y gastronomía.", direccion: "Calle 93, Bogotá" },
      { img: "/img/roller disco.jpeg", nombre: "Roller Disco", descripcion: "Pista de patinaje sobre ruedas.", direccion: "Calle 63 #7-07, Bogotá" }
    ],
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSearchTerm('');
    } else {
      setSelectedCategory(categoryId);
      setSearchTerm('');
      scrollToSection('categoria-vista');
    }
  };

  const handleCloseCategory = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categorias = [
    { id: 'historia', nombre: 'Historia', color: 'from-pink-200 to-rose-200', icon: '🏛️' },
    { id: 'teatros', nombre: 'Teatros', color: 'from-purple-200 to-indigo-200', icon: '🎭' },
    { id: 'museos', nombre: 'Museos', color: 'from-blue-200 to-cyan-200', icon: '🖼️' },
    { id: 'entretenimiento', nombre: 'Entretenimiento', color: 'from-orange-200 to-pink-200', icon: '🎢' },
  ];

  const createPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  };

  const openGoogleMaps = (direccion) => {
    const encodedAddress = encodeURIComponent(direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const filteredLugares = selectedCategory 
    ? lugares[selectedCategory]?.filter(lugar => 
        lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lugar.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lugar.tipo && lugar.tipo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lugar.especialidad && lugar.especialidad.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
  <>
    <div className="min-h-screen" style={{ fontFamily: "Lobster Two, cursive" }}>
      {/* Main Content */}
      <main style={{ fontFamily: "Lobster Two, cursive" }}>
      
        {/* Video Hero Section */}
        <section id="inicio" className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-screen overflow-hidden" style={{ fontFamily: "Lobster Two, cursive" }}>
          {/* Video de fondo */}
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay para contraste */}
          <div className="absolute inset-0 bg-black/25"></div>

          {/* Contenido encima del video */}
          <div className="relative z-10 absolute bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-16 left-3 sm:left-4 md:left-8 lg:left-12 right-3 sm:right-4 md:right-8 lg:right-12">
            <h3 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                style={{ fontFamily: "Lobster Two, cursive" }}>
              Descubre Bogotá
            </h3>
          </div>
        </section>

        {/* Categorías - En cuadros centrados */}
        <section id="categorias" className="py-12 sm:py-16 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50" style={{ fontFamily: "Lobster Two, cursive" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                style={{ fontFamily: "Lobster Two, cursive" }}>
              ¿Qué quieres descubrir?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {categorias.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group relative w-full max-w-[180px] h-32 sm:h-36 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 bg-gradient-to-br ${cat.color} border-2 border-white/80 hover:border-white flex flex-col items-center justify-center ${
                    selectedCategory === cat.id ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                  }`}
                  style={{ fontFamily: "Lobster Two, cursive" }}
                >
                  <span className="text-3xl sm:text-4xl transition-transform group-hover:scale-110 mb-2">
                    {cat.icon}
                  </span>
                  <span className="text-gray-700 font-bold text-sm sm:text-base text-center drop-shadow-lg leading-tight" style={{ fontFamily: "Lobster Two, cursive" }}>
                    {cat.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {selectedCategory && (
          <section id="categoria-vista" className="py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-pink-50" style={{ fontFamily: "Lobster Two, cursive" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h2 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                    style={{ fontFamily: "Lobster Two, cursive" }}>
                  {categorias.find(c => c.id === selectedCategory)?.nombre}
                </h2>
              </div>

              {/* Barra de búsqueda */}
              <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={`Buscar en ${categorias.find(c => c.id === selectedCategory)?.nombre}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
                    style={{ fontFamily: "Lobster Two, cursive" }}
                  />
                  {searchTerm && (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <p className="text-center text-gray-600 mt-2 text-sm" style={{ fontFamily: "Lobster Two, cursive" }}>
                  {filteredLugares.length} de {lugares[selectedCategory]?.length} lugares encontrados
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredLugares.map((lugar, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedPlace(lugar)} 
                    className="group relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
                    style={{ fontFamily: "Lobster Two, cursive" }}
                  >
                    <img 
                      src={lugar.img} 
                      alt={lugar.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => { e.target.src = createPlaceholder(); }} 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${categorias.find(c => c.id === selectedCategory)?.color} opacity-50 group-hover:opacity-60 transition-opacity`}></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 drop-shadow-lg" style={{ fontFamily: "Lobster Two, cursive" }}>{lugar.nombre}</h3>
                      {lugar.tipo && (
                        <p className="text-gray-700 text-xs mt-1 drop-shadow-lg" style={{ fontFamily: "Lobster Two, cursive" }}>{lugar.tipo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredLugares.length === 0 && searchTerm && (
                <div className="text-center py-12" style={{ fontFamily: "Lobster Two, cursive" }}>
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2" style={{ fontFamily: "Lobster Two, cursive" }}>No se encontraron resultados</h3>
                  <p className="text-gray-500" style={{ fontFamily: "Lobster Two, cursive" }}>Intenta con otros términos de búsqueda</p>
                </div>
              )}
            </div>
          </section>
        )}
        <ChatMapFull />
        {/* Acerca de Nosotros - Versión Pastel Mejorada */}
        <section id="acerca" className="py-16 sm:py-20 bg-gradient-to-br from-blue-100 via-pink-50 to-purple-100" style={{ fontFamily: "Lobster Two, cursive" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                  style={{ fontFamily: "Lobster Two, cursive" }}>
                Descubre Bogotá con Nosotros
              </h2>
              <p className="text-lg sm:text-xl text-purple-300 max-w-3xl mx-auto" style={{ fontFamily: "Lobster Two, cursive" }}>
                Tu guía definitiva para explorar los tesoros ocultos y los lugares más emblemáticos de la capital
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tarjeta 1 */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/50 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg" style={{ fontFamily: "Lobster Two, cursive" }}>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl text-purple-400">🎯</span>
                </div>
                <h3 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                    style={{ fontFamily: "Lobster Two, cursive" }}>Misión</h3>
                <p className="text-gray-600 text-center leading-relaxed" style={{ fontFamily: "Lobster Two, cursive" }}>
                  Mostrar la riqueza cultural, histórica y gastronómica de Bogotá, conectando a locales y turistas con experiencias auténticas.
                </p>
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/50 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg" style={{ fontFamily: "Lobster Two, cursive" }}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl text-blue-400">🌟</span>
                </div>
                <h3 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                    style={{ fontFamily: "Lobster Two, cursive" }}>Visión</h3>
                <p className="text-gray-600 text-center leading-relaxed" style={{ fontFamily: "Lobster Two, cursive" }}>
                  Ser la plataforma líder en turismo bogotano, innovando constantemente para ofrecer las mejores experiencias.
                </p>
              </div>

              {/* Tarjeta 3 */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/50 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-2 shadow-lg" style={{ fontFamily: "Lobster Two, cursive" }}>
                <div className="w-16 h-16 bg-gradient-to-r from-green-200 to-teal-200 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl text-green-400">💝</span>
                </div>
                <h3 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                    style={{ fontFamily: "Lobster Two, cursive" }}>Compromiso</h3>
                <p className="text-gray-600 text-center leading-relaxed" style={{ fontFamily: "Lobster Two, cursive" }}>
                  Ofrecer información precisa, actualizada y accesible para todos, promoviendo el turismo responsable y sostenible.
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" style={{ fontFamily: "Lobster Two, cursive" }}>
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/50">
                <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2" style={{ fontFamily: "Lobster Two, cursive" }}>120+</div>
                <div className="text-purple-400 text-sm" style={{ fontFamily: "Lobster Two, cursive" }}>Lugares Únicos</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/50">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2" style={{ fontFamily: "Lobster Two, cursive" }}>6</div>
                <div className="text-purple-400 text-sm" style={{ fontFamily: "Lobster Two, cursive" }}>Categorías</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/50">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2" style={{ fontFamily: "Lobster Two, cursive" }}>100%</div>
                <div className="text-purple-400 text-sm" style={{ fontFamily: "Lobster Two, cursive" }}>Gratuito</div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/50">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2" style={{ fontFamily: "Lobster Two, cursive" }}>24/7</div>
                <div className="text-purple-400 text-sm" style={{ fontFamily: "Lobster Two, cursive" }}>Disponible</div>
              </div>
            </div>

            {/* Cita inspiradora */}
            <div className="mt-12 text-center" style={{ fontFamily: "Lobster Two, cursive" }}>
              <div className="bg-white/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/50 max-w-3xl mx-auto">
                <p className="text-lg sm:text-xl italic text-purple-400 mb-4" style={{ fontFamily: "Lobster Two, cursive" }}>
                  "Bogotá no es solo una ciudad, es un universo de historias esperando ser descubiertas. 
                  Cada rincón, cada sabor, cada sonrisa cuenta parte de nuestra esencia."
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlace(null)} style={{ fontFamily: "Lobster Two, cursive" }}>
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "Lobster Two, cursive" }}>
            <div className="relative h-48 sm:h-64 md:h-80">
              <img src={selectedPlace.img} alt={selectedPlace.nombre} className="w-full h-full object-cover rounded-t-2xl sm:rounded-t-3xl" onError={(e) => { e.target.src = createPlaceholder(); }} />
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-4xl font-bold text-[#00438F] mb-4 text-center"
                  style={{ fontFamily: "Lobster Two, cursive" }}>{selectedPlace.nombre}</h2>
              
              {/* Información adicional para gastronomía */}
              {selectedPlace.tipo && (
                <div className="bg-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100 mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-purple-400" style={{ fontFamily: "Lobster Two, cursive" }}>Tipo</h4>
                      <p className="text-gray-800 font-medium text-sm sm:text-base" style={{ fontFamily: "Lobster Two, cursive" }}>{selectedPlace.tipo}</p>
                    </div>
                    {selectedPlace.especialidad && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-purple-400" style={{ fontFamily: "Lobster Two, cursive" }}>Especialidad</h4>
                        <p className="text-gray-800 font-medium text-sm sm:text-base" style={{ fontFamily: "Lobster Two, cursive" }}>{selectedPlace.especialidad}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base" style={{ fontFamily: "Lobster Two, cursive" }}>{selectedPlace.descripcion}</p>
              
              <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: "Lobster Two, cursive" }}>
                  <span className="mr-2">📍</span> Dirección
                </h3>
                <p className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: "Lobster Two, cursive" }}>{selectedPlace.direccion}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setSelectedPlace(null)} 
                  className="flex-1 bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white font-semibold py-3 rounded-full transition-all text-sm"
                  style={{ fontFamily: "Lobster Two, cursive" }}
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => openGoogleMaps(selectedPlace.direccion)}
                  className="flex-1 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
                  style={{ fontFamily: "Lobster Two, cursive" }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  Ver en Mapa
                </button>
                      

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default Inicio;