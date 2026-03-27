import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";
import useFormValidation from "../hooks/useFormValidation.jsx";
import usePoliticas from "../hooks/usePoliticas";
import PDFModal from "../components/PDFModal";
import bogotaNight from "../assets/img/bogota-night.jpg";
import "../assets/css/FormSignUp.css";

const FormSignUp = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();
  const [showTerminosModal, setShowTerminosModal] = useState(false);
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Obtener funciones de validación del formulario
  const formValidation = useFormValidation();
  
  // Obtener funciones de manejo de políticas
  const politicas = usePoliticas();
  
  // Extraer solo lo que necesitamos de cada hook para mantener la legibilidad
  const {
    formData,
    nacionalidades,
    interesesDisponibles,
    loadingNacionalidades,
    validarTodoElFormulario,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    resetForm,
  } = formValidation;
  
  const {
    sessionId,
    politicasAceptadas,
    registrarVisualizacionPDF,
    handlePoliticaChange,
    validarPoliticas,
    resetPoliticas,
  } = politicas;

  // Agregar estado para rastrear si el formulario ha sido enviado
  const [submitted, setSubmitted] = useState(false);
  
  // Calcular el progreso pasando politicasAceptadas
  const progreso = calcularProgreso(politicasAceptadas);
  
  // Efecto para depuración
  React.useEffect(() => {
    console.log('--- Estado actual en Registro ---');
    console.log('politicasAceptadas:', politicasAceptadas);
    console.log('progreso actual:', progreso);
  }, [politicasAceptadas, progreso]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Marcar como enviado para mostrar errores
    
    console.log('--- Validando formulario ---');
    console.log('politicasAceptadas:', politicasAceptadas);
    
    if (!validarPoliticas()) {
      console.log('Validación de políticas fallida');
      alert("Debes aceptar las políticas antes de registrarte");
      return;
    }

    const esValido = await validarTodoElFormulario(politicasAceptadas);
    if (!esValido) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    if (formData.clave !== formData.confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!sessionId) {
      alert("Error de sesión. Recarga la página");
      return;
    }

    const datosFormulario = {
      ...formData,
      session_id: sessionId,
      acepto_terminos: politicasAceptadas.acepto_terminos,
      acepto_tratamiento_datos: politicasAceptadas.acepto_tratamiento_datos,
    };

    try {
      console.log("Enviando datos al servidor...");
      console.log('Enviando datos a:', 'http://localhost:8000/api/usuario/registro');
      const response = await fetch('http://localhost:8000/api/usuario/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        credentials: 'include',
        body: JSON.stringify(datosFormulario)
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Error procesando la respuesta del servidor');
      }

      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error en el registro (${response.status} ${response.statusText})`);
      }

      console.log('Respuesta del servidor:', data);
      
      // Mostrar mensaje de éxito
      setShowWelcomeModal(true);
      
      // Si el servidor devuelve un mensaje de éxito, lo mostramos
      if (data.message) {
        console.log('Mensaje del servidor:', data.message);
      }
      
      // Limpiar el formulario
      resetForm();
      resetPoliticas();
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert(`Error al registrar el usuario: ${error.message}`);
    }
  };

  const renderNacionalidades = () => {
    if (loadingNacionalidades) {
      return <option value="">Cargando nacionalidades...</option>;
    }

    if (!nacionalidades || nacionalidades.length === 0) {
      return <option value="">No se encontraron nacionalidades</option>;
    }

    return [
      <option key="default" value="">
        Seleccione una nacionalidad
      </option>,
      ...nacionalidades.map((nacionalidad) => (
        <option 
          key={nacionalidad.id_nac} 
          value={nacionalidad.id_nac}
        >
          {nacionalidad.nacionalidad}
        </option>
      ))
    ];
  };

  const renderIntereses = () => {
    // Verificar si interesesDisponibles es un array de objetos o de strings
    const lista = interesesDisponibles.length > 0 
      ? interesesDisponibles.map(item => typeof item === 'object' ? item.interes : item)
      : [
          "Aventureros", "Arte", "Gastronomía", "Naturaleza", "Conciertos",
          "Escalada", "Museos", "Eventos", "Yoga", "Bares", "Danza",
          "Cultura", "Deportes", "Historia", "Festivales", "Talleres",
          "Cocinar", "Ecoturismo", "Concursos", "Discotecas"
        ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
        {lista.map((interes, i) => {
          const valorInteres = typeof interes === 'object' ? interes.interes : interes;
          return (
            <label key={i} className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded cursor-pointer text-xs">
              <input
                type="checkbox"
                name="intereses"
                value={valorInteres}
                checked={formData.intereses?.includes(valorInteres)}
                onChange={handleInteresesChange}
                className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">{valorInteres}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    navigate("/login");
  };

  const reenviarCorreoConfirmacion = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/verificacion/reenviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Se ha enviado un nuevo correo de confirmación. Por favor revisa tu bandeja de entrada.');
      } else {
        throw new Error(data.detail || 'Error al reenviar el correo de confirmación');
      }
    } catch (error) {
      console.error('Error al reenviar correo de confirmación:', error);
      alert(error.message || 'Ocurrió un error al intentar reenviar el correo de confirmación');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d]">
      <div className="min-h-screen bg-[#001a33]/70">
        <div className="flex min-h-screen">
          {/* Left Panel */}
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

          {/* Right Panel - Registration Form */}
          <motion.div
            className="flex-1 flex items-center justify-center p-6 md:p-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white/90 backdrop-blur-md border border-[#c9d6e8] rounded-2xl p-8 space-y-6 shadow-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#002855] mb-1">
                  Crear Cuenta
                </h2>
                <p className="text-sm text-[#5b5b5b]">
                  Únete a nuestra comunidad de viajeros
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progreso}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{progreso}% completado</p>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Datos Personales</h3>
                  
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                      <input
                        type="text"
                        name="primer_nombre"
                        value={formData.primer_nombre || ""}
                        onChange={handleInputChange}
                        placeholder="Primer Nombre"
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                      <input
                        type="text"
                        name="segundo_nombre"
                        value={formData.segundo_nombre || ""}
                        onChange={handleInputChange}
                        placeholder="Segundo Nombre (opcional)"
                        className="form-input"
                      />
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                      <input
                        type="text"
                        name="primer_apellido"
                        value={formData.primer_apellido || ""}
                        onChange={handleInputChange}
                        placeholder="Primer Apellido"
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                      <input
                        type="text"
                        name="segundo_apellido"
                        value={formData.segundo_apellido || ""}
                        onChange={handleInputChange}
                        placeholder="Segundo Apellido (opcional)"
                        className="form-input"
                      />
                    </div>
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo || ""}
                      onChange={handleInputChange}
                      placeholder="Correo Electrónico"
                      className="form-input"
                      required
                    />
                  </motion.div>

                  {/* Confirmar Correo Electrónico */}
                  <motion.div variants={itemVariants} className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Correo Electrónico *</label>
                    <input
                      type="email"
                      name="confirmarCorreo"
                      value={formData.confirmarCorreo || ""}
                      onChange={handleInputChange}
                      placeholder="Confirmar Correo Electrónico"
                      className="form-input"
                      required
                    />
                    {formData.correo && formData.confirmarCorreo && (
                      <p className={`text-xs mt-1 ${formData.correo === formData.confirmarCorreo ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.correo === formData.confirmarCorreo 
                          ? '✓ Los correos coinciden' 
                          : '✗ Los correos no coinciden'}
                      </p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-4" variants={itemVariants}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                      <div className="password-input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="clave"
                          value={formData.clave || ""}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="form-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="password-toggle"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
                      <div className="password-input-container">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmarClave"
                          value={formData.confirmarClave || ""}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="form-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="password-toggle"
                          aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formData.clave && formData.confirmarClave && (
                        <p className={`text-xs mt-1 ${formData.clave === formData.confirmarClave ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.clave === formData.confirmarClave 
                            ? '✓ Las contraseñas coinciden' 
                            : '✗ Las contraseñas no coinciden'}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Additional Information */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad *</label>
                    <select
                      name="nacionalidad"
                      value={formData.nacionalidad || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      {renderNacionalidades()}
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intereses</label>
                    {renderIntereses()}
                  </motion.div>

                  {/* Terms and Conditions */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-none mt-0.5 mr-2">
                        <input
                          id="acepto_terminos"
                          name="acepto_terminos"
                          type="checkbox"
                          required
                          checked={politicasAceptadas.acepto_terminos}
                          onChange={(e) => {
                            console.log('Términos cambiados a:', e.target.checked);
                            handlePoliticaChange("acepto_terminos", e.target.checked);
                          }}
                          className={`h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer ${submitted && !politicasAceptadas.acepto_terminos ? 'border-2 border-red-500' : 'border-gray-300'}`}
                        />
                      </div>
                      <label 
                        htmlFor="acepto_terminos" 
                        className="text-xs text-gray-700 ml-1.5 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
                        onClick={(e) => {
                          // Only open modal if clicking the text, not the checkbox
                          if (e.target.tagName !== 'INPUT') {
                            setShowTerminosModal(true);
                          }
                        }}
                      >
                        Acepto los <span className="text-blue-600 hover:underline">Términos y Condiciones</span>
                      </label>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-none mt-0.5 mr-2">
                        <input
                          id="acepto_tratamiento"
                          name="acepto_tratamiento"
                          type="checkbox"
                          required
                          checked={politicasAceptadas.acepto_tratamiento_datos}
                          onChange={(e) => {
                            console.log('Tratamiento de datos cambiado a:', e.target.checked);
                            handlePoliticaChange("acepto_tratamiento_datos", e.target.checked);
                          }}
                          className={`h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer ${submitted && !politicasAceptadas.acepto_tratamiento_datos ? 'border-2 border-red-500' : 'border-gray-300'}`}
                        />
                      </div>
                      <label 
                        htmlFor="acepto_tratamiento" 
                        className="text-xs text-gray-700 ml-1.5 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
                        onClick={(e) => {
                          // Only open modal if clicking the text, not the checkbox
                          if (e.target.tagName !== 'INPUT') {
                            setShowTratamientoModal(true);
                          }
                        }}
                      >
                        Acepto la <span className="text-blue-600 hover:underline">Política de Tratamiento de Datos</span>
                      </label>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-4">
                    <button
                      type="submit"
                      className="registro-boton"
                    >
                      Registrarse
                    </button>
                  </motion.div>

                  {/* Login Link */}
                  <motion.div 
                    className="text-center text-gray-600 text-sm pt-2"
                    variants={itemVariants}
                  >
                    ¿Ya tienes una cuenta?{' '}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Iniciar sesión
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <PDFModal
        isOpen={showTerminosModal}
        onClose={() => setShowTerminosModal(false)}
        title="Términos y Condiciones"
        pdfUrl="http://localhost:8000/api/politicas/pdf/terminos"
        onView={() => registrarVisualizacionPDF('terminos')}
      />

      <PDFModal
        isOpen={showTratamientoModal}
        onClose={() => setShowTratamientoModal(false)}
        title="Política de Tratamiento de Datos"
        pdfUrl="http://localhost:8000/api/politicas/pdf/tratamiento-datos"
        onView={() => registrarVisualizacionPDF('tratamiento_datos')}
      />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="registro-modal">
          <div className="registro-modal-contenido">
            <div className="registro-modal-icono">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="registro-modal-titulo">¡Registro exitoso!</h3>
            <p className="registro-modal-mensaje">
              Tu cuenta ha sido creada correctamente. Por favor revisa tu correo electrónico y haz clic en el enlace de confirmación para activar tu cuenta.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Si no encuentras el correo, por favor revisa tu carpeta de spam.
            </p>
            <button
              type="button"
              className="registro-boton"
              onClick={handleWelcomeClose}
            >
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSignUp;