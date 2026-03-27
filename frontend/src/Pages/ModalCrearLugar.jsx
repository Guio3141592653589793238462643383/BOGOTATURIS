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

  useEffect(() => {
    fetch("http://localhost:8000/api/lugares/imagenes")
      .then((res) => res.json())
      .then((data) => setImagenes(data))
      .catch((err) => console.error("Error al cargar imágenes:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/tipos_lugar/")
      .then((res) => res.json())
      .then((data) => setTiposLugar(data))
      .catch((err) => console.error("Error al cargar tipos de lugar:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLugar({ ...nuevoLugar, [name]: value });
  };

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

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "#f9fafb",
    border: "2px solid #d1d5db",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#1f2937",
    outline: "none",
    transition: "all 0.2s"
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "0.5rem"
  };

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "1.5rem",
    border: "1px solid #e5e7eb"
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)"
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "56rem",
          backgroundColor: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          maxHeight: "95vh"
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(to right, #4f46e5, #7c3aed, #ec4899)",
          padding: "1.5rem",
          textAlign: "center",
          color: "white"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏛️</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
            Crear Lugar Turístico
          </h2>
        </div>

        {/* Contenido del formulario */}
        <div style={{ padding: "2rem", overflowY: "auto", maxHeight: "calc(95vh - 200px)" }}>
          
          {/* Información Básica */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
              📋 Información Básica
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={labelStyle}>
                  Nombre del Lugar <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="nombre_lugar"
                  value={nuevoLugar.nombre_lugar}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Monserrate, Torre Colpatria..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Tipo de Lugar <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  name="id_tipo"
                  value={nuevoLugar.id_tipo}
                  onChange={handleChange}
                  required
                  style={inputStyle}
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

            <div>
              <label style={labelStyle}>
                Descripción <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="descripcion"
                value={nuevoLugar.descripcion}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe las características y atractivos del lugar..."
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
              📍 Ubicación
            </h3>
            
            <div>
              <label style={labelStyle}>
                Dirección Completa <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={nuevoLugar.direccion}
                onChange={handleChange}
                required
                placeholder="Cra. 7 #32-16, Bogotá..."
                style={inputStyle}
              />
            </div>
          </div>

          {/* Horarios y Precio */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
              ⏰ Horarios y Tarifas
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={labelStyle}>
                  Hora de Apertura <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="time"
                  name="hora_aper"
                  value={nuevoLugar.hora_aper}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Hora de Cierre <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="time"
                  name="hora_cierra"
                  value={nuevoLugar.hora_cierra}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Precio de Entrada
                </label>
                <input
                  type="number"
                  name="precios"
                  value={nuevoLugar.precios}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  style={inputStyle}
                />
                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  💡 Deja en 0 si es gratis
                </p>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#1f2937" }}>
              🖼️ Imagen del Lugar
            </h3>
            
            <div>
              <label style={labelStyle}>
                Selecciona una imagen
              </label>
              <select
                name="imagen_url"
                value={nuevoLugar.imagen_url}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">-- Selecciona una imagen --</option>
                {imagenes.map((img) => (
                  <option key={img.nombre} value={img.url}>
                    {img.nombre}
                  </option>
                ))}
              </select>

              {nuevoLugar.imagen_url && (
                <div style={{ marginTop: "1rem" }}>
                  <img
                    src={`http://localhost:8000/${nuevoLugar.imagen_url}`}
                    alt={nuevoLugar.nombre_lugar}
                    style={{
                      width: "100%",
                      height: "320px",
                      objectFit: "cover",
                      borderRadius: "1rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <p style={{ color: "#059669", fontWeight: "bold", marginTop: "0.5rem" }}>
                    ✓ Imagen seleccionada
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "white",
                color: "#374151",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "0.75rem",
                border: "2px solid #d1d5db",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
                e.target.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.borderColor = "#d1d5db";
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              style={{
                padding: "1rem 2rem",
                background: "linear-gradient(to right, #4f46e5, #7c3aed, #ec4899)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
            >
              💾 Guardar Lugar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}