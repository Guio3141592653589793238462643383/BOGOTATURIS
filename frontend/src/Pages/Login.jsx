import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import bogotaNight from "../assets/img/bogota-night.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    correo: "",
    clave: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------------------------
  // 🔍 Manejo de campos y validaciones
  // ---------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "correo") {
      if (!value) {
        newErrors.correo = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.correo = "El correo no es válido";
      } else {
        delete newErrors.correo;
      }
    }

    if (name === "clave") {
      if (!value) {
        newErrors.clave = "La contraseña es obligatoria";
      } else if (value.length < 6) {
        newErrors.clave = "La contraseña debe tener al menos 6 caracteres";
      } else {
        delete newErrors.clave;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength)
      return "La contraseña debe tener al menos 8 caracteres";
    if (!hasUpperCase)
      return "Debe contener al menos una letra mayúscula";
    if (!hasLowerCase)
      return "Debe contener al menos una letra minúscula";
    if (!hasNumbers)
      return "Debe contener al menos un número";
    if (!hasSpecialChar)
      return "Debe contener al menos un carácter especial";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.correo) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido";
    }

    if (!formData.clave) {
      newErrors.clave = "La contraseña es obligatoria";
    } else {
      const passwordError = validatePassword(formData.clave);
      if (passwordError) newErrors.clave = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // 🚀 Envío del formulario
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const result = await login(formData.correo, formData.clave);

      if (result?.success) {
        setSuccessMessage("Inicio de sesión exitoso");
        toast.success("Inicio de sesión exitoso 🌇");

        const userRole =
          result.user?.rol?.toLowerCase() ||
          localStorage.getItem("user_rol")?.toLowerCase();
        const userId =
          result.user?.id || localStorage.getItem("usuario_id");

        if (!userRole) {
          toast.error("Error al determinar el rol del usuario");
          return;
        }

        if (userRole === "administrador") {
          navigate(`/admin/${userId}`);
        } else if (userRole === "usuario") {
          navigate(`/usuario/${userId}`);
        } else {
          navigate("/");
        }
      } else {
        const errorMessage =
          result?.error ||
          "Credenciales inválidas. Por favor, inténtalo de nuevo.";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
      setErrors({
        general:
          "Error al conectar con el servidor. Por favor, inténtalo más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------
  // 🧠 Verificar sesión existente
  // ---------------------------
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access_token");
        const userRole = localStorage.getItem("user_rol")?.toLowerCase();
        const userId = localStorage.getItem("usuario_id");

        if (token && userRole && userId) {
          if (userRole === "administrador") navigate(`/admin/${userId}`);
          else if (userRole === "usuario") navigate(`/usuario/${userId}`);
          else navigate("/");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // ---------------------------
  // 🎨 Interfaz con diseño moderno azul
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d]">
      <div className="min-h-screen bg-[#001a33]/70">
        <div className="flex min-h-screen">
          {/* Panel izquierdo */}
          <motion.div
            className="hidden md:flex flex-1 flex-col items-center justify-center text-white p-10 relative shadow-2xl"
            style={{
              backgroundImage: `url(${bogotaNight})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="bg-[#001a33]/60 p-8 rounded-2xl backdrop-blur-md text-center space-y-6">
              

              <motion.div
                className="flex justify-center space-x-8 text-[#ffda44]"
                initial={{ y: -10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <motion.div whileHover={{ scale: 1.15 }}>
                  <FaMapMarkerAlt className="text-5xl opacity-90" />
                </motion.div>
                <motion.div whileHover={{ rotate: 15 }}>
                  <MdTravelExplore className="text-5xl opacity-80" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.15 }}>
                  <FaCity className="text-5xl opacity-90" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Bienvenido a <span className="text-[#ffda44]">BogotaTuris</span>
              </motion.h1>

              <motion.p
  className="text-center !text-white text-sm max-w-sm leading-relaxed mx-auto drop-shadow-lg font-medium"
  style={{ color: "white" }}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.7 }}
>
  Vive la magia de la capital colombiana.  
  Cultura, historia y aventura en un solo lugar. 
</motion.p>


            </div>
          </motion.div>

          {/* Panel derecho (Formulario) */}
          <motion.div
            className="flex-1 flex items-center justify-center p-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white/90 backdrop-blur-md border border-[#c9d6e8] rounded-2xl p-8 w-full max-w-md space-y-6 shadow-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="text-center mb-4">                
                <h2 className="text-2xl font-bold text-[#002855]">
                  Inicia Sesión
                </h2>
                <p className="text-sm text-[#5b5b5b]">
                  Descubre Bogotá con nosotros 
                </p>
              </div>

              {errors.general && (
                <p className="text-red-600 text-center text-sm mb-2">
                  {errors.general}
                </p>
              )}

              <div>
                <label className="block text-[#002855] font-semibold mb-1">
                  Correo electrónico:
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004b8d] ${
                    errors.correo ? "border-red-500" : "border-[#a9bcd0]"
                  }`}
                />
                {touched.correo && errors.correo && (
                  <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <label className="block text-[#002855] font-semibold mb-1">
                  Contraseña:
                </label>
                <input
                  type="password"
                  name="clave"
                  value={formData.clave}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ingrese su contraseña"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004b8d] ${
                    errors.clave ? "border-red-500" : "border-[#a9bcd0]"
                  }`}
                />
                {touched.clave && errors.clave && (
                  <p className="text-red-500 text-sm mt-1">{errors.clave}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#004b8d] hover:bg-[#003c73] text-white shadow-md"
                }`}
              >
                {isLoading ? "Cargando..." : "Ingresar"}
              </button>

              {/* 🔗 Enlaces */}
              <div className="text-center mt-3">
  <a
    href="/solicitar-restablecimiento"
    className="!text-[#004b8d] hover:!text-[#002855] underline transition font-medium"
    style={{ color: "#004b8d" }}
  >
    ¿Olvidaste tu contraseña?
  </a>
</div>

<div className="text-center text-sm text-[#333]">
  ¿No tienes cuenta?{" "}
  <a
    href="/registro"
    className="!text-[#004b8d] hover:!text-[#002855] font-semibold hover:underline transition"
    style={{ color: "#004b8d" }}
  >
    Regístrate aquí
  </a>
</div>

            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;