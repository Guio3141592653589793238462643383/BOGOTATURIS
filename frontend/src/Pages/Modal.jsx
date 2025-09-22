import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

export default function Modal({ open, onClose, card }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");
  // Funciones para navegación
  const handleComentario = () => {
    navigate(`/usuario/${usuarioId}/comentarios/nuevo`);
  };
  const handleLugares = () => {
    navigate(`/consultar-lugar/${card.id_lugar}`);
  };
  return (
    <AnimatePresence>
      {open && card && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative rounded-3xl shadow-2xl max-w-lg w-[90%] overflow-hidden
             bg-white/20 backdrop-blur-lg border border-white/30"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full 
                         bg-white/90 text-blue-700 hover:bg-red-500 hover:text-white 
                         transition-colors shadow-md"
            >
              ✕
            </button>

            {/* Imagen destacada */}
            <motion.div
              className="relative h-56"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img
                src={card.imagen}
                alt={card.titulo}
                className="w-full h-full object-cover rounded-t-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h2
                className="absolute bottom-4 left-5 text-3xl font-extrabold text-white"
                style={{
                  WebkitTextStroke: "1px #555", // contorno gris oscuro
                  textShadow: `
      0 0 8px rgba(255,255,255,0.8), 
      0 0 16px rgba(100,100,100,0.6)
    `,
                }}
              >
                {card.titulo}
              </h2>
            </motion.div>

            {/* Contenido */}
            <div className="p-6 text-gray-700">
              <motion.p
                className="text-base leading-relaxed mb-5 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {card.descripcion}
              </motion.p>

              {/* Botones de acción */}
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-lg 
                             bg-gradient-to-r from-blue-400 to-blue-600 
                             text-white font-semibold shadow-lg"
                  onClick={handleComentario}
                >
                  Crear Comentario
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-lg 
                             bg-gradient-to-r from-sky-400 to-sky-600 
                             text-white font-semibold shadow-lg"
                  onClick={handleLugares}
                >
                  Consultar más este lugar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
