import useLoginValidation from "../hooks/Validacion_login";
import { useEffect } from "react";

const LoginPage = () => {
  const {
    formData,
    errors,
    touched,
    successMessage,
    isLoading,
    handleInputChange,
    handleBlur,
    handleSubmit,
  } = useLoginValidation();
  
  // Verificar si ya hay una sesión activa y redirigir
  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    const userRol = localStorage.getItem("user_rol");
    
    if (usuarioId && userRol) {
      if (userRol === "administrador") {
        window.location.href = `/admin/${usuarioId}`;
      } else {
        window.location.href = `/usuario/${usuarioId}`;
      }
    }
  }, []);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              placeholder="usuario@dominio.com"
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.correo ? "error-input" : ""}
              disabled={isLoading}
              autoComplete="email"
              required
            />
            {/* Mostrar error si existe */}
            {errors.correo && (
              <p className="error">{errors.correo}</p>
            )}
            {/* Mostrar éxito SOLO si NO hay error y el campo tiene contenido válido */}
            {!errors.correo && formData.correo && touched.correo && (
              <p className="success">✓ Email válido</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="clave">Contraseña *</label>
            <input
              type="password"
              id="clave"
              name="clave"
              value={formData.clave}
              placeholder="Mínimo 8 caracteres"
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.clave ? "error-input" : ""}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
            {/* Mostrar error si existe */}
            {errors.clave && (
              <p className="error">{errors.clave}</p>
            )}
            {/* Mostrar éxito SOLO si NO hay error y el campo tiene contenido válido */}
            {!errors.clave && formData.clave && touched.clave && (
              <p className="success">✓ Contraseña válida</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Validando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {errors.general && (
          <div className="alert error-alert">
            <p className="error">{errors.general}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="alert success-alert">
            <p className="success">{successMessage}</p>
          </div>
        )}

        <div className="register-link">
          <p>¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;