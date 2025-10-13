import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import ModalComentario from "./ModalComentario";
import ListaComentarios from "../components/ListaComentarios";
import ModalLugar from "./ModalLugar";

export default function Modal({ open, onClose, card }) {
  const [nuevoComentario, setNuevoComentario] = useState(null);
  const token = localStorage.getItem("token");
  const [showComentario, setShowComentario] = useState(false);
  const [showLugar, setShowLugar] = useState(false);

  // ✅ Obtiene el ID del usuario logueado desde el localStorage
  const usuarioId = localStorage.getItem("usuario_id");

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
            className="relative flex gap-4 transition-all duration-500"
            style={{ maxWidth: "90%", width: "100%", justifyContent: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔹 Modal principal */}
            <motion.div
              className="relative rounded-3xl shadow-2xl max-w-md w-[90%] overflow-hidden bg-gradient-to-br from-[#FDF3E7] via-white to-[#A6D8E7] border border-[#dceaf2]"
              initial={{ y: 100, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                x: showComentario || showLugar ? -40 : 0,
              }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* Imagen y texto */}
              <div className="relative h-48">
                <img
                  src={card.imagen}
                  alt={card.titulo}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.h3
                  className="absolute bottom-4 left-4 text-2xl font-extrabold tracking-wide text-white"
                  animate={{
                    textShadow:
                      "0px 0px 8px rgba(0,0,0,0.8), 0px 0px 14px rgba(255,255,255,0.6)",
                  }}
                  whileHover={{
                    x: 6,
                    textShadow:
                      "0px 0px 12px rgba(0,170,255,0.9), 0px 0px 20px rgba(255,255,255,0.8)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {card.titulo}
                </motion.h3>
              </div>

              <div className="p-5 text-[#00376E]">
                <p className="text-sm leading-relaxed mb-5 text-[#00438F]">
                  {card.descripcion}
                </p>

                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 rounded-md text-sm font-semibold bg-[#5E90A6] text-white shadow-md hover:bg-[#00438F] transition-all"
                    onClick={() => {
                      setShowComentario(true);
                      setShowLugar(false);
                    }}
                  >
                    Crear comentario
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 rounded-md text-sm font-semibold bg-[#A6D8E7] text-[#00376E] shadow-md hover:bg-[#5E90A6] hover:text-white transition-all"
                    onClick={() => {
                      setShowComentario(false);
                      setShowLugar(true);
                    }}
                  >
                    Ver más del lugar
                  </motion.button>
                </div>

                <ListaComentarios
                  usuarioId={usuarioId}
                  token={token}
                  nuevoComentario={nuevoComentario}
                />
              </div>
            </motion.div>

            {/* 🔹 Modales laterales controlados */}
            {showComentario && (
              <ModalComentario
                onClose={() => setShowComentario(false)}
                onComentarioCreado={setNuevoComentario}
              />
            )}

            {showLugar && (
              <ModalLugar
                lugarId={card.id_lugar}
                onClose={() => setShowLugar(false)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
