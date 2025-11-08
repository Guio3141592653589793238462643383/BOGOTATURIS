import "../assets/css/UserView.css";
import { useEffect, useState, useCallback } from "react";
import Card from "../Pages/Card";
import Modal from "../Pages/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from "../components/ChatBot";
import NavbarView from "../components/NavbarView";

export default function UserView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [selectedCard, setSelectedCard] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [cargandoLugares, setCargandoLugares] = useState(true);
  const [errorLugares, setErrorLugares] = useState(null);

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/lugares/");
        if (!response.ok) throw new Error("Error al cargar lugares");
        const data = await response.json();
        setLugares(data);
      } catch (error) {
        console.error("💥 Error al traer lugares:", error);
        setErrorLugares("No se pudieron cargar los lugares");
      } finally {
        setCargandoLugares(false);
      }
    };

    fetchLugares();
  }, []);

  // ✅ Función para obtener datos del usuario
  const fetchUsuarioData = useCallback(
    async (id, forceRefresh = false) => {
      try {
        if (usuarioData && !forceRefresh) return;

        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/usuario/perfil/${id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
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
    if (usuarioId) fetchUsuarioData(usuarioId, true);
  }, [usuarioId, fetchUsuarioData]);

  // ✅ Cargar datos del usuario, validando que el usuario del localStorage coincida con el logeado
  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    const savedUser = localStorage.getItem("usuarioData");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const savedId =
          parsedUser?.id_usuario?.toString() ||
          parsedUser?.id ||
          parsedUser?.idUser;

        // 🔍 Validar que los datos guardados coincidan con el usuario logeado
        if (savedId !== usuarioId.toString()) {
          console.log(
            "⚠️ [USER] Usuario distinto, recargando desde servidor..."
          );
          fetchUsuarioData(usuarioId, true); // Forzar refresh
        } else if (!parsedUser.correo || !parsedUser.primer_nombre) {
          console.log("⚠️ [USER] Datos incompletos, recargando...");
          fetch(usuarioId, true);
        } else {
          console.log("✅ [USER] Datos válidos desde localStorage");
          setUsuarioData(parsedUser);
        }
      } catch (error) {
        console.log("❌ [USER] Error al parsear localStorage, recargando...");
        localStorage.removeItem("usuarioData");
        fetchUsuarioData(usuarioId, true);
      }
    } else {
      // Si no hay nada guardado, obtener del servidor
      fetchUsuarioData(usuarioId, true);
    }
  }, [usuarioId, navigate, fetchUsuarioData]);

  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      if (event.detail) {
        setUsuarioData(event.detail);
        localStorage.setItem("usuarioData", JSON.stringify(event.detail));
        console.log("✅ [USER] Datos actualizados desde evento");
      }
    };

    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () =>
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
  }, []);

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchUsuarioData(usuarioId, true)}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <NavbarView
        usuarioData={usuarioData}
        onRefreshUserData={refreshUserData}
      />
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
          {cargandoLugares ? (
            <p>Cargando lugares...</p>
          ) : errorLugares ? (
            <p>{errorLugares}</p>
          ) : lugares.length > 0 ? (
            lugares.map((lugar) => (
              <Card
                key={lugar.id_lugar}
                imagen={lugar.imagen_url || "/default-image.png"} 
                titulo={lugar.nombre_lugar}
                descripcion={lugar.descripcion}
                onClick={() => setSelectedCard(lugar)}
              />
            ))
          ) : (
            <p>No hay lugares disponibles</p>
          )}
        </div>
        {/* Modal fuera del grid */}
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
