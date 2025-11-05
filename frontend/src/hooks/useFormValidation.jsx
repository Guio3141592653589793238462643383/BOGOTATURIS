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
  const [validatingEmail, setValidatingEmail] = useState(false);
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
    // Si el campo está vacío, es válido (es opcional)
    if (!valor || valor.trim() === '') {
      updateMessage('segundoNombre', 'error', '');
      updateMessage('segundoNombre', 'exito', '');
      markField('segundo_nombre', true);
      return true;
    }
    
    // Si tiene valor, debe tener al menos 2 caracteres
    const esValido = valor.trim().length >= 2;
    
    if (!esValido) {
      updateMessage('segundoNombre', 'error', 'Si lo ingresas, el segundo nombre debe tener al menos 2 letras');
      updateMessage('segundoNombre', 'exito', '');
    } else {
      updateMessage('segundoNombre', 'error', '');
      updateMessage('segundoNombre', 'exito', '✓ Segundo nombre válido');
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
    // Si el campo está vacío, es válido (es opcional)
    if (!valor || valor.trim() === '') {
      updateMessage('segundoApellido', 'error', '');
      updateMessage('segundoApellido', 'exito', '');
      markField('segundo_apellido', true);
      return true;
    }
    
    // Si tiene valor, debe tener al menos 2 caracteres
    const esValido = valor.trim().length >= 2;
    
    if (!esValido) {
      updateMessage('segundoApellido', 'error', 'Si lo ingresas, el segundo apellido debe tener al menos 2 letras');
      updateMessage('segundoApellido', 'exito', '');
    } else {
      updateMessage('segundoApellido', 'error', '');
      updateMessage('segundoApellido', 'exito', '✓ Segundo apellido válido');
    }

    markField('segundo_apellido', esValido);
    return esValido;
  }, [updateMessage, markField]);

  const validateCorreo = useCallback(async (valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formatoValido = emailRegex.test(valor);
    
    if (!formatoValido) {
      updateMessage('correo', 'error', 'Formato de correo electrónico no válido');
      updateMessage('correo', 'exito', '');
      markField('correo', false);
      return false;
    }

    // Validar disponibilidad del correo en el servidor
    setValidatingEmail(true);
    try {
      const data = await validarConServidor('correo', valor);
      
      if (!data.valido) {
        updateMessage('correo', 'error', data.mensaje || 'Correo no disponible');
        updateMessage('correo', 'exito', '');
        markField('correo', false);
        return false;
      }
      
      updateMessage('correo', 'error', '');
      updateMessage('correo', 'exito', '✓ Correo electrónico válido');
      markField('correo', true);
      return true;
    } catch (error) {
      console.error('Error al validar correo:', error);
      updateMessage('correo', 'error', 'Error al validar el correo');
      updateMessage('correo', 'exito', '');
      markField('correo', false);
      return false;
    } finally {
      setValidatingEmail(false);
    }
  }, [markField, updateMessage]);

  const validateConfirmarCorreo = useCallback((valor, correoOriginal) => {
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
  }, [markField, updateMessage]);

  const calcularFortalezaPassword = (clave) => {
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
  };

  const validateClave = useCallback((valor) => {
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
  }, [markField, updateMessage]);

  const validateConfirmarClave = useCallback((valor, claveOriginal) => {
    const esValido = valor === claveOriginal && valor.length > 0;
    
    if (!esValido) {
      updateMessage('confirmarClave', 'error', 'Las contraseñas no coinciden');
      updateMessage('confirmarClave', 'exito', '');
    } else {
      updateMessage('confirmarClave', 'error', '');
      updateMessage('confirmarClave', 'exito', '✓ Contraseñas coinciden');
    }
    
    markField('confirmarClave', esValido);
    return esValido;
  }, [markField, updateMessage]);

  const validateNacionalidad = useCallback(async (valor) => {
    if (!valor) {
      updateMessage('nacionalidad', 'error', 'Debes seleccionar una nacionalidad');
      updateMessage('nacionalidad', 'exito', '');
      markField('nacionalidad', false);
      return false;
    }

    setValidatingNacionalidad(true);
    try {
      const data = await validarConServidor('id_nac', valor);
      
      if (!data.valido) {
        updateMessage('nacionalidad', 'error', data.mensaje || 'Nacionalidad no válida');
        updateMessage('nacionalidad', 'exito', '');
        markField('nacionalidad', false);
        return false;
      }
      
      updateMessage('nacionalidad', 'error', '');
      updateMessage('nacionalidad', 'exito', '✓ Nacionalidad válida');
      markField('nacionalidad', true);
      return true;
    } catch (error) {
      console.error('Error al validar nacionalidad:', error);
      updateMessage('nacionalidad', 'error', 'Error al validar la nacionalidad');
      updateMessage('nacionalidad', 'exito', '');
      markField('nacionalidad', false);
      return false;
    } finally {
      setValidatingNacionalidad(false);
    }
  }, [markField, updateMessage]);

  const validateIntereses = useCallback((valor) => {
    const esValido = Array.isArray(valor) && valor.length > 0;
    
    if (!esValido) {
      updateMessage('intereses', 'error', 'Debes seleccionar al menos un interés');
      updateMessage('intereses', 'exito', '');
    } else {
      updateMessage('intereses', 'error', '');
      updateMessage('intereses', 'exito', `✓ ${valor.length} interés(es) seleccionado(s)`);
    }
    
    markField('intereses', esValido);
    return esValido;
  }, [markField, updateMessage]);

  const validateTerminos = useCallback((valor) => {
    const esValido = valor === true;
    
    if (!esValido) {
      updateMessage('aceptoTerminos', 'error', 'Debes aceptar los términos y condiciones');
      updateMessage('aceptoTerminos', 'exito', '');
    } else {
      updateMessage('aceptoTerminos', 'error', '');
      updateMessage('aceptoTerminos', 'exito', '✓ Términos y condiciones aceptados');
    }
    
    markField('acepto_terminos', esValido);
    return esValido;
  }, [markField, updateMessage]);

  const validateTratamientoDatos = useCallback((valor) => {
    const esValido = valor === true;
    
    if (!esValido) {
      updateMessage('aceptoTratamientoDatos', 'error', 'Debes aceptar la política de tratamiento de datos');
      updateMessage('aceptoTratamientoDatos', 'exito', '');
    } else {
      updateMessage('aceptoTratamientoDatos', 'error', '');
      updateMessage('aceptoTratamientoDatos', 'exito', '✓ Política de tratamiento de datos aceptada');
    }
    
    markField('acepto_tratamiento_datos', esValido);
    return esValido;
  }, [markField, updateMessage]);

  // Manejador de cambios en los inputs
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Validar el campo cambiado
    switch (name) {
      case 'primer_nombre':
        validatePrimerNombre(inputValue);
        break;
      case 'segundo_nombre':
        validateSegundoNombre(inputValue);
        break;
      case 'primer_apellido':
        validatePrimerApellido(inputValue);
        break;
      case 'segundo_apellido':
        validateSegundoApellido(inputValue);
        break;
      case 'correo':
        // Usar un timeout para evitar múltiples llamadas al servidor
        if (emailTimeoutRef.current) {
          clearTimeout(emailTimeoutRef.current);
        }
        emailTimeoutRef.current = setTimeout(() => {
          validateCorreo(inputValue);
          // Validar también el campo de confirmación si tiene valor
          if (formData.confirmarCorreo) {
            validateConfirmarCorreo(formData.confirmarCorreo, inputValue);
          }
        }, 500);
        break;
      case 'confirmarCorreo':
        validateConfirmarCorreo(inputValue, formData.correo);
        break;
      case 'clave':
        validateClave(inputValue);
        // Validar también el campo de confirmación si tiene valor
        if (formData.confirmarClave) {
          validateConfirmarClave(formData.confirmarClave, inputValue);
        }
        break;
      case 'confirmarClave':
        validateConfirmarClave(inputValue, formData.clave);
        break;
      case 'nacionalidad':
        validateNacionalidad(inputValue);
        break;
      case 'intereses':
        // Manejar selección múltiple de intereses
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
          ...prev,
          intereses: selectedOptions
        }));
        validateIntereses(selectedOptions);
        break;
      case 'acepto_terminos':
        validateTerminos(inputValue);
        break;
      case 'acepto_tratamiento_datos':
        validateTratamientoDatos(inputValue);
        break;
      default:
        break;
    }
  }, [
    formData.correo,
    formData.confirmarCorreo,
    formData.clave,
    formData.confirmarClave,
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido,
    validateCorreo,
    validateConfirmarCorreo,
    validateClave,
    validateConfirmarClave,
    validateNacionalidad,
    validateIntereses,
    validateTerminos,
    validateTratamientoDatos
  ]);

  // Manejador para cambios en los checkboxes de políticas
  const handlePoliticaChange = useCallback((e) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // Validar el checkbox cambiado
    if (name === 'acepto_terminos') {
      validateTerminos(checked);
    } else if (name === 'acepto_tratamiento_datos') {
      validateTratamientoDatos(checked);
    }
  }, [validateTerminos, validateTratamientoDatos]);

  // Manejador para cambios en los intereses (para checkboxes)
  const handleInteresesChange = useCallback((e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      // Si el checkbox está marcado, agregamos el valor al array de intereses
      // Si no está marcado, lo eliminamos
      const newIntereses = checked
        ? [...(prev.intereses || []), value]
        : (prev.intereses || []).filter(interes => interes !== value);
      
      return {
        ...prev,
        intereses: newIntereses
      };
    });
    
    // Validar los intereses después de actualizar el estado
    validateIntereses(
      checked 
        ? [...(formData.intereses || []), value] 
        : (formData.intereses || []).filter(interes => interes !== value)
    );
  }, [formData.intereses, validateIntereses]);

  // Calcular progreso del formulario
  const calcularProgreso = useCallback(() => {
    // Solo contamos los campos obligatorios
    const camposObligatorios = {
      primer_nombre: validationState.primer_nombre,
      primer_apellido: validationState.primer_apellido,
      correo: validationState.correo,
      confirmarCorreo: validationState.confirmarCorreo,
      clave: validationState.clave,
      confirmarClave: validationState.confirmarClave,
      nacionalidad: validationState.nacionalidad,
      intereses: validationState.intereses,
      acepto_terminos: validationState.acepto_terminos,
      acepto_tratamiento_datos: validationState.acepto_tratamiento_datos
    };
    
    // Solo contamos los campos obligatorios que son verdaderos
    const camposCompletados = Object.values(camposObligatorios).filter(Boolean).length;
    const totalCampos = Object.keys(camposObligatorios).length;
    
    // Calculamos el porcentaje, asegurando que esté entre 0 y 100
    const porcentaje = Math.round((camposCompletados / totalCampos) * 100);
    return Math.min(100, Math.max(0, porcentaje));
  }, [validationState]);

  // Estado de completitud del formulario
  const formularioCompleto = useCallback(() => {
    return (
      validationState.primer_nombre === true &&
      validationState.primer_apellido === true &&
      validationState.correo === true &&
      validationState.confirmarCorreo === true &&
      validationState.clave === true &&
      validationState.confirmarClave === true &&
      validationState.nacionalidad === true &&
      validationState.intereses === true &&
      validationState.acepto_terminos === true &&
      validationState.acepto_tratamiento_datos === true
    );
  }, [validationState]);

  // Función para validar todo el formulario (solo campos obligatorios)
  const validarTodoElFormulario = useCallback(async (politicas) => {
    // Validar campos obligatorios
    const validaciones = [
      validatePrimerNombre(formData.primer_nombre),
      validatePrimerApellido(formData.primer_apellido),
      await validateCorreo(formData.correo),
      validateConfirmarCorreo(formData.confirmarCorreo, formData.correo),
      validateClave(formData.clave),
      validateConfirmarClave(formData.confirmarClave, formData.clave),
      await validateNacionalidad(formData.nacionalidad),
      validateIntereses(formData.intereses),
      validateTerminos(politicas.acepto_terminos),
      validateTratamientoDatos(politicas.acepto_tratamiento_datos)
    ];
    
    // Validar campos opcionales solo si tienen valor
    if (formData.segundo_nombre?.trim()) {
      validaciones.push(validateSegundoNombre(formData.segundo_nombre));
    }
    
    if (formData.segundo_apellido?.trim()) {
      validaciones.push(validateSegundoApellido(formData.segundo_apellido));
    }

    return validaciones.every(Boolean);
  }, [
    formData.primer_nombre,
    formData.primer_apellido,
    formData.correo,
    formData.confirmarCorreo,
    formData.clave,
    formData.confirmarClave,
    formData.nacionalidad,
    formData.intereses,
    formData.segundo_nombre,
    formData.segundo_apellido,
    formData.correo,
    formData.confirmarCorreo,
    formData.clave,
    formData.confirmarClave,
    formData.nacionalidad,
    formData.intereses,
    formData.acepto_terminos,
    formData.acepto_tratamiento_datos,
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido,
    validateCorreo,
    validateConfirmarCorreo,
    validateClave,
    validateConfirmarClave,
    validateNacionalidad,
    validateIntereses,
    validateTerminos,
    validateTratamientoDatos
  ]);

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
      segundo_nombre: true,
      primer_apellido: null,
      segundo_apellido: true,
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
    setPasswordStrength({ nivel: 0, texto: 'Muy Débil', color: '#dc3545' });
  }, []);

  // Función para actualizar el estado de validación
  const updateValidationState = useCallback((field, isValid) => {
    markField(field, isValid);
  }, [markField]);

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
    validatePrimerNombre,
    validateSegundoNombre,
    validatePrimerApellido,
    validateSegundoApellido,
    validateCorreo,
    validateConfirmarCorreo,
    validateClave,
    validateConfirmarClave,
    validateNacionalidad,
    validateIntereses,
    validateTerminos,
    validateTratamientoDatos,
    handleInputChange,
    handleInteresesChange,
    handlePoliticaChange,
    calcularProgreso,
    formularioCompleto,
    validarTodoElFormulario,
    resetForm,
    updateValidationState,
    pdfVisualizado,
    setPdfVisualizado,
    sessionId
  };
};

export default useFormValidation;
