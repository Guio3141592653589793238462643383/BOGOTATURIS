import { motion } from "framer-motion";

export default function Card({ imagen, titulo, onClick }) {
  return (
    <motion.div
  whileHover={{
    scale: 1.05,
    y: -8,
    boxShadow: "0px 15px 30px rgba(0,0,0,0.3)"
  }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 250, damping: 15 }}
  onClick={onClick}
  className="relative max-w-sm rounded-xl overflow-hidden cursor-pointer shadow-md"
>
  <motion.img
    src={imagen}
    alt={titulo}
    className="w-full h-48 object-cover brightness-90 transition-all duration-500"
    whileHover={{ scale: 1.1 }}
  />

  {/* Overlay dinámico con azul */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
    whileHover={{
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,170,255,0.3))"
    }}
    transition={{ duration: 0.4 }}
  />

  {/* Título con glow azul/blanco */}
{/* Título con glow inicial + hover dinámico */}
<motion.h3
  className="absolute bottom-4 left-4 text-xl font-bold tracking-wide text-white"
  animate={{
    textShadow: "0px 0px 8px rgba(0,0,0,0.8), 0px 0px 14px rgba(255,255,255,0.6)"
  }}
  whileHover={{
    x: 10,
    textShadow:
      "0px 0px 12px rgba(0,170,255,0.9), 0px 0px 20px rgba(255,255,255,0.8)"
  }}
  transition={{ duration: 0.3 }}
>
  {titulo}
</motion.h3>

</motion.div>

  );
}
