import { useState, useCallback } from 'react';

const useFormValidation = () => {
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
  const [passwordStrength, setPasswordStrength] = useState({ nivel: 0, texto: 'Muy Débil', color: '#dc3545' });

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

  // Validaciones específicas
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

  const validateCorreo = useCallback((valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esValido = emailRegex.test(valor);
    
    if (!esValido) {
      updateMessage('correo', 'error', 'Formato de email inválido');
      updateMessage('correo', 'exito', '');
    } else {
      updateMessage('correo', 'error', '');
      updateMessage('correo', 'exito', '✓ Email válido');
    }
    
    markField('correo', esValido);
    
    // Revalidar confirmación si existe
    if (formData.confirmarCorreo) {
      validateConfirmarCorreo(formData.confirmarCorreo, valor);
    }
    
    return esValido;
  }, [updateMessage, markField, formData.confirmarCorreo]);

  const validateConfirmarCorreo = useCallback((valor, correoOriginal = formData.correo) => {
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
  }, [updateMessage, markField, formData.correo]);

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

  const validatePassword = useCallback((valor) => {
    const fortaleza = calcularFortalezaPassword(valor);
    setPasswordStrength(fortaleza);
    
    const esValido = valor.length >= 8 && fortaleza.nivel >= 1;
    
    if (!esValido) {
      updateMessage('password', 'error', 'Contraseña débil. Debe tener 8+ caracteres y ser compleja.');
      updateMessage('password', 'exito', '');
    } else {
      updateMessage('password', 'error', '');
      updateMessage('password', 'exito', `✓ Contraseña ${fortaleza.texto}`);
    }
    
    markField('password', esValido);
    
    // Revalidar confirmación si existe
    if (formData.confirmarPassword) {
      validateConfirmarPassword(formData.confirmarPassword, valor);
    }
    
    return esValido;
  }, [calcularFortalezaPassword, updateMessage, markField, formData.confirmarPassword]);

  const validateConfirmarPassword = useCallback((valor, passwordOriginal = formData.password) => {
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
  }, [updateMessage, markField, formData.password]);

  const validateNacionalidad = useCallback((valor) => {
    const esValido = valor !== "" && valor !== null;
    
    if (!esValido) {
      updateMessage('nacionalidad', 'error', 'Debes seleccionar tu nacionalidad');
      updateMessage('nacionalidad', 'exito', '');
    } else {
      updateMessage('nacionalidad', 'error', '');
      updateMessage('nacionalidad', 'exito', '✓ Nacionalidad seleccionada');
    }
    
    markField('nacionalidad', esValido);
    return esValido;
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
      case 'nombreCompleto':
        validateNombre(newValue);
        break;
      case 'apellidoCompleto':
        validateApellido(newValue);
        break;
      case 'correo':
        validateCorreo(newValue);
        break;
      case 'confirmarCorreo':
        validateConfirmarCorreo(newValue);
        break;
      case 'password':
        validatePassword(newValue);
        break;
      case 'confirmarPassword':
        validateConfirmarPassword(newValue);
        break;
      case 'nacionalidad':
        validateNacionalidad(newValue);
        break;
      case 'terminos':
        validateTerminos(newValue);
        break;
    }
  }, [
    validateNombre, validateApellido, validateCorreo, validateConfirmarCorreo,
    validatePassword, validateConfirmarPassword, validateNacionalidad, validateTerminos
  ]);

  // Manejador específico para intereses (checkboxes múltiples)
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

  // Validar todo el formulario (para submit)
  const validarTodoElFormulario = useCallback(() => {
    const resultados = [
      validateNombre(formData.nombreCompleto),
      validateApellido(formData.apellidoCompleto),
      validateCorreo(formData.correo),
      validateConfirmarCorreo(formData.confirmarCorreo),
      validatePassword(formData.password),
      validateConfirmarPassword(formData.confirmarPassword),
      validateNacionalidad(formData.nacionalidad),
      validateIntereses(formData.intereses),
      validateTerminos(formData.terminos)
    ];
    
    return resultados.every(resultado => resultado === true);
  }, [
    formData,
    validateNombre, validateApellido, validateCorreo, validateConfirmarCorreo,
    validatePassword, validateConfirmarPassword, validateNacionalidad, 
    validateIntereses, validateTerminos
  ]);

  return {
    formData,
    validationState,
    messages,
    passwordStrength,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
    validarTodoElFormulario
  };
};

export default useFormValidation;