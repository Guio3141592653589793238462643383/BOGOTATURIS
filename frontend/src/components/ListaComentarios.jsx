import { useState, useEffect } from "react";
import Delete from "../assets/img/delete.png";
import Logo from "../assets/img/BogotaTurisLogo.png";

export default function ListaComentarios({
  usuarioId,
  token,
  nuevoComentario,
}) {
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comentarioAEliminar, setComentarioAEliminar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Cargar comentarios del backend
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
        }
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };

    fetchComentarios();
  }, [usuarioId, token]);

  // 🔹 Agregar el nuevo comentario sin recargar
  useEffect(() => {
    if (nuevoComentario) {
      setComentarios((prev) => [nuevoComentario, ...prev]);
    }
  }, [nuevoComentario]);

  // 🔹 Abrir modal de confirmación
  const eliminarComentario = (id) => {
    console.log("ID a eliminar:", id); // Debug
    setComentarioAEliminar(id);
    setShowModal(true);
    setErrorMessage("");
  };

  // 🔹 Confirmar eliminación
  const confirmarEliminacion = async () => {
    console.log("🟡 Iniciando eliminación...");

    if (!comentarioAEliminar) {
      console.error("⚠️ No hay comentario seleccionado para eliminar.");
      return;
    }

    console.log("🟢 Eliminando comentario con ID:", comentarioAEliminar);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/usuario/comentario/${comentarioAEliminar}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📡 Status de respuesta:", response.status);

      const responseText = await response.text();
      console.log("📥 Respuesta del backend:", responseText);

      if (response.ok) {
        console.log("✅ Comentario eliminado correctamente.");

        // Filtra el comentario eliminado
        setComentarios((prev) =>
          prev.filter((c) => c.id_com !== comentarioAEliminar)
        );

        // Cierra modal de confirmación
        setShowModal(false);

        // Muestra modal de éxito
        setShowSuccessModal(true);

        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else if (response.status === 404) {
        setErrorMessage("❌ El comentario no existe o ya fue eliminado.");
        console.error("❌ Error 404: Comentario no encontrado.");
      } else if (response.status === 401) {
        setErrorMessage("🔒 No autorizado. Token inválido o expirado.");
        console.error("🔒 Error 401: Token inválido.");
      } else {
        console.error("⚠️ Error desconocido del backend:", responseText);
        setErrorMessage(
          "⚠️ No se pudo eliminar el comentario. Intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("🔥 Error de conexión:", error);
      setErrorMessage("🚫 Error de conexión con el servidor.");
    } finally {
      console.log("🧹 Limpieza final, reseteando estado...");
      setComentarioAEliminar(null);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#f8fafc",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            color: "#00376E",
            marginBottom: "10px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Comentarios recientes 💬
        </h3>

        {comentarios.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#5E90A6",
              fontStyle: "italic",
            }}
          >
            Aún no hay comentarios.
          </p>
        ) : (
          comentarios.map((c) => (
            <div
              key={c.id_com}
              style={{
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: "600", color: "#00438F" }}>
                  {c.tipo_com}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#5E90A6",
                    fontStyle: "italic",
                  }}
                >
                  📅{" "}
                  {new Date(c.fecha_com).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <img
                src={Delete}
                alt="Eliminar"
                title="Eliminar comentario"
                style={{
                  width: "22px",
                  height: "22px",
                  cursor: "pointer",
                  opacity: 0.8,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "0.8";
                  e.target.style.transform = "scale(1)";
                }}
                onClick={() => eliminarComentario(c.id_com)}
              />
            </div>
          ))
        )}
      </div>

      {/* 🔹 Modal de confirmación de eliminación */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #00438F 0%, #5E90A6 100%)",
              padding: "30px",
              borderRadius: "16px",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0, 67, 143, 0.6)",
              maxWidth: "380px",
              width: "90%",
              animation: "slideUp 0.4s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "22px",
                marginBottom: "12px",
                fontWeight: "600",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              ⚠️ ¿Eliminar comentario?
            </h3>

            <p
              style={{
                color: "#e0f7fa",
                marginBottom: "20px",
                fontSize: "15px",
                lineHeight: "1.5",
              }}
            >
              Esta acción no se puede deshacer. ¿Estás seguro/a?
            </p>

            {errorMessage && (
              <p
                style={{
                  color: "#ffcccc",
                  backgroundColor: "rgba(231, 76, 60, 0.2)",
                  padding: "8px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  fontSize: "13px",
                }}
              >
                ❌ {errorMessage}
              </p>
            )}

            <div
              style={{ display: "flex", justifyContent: "center", gap: "12px" }}
            >
              <button
                type="button"
                onClick={() => {
                  console.log("CLICK: botón 'Sí, eliminar' pulsado (inline)"); // <- log inmediato
                  confirmarEliminacion();
                }}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c0392b";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#e74c3c";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Sí, eliminar
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setErrorMessage("");
                }}
                style={{
                  backgroundColor: "#ecf0f1",
                  color: "#00376E",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#bdc3c7";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ecf0f1";
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 Modal de éxito */}
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
              <h2 className="success-title">¡Comentario Eliminado!</h2>
              <p className="success-message">
                El comentario se ha eliminado exitosamente
              </p>
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Modal de éxito */
        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-in-out;
        }

        .success-modal-content {
          position: relative;
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 450px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease-out;
        }

        .success-modal-logo-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .modal-logo-watermark {
          width: 400px;
          height: 400px;
          opacity: 0.08;
          object-fit: contain;
          animation: rotateLogo 20s linear infinite;
        }

        @keyframes rotateLogo {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .success-modal-body {
          position: relative;
          z-index: 1;
          padding: 50px 30px 40px;
          text-align: center;
        }

        .success-icon {
          margin: 0 auto 25px;
          width: 80px;
          height: 80px;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #4caf50;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #4caf50;
          animation: fill 0.4s ease-in-out 0.4s forwards,
            scale 0.3s ease-in-out 0.9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke-miterlimit: 10;
          stroke: #4caf50;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scale {
          0%,
          100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }

        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #4caf50;
          }
        }

        .success-title {
          font-size: 28px;
          font-weight: bold;
          color: #2c5282;
          margin-bottom: 15px;
          animation: slideDown 0.5s ease-out 0.3s both;
        }

        .success-message {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 30px;
          animation: slideDown 0.5s ease-out 0.4s both;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-close-btn {
          background: linear-gradient(135deg, #00438f 0%, #5e90a6 100%);
          color: white;
          border: none;
          padding: 12px 40px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: slideDown 0.5s ease-out 0.5s both;
        }

        .success-close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 67, 143, 0.4);
        }

        .success-close-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .success-modal-content {
            width: 95%;
            margin: 20px;
          }

          .success-modal-body {
            padding: 40px 20px 30px;
          }

          .success-title {
            font-size: 24px;
          }

          .success-icon {
            width: 60px;
            height: 60px;
          }

          .checkmark {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </>
  );
}
