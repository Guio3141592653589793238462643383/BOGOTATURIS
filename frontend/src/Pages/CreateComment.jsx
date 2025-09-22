import { useState, useEffect } from "react";
import logoUser from "../assets/img/user.png";
import Delete from "../assets/img/delete.png";
import Logo from "../assets/img/BogotaTurisLogo.png";
import { useParams, useNavigate } from "react-router-dom";

function ComentariosNuevo() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comentarioAEliminar, setComentarioAEliminar] = useState(null);

  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false); // 🔧 Cambiar a false por defecto
  const [error, setError] = useState(null);
  
  // 🎨 Estados para notificaciones bonitas
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem("token");

  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const handleInicio = () => {
    navigate(`/usuario/${usuarioId}/`);
  };

  // 🎨 Función para mostrar notificaciones bonitas
  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // 🔧 Cargar datos del usuario de forma optimizada
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
        setUsuarioData(parsedUser);
        console.log("✅ [COMENTARIOS] Datos cargados desde localStorage");
        return; // 🔧 Si tenemos datos guardados, no hacer fetch
      } catch (error) {
        console.log("❌ [COMENTARIOS] Error parseando localStorage, buscando en servidor");
        localStorage.removeItem("usuarioData");
      }
    }

    // 2️⃣ Solo hacer fetch si no hay datos guardados
    const fetchUsuarioData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/usuario/perfil/${usuarioId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
          localStorage.setItem("usuarioData", JSON.stringify(data)); // 🔧 Guardar en localStorage
          console.log("✅ [COMENTARIOS] Datos cargados desde servidor");
        } else {
          setError("No se pudo cargar el perfil.");
        }
      } catch {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioData();
  }, [usuarioId, navigate]);

  // 🔧 Escuchar actualizaciones del usuario desde otros componentes
  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      if (event.detail) {
        setUsuarioData(event.detail);
        console.log("✅ [COMENTARIOS] Datos actualizados desde evento");
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  // 🔧 Cargar comentarios
  useEffect(() => {
    if (!usuarioId || !token) return;

    const fetchComentarios = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/usuario/comentarios/${usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setComentarios(data);
          console.log("✅ [COMENTARIOS] Comentarios cargados");
        } else {
          console.error("Error al cargar comentarios");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    fetchComentarios();
  }, [usuarioId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔧 Validaciones mejoradas
    if (!usuarioId) {
      showNotification("Debes iniciar sesión antes de comentar", "error");
      return;
    }

    if (!token) {
      showNotification("Token de autenticación no encontrado. Inicia sesión nuevamente", "error");
      navigate("/login");
      return;
    }

    if (!tipo.trim()) {
      showNotification("Por favor selecciona un tipo de comentario", "warning");
      return;
    }

    if (!fecha.trim()) {
      showNotification("Por favor selecciona una fecha", "warning");
      return;
    }

    console.log("🚀 [COMENTARIO] Enviando datos:", {
      tipo_com: tipo,
      fecha_com: fecha,
      id_usuario: parseInt(usuarioId),
    });

    const comentarioData = {
      tipo_com: tipo,
      fecha_com: fecha,
      id_usuario: parseInt(usuarioId),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/usuario/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comentarioData),
      });

      console.log("📡 [COMENTARIO] Respuesta del servidor:", res.status);

      // 🔧 Verificar si la respuesta es JSON válida
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        console.log("📄 [COMENTARIO] Datos de respuesta:", data);
      } else {
        const textResponse = await res.text();
        console.log("📄 [COMENTARIO] Respuesta de texto:", textResponse);
        throw new Error("La respuesta del servidor no es JSON válido");
      }

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || `Error del servidor: ${res.status}`);
      }

      // 🎉 Éxito
      showNotification("¡Comentario guardado exitosamente! 🎉", "success");
      console.log("✅ [COMENTARIO] Comentario guardado:", data);
      
      // 🔧 Actualizar la lista de comentarios
      setComentarios((prev) => [...prev, data]);
      
      // 🧹 Limpiar formulario
      setTipo("");
      setFecha("");

    } catch (error) {
      console.error("💥 [COMENTARIO] Error completo:", error);
      console.error("💥 [COMENTARIO] Mensaje de error:", error.message);
      
      // 🔧 Mostrar error más específico
      if (error.message.includes("Failed to fetch")) {
        showNotification("Error de conexión con el servidor. Verifica tu internet", "error");
      } else if (error.message.includes("401")) {
        showNotification("Tu sesión ha expirado. Inicia sesión nuevamente", "error");
        navigate("/login");
      } else {
        showNotification(`No se pudo guardar el comentario: ${error.message}`, "error");
      }
    }
  };

  // 🔧 Solo mostrar loading si realmente está cargando Y no hay datos
  if (loading && !usuarioData) {
    return (
      <div className="loading-container" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column"
      }}>
        <div className="loading-spinner" style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite",
          marginBottom: "15px"
        }}></div>
        <h2>Cargando perfil...</h2>
      </div>
    );
  }

  // 🔧 Si hay error y no hay datos, mostrar error
  if (error && !usuarioData) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column"
      }}>
        <h2 className="text-red-500">❌ {error}</h2>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const eliminarComentario = async (id) => {
    const confirmar = window.confirm(
      "¿Estás segura de que quieres eliminar este comentario?"
    );
    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/usuario/comentario/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setComentarios(comentarios.filter((c) => c.id_com !== id));
        console.log("✅ [COMENTARIOS] Comentario eliminado");
        showNotification("Comentario eliminado correctamente", "success");
      } else {
        console.error("Error al eliminar comentario");
        showNotification("Error al eliminar comentario", "error");
      }
    } catch (error) {
      console.error("Error de red:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const confirmarEliminacion = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/usuario/comentario/${comentarioAEliminar}`, 
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setComentarios(comentarios.filter((c) => c.id_com !== comentarioAEliminar));
        setMostrarModal(false);
        setComentarioAEliminar(null);
        console.log("✅ [COMENTARIOS] Comentario eliminado via modal");
        showNotification("Comentario eliminado correctamente", "success");
      } else {
        console.error("Error al eliminar comentario");
        showNotification("Error al eliminar comentario", "error");
      }
    } catch (error) {
      console.error("Error de red:", error);
      showNotification("Error de conexión", "error");
    }
  };

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
                  <a className="dropdown-item" onClick={handleInicio}>
                    inicio
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div
        style={{
          display: "flex",
          gap: "24px",
          maxWidth: "900px",
          margin: "auto",
          marginTop: "40px",
        }}
      >
        {/* Formulario a la izquierda */}
        <div style={{ flex: 1 }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "linear-gradient(135deg, #00438F 0%, #5E90A6 100%)",
              padding: "24px",
              borderRadius: "16px",
              color: "#f0f4f8",
              boxShadow: "0 6px 18px rgba(0, 67, 143, 0.5)",
            }}
          >
            <h2
              style={{
                marginBottom: "16px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Crear Comentario
            </h2>
            <input
              type="text"
              placeholder="Tipo de comentario"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: "2.5px solid #5E90A6",
                fontSize: "1rem",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "10px",
                border: "2.5px solid #5E90A6",
                fontSize: "1rem",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #5E90A6 0%, #00438F 100%)",
                color: "#f0f4f8",
                fontWeight: "700",
                padding: "12px 0",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(0, 67, 143, 0.5)",
                transition: "background 0.4s ease",
              }}
            >
              Guardar Comentario
            </button>
          </form>
        </div>

        {/* Comentarios a la derecha */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h3>Comentarios</h3>
          {comentarios.length === 0 ? (
            <p>No hay comentarios aún.</p>
          ) : (
            comentarios.map((c, i) => (
              <div
                key={c.id_com}
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p>
                  <strong>Tipo:</strong> {c.tipo_com}
                </p>
                <p>
                  <strong>Fecha:</strong> {c.fecha_com}
                </p>
                <img
                  src={Delete}
                  alt="icono de eliminar"
                  style={{
                    cursor: "pointer",
                    width: "24px",
                    marginRight: "8px",
                  }}
                  onClick={() => {
                    setComentarioAEliminar(c.id_com);
                    setMostrarModal(true);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
      {mostrarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #00438F 0%, #5E90A6 100%)",
              padding: "24px",
              borderRadius: "16px",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0, 67, 143, 0.5)",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>¿Eliminar comentario?</h3>
            <p style={{ marginBottom: "20px" }}>
              Esta acción no se puede deshacer. ¿Estás segura?
            </p>
            <button
              onClick={() => confirmarEliminacion()}
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                marginRight: "12px",
                cursor: "pointer",
              }}
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setMostrarModal(false)}
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ComentariosNuevo;
