
import useLoginValidation from "../hooks/Validacion_login";
const LoginPage = () => {
  const {
    formData,
    errors,
    successMessage,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useLoginValidation();

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
              className={errors.correo ? "error-input" : ""}
              disabled={isLoading}
              autoComplete="email"
              required
            />
            {errors.correo && <p className="error">{errors.correo}</p>}
            {!errors.correo && formData.correo && (
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
              className={errors.clave ? "error-input" : ""}
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
            {errors.clave && <p className="error">{errors.clave}</p>}
            {!errors.clave && formData.clave && (
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
                <span className="spinner" ></span>
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