import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";

export default function Card({ imagen, titulo, fecha, ubicacion, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.article
      className="relative bg-white rounded-3xl overflow-hidden cursor-pointer group w-full"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      {/* Brillo de fondo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0"
        animate={{ 
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.5 : 1
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Imagen con efectos mejorados */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {!imageLoaded && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          />
        )}
        
        <motion.img
          src={imagen?.startsWith("http") ? imagen : `http://localhost:8000/${imagen}`}
          alt={titulo}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/default-image.png";
            setImageLoaded(true);
          }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ 
            scale: imageLoaded ? 1 : 1.2,
            opacity: imageLoaded ? 1 : 0
          }}
          whileHover={{ scale: 1.15, rotate: isHovered ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        
        {/* Gradient overlay mejorado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#00438F]/80 via-[#00438F]/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Partículas flotantes al hover */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  opacity: 0 
                }}
                animate={{ 
                  y: "-20%",
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {/* Badge flotante con efecto de pulsación */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg"
            animate={{
              boxShadow: isHovered 
                ? ["0 0 0 0 rgba(255,255,255,0.7)", "0 0 0 10px rgba(255,255,255,0)"]
                : "0 4px 6px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          >
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[#00438F]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Contenido con entrada animada */}
      <motion.div 
        className="p-4 sm:p-5 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Título con gradiente animado */}
        <motion.h3 
          className="text-base sm:text-lg font-bold mb-3 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] relative"
          animate={{ 
            color: isHovered ? "#0066CC" : "#00438F"
          }}
          transition={{ duration: 0.3 }}
        >
          {titulo}
          {/* Subrayado animado */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00438F] to-[#0066CC]"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.h3>

        {/* Info con iconos animados */}
        {(fecha || ubicacion) && (
          <motion.div 
            className="space-y-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {fecha && (
              <motion.div 
                className="flex items-start gap-2 text-xs sm:text-sm text-gray-600"
                whileHover={{ x: 4, color: "#00438F" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ 
                    rotate: isHovered ? [0, -10, 10, 0] : 0,
                    scale: isHovered ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00438F]" />
                </motion.div>
                <span className="leading-tight">{fecha}</span>
              </motion.div>
            )}
            
            {ubicacion && (
              <motion.div 
                className="flex items-start gap-2 text-xs sm:text-sm text-gray-600"
                whileHover={{ x: 4, color: "#00438F" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ 
                    y: isHovered ? [0, -3, 0] : 0
                  }}
                  transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00438F]" />
                </motion.div>
                <span className="leading-tight">{ubicacion}</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Botón con efectos premium */}
        <motion.button
          className="w-full bg-gradient-to-r from-[#00438F] to-[#0066CC] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden text-sm sm:text-base shadow-lg"
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(0, 67, 143, 0.5)"
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          {/* Onda de luz múltiple */}
          {isHovered && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.3 }}
              />
            </>
          )}
          
          <motion.span 
            className="relative z-10"
            animate={{ scale: isHovered ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            Ver evento
          </motion.span>
          
          <motion.div
            animate={{ 
              x: isHovered ? [0, 5, 0] : 0,
              rotate: isHovered ? [0, 0, 0] : 0
            }}
            transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
          >
            <ArrowRight className="w-4 h-4 relative z-10" />
          </motion.div>

          {/* Círculos de expansión al hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 border-2 border-white/30 rounded-xl"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Borde brillante animado */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered 
            ? [
                "0 0 0 0 rgba(0, 102, 204, 0)",
                "0 0 20px 5px rgba(0, 102, 204, 0.3)",
                "0 0 40px 8px rgba(0, 102, 204, 0.1)",
                "0 0 0 0 rgba(0, 102, 204, 0)"
              ]
            : "none"
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Efecto de resplandor de esquina */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [0.3, 0.5, 0.3] : 0
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.article>
  );
}