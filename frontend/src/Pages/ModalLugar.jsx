import { motion } from "framer-motion";
import { X } from "lucide-react";
import LugarDetalle from "./ConsultPlaces";

export default function ModalLugar({ onClose, lugarId }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative p-6 bg-white rounded-3xl shadow-2xl border border-[#bde0eb] max-w-lg w-[90%]"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <X
          size={22}
          className="absolute top-6 right-3 cursor-pointer text-gray-600 hover:text-red-500 transition"
          onClick={onClose}
        />

        {/* ✅ Contenido del lugar */}
        <LugarDetalle lugarId={lugarId} />
      </motion.div>
    </motion.div>
  );
}
