import React, { useState, useEffect } from "react";
import "../assets/css/AdminView.css";

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
    fetch("http://localhost:8000/api/tipos_lugar")
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
      onLugarCreado(nuevoLugar); // ← Enviamos los datos al padre
    } else {
      console.warn("⚠️ onLugarCreado no está definido o no es una función");
    }

    onClose(); // Cerramos el modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear Nuevo Lugar Turístico</h3>

        <form onSubmit={handleSubmit} className="form-crear-lugar">
          {/* Nombre */}
          <label>Nombre del lugar:</label>
          <input
            type="text"
            name="nombre_lugar"
            value={nuevoLugar.nombre_lugar}
            onChange={handleChange}
            required
          />

          {/* Tipo */}
          <label>Tipo de lugar:</label>
          <select
            name="id_tipo"
            value={nuevoLugar.id_tipo}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona un tipo de lugar --</option>
            {tiposLugar.map((tipo) => (
              <option key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.nombre_tipo}
              </option>
            ))}
          </select>

          {/* Descripción */}
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={nuevoLugar.descripcion}
            onChange={handleChange}
            required
          />

          {/* Dirección */}
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={nuevoLugar.direccion}
            onChange={handleChange}
            required
          />

          {/* Horarios */}
          <label>Hora de apertura:</label>
          <input
            type="time"
            name="hora_aper"
            value={nuevoLugar.hora_aper}
            onChange={handleChange}
            required
          />

          <label>Hora de cierre:</label>
          <input
            type="time"
            name="hora_cierra"
            value={nuevoLugar.hora_cierra}
            onChange={handleChange}
            required
          />

          {/* Precio */}
          <label>Precio:</label>
          <input
            type="number"
            name="precios"
            value={nuevoLugar.precios}
            onChange={handleChange}
            min="0"
          />

          {/* Imagen */}
          <label>Seleccionar Imagen:</label>
          <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNuevoLugar({ ...nuevoLugar, imagen: e.target.files[0] })
  }
/>
          <select
            name="imagen_url"
            value={nuevoLugar.imagen_url}
            onChange={handleChange}
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
            <img
              src={`http://localhost:8000/${nuevoLugar.imagen_url}`}
              alt={nuevoLugar.nombre_lugar}
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}

          {/* Botones */}
          <div className="modal-buttons">
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
