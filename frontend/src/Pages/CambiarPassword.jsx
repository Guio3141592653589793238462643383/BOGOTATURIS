import "../assets/css/FormSignUp.css";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarView from "../components/NavbarView";
import Logo from "../assets/img/BogotaTurisLogo.png";
import bogotaNight from "../assets/img/bogota-night.jpg";
import Footer from "../components/Footer.jsx";

function CambiarPassword() {
  const [mensaje, setMensaje] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");
  const [usuarioData, setUsuarioData] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para validación en tiempo real
  const [fortalezaPassword, setFortalezaPassword] = useState({
    nivel: 0,
    texto: "Muy Débil",
    color: "#dc3545",
  });
  const [validaciones, setValidaciones] = useState({
    tieneMayuscula: false,
    tieneMinuscula: false,
    tieneNumero: false,
    longitudMinima: false,
  });
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(null);

  // Estado para modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calcular fortaleza de contraseña
  const calcularFortalezaPassword = useCallback((clave) => {
    let nivel = 0;
    let texto = "Muy Débil";
    let color = "#dc3545";

    if (/[a-z]/.test(clave)) nivel++;
    if (/[A-Z]/.test(clave)) nivel++;
    if (/[0-9]/.test(clave)) nivel++;
    if (/[^A-Za-z0-9]/.test(clave)) nivel++;

    switch (nivel) {
      case 1:
        texto = "Débil";
        color = "#dc3545";
        break;
      case 2:
        texto = "Aceptable";
        color = "#ffc107";
        break;
      case 3:
        texto = "Fuerte";
        color = "#17a2b8";
        break;
      case 4:
        texto = "Muy Fuerte";
        color = "#28a745";
        break;
    }

    return { nivel, texto, color };
  }, []);

  // Validar contraseña en tiempo real
  useEffect(() => {
    if (newPassword) {
      const fortaleza = calcularFortalezaPassword(newPassword);
      setFortalezaPassword(fortaleza);

      setValidaciones({
        tieneMayuscula: /[A-Z]/.test(newPassword),
        tieneMinuscula: /[a-z]/.test(newPassword),
        tieneNumero: /[0-9]/.test(newPassword),
        longitudMinima: newPassword.length >= 8,
      });
    } else {
      setFortalezaPassword({ nivel: 0, texto: "Muy Débil", color: "#dc3545" });
      setValidaciones({
        tieneMayuscula: false,
        tieneMinuscula: false,
        tieneNumero: false,
        longitudMinima: false,
      });
    }
  }, [newPassword, calcularFortalezaPassword]);

  // Validar coincidencia de contraseñas
  useEffect(() => {
    if (confirmPassword) {
      setConfirmPasswordMatch(newPassword === confirmPassword);
    } else {
      setConfirmPasswordMatch(null);
    }
  }, [newPassword, confirmPassword]);

  // Función reutilizable para obtener los datos del usuario
  const fetchUsuarioData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/usuario/perfil/${usuarioId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsuarioData(data);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario");
    }
  }, [usuarioId]);

  // Refrescar datos (por ejemplo, usado por NavbarView)
  const refreshUserData = useCallback(() => {
    if (usuarioId) fetchUsuarioData();
  }, [usuarioId, fetchUsuarioData]);

  // useEffect inicial
  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    fetchUsuarioData();
  }, [usuarioId, navigate, fetchUsuarioData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    // Validar que cumple requisitos mínimos
    if (!validaciones.tieneMayuscula || !validaciones.tieneMinuscula || 
        !validaciones.tieneNumero || !validaciones.longitudMinima) {
      setMensaje("❌ La contraseña no cumple con los requisitos mínimos");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/usuario/cambiar-password/${usuarioId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actual: password,
            nueva: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Mostrar modal en lugar de mensaje
        setShowSuccessModal(true);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMensaje("");

        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setMensaje(`❌ ${data.detail || "Error al cambiar contraseña"}`);
      }
    } catch {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      password &&
      newPassword &&
      confirmPassword &&
      confirmPasswordMatch &&
      validaciones.tieneMayuscula &&
      validaciones.tieneMinuscula &&
      validaciones.tieneNumero &&
      validaciones.longitudMinima
    );
  };

  return (
    <>
      <NavbarView
        usuarioData={usuarioData}
        onRefreshUserData={refreshUserData}
      />

      <div
        className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d]"
        style={{
          backgroundImage: `url(${bogotaNight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">

          <div className="flex w-full max-w-5xl justify-center">
            {/* Panel único: formulario */}
            <motion.div
              className="w-full max-w-md flex items-center justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >

              <motion.form
                onSubmit={handleSubmit}
                className="bg-white/95 backdrop-blur-md border border-[#c9d6e8] rounded-2xl p-8 w-full max-w-md shadow-xl"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <h2 className="text-2xl font-bold text-[#002855] text-center mb-2">
                  Cambiar Contraseña
                </h2>

                {/* Contraseña Actual */}
                <div className="form-group1 relative">
                  <label htmlFor="password">Contraseña Actual</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Ingrese su clave"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Nueva Contraseña */}
                <div className="form-group1 relative">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Ingrese nueva clave"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={
                      showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showNewPassword ? "🙈" : "👁️"}
                  </button>

                  {/* Barra de fortaleza de contraseña */}
                  {newPassword && (
                    <div className="password-strength-container">
                      <div className="password-strength-bar">
                        <div
                          className="password-strength-fill"
                          style={{
                            width: `${(fortalezaPassword.nivel / 4) * 100}%`,
                            backgroundColor: fortalezaPassword.color,
                          }}
                        ></div>
                      </div>
                      <span
                        className="password-strength-text"
                        style={{ color: fortalezaPassword.color }}
                      >
                        {fortalezaPassword.texto}
                      </span>
                    </div>
                  )}

                  {/* Lista de validaciones */}
                  {newPassword && (
                    <div className="password-requirements">
                      <p className="requirements-title">La contraseña debe contener:</p>
                      <ul className="requirements-list">
                        <li
                          className={
                            validaciones.longitudMinima ? "valid" : "invalid"
                          }
                        >
                          {validaciones.longitudMinima ? "✓" : "○"} Mínimo 8 caracteres
                        </li>
                        <li
                          className={
                            validaciones.tieneMayuscula ? "valid" : "invalid"
                          }
                        >
                          {validaciones.tieneMayuscula ? "✓" : "○"} Una letra mayúscula
                        </li>
                        <li
                          className={
                            validaciones.tieneMinuscula ? "valid" : "invalid"
                          }
                        >
                          {validaciones.tieneMinuscula ? "✓" : "○"} Una letra minúscula
                        </li>
                        <li className={validaciones.tieneNumero ? "valid" : "invalid"}>
                          {validaciones.tieneNumero ? "✓" : "○"} Un número
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div className="form-group1 relative">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirme nueva clave"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>

                  {/* Indicador de coincidencia */}
                  {confirmPassword && (
                    <small
                      className={`password-match ${
                        confirmPasswordMatch ? "match" : "no-match"
                      }`}
                    >
                      {confirmPasswordMatch
                        ? "✓ Las contraseñas coinciden"
                        : "✗ Las contraseñas no coinciden"}
                    </small>
                  )}
                </div>

                {mensaje && <p className="mensaje1 mt-2">{mensaje}</p>}

                <button
                  type="submit"
                  className="form-submit-btn1"
                  disabled={!isFormValid()}
                  style={{
                    opacity: isFormValid() ? 1 : 0.5,
                    cursor: isFormValid() ? "pointer" : "not-allowed",
                  }}
                >
                  Actualizar Contraseña
                </button>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div
          className="success-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="success-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-modal-logo-bg">
              <img
                src={Logo}
                alt="BogotaTuris"
                className="modal-logo-watermark"
              />
            </div>
            <div className="success-modal-body">
              <div className="success-icon">
                <svg viewBox="0 0 52 52" className="checkmark">
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h2 className="success-title">¡Contraseña Actualizada!</h2>
              <p className="success-message">
                Tu contraseña se ha cambiado exitosamente
              </p>
              <button
                className="success-close-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default CambiarPassword;