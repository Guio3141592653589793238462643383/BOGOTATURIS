import { useState } from 'react';

const Lugares = () => {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const lugares = [
    { 
      img: "../public/img/MONSERRATE.jpg", 
      nombre: "Monserrate", 
      categoria: "religioso",
      descripcion: "Cerro sagrado de Bogotá con vista panorámica de la ciudad"
    },
    { 
      img: "../img/la-candelaria.jpg", 
      nombre: "La Candelaria", 
      categoria: "historico",
      descripcion: "Centro histórico de Bogotá con arquitectura colonial"
    },
    { 
      img: "/img/museo del oro.jpg", 
      nombre: "Museo del Oro", 
      categoria: "museo",
      descripcion: "Colección de orfebrería prehispánica más importante del mundo"
    },
    { 
      img: "/img/jardin botanico.jpg", 
      nombre: "Jardín Botánico", 
      categoria: "naturaleza",
      descripcion: "Espacio verde con diversidad de flora colombiana"
    },
    { 
      img: "/img/simon bolivar .jpg", 
      nombre: "Parque Simón Bolívar", 
      categoria: "parque",
      descripcion: "El pulmón verde más grande de Bogotá"
    },
    { 
      img: "/img/virgilio barco.jpg", 
      nombre: "Biblioteca Virgilio Barco", 
      categoria: "cultura",
      descripcion: "Moderna biblioteca con arquitectura contemporánea"
    },
    { 
      img: "/img/Plaza Bolivar.jpg", 
      nombre: "Plaza Bolívar", 
      categoria: "historico",
      descripcion: "Plaza principal de Bogotá, corazón político del país"
    },
    { 
      img: "/img/usaquen.jpg", 
      nombre: "Usaquén", 
      categoria: "barrio",
      descripcion: "Barrio bohemio con mercado de pulgas dominical"
    },
    { 
      img: "/img/planetario.jpg", 
      nombre: "Planetario", 
      categoria: "museo",
      descripcion: "Centro de divulgación científica y astronómica"
    },
    { 
      img: "/img/maloka.jpg", 
      nombre: "Maloka", 
      categoria: "museo",
      descripcion: "Centro interactivo de ciencia y tecnología"
    },
    { 
      img: "/img/cerro de guadalupe.jpg", 
      nombre: "Cerro de Guadalupe", 
      categoria: "religioso",
      descripcion: "Cerro con vista panorámica y sitio religioso"
    }
  ];

  const categorias = [
    { value: 'todos', label: 'Todos los lugares', icon: 'fas fa-map' },
    { value: 'historico', label: 'Históricos', icon: 'fas fa-landmark' },
    { value: 'museo', label: 'Museos', icon: 'fas fa-university' },
    { value: 'naturaleza', label: 'Naturaleza', icon: 'fas fa-leaf' },
    { value: 'parque', label: 'Parques', icon: 'fas fa-tree' },
    { value: 'religioso', label: 'Religiosos', icon: 'fas fa-church' },
    { value: 'cultura', label: 'Culturales', icon: 'fas fa-theater-masks' },
    { value: 'barrio', label: 'Barrios', icon: 'fas fa-home' }
  ];

  const lugaresFiltrados = lugares.filter(lugar => {
    const coincideFiltro = filtro === 'todos' || lugar.categoria === filtro;
    const coincideBusqueda = lugar.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <i className="fas fa-map-marked-alt mr-3"></i>
            Lugares Turísticos de Bogotá
          </h2>
          <p className="text-lg opacity-90">
            Explora los destinos más fascinantes de la capital colombiana
          </p>
        </div>
      </section>

      {/* Filtros y búsqueda */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Barra de búsqueda */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar lugares..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categorias.map(categoria => (
              <button
                key={categoria.value}
                onClick={() => setFiltro(categoria.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filtro === categoria.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className={`${categoria.icon} mr-2`}></i>
                {categoria.label}
              </button>
            ))}
          </div>

          {/* Contador de resultados */}
          <p className="text-center text-gray-600">
            {lugaresFiltrados.length} lugar{lugaresFiltrados.length !== 1 ? 'es' : ''} encontrado{lugaresFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Grid de lugares */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {lugaresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl text-gray-600 mb-2">No se encontraron lugares</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {lugaresFiltrados.map((lugar, index) => (
                <article 
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={lugar.img}
                      alt={lugar.nombre}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/img/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de categoría */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {categorias.find(cat => cat.value === lugar.categoria)?.label || lugar.categoria}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {lugar.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {lugar.descripcion}
                    </p>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                      <i className="fas fa-info-circle mr-2"></i>
                      Más información
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Lugares;