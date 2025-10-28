import { useState } from 'react';
const useLoginValidation = () => {
  const [formData, setFormData] = useState({
    correo: '',
    clave: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL de tu API - AJUSTA ESTO A TU CONFIGURACIÓN
  const API_URL = 'http://localhost:8000';

  // Función para validar email
  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'El correo es obligatorio';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }
    return '';
  };

  // Función para validar contraseña
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return 'La contraseña es obligatoria';
    }
    if (password.length < 8) {
      return `Contraseña debe tener números, 1 Mayúscula, Minúsculas (tienes ${password.length})`;
    }
    return '';
  };

  // Validar un campo específico
  const validateField = (name, value) => {
    let error = '';

    if (name === 'correo') {
      error = validateEmail(value);
    } else if (name === 'clave') {
      error = validatePassword(value);
    }

    return error;
  };

  // Manejar cambios en los inputs - VALIDACIÓN EN TIEMPO REAL
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualizar el valor del campo
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Marcar el campo como tocado SIEMPRE que se escriba algo
    if (value.length > 0) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }

    // Validar en tiempo real SIEMPRE mientras escribe
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
      general: ''
    }));

    setSuccessMessage('');
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Marcar como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar al salir del campo
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};

    newErrors.correo = validateEmail(formData.correo);
    newErrors.clave = validatePassword(formData.clave);

    return newErrors;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      correo: true,
      clave: true
    });

    // Validar todo el formulario
    const newErrors = validateForm();
    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (hasErrors) {
      return;
    }

    // ✅ LLAMADA REAL A TU API DE FASTAPI
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          clave: formData.clave
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores de la API
        throw new Error(data.detail || 'Error al iniciar sesión');
      }

      // ✅ Login exitoso
      setSuccessMessage('¡Inicio de sesión exitoso!');
      setErrors({});
<<<<<<< HEAD

      // Guardar el token en localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('usuario_id', data.usuario_id);

      console.log('Login exitoso:', data);

      // Redirigir al perfil del usuario después de 1 segundo
setTimeout(() => {
  window.location.href = `/usuario/${data.usuario_id}`;
}, 1000);

=======
      
      // Guardar el token y datos del usuario en localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('usuario_id', data.usuario_id);
      localStorage.setItem('user_rol', data.rol);
      localStorage.setItem('id_rol', data.id_rol);
      
      console.log('Login exitoso:', data);
      
      // Redirigir según el rol del usuario después de 1 segundo
      setTimeout(() => {
        if (data.rol === 'administrador') {
          window.location.href = `/admin/${data.usuario_id}`;
        } else {
          window.location.href = `/usuario/${data.usuario_id}`;
        }
      }, 1000);
      
>>>>>>> 93b0132 (subiendo cambios de registro, bd, inicio de sesión y vista admin)
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({
        general: error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    touched,
    successMessage,
    isLoading,
    handleInputChange,
    handleBlur,
    handleSubmit
  };
};

export default useLoginValidation;