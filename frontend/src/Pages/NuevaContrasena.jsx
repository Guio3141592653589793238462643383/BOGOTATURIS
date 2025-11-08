import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../services/api';

const NuevaContrasena = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Token de restablecimiento no válido');
      navigate('/solicitar-restablecimiento');
      return;
    }
    setToken(tokenParam);
    
    // Verificar si el token es válido
    const verificarToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usuario/verificar-token/${tokenParam}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail?.message || 'Token inválido o expirado');
        }
        setIsTokenValid(true);
      } catch (error) {
        console.error('Error al verificar el token:', error);
        toast.error(error.message || 'El enlace de restablecimiento ha expirado o ya ha sido utilizado');
        navigate('/solicitar-restablecimiento');
      } finally {
        setIsLoading(false);
      }
    };
    
    verificarToken();
  }, [searchParams, navigate]);

  const validatePassword = (pass) => {
    if (!pass) return 'La contraseña es obligatoria';
    if (pass.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pass)) return 'Debe contener al menos una mayúscula';
    if (!/[a-z]/.test(pass)) return 'Debe contener al menos una minúscula';
    if (!/\d/.test(pass)) return 'Debe contener al menos un número';
    return '';
  };

  const validateForm = () => {
    const passwordError = validatePassword(password);
    let isValid = true;
    const newErrors = {};

    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/restablecer-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          nueva_password: password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail?.message || 'Error al restablecer la contraseña');
      }

      // Mostrar mensaje de éxito
      toast.success(data.message || 'Contraseña actualizada correctamente');
      
      // Redirigir a la ruta especificada por el servidor o a /login por defecto
      const redirectTo = data.redirect_to || '/login';
      navigate(redirectTo);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast.error(error.message || 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Verificando enlace de restablecimiento...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Enlace no válido</h2>
          <p className="text-gray-700 mb-6">
            El enlace de restablecimiento ha expirado o ya ha sido utilizado.
          </p>
          <button
            onClick={() => navigate('/solicitar-restablecimiento')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Establecer nueva contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa y confirma tu nueva contraseña
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas y números"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Vuelve a escribir tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaContrasena;
