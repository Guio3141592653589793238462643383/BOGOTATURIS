import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/UserView.css";

export default function CrearComentario({onComentarioCreado }) {
  const [tipo, setTipo] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const usuarioId = userId || localStorage.getItem("usuario_id");

useEffect(() => {
  // Si se usa dentro de un modal, no redirige
  if (!usuarioId || !token) {
    if (!onComentarioCreado) {
      navigate("/login");
    }
  }
}, [usuarioId, token, navigate, onComentarioCreado]);


const handleSubmit = async (e) => {
  e.preventDefault();

if (!tipo.trim()) {
  setNotification({
    type: "error",
    message: "⚠️ Por favor completa todos los campos.",
  });
  return;
}


const fechaActual = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
const nuevoComentario = {
  tipo_com: tipo,
  fecha_com: fechaActual,
  id_usuario: parseInt(usuarioId),
};


    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/usuario/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoComentario),
      });

      const data = await res.json();

if (res.ok) {
  setNotification({
    type: "success",
    message: "✅ ¡Comentario creado con éxito!",
  });
  onComentarioCreado(data); // 🔹 Notifica al padre
  setTipo("");


      } else {
        throw new Error(data.detail || "No se pudo crear el comentario");
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };


return (
  <div className="comentario-wrapper">
    <div className="comentario-box">
      <h1>Crear Comentario 💬</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Tipo de comentario:</label>
          <input
            type="text"
            placeholder="Escribe tu opinión o sugerencia..."
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Guardando...
            </>
          ) : (
            "Guardar Comentario"
          )}
        </button>
      </form>

      {notification && (
        <div
          className={`alert ${
            notification.type === "success"
              ? "success-alert"
              : "error-alert"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  </div>
);
}
