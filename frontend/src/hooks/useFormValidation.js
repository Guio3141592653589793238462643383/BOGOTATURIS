import { useState, useCallback, useEffect, useRef } from 'react';

const useFormValidation = () => {
  const emailTimeoutRef = useRef(null);
  
  const [formData, setFormData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    confirmarCorreo: '',
    clave: '',
    confirmarClave: '',
    nacionalidad: '',
    intereses: [],
    acepto_terminos: false,
    acepto_tratamiento_datos: false
  });

  // Estado de validación (true/false/null)
  const [validationState, setValidationState] = useState({
    primer_nombre: null,
    segundo_nombre: true,  // Opcional, válido por defecto
    primer_apellido: null,
    segundo_apellido: true,  // Opcional, válido por defecto
    correo: null,
    confirmarCorreo: null,
    clave: null,
    confirmarClave: null,
    nacionalidad: null,
    intereses: null,
    acepto_terminos: null,
    acepto_tratamiento_datos: null
  });

  // Estados para tracking de visualización de PDFs
  const [pdfVisualizado, setPdfVisualizado] = useState({
    terminos: false,
    tratamiento_datos: false
  });
  
  const [sessionId] = useState(() => {
    // Generar un ID único de sesión para tracking
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      }
    } catch (error) {
      console.error('Error de conexión al cargar nacionalidades:', error);
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
      return { valido: true, mensaje: '' };
    }
  };

  // Validaciones específicas
  const validatePrimerNombre = useCallback((valor) => {
    const esValido = valor.trim().length >= 2;

    if (!esValido) {
      updateMessage('primerNombre', 'error', 'El primer nombre debe tener al menos 2 letras');
      updateMessage('primerNombre', 'exito', '');
    } else {
      updateMessage('primerNombre', 'error', '');
      updateMessage('primerNombre', 'exito', '✓ Primer nombre válido');
    }

    markField('primer_nombre', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateSegundoNombre = useCallback((valor) => {
    const esValido = valor.trim() === '' || valor.trim().length >= 2;

    if (!esValido) {
      updateMessage('segundoNombre', 'error', 'El segundo nombre debe tener al menos 2 letras');
      updateMessage('segundoNombre', 'exito', '');
    } else {
      updateMessage('segundoNombre', 'error', '');
      updateMessage('segundoNombre', 'exito', valor ? '✓ Segundo nombre válido' : '');
    }

    markField('segundo_nombre', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validatePrimerApellido = useCallback((valor) => {
    const esValido = valor.trim().length >= 2;

    if (!esValido) {
      updateMessage('primerApellido', 'error', 'El primer apellido debe tener al menos 2 letras');
      updateMessage('primerApellido', 'exito', '');
    } else {
      updateMessage('primerApellido', 'error', '');
      updateMessage('primerApellido', 'exito', '✓ Primer apellido válido');
    }

    markField('primer_apellido', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateSegundoApellido = useCallback((valor) => {
    const esValido = valor.trim() === '' || valor.trim().length >= 2;

    if (!esValido) {
      updateMessage('segundoApellido', 'error', 'El segundo apellido debe tener al menos 2 letras');
      updateMessage('segundoApellido', 'exito', '');
    } else {
      updateMessage('segundoApellido', 'error', '');
      updateMessage('segundoApellido', 'exito', valor ? '✓ Segundo apellido válido' : '');
    }

    markField('segundo_apellido', esValido);
    return esValido;
  }, [updateMessage, markField]);

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

const validatePrimerApellido = useCallback((valor) => {
  const esValido = valor.trim().length >= 2;

  if (!esValido) {
    updateMessage('primerApellido', 'error', 'El primer apellido debe tener al menos 2 letras');
    updateMessage('primerApellido', 'exito', '');
  } else {
    updateMessage('primerApellido', 'error', '');
    updateMessage('primerApellido', 'exito', '✓ Primer apellido válido');
  }

  markField('primer_apellido', esValido);
  return esValido;
}, [updateMessage, markField]);

const validateSegundoApellido = useCallback((valor) => {
  const esValido = valor.trim() === '' || valor.trim().length >= 2;

  if (!esValido) {
    updateMessage('segundoApellido', 'error', 'El segundo apellido debe tener al menos 2 letras');
    updateMessage('segundoApellido', 'exito', '');
  } else {
    updateMessage('segundoApellido', 'error', '');
    updateMessage('segundoApellido', 'exito', valor ? '✓ Segundo apellido válido' : '');
  }

  markField('segundo_apellido', esValido);
  return esValido;
}, [updateMessage, markField]);

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

const calcularFortalezaPassword = useCallback((clave) => {
  if (!clave) return { nivel: 0, texto: 'Muy Débil', color: '#dc3545' };
  
  let nivel = 0;
  let texto = 'Muy Débil';
  let color = '#dc3545';
  
  // Solo verificamos la longitud mínima como requisito
  const cumpleLongitud = clave.length >= 8;
  
  // El resto son sugerencias de fortaleza
  if (/[a-z]/.test(clave)) nivel++;
  if (/[A-Z]/.test(clave)) nivel++;
  if (/[0-9]/.test(clave)) nivel++;
  if (/[^A-Za-z0-9]/.test(clave)) nivel++;
  
  // Ajustar el nivel basado en la longitud
  if (clave.length >= 12) nivel = Math.min(4, nivel + 1);
  
  // Solo mostrar como válido si cumple con la longitud mínima
  if (cumpleLongitud) {
    switch (nivel) {
      case 0:
      case 1:
        texto = 'Débil';
        color = '#fd7e14';
        break;
      case 2:
        texto = 'Moderada';
        color = '#ffc107';
        break;
      case 3:
        texto = 'Fuerte';
        color = '#28a745';
        break;
      case 4:
        texto = 'Muy Fuerte';
        color = '#20c997';
        break;
      default:
        texto = 'Válida';
        color = '#28a745';
    }
  } else {
    texto = 'Muy Corta';
    color = '#dc3545';
  }
  
  return { nivel, texto, color, valida: cumpleLongitud };
}, []);

const validateConfirmarClaveHelper = useCallback((valor, claveOriginal) => {
  const esValido = valor.length > 0 && valor === claveOriginal;

  if (!esValido) {
    updateMessage('confirmarClave', 'error', 'Las contraseñas no coinciden');
    updateMessage('confirmarClave', 'exito', '');
  } else {
    updateMessage('confirmarClave', 'error', '');
    updateMessage('confirmarClave', 'exito', '✓ Contraseñas coinciden');
  }
    if (!esValido) {
      updateMessage('confirmarClave', 'error', 'Las contraseñas no coinciden');
      updateMessage('confirmarClave', 'exito', '');
    } else {
      updateMessage('confirmarClave', 'error', '');
      updateMessage('confirmarClave', 'exito', '✓ Contraseñas coinciden');
    }

    markField('confirmarClave', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const confirmarClave = useCallback((valor) => {
    const fortaleza = calcularFortalezaPassword(valor);
    setPasswordStrength(fortaleza);
    
    // Solo validamos la longitud mínima
    const esValido = valor.length >= 8;
    
    // Actualizamos los mensajes
    if (valor.length === 0) {
      updateMessage('clave', 'error', 'La contraseña es obligatoria');
      updateMessage('clave', 'exito', '');
    } else if (!esValido) {
      updateMessage('clave', 'error', 'La contraseña debe tener al menos 8 caracteres');
      updateMessage('clave', 'exito', '');
    } else {
      // Mostrar sugerencia de fortaleza como mensaje de éxito
      updateMessage('clave', 'error', '');
      updateMessage('clave', 'exito', `✓ ${fortaleza.texto}${fortaleza.nivel < 2 ? ' (Sugerencia: usa mayúsculas, minúsculas, números o símbolos para mayor seguridad)' : ''}`);
    }
    
    markField('clave', esValido);
    
    return esValido;
  }, [calcularFortalezaPassword, markField, updateMessage]);

  const validateNacionalidad = useCallback(async (valor) => {
    const esValido = valor !== "id_nac" && valor !== null;
    
    if (!esValido) {
      updateMessage('nacionalidad', 'error', 'Debes seleccionar tu nacionalidad');
      updateMessage('nacionalidad', 'exito', '');
      markField('nacionalidad', false);
      return false;
    }

    const valorNumerico = Number(valor);

    setValidatingNacionalidad(true);
    const validacionServidor = await validarConServidor('id_nac', valorNumerico);
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

  // ✅ NUEVAS VALIDACIONES PARA POLÍTICAS
  const validateTerminos = useCallback((valor) => {
    if (!pdfVisualizado.terminos) {
      updateMessage('aceptoTerminos', 'error', 'Debes visualizar el documento antes de aceptar');
      updateMessage('aceptoTerminos', 'exito', '');
      markField('acepto_terminos', false);
      return false;
    }
    
    const esValido = valor === true;
    
    if (!esValido) {
      updateMessage('aceptoTerminos', 'error', 'Debes aceptar los términos y condiciones');
      updateMessage('aceptoTerminos', 'exito', '');
    } else {
      updateMessage('aceptoTerminos', 'error', '');
      updateMessage('aceptoTerminos', 'exito', '✓ Términos aceptados');
    }
    
    markField('acepto_terminos', esValido);
    return esValido;
  }, [updateMessage, markField, pdfVisualizado.terminos]);

  const validateTratamientoDatos = useCallback((valor) => {
    if (!pdfVisualizado.tratamiento_datos) {
      updateMessage('aceptoTratamientoDatos', 'error', 'Debes visualizar el documento antes de aceptar');
      updateMessage('aceptoTratamientoDatos', 'exito', '');
      markField('acepto_tratamiento_datos', false);
      return false;
    }
    
    const esValido = valor === true;
    
    if (!esValido) {
      updateMessage('aceptoTratamientoDatos', 'error', 'Debes aceptar el tratamiento de datos');
      updateMessage('aceptoTratamientoDatos', 'exito', '');
    } else {
      updateMessage('aceptoTratamientoDatos', 'error', '');
      updateMessage('aceptoTratamientoDatos', 'exito', '✓ Tratamiento de datos aceptado');
    }
    
    markField('acepto_tratamiento_datos', esValido);
    return esValido;
  }, [updateMessage, markField, pdfVisualizado.tratamiento_datos]);

  // Función para registrar visualización de PDF
  const registrarVisualizacionPDF = useCallback(async (tipoDocumento, tiempoVisualizacion) => {
    try {
      const response = await fetch('http://localhost:8000/api/politicas/registrar-visualizacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          tipo_documento: tipoDocumento,
          tiempo_visualizacion: tiempoVisualizacion
        })
      });

      if (response.ok) {
        setPdfVisualizado(prev => ({
          ...prev,
          [tipoDocumento]: true
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al registrar visualización:', error);
      return false;
    }
  }, [sessionId]);

  // Manejador general de inputs
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar en tiempo real
    switch (name) {
      case 'primer_nombre':
        validatePrimerNombre(newValue);
        break;
      case 'segundo_nombre':
        validateSegundoNombre(newValue);
        break;
      case 'primer_apellido':
        validatePrimerApellido(newValue);
        break;
      case 'segundo_apellido':
        validateSegundoApellido(newValue);
        break;
      case 'correo':
        if (emailTimeoutRef.current) {
          clearTimeout(emailTimeoutRef.current);
        }
        
        if (newValue.length > 5) {
          emailTimeoutRef.current = setTimeout(() => {
            validateCorreo(newValue);
          }, 800);
        }
        break;
      case 'confirmarCorreo':
        validateConfirmarCorreoHelper(newValue, formData.correo);
        break;
      case 'clave':
        confirmarClave(newValue);
        break;
      case 'confirmarClave':
        validateConfirmarClaveHelper(newValue, formData.clave);
        break;
      case 'nacionalidad':
        if (newValue) {
          validateNacionalidad(newValue);
        }
        break;
      case 'acepto_terminos':
        validateTerminos(newValue);
        break;
      case 'acepto_tratamiento_datos':
        validateTratamientoDatos(newValue);
        break;
    }
  }, [
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido,
    validateCorreo, 
    validateConfirmarCorreoHelper,
    confirmarClave, 
    validateConfirmarClaveHelper, 
    validateNacionalidad, 
    validateTerminos,
    validateTratamientoDatos,
    formData.correo,
    formData.clave
  ]);

  // Effect para revalidar confirmaciones
  useEffect(() => {
    if (formData.confirmarCorreo) {
      validateConfirmarCorreoHelper(formData.confirmarCorreo, formData.correo);
    }
  }, [formData.correo, formData.confirmarCorreo, validateConfirmarCorreoHelper]);

  useEffect(() => {
    if (formData.confirmarClave) {
      validateConfirmarClaveHelper(formData.confirmarClave, formData.clave);
    }
  }, [formData.clave, formData.confirmarClave, validateConfirmarClaveHelper]);

  // Manejador específico para intereses
  const handleInteresesChange = useCallback((e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const nuevosIntereses = checked 
        ? [...prev.intereses, value]
        : prev.intereses.filter(interes => interes !== value);
      
      validateIntereses(nuevosIntereses);
      
      return {
        ...prev,
        intereses: nuevosIntereses
      };
    });
  }, [validateIntereses]);

// Calcular progreso del formulario
const calcularProgreso = useCallback(() => {
  // Campos obligatorios: 12 (todos los campos del formulario)
  const camposObligatorios = [
    'primer_nombre',
    'segundo_nombre',
    'primer_apellido',
    'segundo_apellido',
    'correo',
    'confirmarCorreo',
    'clave',
    'confirmarClave',
    'nacionalidad',
    'intereses',
    'acepto_terminos',
    'acepto_tratamiento_datos'
  ];
  
  const camposValidosObligatorios = camposObligatorios.filter(
    campo => validationState[campo] === true
  ).length;
  
  return Math.round((camposValidosObligatorios / camposObligatorios.length) * 100);
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

  // Validar todo el formulario (sin políticas, esas se validan por separado)
  const validarTodoElFormulario = useCallback(async () => {
    const resultadosSync = [
      validatePrimerNombre(formData.primer_nombre),
      validateSegundoNombre(formData.segundo_nombre),
      validatePrimerApellido(formData.primer_apellido),
      validateSegundoApellido(formData.segundo_apellido),
      validateConfirmarCorreoHelper(formData.confirmarCorreo, formData.correo),
      confirmarClave(formData.clave),
      validateConfirmarClaveHelper(formData.confirmarClave, formData.clave),
      validateIntereses(formData.intereses)
      // Las políticas se validan por separado con usePoliticas
    ];
    
    const resultadosAsync = await Promise.all([
      validateCorreo(formData.correo),
      validateNacionalidad(formData.nacionalidad)
    ]);
    
    const todosLosResultados = [...resultadosSync, ...resultadosAsync];
    return todosLosResultados.every(resultado => resultado === true);
  }, [
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido, 
    validateConfirmarCorreoHelper,
    confirmarClave, 
    validateConfirmarClaveHelper, 
    validateIntereses,
    validateCorreo, 
    validateNacionalidad,
    formData
  ]);

  // Función para actualizar manualmente el estado de validación
  const updateValidationState = useCallback((campo, valor) => {
    setValidationState(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  // Función para reiniciar el formulario
  const resetForm = useCallback(() => {
    setFormData({
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      correo: '',
      confirmarCorreo: '',
      clave: '',
      confirmarClave: '',
      nacionalidad: '',
      intereses: [],
      acepto_terminos: false,
      acepto_tratamiento_datos: false
    });
    setValidationState({
      primer_nombre: null,
      segundo_nombre: true,  // Opcional, válido por defecto
      primer_apellido: null,
      segundo_apellido: true,  // Opcional, válido por defecto
      correo: null,
      confirmarCorreo: null,
      clave: null,
      confirmarClave: null,
      nacionalidad: null,
      intereses: null,
      acepto_terminos: null,
      acepto_tratamiento_datos: null
    });
    setMessages({});
    setPasswordStrength({ 
      nivel: 0, 
      texto: 'Muy Débil', 
      color: '#dc3545' 
    });
    setPdfVisualizado({
      terminos: false,
      tratamiento_datos: false
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
    pdfVisualizado,
    sessionId,
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
    validarTodoElFormulario,
    resetForm,
    cargarDatosIniciales,
    registrarVisualizacionPDF,
    updateValidationState
  };
};

export default useFormValidation;
