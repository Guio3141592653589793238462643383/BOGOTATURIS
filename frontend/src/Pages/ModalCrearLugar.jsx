import React, { useState, useEffect } from "react";

export default function ModalCrearLugar({ onClose, onLugarCreado }) {
  const [imagenes, setImagenes] = useState([]);
  const [tiposLugar, setTiposLugar] = useState([]);
  const [nuevoLugar, setNuevoLugar] = useState({
    nombre_lugar: "",
    id_tipo: "",
    descripcion: "",
    direccion: "",
    hora_aper: "",
    hora_cierra: "",
    precios: 0,
    imagen_url: "",
  });

  // 🔹 Cargar imágenes desde tu backend
  useEffect(() => {
    fetch("http://localhost:8000/api/lugares/imagenes")
      .then((res) => res.json())
      .then((data) => setImagenes(data))
      .catch((err) => console.error("Error al cargar imágenes:", err));
  }, []);

  // 🔹 Cargar tipos de lugar desde tu backend
  useEffect(() => {
    fetch("http://localhost:8000/api/tipos_lugar/")
      .then((res) => res.json())
      .then((data) => setTiposLugar(data))
      .catch((err) => console.error("Error al cargar tipos de lugar:", err));
  }, []);

  // 🔹 Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLugar({ ...nuevoLugar, [name]: value });
  };

  // 🔹 Enviar datos al componente padre (AdminView)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nuevoLugar.nombre_lugar || !nuevoLugar.id_tipo) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (typeof onLugarCreado === "function") {
      onLugarCreado(nuevoLugar);
    } else {
      console.warn("⚠️ onLugarCreado no está definido o no es una función");
    }

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '95vh',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Header Espectacular */}
<div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-xl w-full max-w-md mx-auto text-center">
  {/* Patrón decorativo de fondo */}
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-2xl translate-x-1/4 translate-y-1/4"></div>
  </div>

  {/* Contenido centrado */}
  <div className="relative flex flex-col items-center justify-center">
    <div className="text-4xl animate-bounce mb-2">🏛️</div>
    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
      Crear Lugar Turístico
    </h2>
  </div>
</div>



        {/* Contenido del formulario */}
        <div className="overflow-y-auto px-8 py-8" style={{ maxHeight: 'calc(95vh - 280px)' }}>
          <div className="space-y-6">
            
            {/* Sección: Información Básica */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Nombre del Lugar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_lugar"
                    value={nuevoLugar.nombre_lugar}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Monserrate, Torre Colpatria..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none text-gray-800 font-medium"
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Tipo de Lugar <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="id_tipo"
                    value={nuevoLugar.id_tipo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">-- Selecciona un tipo --</option>
                    {tiposLugar.map((tipo) => (
                      <option key={tipo.id_tipo} value={tipo.id_tipo}>
                        {tipo.nombre_tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2 mt-5">
                <label className="block text-sm font-bold text-gray-700">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={nuevoLugar.descripcion}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe las características y atractivos del lugar..."
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none resize-none text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Sección: Ubicación */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Ubicación
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Dirección Completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={nuevoLugar.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Cra. 7 #32-16, Bogotá..."
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Sección: Horarios y Precio */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                Horarios y Tarifas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Hora Apertura */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Hora de Apertura <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                      🌅
                    </div>
                    <input
                      type="time"
                      name="hora_aper"
                      value={nuevoLugar.hora_aper}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-800 font-bold text-lg"
                    />
                  </div>
                </div>

                {/* Hora Cierre */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Hora de Cierre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                      🌙
                    </div>
                    <input
                      type="time"
                      name="hora_cierra"
                      value={nuevoLugar.hora_cierra}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-800 font-bold text-lg"
                    />
                  </div>
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Precio de Entrada
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-green-600">
                      $
                    </div>
                    <input
                      type="number"
                      name="precios"
                      value={nuevoLugar.precios}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-800 font-bold text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Deja en 0 si es gratis
                  </p>
                </div>
              </div>
            </div>

            {/* Sección: Imagen */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                Imagen del Lugar
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Selecciona una imagen
                </label>
                <select
                  name="imagen_url"
                  value={nuevoLugar.imagen_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200 outline-none text-gray-800 font-medium cursor-pointer"
                >
                  <option value="">-- Selecciona una imagen --</option>
                  {imagenes.map((img) => (
                    <option key={img.nombre} value={img.url}>
                      {img.nombre}
                    </option>
                  ))}
                </select>

                {/* Vista previa */}
                {nuevoLugar.imagen_url && (
                  <div className="mt-4 animate-fadeIn">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                      <img
                        src={`http://localhost:8000/${nuevoLugar.imagen_url}`}
                        alt={nuevoLugar.nombre_lugar}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="p-6 w-full">
                          <p className="text-white font-bold text-lg">
                            ✓ Imagen seleccionada
                          </p>
                          <p className="text-blue-200 text-sm">
                            Esta será la imagen principal del lugar
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
<div className="flex justify-between mt-2">
  <button
    type="button"
    onClick={onClose}
    className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl border-2 border-gray-300 
               hover:bg-gray-100 hover:border-gray-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
  >
    Cancelar
  </button>

  <button
    onClick={handleSubmit}
    className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
               text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl 
               hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 
               transition-all duration-200 hover:-translate-y-1 transform"
  >
    💾 Guardar Lugar
  </button>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}