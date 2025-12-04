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
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function Modal({ open, onClose, card }) {
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
          showToast("Comentario actualizado", "success");
        } else {
          const comentarioConUsuario = {
            ...data,
            nombre: localStorage.getItem("primer_nombre"),
            apellido: localStorage.getItem("primer_apellido"),
          };
          setComentarios([comentarioConUsuario, ...comentarios]);
          showToast("Comentario publicado exitosamente", "success");
        }

        setNuevoComentario("");
        setCalificacion(0);
        setModoEdicion(false);
        setComentarioEditId(null);
      } else {
        const error = await response.json();
        showToast(
          `Error: ${error.detail || "No se pudo publicar el comentario"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error al crear/actualizar comentario:", error);
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

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
          showToast("Comentario eliminado", "success");
        } else if (response.status === 404) {
          showToast(
            "No tienes permiso para eliminar este comentario",
            "error"
          );
        } else {
          showToast("Error al eliminar el comentario", "error");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        showToast("Error de conexión", "error");
      }
    });
    setConfirmOpen(true);
  };

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
          showToast("Alerta actualizada", "success");
        } else {
          await fetchAlertas();
          showToast("Alerta registrada correctamente", "success");
        }

        setNuevoAlerta("");
        setModoEdicionAlerta(false);
        setAlertaEditId(null);
      } else {
        showToast("Error al registrar/actualizar alerta", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error de conexión", "error");
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

  const renderStars = (rating, isInteractive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={isInteractive ? 20 : 14}
          className={`transition-all duration-200 ${
            isInteractive ? "cursor-pointer" : ""
          }`}
          fill={
            star <= (isInteractive ? hoverStar || calificacion : rating)
              ? "#FBBF24"
              : "none"
          }
          stroke={
            star <= (isInteractive ? hoverStar || calificacion : rating)
              ? "#FBBF24"
              : "#D1D5DB"
          }
          onClick={() => isInteractive && setCalificacion(star)}
          onMouseEnter={() => isInteractive && setHoverStar(star)}
          onMouseLeave={() => isInteractive && setHoverStar(0)}
        />
      ))}
    </div>
  );

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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white ${
              type === "success"
                ? "bg-green-600"
                : type === "error"
                ? "bg-red-600"
                : type === "warning"
                ? "bg-amber-500"
                : "bg-blue-600"
            }`}
          >
            {type === "success" && <CheckCircle2 size={16} />}
            {type === "error" && <XCircle size={16} />}
            {type === "warning" && <AlertTriangle size={16} />}
            {type === "info" && <Info size={16} />}
            <span className="font-normal">{message}</span>
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
            className="fixed inset-0 z-[1100] flex items-start md:items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 pt-24 md:pt-0 pb-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative mt-2 bg-white/95 rounded-3xl shadow-2xl w-full max-w-xl lg:max-w-3xl max-h-[80vh] md:max-h-[80vh] flex flex-col sm:flex-row border border-white/40 overflow-y-auto sm:overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel izquierdo: Información del lugar */}
              <div className="w-full sm:w-5/12 md:w-1/2 lg:w-1/2 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Imagen */}
                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-4 left-4 right-4 text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight"
                  >
                    {card.nombre}
                  </motion.h2>
                </div>

                {/* Contenido sin scroll interno */}
                <div className="flex-1 px-4 py-3 space-y-3">

                  {/* Detalles compactos */}
                  <div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-100 leading-snug space-y-1 max-h-24 overflow-y-auto pr-1">
                      <span className="block">
                        <span className="font-semibold text-white mr-1">Descripción:</span>
                        <span className="text-slate-50">{card.descripcion}</span>
                      </span>
                      <span className="block">
                        <span className="font-semibold text-white mr-1">Dirección:</span>
                        <span className="text-slate-50">{card.direccion}</span>
                      </span>
                      <span className="block">
                        <span className="font-semibold text-white mr-1">Horario:</span>
                        <span className="text-slate-50">{card.hora_aper} - {card.hora_cierra}</span>
                      </span>
                      <span className="block">
                        <span className="font-semibold text-white mr-1">Precio:</span>
                        <span className="text-slate-50">{card.precios}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Panel derecho: Comentarios y Alertas */}
              <div className="w-full sm:w-7/12 md:w-1/2 lg:w-1/2 flex flex-col bg-gray-50/60">
                {/* Pestañas */}
                <div className="flex items-center justify-between border-b border-gray-200 px-3 sm:px-4 pt-2 sm:pt-3 pb-1.5 bg-gray-50/50 gap-3 sm:gap-4 w-full">
                  <motion.h3
                      onClick={() => setModo("comentarios")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative text-sm sm:text-base lg:text-lg font-bold cursor-pointer transition-all duration-300 ${
                        modo === "comentarios"
                          ? "text-blue-700 drop-shadow-sm after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-blue-600 after:rounded-full"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                    <span className="inline-flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>Comentarios</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          modo === "comentarios" ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      >
                        {comentarios.length}
                      </span>
                    </span>
                  </motion.h3>

<motion.h3
  onClick={() => setModo("alertas")}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`relative ml-3 sm:ml-5 text-sm sm:text-base lg:text-lg font-bold cursor-pointer transition-all duration-300 ${
    modo === "alertas"
      ? "text-red-600 drop-shadow-sm after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-red-600 after:rounded-full"
      : "text-gray-500 hover:text-red-500"
  }`}
>
                    <span className="inline-flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>Alertas</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          modo === "alertas" ? "bg-red-500" : "bg-gray-200"
                        }`}
                      >
                        {alertas?.length || 0}
                      </span>
                    </span>
                  </motion.h3>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 overflow-hidden flex flex-col items-center px-2 sm:px-4 pb-2">
                  {modo === "comentarios" ? (
                    <>
                      {/* Lista de comentarios */}
                      <div className="flex-1 w-full max-w-md overflow-y-auto py-1.5 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {loadingComentarios ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
                            <p className="text-gray-500 text-sm font-medium">Cargando comentarios...</p>
                          </div>
                        ) : comentarios.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <MessageSquare size={28} className="text-gray-400" />
                            </div>
                            <p className="text-base font-semibold text-gray-600 mb-1">
                              No hay comentarios aún
                            </p>
                            <p className="text-sm text-gray-400">
                              Sé el primero en comentar
                            </p>
                          </div>
                        ) : (
                          <AnimatePresence mode="popLayout">
                            {comentarios.map((comentario) => (
                              <motion.div
                                key={comentario.id_com}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-start gap-2 mb-1.5">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0">
                                    {comentario.nombre?.[0]?.toUpperCase() || "?"}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base leading-snug">
                                      {comentario.nombre || "Usuario"} {comentario.apellido || ""}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 text-right">
                                      {new Date(comentario.fecha_com).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>

                                  {comentario.editado && (
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                      Editado
                                    </span>
                                  )}

                                  {comentario.id_usuario === usuarioId && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleActualizarComentario(comentario.id_com)}
                                        className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white flex items-center justify-center transition-colors"
                                      >
                                        <RefreshCw size={14} />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEliminarComentario(comentario.id_com)}
                                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors"
                                      >
                                        <Trash2 size={14} />
                                      </motion.button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-start justify-between gap-2 mt-0.5">
                                  <p className="flex-1 text-gray-700 leading-snug text-xs sm:text-sm md:text-base break-words">
                                    {comentario.tipo_com}
                                  </p>

                                  <div className="flex flex-col items-end gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100 min-w-[96px]">
                                    <div className="flex items-center gap-1">
                                      {renderStars(comentario.calificacion)}
                                    </div>
                                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-amber-700">
                                      {comentario.calificacion}/5
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                      </div>

                      {/* Formulario comentario */}
                      <div className="w-full max-w-md lg:max-w-sm border-t border-gray-200 px-3 pb-1.5 pt-1 bg-white/95 rounded-2xl shadow-sm mt-1.5">
                        <textarea
                          value={nuevoComentario}
                          onChange={(e) => setNuevoComentario(e.target.value)}
                          placeholder="Escribe tu comentario..."
                          className="w-full px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs sm:text-sm mb-1"
                          rows="2"
                          disabled={loading}
                        />

                        <div className="flex items-center justify-between mb-1">
                          <div className="bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            {renderStars(calificacion, true)}
                          </div>
                        </div>

                        <motion.button
                          onClick={handleSubmitComentario}
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          disabled={loading}
                          className={`w-full font-medium py-1.5 md:py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                            loading
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                          }`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              {modoEdicion ? "Actualizando..." : "Publicando..."}
                            </>
                          ) : (
                            <>
                              {modoEdicion ? <RefreshCw size={16} /> : <Send size={16} />}
                              {modoEdicion ? "Actualizar" : "Publicar"}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Lista de alertas */}
                      <div className="flex-1 w-full max-w-md overflow-y-auto py-1.5 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {alertas && alertas.length > 0 ? (
                          alertas.map((alerta) => (
                            <motion.div
                              key={alerta.id_alerta}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-red-50 border border-red-200 rounded-xl p-3 hover:shadow-sm transition-all group"
                            >
                              <div className="flex items-start gap-2.5 mb-2">
                                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                                  {alerta.usuario?.[0]?.toUpperCase() || "?"}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-sm truncate">
                                    {alerta.usuario || "Usuario desconocido"}
                                  </p>
                                  {alerta.fecha && (
                                    <p className="text-xs text-gray-500">
                                      {new Date(alerta.fecha).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm font-medium text-red-700 leading-snug pl-11">
                                {alerta.tipo_aler}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                              <AlertTriangle size={28} className="text-red-400" />
                            </div>
                            <p className="text-base font-semibold text-gray-600 mb-1">
                              No hay alertas
                            </p>
                            <p className="text-sm text-gray-400">
                              Reporta cualquier problema
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Formulario alerta */}
                      <div className="w-full max-w-md border-t border-gray-200 px-3 pb-1.5 pt-1 bg-red-50/90 rounded-2xl shadow-sm mt-1.5">
                        <textarea
                          value={nuevoAlerta}
                          onChange={(e) => setNuevoAlerta(e.target.value)}
                          placeholder="Describe la alerta o problema..."
                          className="w-full px-3 py-1.5 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-xs mb-1"
                          rows="2"
                        />
                        <motion.button
                          onClick={handleSubmitAlerta}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow"
                        >
                          {modoEdicionAlerta ? (
                            <>
                              <RefreshCw size={16} /> Actualizar alerta
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} /> Publicar alerta
                            </>
                          )}
                        </motion.button>
                      </div>
                    </>
                  )}
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