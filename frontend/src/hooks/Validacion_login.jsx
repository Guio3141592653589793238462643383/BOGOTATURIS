import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useLoginValidation = () => {
  const [formData, setFormData] = useState({ correo: "", clave: "" });
  const [errors, setErrors] = useState({ correo: "", clave: "", general: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  // ✅ CORREGIDO: Sin el "1" extra
  const LOGIN_ENDPOINT = "http://localhost:8000/api/usuario/login";

  const validateCorreo = useCallback((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, correo: "El correo es obligatorio" }));
      return false;
    }
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, correo: "Formato de correo inválido" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, correo: "" }));
    return true;
  }, []);

  const validateClave = useCallback((value) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, clave: "La contraseña es obligatoria" }));
      return false;
    }
    if (value.length < 8) {
      setErrors((prev) => ({ ...prev, clave: "Debe tener al menos 8 caracteres" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, clave: "" }));
    return true;
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, general: "" }));
    setSuccessMessage("");
  }, []);

  const validateAllFields = useCallback(() => {
    const correoValid = validateCorreo(formData.correo);
    const claveValid = validateClave(formData.clave);
    return correoValid && claveValid;
  }, [formData.correo, formData.clave, validateCorreo, validateClave]);

  
  // ✅ FUNCIÓN ACTUALIZADA para manejar login exitoso
  const handleLoginSuccess = useCallback((userData) => {
  console.log("✅ Login exitoso, guardando datos:", userData);
      
    // 🔧 CAMBIO: Usar localStorage en lugar de sessionStorage para consistencia con UserView
    localStorage.setItem("usuario_id", userData.usuario_id.toString());
    localStorage.setItem("user_email", formData.correo);
    localStorage.setItem("loginTime", Date.now().toString());
        if (userData.access_token) {
      localStorage.setItem("token", userData.access_token);
    }
        if (userData.access_token) {
      localStorage.setItem("token", userData.access_token);
    }
    
    setUsuarioId(userData.usuario_id);
    setSuccessMessage(userData.message || "¡Login exitoso! Redirigiendo...");

    // ✅ Redirigir a UserView después de 1 segundo
    setTimeout(() => {
      console.log(`🔄 Redirigiendo a /usuario/${userData.usuario_id}`);
      navigate(`/usuario/${userData.usuario_id}`);
    }, 1000);
  }, [navigate, formData.correo]); // Agregar formData.correo como dependencia


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors((prev) => ({ ...prev, general: "" }));
      setSuccessMessage("");

      if (!validateAllFields()) {
        setIsLoading(false);
        return;
      }

      try {
        const requestBody = {
          correo: formData.correo,
          clave: formData.clave,
        };

        console.log("🚀 Enviando petición a:", LOGIN_ENDPOINT);
        console.log("📧 Datos:", requestBody);
        console.log("Enviando a login:", {
          correo: formData.correo,
          clave: formData.clave,
        });
        const response = await fetch(LOGIN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("📡 Respuesta status:", response.status);

        const data = await response.json();
        console.log("📄 Respuesta data:", data);

        if (response.ok) {
          handleLoginSuccess(data);
        } else {
          let errorMessage = "Credenciales inválidas";

          if (response.status === 401) {
            // ✅ MENSAJE ESPECÍFICO para credenciales hardcodeadas
            errorMessage = "Correo o contraseña incorrectos";
          } else if (response.status >= 500) {
            errorMessage = "Error del servidor. Intenta más tarde";
          } else if (data.detail) {
            errorMessage = data.detail;
          }

          setErrors((prev) => ({
            ...prev,
            general: errorMessage,
          }));
        }
      } catch (error) {
        console.error("❌ Login error:", error);

        let errorMessage = "Error de conexión";
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          errorMessage = "No se puede conectar al servidor. Verifica que esté ejecutándose en http://localhost:8000";
        }

        setErrors((prev) => ({
          ...prev,
          general: errorMessage,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateAllFields, handleLoginSuccess]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setUsuarioId(null);
    navigate("/login");
  }, [navigate]);

  return {
    formData,
    errors,
    successMessage,
    isLoading,
    usuarioId,
    handleInputChange,
    handleSubmit,
    logout,
  };
};

export default useLoginValidation;