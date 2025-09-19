import Logo from '../assets/img/BogotaTurisLogo.png';
import logoUsuario from '../assets/img/logoUsuario.png';
import '../assets/css/UserView.css';
import { useEffect, useState, useCallback } from 'react';
import Card from '../Pages/Card';
import Data from '../utils/data';
import Modal from '../Pages/Modal';
import { useParams, useNavigate } from "react-router-dom";

export default function UserView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  // Estados existentes
  const [selectedCard, setSelectedCard] = useState(null);
  const [isBienvenidoOpen, setIsBienvenidoOpen] = useState(false);
  
  // Estados para manejo de usuario
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // 🔧 Función optimizada para obtener datos básicos del perfil
  const fetchUsuarioData = useCallback(async (id) => {
    try {
      console.log(`🔄 [USER] Cargando perfil básico del usuario ID: ${id}`);
      setLoading(true);
      
      const response = await fetch(`http://localhost:8000/api/usuario/perfil/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ [USER] Perfil básico cargado:", data);
        setUsuarioData(data);
        setError(null);
      } else if (response.status === 404) {
        console.log("❌ [USER] Usuario no encontrado");
        setError("Usuario no encontrado");
        // Redirigir al login después de 2 segundos
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Error al cargar los datos del usuario");
      }
    } catch (error) {
      console.error("💥 [USER] Error de conexión:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (!usuarioId) {
      console.log("❌ [USER] No hay ID de usuario, redirigiendo a login");
      navigate("/login");
      return;
    }
    fetchUsuarioData(usuarioId);
  }, [usuarioId, navigate, fetchUsuarioData]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/login");
  };

  // Funciones para navegación
  const handleMiCuenta = () => {
    setShowProfile(true);
    setIsBienvenidoOpen(false);
  };

  const handleCambiarPassword = () => {
    navigate(`/usuario/${usuarioId}/cambiar-password`);
    setIsBienvenidoOpen(false);
  };

  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
    setIsBienvenidoOpen(false);
  };

  const toggleBienvenido = () => {
    setIsBienvenidoOpen(!isBienvenidoOpen);
  };

  // Cerrar modales con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedCard(null);
        setShowProfile(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const data = Data();

  // 🔄 Pantalla de carga
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2>Cargando tu perfil...</h2>
        <p>Obteniendo información del usuario {usuarioId}</p>
      </div>
    );
  }

  // ❌ Pantalla de error
  if (error) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="error-message" style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>⚠️ {error}</h2>
          <p style={{ marginBottom: '20px' }}>
            {error.includes("conexión") 
              ? "Verifica tu conexión a internet y que el servidor esté ejecutándose."
              : "Serás redirigido al login en unos segundos..."
            }
          </p>
          <button 
            onClick={() => navigate("/login")} 
            style={{
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Vista principal con datos del usuario
  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src={Logo} alt="BogotaTuris Logo" />
          </div>
          <ul className="nav-links">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                onClick={toggleBienvenido}
                aria-expanded={isBienvenidoOpen}
              >
                <strong>
                  Bienvenido {usuarioData?.correo || 'Usuario'}
                  <img src={logoUsuario} alt="Logo Usuario" className="user-logo" />
                </strong>
              </a>
              {isBienvenidoOpen && (
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <a className="dropdown-item" onClick={handleMiCuenta}>
                      Mi Cuenta
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleCambiarPassword}>
                      Cambiar Contraseña
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleCambiarIntereses}>
                      Cambiar Intereses
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Cerrar Sesión
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Sección principal */}
      <div className="promo-section">
        <h2>
          ¡Descubre la belleza de Bogotá, {usuarioData?.primer_nombre || 'Usuario'}!
        </h2>
        <p>Este lugar es imperdible. Ven y explora todo lo que tiene para ofrecer.</p>
    
        {/* Tarjetas dinámicas */}
        <div className="cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {data.map((item) => (
            <Card
              key={item.id}
              imagen={item.imagen}
              titulo={item.titulo}
              onClick={() => setSelectedCard(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal con la tarjeta seleccionada */}
      <Modal 
        open={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        card={selectedCard} 
      />

      {/* 👤 Modal de perfil básico */}
      {showProfile && usuarioData && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <h3>Mi Perfil</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowProfile(false)}
              >
                ✕
              </button>
            </div>
            <div className="profile-content">
              <div className="profile-field">
                <label>Nombre Completo:</label>
                <span>
                  {usuarioData.primer_nombre} 
                  {usuarioData.segundo_nombre ? ` ${usuarioData.segundo_nombre}` : ''} 
                  {usuarioData.primer_apellido} 
                  {usuarioData.segundo_apellido ? ` ${usuarioData.segundo_apellido}` : ''}
                </span>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <span>{usuarioData.correo}</span>
              </div>
              <div className="profile-field">
                <label>Nacionalidad:</label>
                <span>{usuarioData.nacionalidad}</span>
              </div>
              <div className="profile-field">
                <label>ID de Usuario:</label>
                <span>{usuarioData.id_usuario}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS para la animación del spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}