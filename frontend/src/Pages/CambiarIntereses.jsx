import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/UserView.css";
import NavbarView from "../components/NavbarView";
import Logo from "../assets/img/BogotaTurisLogo.png";
import bogotaNight from "../assets/img/bogota-night.jpg";
import Footer from "../components/Footer.jsx";

export default function CambiarIntereses() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [usuarioData, setUsuarioData] = useState(null);
  const [error, setError] = useState(null);
  const [interesesDisponibles, setInteresesDisponibles] = useState([]);
  const [interesesUsuario, setInteresesUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🔹 Obtener datos del usuario
  const fetchUsuarioData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/usuario/perfil/${usuarioId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsuarioData(data);
      } else {
        setError("No se pudo cargar el perfil.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  // 🔹 Refrescar datos (usado por NavbarView)
  const refreshUserData = useCallback(() => {
    if (usuarioId) fetchUsuarioData();
  }, [usuarioId, fetchUsuarioData]);

  // 🔹 Emojis por categoría
  const emojiMap = {
    Museos: "🏛️",
    Arte: "🎨",
    Teatro: "🎭",
    Historia: "📚",
    Cultura: "🎪",
    Patrimonio: "🏰",
    Naturaleza: "🌿",
    talleres: "🌺",
    yoga: "🦋",
    gastronomia: "🍽️",
    Restaurantes: "🍴",
    Cocina: "🥘",
    Café: "☕",
    Mercados: "🛒",
    "Vida Nocturna": "🌃",
    Bares: "🍺",
    discotecas: "🍺",
    concursos: "💃",
    danza: "💃",
    Música: "🎵",
    Conciertos: "🎤",
    Deportes: "⚽",
    Ciclismo: "🚴",
    escalada: "🥾",
    aventureros: "🧗",
    Compras: "🛍️",
    festivales: "🏬",
    eventos: "🎁",
    Cine: "🎬",
    Fotografía: "📸",
    Arquitectura: "🏗️",
    Turismo: "✈️",
    Religioso: "⛪",
  };

  const getEmojiForInteres = (interesNombre) => {
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (interesNombre.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
  };

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    const fetchTodo = async () => {
try {
  if (!usuarioData) setLoading(true);
  const [perfilRes, interesesRes, usuarioInteresesRes] = await Promise.all([
    fetch(`http://localhost:8000/api/usuario/perfil/${usuarioId}`),
    fetch("http://localhost:8000/api/usuario/intereses"),
    fetch(`http://localhost:8000/api/usuario/intereses/${usuarioId}`),
  ]);


        const [perfilData, interesesData, usuarioInteresesData] =
          await Promise.all([
            perfilRes.json(),
            interesesRes.json(),
            usuarioInteresesRes.json(),
          ]);

        if (perfilRes.ok) setUsuarioData(perfilData);
        if (interesesRes.ok) setInteresesDisponibles(interesesData);
        if (usuarioInteresesRes.ok) setInteresesUsuario(usuarioInteresesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [usuarioId, navigate]);

  // 🔹 Manejar selección
  const handleToggle = (interesId) => {
    setInteresesUsuario((prev) =>
      prev.includes(interesId)
        ? prev.filter((id) => id !== interesId)
        : [...prev, interesId]
    );
  };

  // 🔹 Enviar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/usuario/actualizar-intereses/${usuarioId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intereses: interesesUsuario }),
        }
      );

      if (res.ok) {
        setShowSuccessModal(true);
        setMensaje("Intereses actualizados correctamente");
        refreshUserData();
      } else {
        setMensaje("Error al actualizar intereses");
      }
    } catch (error) {
      console.error("Error enviando intereses:", error);
      setMensaje("Error de conexión al actualizar");
    }
  };

  // 🔹 Renderizado condicional
  if (loading && !usuarioData) {
    return (
      <>
        <NavbarView
          usuarioData={usuarioData}
          onRefreshUserData={refreshUserData}
        />
        <div
          className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d]"
          style={{
            backgroundImage: `url(${bogotaNight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
            <div className="form-container1 intereses-container">
              <h2 className="form-title">Cargando intereses...</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <span className="spinner" />
                <p style={{ fontSize: "0.95rem", color: "#002855", margin: 0 }}>
                  Por favor espera un momento mientras preparamos tus preferencias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  }

  const mitad = Math.ceil(interesesDisponibles.length / 2);
  const primeraColumna = interesesDisponibles.slice(0, mitad);
  const segundaColumna = interesesDisponibles.slice(mitad);

  return (
    <>
      <NavbarView
        usuarioData={usuarioData}
        onRefreshUserData={refreshUserData}
      />
      <div
        className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d]"
        style={{
          backgroundImage: `url(${bogotaNight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-5xl flex justify-center">
            <div className="form-container1 intereses-container">
              <h2 className="form-title">Cambiar Intereses</h2>

              <div className="intereses-counter">
                <span className="counter-badge">
                  {interesesUsuario.length}{" "}
                  {interesesUsuario.length === 1
                    ? "interés seleccionado"
                    : "intereses seleccionados"}
                </span>
              </div>

              {mensaje && <p className="mensaje1">{mensaje}</p>}

              <form onSubmit={handleSubmit}>
                <div className="tablas-container">
            {/* TABLA IZQUIERDA */}
            <div className="tabla-columna">
              <table className="tabla-intereses">
                <tbody>
                  {primeraColumna.map((interes) => {
                    const isSelected = interesesUsuario.includes(
                      interes.id_inte
                    );
                    const emoji = getEmojiForInteres(interes.interes);

                    return (
                      <tr
                        key={interes.id_inte}
                        className={`interes-row ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleToggle(interes.id_inte)}
                      >
                        <td
                          className="checkbox-col"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            value={interes.id_inte}
                            checked={isSelected}
                            onChange={() => handleToggle(interes.id_inte)}
                          />
                        </td>
                        <td className="emoji-col">
                          <span className="emoji-icon">{emoji}</span>
                        </td>
                        <td className="texto-col">
                          <span className="interes-text">
                            {interes.interes}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABLA DERECHA */}
            <div className="tabla-columna">
              <table className="tabla-intereses">
                <tbody>
                  {segundaColumna.map((interes) => {
                    const isSelected = interesesUsuario.includes(
                      interes.id_inte
                    );
                    const emoji = getEmojiForInteres(interes.interes);

                    return (
                      <tr
                        key={interes.id_inte}
                        className={`interes-row ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleToggle(interes.id_inte)}
                      >
                        <td
                          className="checkbox-col"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            value={interes.id_inte}
                            checked={isSelected}
                            onChange={() => handleToggle(interes.id_inte)}
                          />
                        </td>
                        <td className="emoji-col">
                          <span className="emoji-icon">{emoji}</span>
                        </td>
                        <td className="texto-col">
                          <span className="interes-text">
                            {interes.interes}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
                </div>

                <button
                  type="submit"
                  className="form-submit-btn1 mt-6"
                  disabled={interesesUsuario.length === 0}
                  style={{
                    opacity: interesesUsuario.length === 0 ? 0.5 : 1,
                    cursor:
                      interesesUsuario.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Guardar Intereses ({interesesUsuario.length})
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 🎉 MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div
          className="success-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="success-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-modal-logo-bg">
              <img
                src={Logo}
                alt="BogotaTuris"
                className="modal-logo-watermark"
              />
            </div>
            <div className="success-modal-body">
              <div className="success-icon">
                <svg viewBox="0 0 52 52" className="checkmark">
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h2 className="success-title">¡Intereses Actualizados!</h2>
              <p className="success-message">
                Tus preferencias se han guardado exitosamente
              </p>
              <div className="intereses-summary">
                <span className="summary-count">{interesesUsuario.length}</span>
                <span className="summary-text">
                  {interesesUsuario.length === 1
                    ? "interés seleccionado"
                    : "intereses seleccionados"}
                </span>
              </div>
              <button
                className="success-close-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
