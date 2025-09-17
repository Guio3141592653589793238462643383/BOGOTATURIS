import Logo from '../assets/img/BogotaTurisLogo.png';
import logoUsuario from '../assets/img/logoUsuario.png';
import '../assets/css/UserView.css';
import { useEffect, useState } from 'react';
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
  
  // NUEVOS ESTADOS para manejo de usuario
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  const API_BASE_URL = "http://localhost:8000";

const fetchUsuarioData = useCallback(async (id) => {
  try {
    console.log(`🔄 [USER] Cargando datos del usuario ID: ${id}`);

    setLoading(true);
    
    const response = await fetch(`http://localhost:8000/api/usuario/perfil/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ [USER] Datos del usuario cargados:", data);
      setUsuarioData(data);
      setError(null);
    } else if (response.status === 404) {
      setError("Usuario no encontrado");
      navigate("/login");
    } else {
      setError("Error al cargar los datos del usuario");
    }
  } catch (error) {
    console.error("💥 [USER] Error:", error);
    setError("Error de conexión");
  } finally {
    setLoading(false);
  }
}, [navigate]);

  // EFECTO PARA CARGAR DATOS AL MONTAR EL COMPONENTE
useEffect(() => {
  if (!usuarioId) {
    console.log("❌ [USER] No hay ID de usuario, redirigiendo a login");
    navigate("/login");
    return;
  }
  fetchUsuarioData(usuarioId);
}, [usuarioId, navigate, fetchUsuarioData]);



  // FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // FUNCIONES PARA NAVEGACIÓN
  const handleMiCuenta = () => {
    // EN VEZ DE NAVEGAR, MOSTRAR MODAL O SECCIÓN DE PERFIL
    // eslint-disable-next-line no-undef
    setShowProfile(true); // O crear un estado para mostrar perfil
  };

  const handleCambiarPassword = () => {
    navigate(`/usuario/${usuarioId}/cambiar-password`);
  };

  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
  };

  const toggleBienvenido = () => {
    setIsBienvenidoOpen(!isBienvenidoOpen);
  };

  // Cerrar modal con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedCard(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const data = Data();

  // MOSTRAR LOADING
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="loading-spinner">
          <h2>Cargando tu perfil...</h2>
        </div>
      </div>
    );
  }

  // MOSTRAR ERROR
  if (error) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="error-message">
          <h2>Error: {error}</h2>
          <button 
            onClick={() => navigate("/login")} 
            className="btn-primary"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

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
    </>
  );
}