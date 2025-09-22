import { useEffect, useState } from "react";
import axios from "axios";
import logoUser  from "../assets/img/user.png";
import { useParams, useNavigate } from "react-router-dom";
import Logo from '../assets/img/BogotaTurisLogo.png';
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 8px rgb(212, 163, 115)",
    transition: { yoyo: Infinity, duration: 0.6 },
  },
}; 
const ConsultarLugar = () => {
  const { userId, lugarId } = useParams();
  const navigate = useNavigate();

  const [lugar, setLugar] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLugar, setLoadingLugar] = useState(true);
  const [loadingUsuario, setLoadingUsuario] = useState(false);

  const usuarioId = userId || localStorage.getItem("usuario_id");

  const handleInicio = () => {
    navigate(`/usuario/${usuarioId}/`);
  };

  useEffect(() => {
    const fetchLugar = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/usuario/lugares/${lugarId}`);
        setLugar(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Error desconocido al cargar lugar");
      } finally {
        setLoadingLugar(false);
      }
    };
    

    const fetchUsuarioData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/usuario/perfil/${usuarioId}`);
        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
        } else {
          setError("No se pudo cargar el perfil.");
        }
      } catch {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoadingUsuario(false);
      }
    };

    fetchLugar();
    fetchUsuarioData();
  }, [lugarId, usuarioId]);

  if (error) {
    return <div className="text-red-600 text-center mt-10 font-semibold">{error}</div>;
  }

  if (loadingLugar || loadingUsuario) {
    return <div className="text-gray-600 text-center mt-10 font-medium">Cargando...</div>;
  }

  return (
    <>
     <nav className="nav">
                 <div className="container1">
                   <div className="logo">
                     <img src={Logo} alt="BogotaTuris Logo" />
                     <h1>BogotaTuris</h1>
                   </div>
                   <ul className="nav-links">
                     <li className="nav-item dropdown">
                       <a
                         className="nav-link dropdown-toggle"
                         href="#"
                         id="userDropdown"
                         role="button"
                       >
                         <strong className="user-section">
                           Bienvenido {usuarioData?.correo || "Usuario"}
                           <img
                             src={logoUser}
                             alt="Logo Usuario"
                             className="user-logo"
                           />
                         </strong>
                       </a>
         
                       {/* Dropdown siempre en el DOM, pero oculto con CSS */}
                       <ul className="dropdown-menu" aria-labelledby="userDropdown">
                         <li>
                           <a className="dropdown-item" onClick={handleInicio}>
                             inicio 
                           </a>
                         </li>
                       </ul>
                     </li>
                   </ul>
                  </div>
               </nav>

    <motion.main
      className="max-w-lg mx-auto mt-10 p-8 bg-[#F4EBD0] rounded-2xl shadow-2xl border-4 border-[#D4A373]"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-[#00438F] drop-shadow-md">
        {lugar.nombre_lugar} 🌟
      </h2>
      <p className="mb-3 text-lg">
        <span className="font-semibold">Tipo:</span> {lugar.tipo_lugar}
      </p>
      <p className="mb-3 text-lg">
        <span className="font-semibold">Dirección:</span> {lugar.direccion}
      </p>
          <p className="mb-3 text-lg">
        <span className="font-semibold">Horario:</span> {lugar.hora_aper} - {lugar.hora_cierra}
      </p>
      <p className="mb-3 text-lg">
        <span className="font-semibold">Precios:</span> {lugar.precios}
      </p>
      <motion.button
        onClick={handleInicio}
        className="mt-8 w-full bg-[#D4A373] hover:bg-[#b07a5a] text-white font-bold py-3 rounded-xl shadow-lg"
        variants={buttonVariants}
        whileHover="hover"
      >
        Volver al inicio
      </motion.button>
    </motion.main>
    </>
  );
};

export default ConsultarLugar;