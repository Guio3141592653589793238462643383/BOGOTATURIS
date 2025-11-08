import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Send,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function Modal({ open, onClose, card, lugar }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [comentarioEditId, setComentarioEditId] = useState(null);
  const [modoEdicionAlerta, setModoEdicionAlerta] = useState(false);
  const [alertaEditId, setAlertaEditId] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [modo, setModo] = useState("comentarios");
  const [nuevoAlerta, setNuevoAlerta] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // 🧁 Sistema de toasts (notificaciones flotantes)
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const usuarioId = parseInt(localStorage.getItem("usuario_id"));
  const token = localStorage.getItem("token");

  // ✅ Cargar comentarios
  useEffect(() => {
    if (!card || !open || !card?.id_lugar) return;

    const fetchComentarios = async () => {
      setLoadingComentarios(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/usuario/lugares/${card.id_lugar}/comentarios`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setComentarios(data);
        } else {
          console.error("Error al obtener comentarios:", response.status);
        }
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setLoadingComentarios(false);
      }
    };

    fetchComentarios();
  }, [open, card?.id_lugar, token]);

  // ✅ Crear nuevo comentario
  const handleSubmitComentario = async (e) => {
    e.preventDefault();

    if (!nuevoComentario.trim() || calificacion === 0) {
      showToast("Por favor completa el comentario y la calificación", "error");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (modoEdicion && comentarioEditId) {
        response = await fetch(
          `http://127.0.0.1:8000/api/usuario/comentario/${comentarioEditId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tipo_com: nuevoComentario,
              calificacion,
            }),
          }
        );
      } else {
        response = await fetch(
          "http://127.0.0.1:8000/api/usuario/comentarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tipo_com: nuevoComentario,
              calificacion,
              id_usuario: usuarioId,
              id_lugar: card.id_lugar,
            }),
          }
        );
      }

      if (response.ok) {
        const data = await response.json();

        if (modoEdicion) {
          setComentarios((prev) =>
            prev.map((c) =>
              c.id_com === comentarioEditId
                ? {
                    ...c,
                    tipo_com: nuevoComentario,
                    calificacion,
                    editado: true,
                  }
                : c
            )
          );
          showToast(" Comentario actualizado", "success");
        } else {
          const comentarioConUsuario = {
            ...data,
            nombre: localStorage.getItem("primer_nombre"),
            apellido: localStorage.getItem("primer_apellido"),
          };
          setComentarios([comentarioConUsuario, ...comentarios]);
          showToast(" Comentario publicado exitosamente", "success");
        }

        setNuevoComentario("");
        setCalificacion(0);
        setModoEdicion(false);
        setComentarioEditId(null);
      } else {
        const error = await response.json();
        showToast(
          `❌ Error: ${error.detail || "No se pudo publicar el comentario"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error al crear/actualizar comentario:", error);
      showToast("❌ Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Eliminar comentario
  const handleEliminarComentario = async (id_com) => {
    setConfirmMessage("¿Deseas eliminar este comentario?");
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/usuario/comentarios/${id_com}?id_usuario=${usuarioId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setComentarios(comentarios.filter((c) => c.id_com !== id_com));
          showToast("🗑️ Comentario eliminado", "success");
        } else if (response.status === 404) {
          showToast(
            "❌ No tienes permiso para eliminar este comentario",
            "error"
          );
        } else {
          showToast("❌ Error al eliminar el comentario", "error");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        showToast("❌ Error de conexión", "error");
      }
    });
    setConfirmOpen(true);
  };

  // ✅ Cargar alertas
  useEffect(() => {
    if (open && card?.id_lugar) {
      fetchAlertas();
    }
  }, [open, card?.id_lugar]);

  const fetchAlertas = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/usuario/lugares/${card.id_lugar}/alertas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setAlertas(data);
      } else {
        console.error("Error al cargar las alertas:", response.status);
      }
    } catch (error) {
      console.error("Error al obtener alertas:", error);
    }
  };

  // ✅ Crear alerta
  const handleSubmitAlerta = async () => {
    if (!nuevoAlerta.trim()) {
      showToast("Por favor escribe la alerta", "error");
      return;
    }

    try {
      let response;

      if (modoEdicionAlerta && alertaEditId) {
        response = await fetch(
          `http://127.0.0.1:8000/api/usuario/alerta/${alertaEditId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tipo_aler: nuevoAlerta }),
          }
        );
      } else {
        response = await fetch("http://127.0.0.1:8000/api/usuario/alertas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tipo_aler: nuevoAlerta,
            id_lugar: card.id_lugar,
            id_usuario: usuarioId,
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();

        if (modoEdicionAlerta) {
          setAlertas((prev) =>
            prev.map((a) =>
              a.id_alerta === alertaEditId
                ? { ...a, tipo_aler: nuevoAlerta }
                : a
            )
          );
          showToast("✏️ Alerta actualizada", "success");
        } else {
          await fetchAlertas();
          showToast("🚨 Alerta registrada correctamente", "success");
        }

        setNuevoAlerta("");
        setModoEdicionAlerta(false);
        setAlertaEditId(null);
      } else {
        showToast("❌ Error al registrar/actualizar alerta", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("❌ Error de conexión", "error");
    }
  };

  const handleActualizarComentario = (id_com) => {
    const comentario = comentarios.find((c) => c.id_com === id_com);
    if (!comentario) return;

    setNuevoComentario(comentario.tipo_com);
    setCalificacion(comentario.calificacion);
    setComentarioEditId(id_com);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ⭐ Renderizar estrellas
  const renderStars = (rating, isInteractive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={isInteractive ? 24 : 16}
          className={`transition-all duration-200 ${
            isInteractive ? "cursor-pointer" : ""
          }`}
          fill={
            star <= (isInteractive ? hoverStar || calificacion : rating)
              ? "#FFD700"
              : "none"
          }
          stroke={
            star <= (isInteractive ? hoverStar || calificacion : rating)
              ? "#FFD700"
              : "#cbd5e0"
          }
          onClick={() => isInteractive && setCalificacion(star)}
          onMouseEnter={() => isInteractive && setHoverStar(star)}
          onMouseLeave={() => isInteractive && setHoverStar(0)}
        />
      ))}
    </div>
  );

  // 🌟 Toast visual component
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
              type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : type === "error"
                ? "bg-gradient-to-r from-red-500 to-rose-600"
                : type === "warning"
                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
          >
            {type === "success" && <CheckCircle2 size={18} />}
            {type === "error" && <XCircle size={18} />}
            {type === "warning" && <AlertTriangle size={18} />}
            {type === "info" && <Info size={18} />}
            <span>{message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* LADO IZQUIERDO: Imagen y descripción */}
              <div className="w-1/2 flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
                <div className="relative h-2/3 overflow-hidden group">
                  <motion.img
                    src={
                      card.imagen_url?.startsWith("http")
                        ? card.imagen_url
                        : `http://localhost:8000/${card.imagen_url}`
                    }
                    alt={card.nombre}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent"></div>
                  
                  {/* Título flotante sobre la imagen */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-6 left-6 right-6"
                  >
                    <h2 className="text-3xl font-black text-white drop-shadow-2xl tracking-tight">
                      {card.nombre}
                    </h2>
                  </motion.div>
                </div>

                <div className="flex-1 px-6 py-4 bg-gradient-to-b from-blue-900/50 to-blue-950/80 overflow-y-auto">
                  <h3 className="text-lg font-extrabold text-white mb-3 flex items-center gap-2.5 drop-shadow-lg tracking-tight">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    Descripción
                  </h3>
                  <p className="text-white/95 leading-relaxed text-sm drop-shadow-md font-normal tracking-normal mb-4">
                    {card.descripcion}
                  </p>

                  {/* Botón Ver más detalles */}
                  <motion.button
                    onClick={() => setMostrarDetalles(!mostrarDetalles)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 backdrop-blur-sm border border-cyan-400/40 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <Info size={18} className="text-cyan-300" />
                      {mostrarDetalles ? "Ocultar detalles" : "Ver más detalles"}
                    </span>
                    <motion.div
                      animate={{ rotate: mostrarDetalles ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-cyan-300" />
                    </motion.div>
                  </motion.button>

                  {/* Detalles expandibles con animación */}
                  <AnimatePresence>
                    {mostrarDetalles && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 mb-4">
                          {/* Dirección */}
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                              <MapPin size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-cyan-300 mb-1">Dirección</p>
                              <p className="text-sm text-white font-medium leading-snug">{card.direccion}</p>
                            </div>
                          </motion.div>

                          {/* Horario */}
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Clock size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-purple-300 mb-1">Horario</p>
                              <p className="text-sm text-white font-medium">
                                {card.hora_aper} - {card.hora_cierra}
                              </p>
                            </div>
                          </motion.div>

                          {/* Precios */}
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                              <DollarSign size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-300 mb-1">Precio</p>
                              <p className="text-sm text-white font-medium">${card.precios}</p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* LADO DERECHO: Comentarios / Alertas */}
              <div className="w-1/2 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/50 perspective-[2000px]">
                {/* Encabezado con pestañas mejorado */}
                <div className="px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200/80 flex justify-between items-center">
                  <div className="flex gap-6">
                    <motion.h3
                      onClick={() => setModo("comentarios")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative text-lg font-bold cursor-pointer transition-all duration-300 ${
                        modo === "comentarios"
                          ? "text-blue-700 drop-shadow-sm after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-blue-600 after:rounded-full"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      Comentarios{" "}
                      <span className="text-base text-gray-500">
                        ({comentarios.length})
                      </span>
                    </motion.h3>

                    <motion.h3
                      onClick={() => setModo("alertas")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative text-lg font-bold cursor-pointer transition-all duration-300 ${
                        modo === "alertas"
                          ? "text-red-600 drop-shadow-sm after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-red-600 after:rounded-full"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      ⚠️ Alertas{" "}
                      <span className="text-base text-gray-500">
                        ({alertas?.length || 0})
                      </span>
                    </motion.h3>
                  </div>
                </div>

                {/* Contenedor giratorio */}
                <div className="relative flex-1 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 w-full h-full transition-transform"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: modo === "alertas" ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    {/* Cara frontal → COMENTARIOS */}
                    <div className="absolute inset-0 backface-hidden flex flex-col">
                      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {loadingComentarios ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative">
                              <Loader2
                                className="animate-spin text-blue-500"
                                size={48}
                              />
                              <div className="absolute inset-0 animate-ping">
                                <Loader2
                                  className="text-blue-300 opacity-30"
                                  size={48}
                                />
                              </div>
                            </div>
                            <p className="text-gray-600 mt-4 font-medium">
                              Cargando comentarios...
                            </p>
                          </div>
                        ) : comentarios.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                              <Send size={32} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-500">
                              Aún no hay comentarios
                            </p>
                            <p className="text-sm text-gray-400">
                              ¡Sé el primero en compartir tu experiencia!
                            </p>
                          </div>
                        ) : (
                          <AnimatePresence mode="popLayout">
                            {comentarios.map((comentario) => (
                              <motion.div
                                key={comentario.id_com}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-blue-100 transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
                                    {comentario.nombre?.[0]?.toUpperCase() ||
                                      "?"}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-[15px] truncate">
                                      {comentario.nombre || "Usuario"}{" "}
                                      {comentario.apellido || ""}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                      {new Date(
                                        comentario.fecha_com
                                      ).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  {comentario.editado && (
                                    <div className="inline-flex items-center gap-1 mb-2 text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full text-xs font-semibold w-fit">
                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                      Editado
                                    </div>
                                  )}

                                  {comentario.id_usuario === usuarioId && (
                                    <motion.button
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEliminarComentario(
                                          comentario.id_com
                                        );
                                      }}
                                      type="button"
                                      className="!w-9 !h-9 !min-w-[36px] !max-w-[36px] !min-h-[36px] !max-h-[36px] rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white inline-flex items-center justify-center flex-shrink-0 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md !p-0"
                                      title="Eliminar comentario"
                                      aria-label="Eliminar comentario"
                                    >
                                      <Trash2
                                        size={16}
                                        strokeWidth={2.5}
                                        className="pointer-events-none"
                                      />
                                    </motion.button>
                                  )}
                                  {comentario.id_usuario === usuarioId && (
                                    <motion.button
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActualizarComentario(
                                          comentario.id_com
                                        );
                                      }}
                                      type="button"
                                      className="!w-9 !h-9 !min-w-[36px] !max-w-[36px] !min-h-[36px] !max-h-[36px] rounded-full bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white inline-flex items-center justify-center flex-shrink-0 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md !p-0"
                                      title="Actualizar comentario"
                                      aria-label="Actualizar comentario"
                                    >
                                      <RefreshCw
                                        size={16}
                                        strokeWidth={2.5}
                                        className="pointer-events-none"
                                      />
                                    </motion.button>
                                  )}
                                </div>

                                <p className="text-gray-700 mb-3 leading-relaxed text-[15px]">
                                  {comentario.tipo_com}
                                </p>

                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-xl w-fit border border-amber-100">
                                  <div className="flex gap-0.5">
                                    {renderStars(comentario.calificacion)}
                                  </div>
                                  <span className="text-sm font-semibold text-amber-700 ml-1">
                                    {comentario.calificacion}/5
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                      </div>

                      <div className="p-2 bg-white/80 backdrop-blur-sm border-t border-gray-200">
  <div className="space-y-1.5">
    <label className="block text-[10px] font-semibold text-gray-800 mb-1 flex items-center gap-1">
      <div className="w-0.5 h-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
      Tu comentario
    </label>

    <textarea
      value={nuevoComentario}
      onChange={(e) => setNuevoComentario(e.target.value)}
      placeholder="Comparte tu experiencia..."
      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-[12px] leading-snug"
      rows="2"
      disabled={loading}
    />

    <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-2 py-1.5 rounded-md border border-amber-200/50 text-[12px]">
      {renderStars(calificacion, true)}
    </div>

    <motion.button
      onClick={handleSubmitComentario}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      disabled={loading}
      type="button"
      className={`w-full font-semibold py-1.5 rounded-md shadow-md transition-all inline-flex items-center justify-center gap-1.5 text-[11px] ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white hover:shadow-lg hover:from-blue-700 hover:via-blue-800 hover:to-purple-800"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={14} />{" "}
          {modoEdicion ? "Actualizando..." : "Publicando..."}
        </>
      ) : (
        <>
          {modoEdicion ? (
            <>
              <RefreshCw size={14} /> Actualizar
            </>
          ) : (
            <>
              <Send size={14} /> Publicar
            </>
          )}
        </>
      )}
    </motion.button>
  </div>
</div>
                    </div>

                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-red-50 to-red-100/70 flex flex-col">
                      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                        {alertas && alertas.length > 0 ? (
                          alertas.map((alerta) => (
                            <motion.div
                              key={alerta.id_alerta}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white border border-red-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-red-100 transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
                                  {alerta.usuario?.[0]?.toUpperCase() || "?"}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-[15px] truncate">
                                    {alerta.usuario || "Usuario desconocido"}
                                  </p>
                                  {alerta.fecha && (
                                    <p className="text-xs text-gray-500 font-medium">
                                      {new Date(
                                        alerta.fecha
                                      ).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="pl-[3.3rem]">
                                <p className="text-sm font-medium text-red-700 leading-tight">
                                  🚨 {alerta.tipo_aler}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <AlertTriangle
                              size={40}
                              className="text-red-400 mb-2"
                            />
                            <p className="font-semibold text-gray-600">
                              No hay alertas
                            </p>
                            <p className="text-xs text-gray-400">
                              Puedes crear una nueva alerta abajo
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                        <textarea
                          value={nuevoAlerta}
                          onChange={(e) => setNuevoAlerta(e.target.value)}
                          placeholder="Describe la alerta..."
                          className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none transition-all text-sm"
                          rows="2"
                        />
                        <motion.button
                          onClick={handleSubmitAlerta}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full mt-2 font-bold py-2 rounded-lg shadow-md transition-all text-sm inline-flex items-center justify-center gap-2 text-white 
    bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg"
                        >
                          {modoEdicionAlerta ? (
                            <>
                              <RefreshCw size={16} /> Actualizar alerta
                            </>
                          ) : (
                            <>Publicar alerta</>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </>
  );
}