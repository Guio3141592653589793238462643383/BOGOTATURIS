import React, { useState, useEffect } from "react";
import "../assets/css/TablaLugares.css";


function TablaLugares() {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const lugaresPorPagina = 5;

  // Simulación de datos (puedes reemplazar con fetch desde tu API)
  useEffect(() => {
    const datos = [
      { nombre: "Monserrate", descripcion: "Santuario en la cima", ubicacion: "Bogotá" },
      { nombre: "La Candelaria", descripcion: "Centro histórico", ubicacion: "Bogotá" },
      { nombre: "Museo del Oro", descripcion: "Colección precolombina", ubicacion: "Bogotá" },
      { nombre: "Jardín Botánico", descripcion: "Naturaleza y ciencia", ubicacion: "Bogotá" },
      { nombre: "Parque Simón Bolívar", descripcion: "Espacio verde", ubicacion: "Bogotá" },
      { nombre: "Biblioteca Virgilio Barco", descripcion: "Arquitectura moderna", ubicacion: "Bogotá" },
      { nombre: "Plaza Bolívar", descripcion: "Plaza principal", ubicacion: "Bogotá" },
      { nombre: "Usaquén", descripcion: "Zona gastronómica", ubicacion: "Bogotá" },
      { nombre: "Planetario", descripcion: "Ciencia y estrellas", ubicacion: "Bogotá" },
      { nombre: "Maloka", descripcion: "Museo interactivo", ubicacion: "Bogotá" },
      { nombre: "Cerro de Guadalupe", descripcion: "Mirador natural", ubicacion: "Bogotá" }
    ];
    setLugares(datos);
  }, []);

  // Filtro
  const filtrados = lugares.filter(lugar =>
    lugar.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Ordenamiento
  const ordenados = [...filtrados].sort((a, b) =>
    ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
  );

  // Paginación
  const inicio = (paginaActual - 1) * lugaresPorPagina;
  const paginados = ordenados.slice(inicio, inicio + lugaresPorPagina);
  const totalPaginas = Math.ceil(ordenados.length / lugaresPorPagina);

  return (
    <div className="tabla-container">
      <h2 className="titulo">Lugares Turísticos</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="busqueda-input"
      />

      <table className="tabla">
        <thead>
          <tr>
            <th onClick={() => setOrdenAscendente(!ordenAscendente)}>
              Nombre {ordenAscendente ? "⬆️" : "⬇️"}
            </th>
            <th>Descripción</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {paginados.map((lugar, index) => (
            <tr key={index}>
              <td>{lugar.nombre}</td>
              <td>{lugar.descripcion}</td>
              <td>{lugar.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={paginaActual === i + 1 ? "activo" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TablaLugares;