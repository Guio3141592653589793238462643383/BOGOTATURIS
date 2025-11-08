import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A2342]/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#F9F9F9] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#0A2342]/20"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-[#FF6B6B]/20 p-3 rounded-full">
                <AlertTriangle className="text-[#FF6B6B]" size={36} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#0A2342] mb-2">
              Confirmar acción
            </h2>
            <p className="text-[#333] mb-6 text-sm">{message}</p>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#e55a5a] text-white font-semibold transition shadow-md"
              >
                Sí, eliminar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
