import { motion } from "framer-motion";
import ListaComentarios from "../components/ListaComentarios";
import { X } from "lucide-react";
import ComentariosNuevo from "./CreateComment";

export default function ModalComentario({ onClose, onComentarioCreado }) {
  return (
    <div className="relative p-6">
      {/* Botón cerrar */}
      <X
        size={22}
        className="absolute top-6 right-3 cursor-pointer text-gray-600 hover:text-red-500 transition"
        onClick={onClose}
      />

      {/* ✅ Pasa las funciones como props al componente hijo */}
      <ComentariosNuevo
        onClose={onClose}
        onComentarioCreado={onComentarioCreado}
      />
    </div>
  );
}
