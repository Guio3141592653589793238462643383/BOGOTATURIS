import React, { useState } from "react";
// Ajusta la ruta si usas otra imagen
import "../assets/css/Dashboard.css"; // Aquí van todos los estilos

const Dashboard = () => {
  const [rol, setRol] = useState("turista");
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const cambiarRol = (nuevoRol) => {
    setMostrarPerfil(false);
    setRol(nuevoRol);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="rol-selector">
          <button onClick={() => cambiarRol("turista")}>Turista</button>
          <button onClick={() => cambiarRol("guia")}>Guía</button>
          <button onClick={() => cambiarRol("admin")}>Administrador</button>
        </div>

        {mostrarPerfil && (
          <div className="perfil-cuadro">
            <img alt="Perfil" className="perfil-img" />
            <h3>{rol === "admin" ? "Admin" : rol === "guia" ? "Guía" : "Turista"}</h3>
            <p>
              {rol === "admin"
                ? "admin@bogotaturis.com"
                : rol === "guia"
                ? "guia@bogotaturis.com"
                : "chirlysotos15@gmail.com"}
            </p>
            <ul>
              {rol === "admin" && (
                <>
                  <li>⚙️ Configuración del sistema</li>
                  <li>👥 Gestión de usuarios</li>
                  <li>📊 Panel de reportes</li>
                  <li>🔐 Seguridad avanzada</li>
                </>
              )}
              {rol === "guia" && (
                <>
                  <li>📍 Rutas asignadas</li>
                  <li>📅 Agenda de recorridos</li>
                  <li>📝 Evaluaciones de turistas</li>
                  <li>🔄 Sincronización activa</li>
                </>
              )}
              {rol === "turista" && (
                <>
                  <li>🔐 Contraseñas y Autocompletar</li>
                  <li>👤 Gestionar tu cuenta</li>
                  <li>🎨 Personalizar perfil</li>
                  <li>🔄 Sincronización activada</li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      <main className="dashboard-content">
        {rol === "admin" && (
          <>
            <h2>🛠️ Panel de Administración</h2>
            <p>Control total sobre usuarios, lugares, reportes y configuración.</p>
            <section><h3>👥 Gestión de Usuarios</h3></section>
            <section><h3>📊 Reportes de Actividad</h3></section>
            <section><h3>🗺️ Lugares Turísticos</h3></section>
          </>
        )}

        {rol === "guia" && (
          <>
            <h2>🧭 Panel del Guía</h2>
            <p>Organiza tus recorridos y gestiona la experiencia de los turistas.</p>
            <section><h3>📍 Rutas asignadas</h3></section>
            <section><h3>📅 Agenda de recorridos</h3></section>
            <section><h3>📝 Evaluaciones recibidas</h3></section>
          </>
        )}

        {rol === "turista" && (
          <>
            <h2>🌆 Dashboard Turista</h2>
            <p>Explora Bogotá y personaliza tu experiencia.</p>
            <section><h3>📌 Lugares recomendados</h3></section>
            <section><h3>🎉 Eventos cercanos</h3></section>
            <section><h3>👤 Tu perfil</h3></section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;