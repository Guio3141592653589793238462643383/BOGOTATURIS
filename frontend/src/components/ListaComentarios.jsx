import { useState, useEffect } from "react";
import Delete from "../assets/img/delete.png";

export default function ListaComentarios({ usuarioId, token, nuevoComentario }) {
  const [comentarios, setComentarios] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comentarioAEliminar, setComentarioAEliminar] = useState(null);

  // 🎨 Mostrar notificación bonita
  const showNotification = (message, type = "success", duration = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

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
    setComentarioAEliminar(id);
    setShowModal(true);
  };

  const confirmarEliminacion = async () => {
  if (!comentarioAEliminar) return;

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

    console.log("Código de respuesta:", response.status);

    if (response.ok) {
      // ✅ Filtra el comentario eliminado
      setComentarios((prev) =>
        prev.filter((c) => c.id_com !== comentarioAEliminar)
      );
      showNotification("✅ Comentario eliminado correctamente", "success");
    } else {
      const errorData = await response.text();
      console.error("Error del backend:", errorData);
      showNotification("❌ No se pudo eliminar el comentario", "error");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    showNotification("⚠️ Error de conexión al servidor", "error");
  } finally {
    setShowModal(false);
    setComentarioAEliminar(null);
  }
};


  return (
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
            key={c.id_com || c.id || c.fecha_com}
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
              }}
              onClick={() => eliminarComentario(c.id_com || c.id || c.idComentario)}
            />
          </div>
        ))
      )}

      {/* 🔹 Modal de confirmación */}
      {showModal && (
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
              padding: "30px",
              borderRadius: "16px",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0, 67, 143, 0.6)",
              maxWidth: "380px",
              width: "90%",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontWeight: "600",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              ¿Eliminar comentario?
            </h3>

            <p
              style={{
                color: "#e0f7fa",
                marginBottom: "22px",
                fontSize: "15px",
              }}
            >
              Esta acción no se puede deshacer. ¿Estás segura?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={confirmarEliminacion}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Sí, eliminar
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#ccc",
                  color: "#00376E",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
