import "../assets/css/UserView.css";
import { useEffect, useState, useCallback } from "react";
import Card from "../Pages/Card";
import Modal from "../Pages/Modal";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Chatbot from "../components/ChatBot";
import NavbarView from "../components/NavbarView";
import Footer from "../components/Footer.jsx";

export default function UserView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [selectedCard, setSelectedCard] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargandoRecomendaciones, setCargandoRecomendaciones] = useState(true);
  const [errorRecomendaciones, setErrorRecomendaciones] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar las recomendaciones por nombre
  const filteredRecomendaciones = recomendaciones.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
  const fetchRecomendaciones = async () => {
    if (!usuarioId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/recomendaciones/${usuarioId}`);
      if (!response.ok) throw new Error("Error al cargar recomendaciones");
      const data = await response.json();
      setRecomendaciones(data);
    } catch (error) {
      console.error("💥 Error al traer recomendaciones:", error);
      setErrorRecomendaciones("No se pudieron cargar las recomendaciones");
    } finally {
      setCargandoRecomendaciones(false);
    }
  };

  fetchRecomendaciones();
}, [usuarioId]);

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
     <div className="promo-section px-6">
  {/* Sección de Bienvenida */}
  <motion.h2
    className="text-4xl font-bold text-[#00438F] mb-4 text-center"
    style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}
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
    className="text-gray-700 mb-10 text-lg text-center"
    style={{ fontFamily: "Poppins, sans-serif" }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.3 }}
    whileHover={{
      scale: 1.03,
      textShadow: "0px 0px 10px rgba(0,0,0,0.3)",
    }}
  >
    Hemos seleccionado estos lugares especialmente para ti. ¡Explora y 
    disfruta tu próxima aventura!
  </motion.p>

  {/* Header con ícono, título y línea - Similar a la imagen */}
  <div className="flex items-center gap-4 mb-8 mt-12">
    {/* Ícono */}
    <div className="flex-shrink-0">
      <svg 
        className="w-12 h-12 text-[#00438F]" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
        />
      </svg>
    </div>
    
    {/* Título */}
    <motion.h2
    className="text-4xl font-bold text-[#00438F] mb-4 text-center"
    style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    whileHover={{
      scale: 1.08,
      textShadow:
        "0px 0px 15px rgba(0,67,143,0.7), 0px 0px 25px rgba(0,0,0,0.4)",
    }}
  >
      Recomendaciones para ti
    </motion.h2>
    
    {/* Línea horizontal */}
    <div className="flex-grow h-[4px] bg-[#00438F]"></div>
<div className="w-full flex justify-center mb-4 mt-2">
  <input
    type="text"
    placeholder="Buscar lugar..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-1/2 px-4 py-2 border border-[#00438F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00438F] focus:border-transparent transition-all duration-200 placeholder-gray-500 shadow-sm"
  />
</div>
  </div>


  {cargandoRecomendaciones ? (
  <p className="text-center text-gray-600">Cargando recomendaciones...</p>
) : errorRecomendaciones ? (
  <p className="text-center text-red-600">{errorRecomendaciones}</p>
) : recomendaciones.length > 0 ? (
  <>
    <div className="cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {recomendaciones
        .filter((lugar) =>
          lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((lugar) => (
          <Card
            key={`rec-${lugar.id_lugar}`}
            imagen={lugar.imagen_url || "/default-image.png"}
            titulo={lugar.nombre}
            descripcion={lugar.descripcion}
            onClick={() =>
    setSelectedCard({
      ...lugar,
      hora_aper: lugar.hora_aper,
      hora_cierra: lugar.hora_cierra,
      precios: lugar.precios,
      direccion: lugar.direccion
    })
  }
          />
        ))}
    </div>

    {/* Si no hay coincidencias con el filtro */}
    {recomendaciones.filter((lugar) =>
      lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ).length === 0 && searchTerm !== "" && (
      <p className="text-center text-gray-600 mt-4">
        No se encontraron lugares con ese nombre.
      </p>
    )}
  </>
) : (
  <p className="text-center text-gray-600">
    No hay recomendaciones personalizadas por ahora.
  </p>
)}
</div>
      {/* Modal fuera del grid */}
      <Modal
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        card={selectedCard}
      />
    <Chatbot />
    <Footer />
  </>
);
}
