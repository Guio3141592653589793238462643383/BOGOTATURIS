import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    correo: '',
    clave: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar el error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (name === 'correo') {
      if (!value) {
        newErrors.correo = 'El correo es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.correo = 'El correo no es válido';
      } else {
        delete newErrors.correo;
      }
    }
    
    if (name === 'clave') {
      if (!value) {
        newErrors.clave = 'La contraseña es obligatoria';
      } else if (value.length < 6) {
        newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        delete newErrors.clave;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasMinLength) return 'La contraseña debe tener al menos 8 caracteres';
    if (!hasUpperCase) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!hasLowerCase) return 'La contraseña debe contener al menos una letra minúscula';
    if (!hasNumbers) return 'La contraseña debe contener al menos un número';
    if (!hasSpecialChar) return 'La contraseña debe contener al menos un carácter especial';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de correo
    if (!formData.correo) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    
    // Validación de contraseña
    if (!formData.clave) {
      newErrors.clave = 'La contraseña es obligatoria';
    } else {
      const passwordError = validatePassword(formData.clave);
      if (passwordError) {
        newErrors.clave = passwordError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const result = await login(formData.correo, formData.clave);
      
      if (result?.success) {
        setSuccessMessage('Inicio de sesión exitoso');
        toast.success('Inicio de sesión exitoso');
        
        // Redirigir según el rol del usuario
        const userRole = localStorage.getItem('user_rol');
        const userId = localStorage.getItem('usuario_id');
        
        if (userRole === 'administrador') {
          navigate(`/admin/${userId}`);
        } else {
          navigate(`/usuario/${userId}`);
        }
      } else {
        setErrors({
          general: result?.error || 'Credenciales inválidas. Por favor, inténtalo de nuevo.'
        });
        toast.error(result?.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setErrors({
        general: 'Error al conectar con el servidor. Por favor, inténtalo más tarde.'
      });
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si ya hay una sesión activa y redirigir según el rol
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userRole = localStorage.getItem('user_rol');
        const userId = localStorage.getItem('usuario_id');
        
        if (token && userRole && userId) {
          if (userRole === 'administrador') {
            navigate(`/admin/${userId}`);
          } else {
            navigate(`/usuario/${userId}`);
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      }
    };
    
    checkAuth();
  }, [navigate]);

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
            {errors.correo && (
              <p className="error">{errors.correo}</p>
            )}
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
            {errors.clave && (
              <p className="error">{errors.clave}</p>
            )}
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