import { useState, useCallback, useEffect, useRef } from 'react';

const useFormValidation = () => {
  const emailTimeoutRef = useRef(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    apellidoCompleto: '',
    correo: '',
    confirmarCorreo: '',
    password: '',
    confirmarPassword: '',
    nacionalidad: '',
    intereses: [],
    terminos: false
  });

  // Estado de validación (true/false/null)
  const [validationState, setValidationState] = useState({
    nombreCompleto: null,
    apellidoCompleto: null,
    correo: null,
    confirmarCorreo: null,
    password: null,
    confirmarPassword: null,
    nacionalidad: null,
    intereses: null,
    terminos: null
  });

  // Mensajes de error y éxito
  const [messages, setMessages] = useState({});

  // Fortaleza de contraseña
  const [passwordStrength, setPasswordStrength] = useState({ 
    nivel: 0, 
    texto: 'Muy Débil', 
    color: '#dc3545' 
  });

  // Estados para datos dinámicos del servidor
  const [nacionalidades, setNacionalidades] = useState([]);
  const [interesesDisponibles, setInteresesDisponibles] = useState([]);
  const [loadingNacionalidades, setLoadingNacionalidades] = useState(false);
  const [loadingIntereses, setLoadingIntereses] = useState(false);

  // Estados para validación asíncrona
  const [validatingEmail] = useState(false);
  const [validatingNacionalidad, setValidatingNacionalidad] = useState(false);

  // Cargar nacionalidades e intereses al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    await Promise.all([
      cargarNacionalidades(),
      cargarIntereses()
    ]);
  };

  const cargarNacionalidades = async () => {
    setLoadingNacionalidades(true);
    try {
      const response = await fetch('http://localhost:8000/api/usuario/nacionalidades');
      if (response.ok) {
        const data = await response.json();
        setNacionalidades(data);
      } else {
        console.error('Error al cargar nacionalidades');
        // Fallback con datos locales si tienes el JSON
      }
    } catch (error) {
      console.error('Error de conexión al cargar nacionalidades:', error);
      // Aquí podrías cargar desde tu archivo JSON local como fallback
    } finally {
      setLoadingNacionalidades(false);
    }
  };

  const cargarIntereses = async () => {
    setLoadingIntereses(true);
    try {
      const response = await fetch('http://localhost:8000/api/usuario/intereses');
      if (response.ok) {
        const data = await response.json();
        setInteresesDisponibles(data);
      } else {
        console.error('Error al cargar intereses');
      }
    } catch (error) {
      console.error('Error de conexión al cargar intereses:', error);
    } finally {
      setLoadingIntereses(false);
    }
  };

  // Función para actualizar mensajes
  const updateMessage = useCallback((field, type, message) => {
    setMessages(prev => ({
      ...prev,
      [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]: message
    }));
  }, []);

  // Función para marcar campo como válido/inválido
  const markField = useCallback((field, isValid) => {
    setValidationState(prev => ({
      ...prev,
      [field]: isValid
    }));
  }, []);

  // Validación asíncrona del servidor
  const validarConServidor = async (campo, valor) => {
    try {
      const response = await fetch('http://localhost:8000/api/usuario/validar-campo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campo, valor })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validando con servidor:', error);
      return { valido: true, mensaje: '' }; // No bloquear por errores de red
    }
  };

  // Validaciones específicas (SIN dependencias circulares)
  const validateNombre = useCallback((valor) => {
    const nombres = valor.trim().split(' ').filter(n => n.length > 0);
    const esValido = nombres.length >= 2 && valor.length >= 3;
    
    if (!esValido) {
      updateMessage('nombre', 'error', 'Ingresa al menos 2 nombres completos');
      updateMessage('nombre', 'exito', '');
    } else {
      updateMessage('nombre', 'error', '');
      updateMessage('nombre', 'exito', '✓ Nombre completo válido');
    }
    
    markField('nombreCompleto', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateApellido = useCallback((valor) => {
    const apellidos = valor.trim().split(' ').filter(a => a.length > 0);
    const esValido = apellidos.length >= 2 && valor.length >= 3;
    
    if (!esValido) {
      updateMessage('apellido', 'error', 'Ingresa al menos 2 apellidos completos');
      updateMessage('apellido', 'exito', '');
    } else {
      updateMessage('apellido', 'error', '');
      updateMessage('apellido', 'exito', '✓ Apellido completo válido');
    }
    
    markField('apellidoCompleto', esValido);
    return esValido;
  }, [updateMessage, markField]);

  // FUNCIÓN AUXILIAR PARA VALIDAR CONFIRMACIÓN DE CORREO
  const validateConfirmarCorreoHelper = useCallback((valor, correoOriginal) => {
    const esValido = valor === correoOriginal && valor.length > 0;
    
    if (!esValido) {
      updateMessage('confirmarCorreo', 'error', 'Los correos no coinciden');
      updateMessage('confirmarCorreo', 'exito', '');
    } else {
      updateMessage('confirmarCorreo', 'error', '');
      updateMessage('confirmarCorreo', 'exito', '✓ Correos coinciden');
    }
    
    markField('confirmarCorreo', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateCorreo = useCallback(async (valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formatoValido = emailRegex.test(valor);
    
    if (!formatoValido) {
      updateMessage('correo', 'error', 'Formato de email inválido');
      updateMessage('correo', 'exito', '');
      markField('correo', false);
      return false;
    }

    updateMessage('correo', 'error', '');
    updateMessage('correo', 'exito', '✓ Email válido y disponible');
    markField('correo', true);
    
    return true;
  }, [updateMessage, markField]);


  // Calcular fortaleza de contraseña
  const calcularFortalezaPassword = useCallback((password) => {
    let nivel = 0;
    let texto = 'Muy Débil';
    let color = '#dc3545';
    
    if (/[a-z]/.test(password)) nivel++;
    if (/[A-Z]/.test(password)) nivel++;
    if (/[0-9]/.test(password)) nivel++;
    if (/[^A-Za-z0-9]/.test(password)) nivel++;
    
    switch (nivel) {
      case 1:
        texto = 'Débil';
        color = '#dc3545';
        break;
      case 2:
        texto = 'Aceptable';
        color = '#ffc107';
        break;
      case 3:
        texto = 'Fuerte';
        color = '#17a2b8';
        break;
      case 4:
        texto = 'Muy Fuerte';
        color = '#28a745';
        break;
    }
    
    return { nivel, texto, color };
  }, []);

  // FUNCIÓN AUXILIAR PARA VALIDAR CONFIRMACIÓN DE PASSWORD
  const validateConfirmarPasswordHelper = useCallback((valor, passwordOriginal) => {
    const esValido = valor === passwordOriginal && valor.length > 0;
    
    if (!esValido) {
      updateMessage('confirmarPassword', 'error', 'Las contraseñas no coinciden');
      updateMessage('confirmarPassword', 'exito', '');
    } else {
      updateMessage('confirmarPassword', 'error', '');
      updateMessage('confirmarPassword', 'exito', '✓ Contraseñas coinciden');
    }
    
    markField('confirmarPassword', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validatePassword = useCallback((valor) => {
    const fortaleza = calcularFortalezaPassword(valor);
    setPasswordStrength(fortaleza);
    
    const esValido = valor.length >= 8 && fortaleza.nivel >= 2;
    
    if (!esValido) {
      if (valor.length < 8) {
        updateMessage('password', 'error', 'Contraseña debe tener al menos 8 caracteres');
      } else {
        updateMessage('password', 'error', 'Contraseña muy débil. Debe contener al menos 2 tipos de caracteres');
      }
      updateMessage('password', 'exito', '');
    } else {
      updateMessage('password', 'error', '');
      updateMessage('password', 'exito', `✓ Contraseña ${fortaleza.texto}`);
    }
    
    markField('password', esValido);
    
    return esValido;
  }, [calcularFortalezaPassword, markField, updateMessage]);


  const validateNacionalidad = useCallback(async (valor) => {
    const esValido = valor !== "" && valor !== null;
    
    if (!esValido) {
      updateMessage('nacionalidad', 'error', 'Debes seleccionar tu nacionalidad');
      updateMessage('nacionalidad', 'exito', '');
      markField('nacionalidad', false);
      return false;
    }

    // Validar con el servidor si la nacionalidad existe
    setValidatingNacionalidad(true);
    const validacionServidor = await validarConServidor('nacionalidad', valor);
    setValidatingNacionalidad(false);

    if (!validacionServidor.valido) {
      updateMessage('nacionalidad', 'error', validacionServidor.mensaje);
      updateMessage('nacionalidad', 'exito', '');
      markField('nacionalidad', false);
      return false;
    }

    updateMessage('nacionalidad', 'error', '');
    updateMessage('nacionalidad', 'exito', '✓ Nacionalidad seleccionada');
    markField('nacionalidad', true);
    return true;
  }, [updateMessage, markField]);

  const validateIntereses = useCallback((intereses) => {
    const esValido = intereses.length > 0;
    
    if (!esValido) {
      updateMessage('intereses', 'error', 'Selecciona al menos un interés turístico');
      updateMessage('intereses', 'exito', '');
    } else {
      updateMessage('intereses', 'error', '');
      const mensaje = intereses.length === 1 ? 
        '✓ Has seleccionado 1 interés' : 
        `✓ Has seleccionado ${intereses.length} intereses`;
      updateMessage('intereses', 'exito', mensaje);
    }
    
    markField('intereses', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateTerminos = useCallback((valor) => {
    const esValido = valor === true;
    
    if (!esValido) {
      updateMessage('terminos', 'error', 'Debes aceptar los términos y condiciones');
      updateMessage('terminos', 'exito', '');
    } else {
      updateMessage('terminos', 'error', '');
      updateMessage('terminos', 'exito', '✓ Términos aceptados');
    }
    
    markField('terminos', esValido);
    return esValido;
  }, [updateMessage, markField]);

  // Manejador general de inputs (CORREGIDO)
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar en tiempo real
    switch (name) {
      case 'nombreCompleto':
        validateNombre(newValue);
        break;
      case 'apellidoCompleto':
        validateApellido(newValue);
        break;
      case 'correo':
        if (emailTimeoutRef.current) {
          clearTimeout(emailTimeoutRef.current);
        }
        
        // Validación con servidor con debounce solo si hay contenido suficiente
        if (newValue.length > 5) {
          emailTimeoutRef.current = setTimeout(() => {
            validateCorreo(newValue);
          }, 800);
        }
        break;
      case 'confirmarCorreo':
        validateConfirmarCorreoHelper(newValue, formData.correo);
        break;
      case 'password':
        validatePassword(newValue);
        break;
      case 'confirmarPassword':
        validateConfirmarPasswordHelper(newValue, formData.password);
        break;
      case 'nacionalidad':
        if (newValue) {
          validateNacionalidad(newValue);
        }
        break;
      case 'terminos':
        validateTerminos(newValue);
        break;
    }
  }, [
    validateNombre, 
    validateApellido, 
    validateCorreo, 
    validateConfirmarCorreoHelper,
    validatePassword, 
    validateConfirmarPasswordHelper, 
    validateNacionalidad, 
    validateTerminos,
    formData.correo,
    formData.password
  ]);

  // Effect para revalidar confirmaciones cuando cambian los campos originales
  useEffect(() => {
    if (formData.confirmarCorreo) {
      validateConfirmarCorreoHelper(formData.confirmarCorreo, formData.correo);
    }
  }, [formData.correo, formData.confirmarCorreo, validateConfirmarCorreoHelper]);

  useEffect(() => {
    if (formData.confirmarPassword) {
      validateConfirmarPasswordHelper(formData.confirmarPassword, formData.password);
    }
  }, [formData.password, formData.confirmarPassword, validateConfirmarPasswordHelper]);

  // Manejador específico para intereses
  const handleInteresesChange = useCallback((e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const nuevosIntereses = checked 
        ? [...prev.intereses, value]
        : prev.intereses.filter(interes => interes !== value);
      
      // Validar inmediatamente
      validateIntereses(nuevosIntereses);
      
      return {
        ...prev,
        intereses: nuevosIntereses
      };
    });
  }, [validateIntereses]);

  // Calcular progreso del formulario
  const calcularProgreso = useCallback(() => {
    const totalCampos = 9;
    const camposValidos = Object.values(validationState).filter(valido => valido === true).length;
    return Math.round((camposValidos / totalCampos) * 100);
  }, [validationState]);

  // Verificar si formulario está completo
  const formularioCompleto = useCallback(() => {
    return Object.values(validationState).every(valido => valido === true);
  }, [validationState]);

  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
    };
  }, []);

  // Validar todo el formulario
  const validarTodoElFormulario = useCallback(async () => {
    // Validar todos los campos síncronos primero
    const resultadosSync = [
      validateNombre(formData.nombreCompleto),
      validateApellido(formData.apellidoCompleto),
      validateConfirmarCorreoHelper(formData.confirmarCorreo, formData.correo),
      validatePassword(formData.password),
      validateConfirmarPasswordHelper(formData.confirmarPassword, formData.password),
      validateIntereses(formData.intereses),
      validateTerminos(formData.terminos)
    ];
    
    // Validar campos asíncronos
    const resultadosAsync = await Promise.all([
      validateCorreo(formData.correo),
      validateNacionalidad(formData.nacionalidad)
    ]);
    
    const todosLosResultados = [...resultadosSync, ...resultadosAsync];
    return todosLosResultados.every(resultado => resultado === true);
  }, [
    validateNombre, 
    validateApellido, 
    validateConfirmarCorreoHelper,
    validatePassword, 
    validateConfirmarPasswordHelper, 
    validateIntereses, 
    validateTerminos,
    validateCorreo, 
    validateNacionalidad,
    formData
  ]);

  // Función para reiniciar el formulario
  const resetForm = useCallback(() => {
    setFormData({
      nombreCompleto: '',
      apellidoCompleto: '',
      correo: '',
      confirmarCorreo: '',
      password: '',
      confirmarPassword: '',
      nacionalidad: '',
      intereses: [],
      terminos: false
    });
    setValidationState({
      nombreCompleto: null,
      apellidoCompleto: null,
      correo: null,
      confirmarCorreo: null,
      password: null,
      confirmarPassword: null,
      nacionalidad: null,
      intereses: null,
      terminos: null
    });
    setMessages({});
    setPasswordStrength({ 
      nivel: 0, 
      texto: 'Muy Débil', 
      color: '#dc3545' 
    });
  }, []);

  return {
    formData,
    validationState,
    messages,
    passwordStrength,
    nacionalidades,
    interesesDisponibles,
    loadingNacionalidades,
    loadingIntereses,
    validatingEmail,
    validatingNacionalidad,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
    validarTodoElFormulario,
    resetForm,
    cargarDatosIniciales
  };
};

export default useFormValidation;