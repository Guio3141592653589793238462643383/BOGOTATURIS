import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LugarDetalle({ lugarId }) {
  const [lugar, setLugar] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLugar, setLoadingLugar] = useState(true);

  useEffect(() => {
    const fetchLugar = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/usuario/lugares/${lugarId}`
        );
        setLugar(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Error al cargar el lugar.");
      } finally {
        setLoadingLugar(false);
      }
    };

    fetchLugar();
  }, [lugarId]);

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10 font-semibold">{error}</div>
    );
  }

  if (loadingLugar) {
    return (
      <div className="text-gray-600 text-center mt-10 font-medium">
        Cargando información del lugar...
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-[#E8F6F9] rounded-2xl shadow-xl border border-[#bde0eb]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-extrabold mb-4 text-[#00438F] drop-shadow-md">
        {lugar.nombre_lugar} 🌟
      </h2>

      <p className="mb-2 text-sm">
        <span className="font-semibold">Tipo:</span> {lugar.tipo_lugar}
      </p>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Dirección:</span> {lugar.direccion}
      </p>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Horario:</span> {lugar.hora_aper} - {lugar.hora_cierra}
      </p>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Precios:</span> {lugar.precios}
      </p>

      <motion.div
        className="mt-4 p-2 bg-[#A6D8E7]/50 rounded-lg text-[#00376E] text-sm shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>
          ✨ Este lugar forma parte de la experiencia <strong>BogotáTuris</strong>.
          ¡Ven y descubre lo mejor de la ciudad!
        </p>
      </motion.div>
    </motion.div>
  );
}
