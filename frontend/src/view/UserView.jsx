import Logo from "../assets/img/BogotaTurisLogo.png";
import logoUser from "../assets/img/user.png";
import "../assets/css/UserView.css";
import { useEffect, useState, useCallback } from "react";
import Card from "../Pages/Card";
import Data from "../utils/data";
import Modal from "../Pages/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from "../components/ChatBot";

export default function UserView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  // Estados existentes
  const [selectedCard, setSelectedCard] = useState(null);

  // Estados para manejo de usuario
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // 🔧 Función optimizada SIN usuarioData como dependencia
  const fetchUsuarioData = useCallback(
    async (id, forceRefresh = false) => {
      try {
        if (usuarioData && !forceRefresh) {
          return;
        }

        setLoading(true);

        const response = await fetch(
          `http://localhost:8000/api/usuario/perfil/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
          localStorage.setItem("usuarioData", JSON.stringify(data));
          setError(null);
        } else if (response.status === 404) {
          console.log("❌ [USER] Usuario no encontrado");
          setError("Usuario no encontrado");
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
    },
    [navigate]
  );

  const refreshUserData = useCallback(() => {
    if (usuarioId) {
      fetchUsuarioData(usuarioId, true); 
    }
  }, [usuarioId, fetchUsuarioData]);

  // 🔧 Cargar datos solo una vez al montar
  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    // 1️⃣ Intentar cargar desde localStorage primero
    const savedUser = localStorage.getItem("usuarioData");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // 🔧 Validar si están los campos importantes
        if (!parsedUser.correo || !parsedUser.primer_nombre) {
          console.log("⚠️ [USER] Datos incompletos en localStorage, buscando en servidor...");
          fetchUsuarioData(usuarioId, true); // 👉 forzar refresh
        } else {
          setUsuarioData(parsedUser);
          console.log("✅ [USER] Datos cargados desde localStorage");
        }
      } catch (error) {
        console.log("❌ [USER] Error parseando localStorage, buscando en servidor");
        localStorage.removeItem("usuarioData");
        fetchUsuarioData(usuarioId);
      }
    } else {
      // 2️⃣ Si no hay datos guardados, hacer fetch
      fetchUsuarioData(usuarioId);
    }
  }, [usuarioId, navigate]);

  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      if (event.detail) {
        setUsuarioData(event.detail);
        localStorage.setItem("usuarioData", JSON.stringify(event.detail));
        console.log("✅ [USER] Datos actualizados desde evento");
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("usuarioData");

    navigate("/login", { replace: true });

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      navigate("/login", { replace: true });
    };
  };

  const handleMiCuenta = () => {
    navigate(`/usuario/${usuarioId}/perfil`);
  };

  const handleCambiarPassword = () => {
    navigate(`/usuario/${usuarioId}/cambiar-password`);
  };

  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedCard(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const data = Data();

  if (loading && !usuarioData) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div
          className="loading-spinner"
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <h2>Cargando tu perfil...</h2>
        <p>Obteniendo información del usuario</p>
      </div>
    );
  }

  if (error && !usuarioData) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column"
      }}>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchUsuarioData(usuarioId, true)}>
          Reintentar
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="error-message"
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#e74c3c", marginBottom: "20px" }}>⚠️ {error}</h2>
          <p style={{ marginBottom: "20px" }}>
            {error.includes("conexión")
              ? "Verifica tu conexión a internet y que el servidor esté ejecutándose."
              : "Serás redirigido al login en unos segundos..."}
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
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
            <h1>BogotaTuris</h1>
          </div>
          <ul className="nav-links">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
              >
                <strong className="user-section">
                  Bienvenido {usuarioData?.correo || "Usuario"}
                  <img
                    src={logoUser}
                    alt="Logo Usuario"
                    className="user-logo"
                  />
                </strong>
              </a>

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
            </li>
          </ul>
        </div>
      </nav>

      <div className="promo-section text-center px-6">
        <motion.h2
          className="text-4xl font-bold text-[#00438F] mb-4"
          style={{ fontFamily: "Lobster Two, cursive" }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.08,
            textShadow:
              "0px 0px 15px rgba(0,67,143,0.7), 0px 0px 25px rgba(0,0,0,0.4)",
          }}
        >
          ¡Descubre la belleza de Bogotá,{" "}
          {usuarioData?.primer_nombre || "Usuario"}!
        </motion.h2>

        <motion.p
          className="text-gray-700 mb-10 text-lg"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{
            scale: 1.03,
            textShadow: "0px 0px 10px rgba(0,0,0,0.3)",
          }}
        >
          Este lugar es imperdible. Ven y explora todo lo que tiene para
          ofrecer.
        </motion.p>

        <div className="cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {data.map((item) => (
            <Card
              key={item.id_lugar}
              imagen={item.imagen}
              titulo={item.titulo}
              descripcion={item.descripcion}
              onClick={() => setSelectedCard(item)} 
            />
          ))}
        </div>

        <Modal
          open={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          card={selectedCard}
        />
      </div>
      <Chatbot />
    </>
  );
}
