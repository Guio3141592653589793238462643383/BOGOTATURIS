import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gestionar políticas y términos
 * Este hook es independiente y no afecta el formulario existente
 */
const usePoliticas = () => {
  // Estados para tracking de visualización de PDFs
  const [pdfVisualizado, setPdfVisualizado] = useState({
    terminos: false,
    tratamiento_datos: false
  });
  
  // Session ID único para tracking antes del registro
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  // Estados para los checkboxes de políticas
  const [politicasAceptadas, setPoliticasAceptadas] = useState({
    acepto_terminos: false,
    acepto_tratamiento_datos: false
  });

  // Mensajes de validación
  const [mensajesPoliticas, setMensajesPoliticas] = useState({
    errorTerminos: '',
    exitoTerminos: '',
    errorTratamientoDatos: '',
    exitoTratamientoDatos: ''
  });

  /**
   * Registra la visualización de un PDF en el backend
   */
  const registrarVisualizacionPDF = useCallback(async (tipoPDF, tiempoVisualizacion) => {
    try {
      const response = await fetch('http://localhost:8000/api/politicas/registrar-visualizacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          tipo_documento: tipoPDF,
          tiempo_visualizacion: tiempoVisualizacion
        })
      });

      if (response.ok) {
        // Marcar como visualizado
        setPdfVisualizado(prev => ({
          ...prev,
          [tipoPDF]: true
        }));
        
        console.log(`✅ PDF ${tipoPDF} registrado como visualizado`);
      }
      
    } catch (error) {
      console.error('Error al registrar visualización:', error);
    }
  }, [sessionId]);

  /**
   * Maneja el cambio de los checkboxes de políticas
   */
  const handlePoliticaChange = useCallback((tipo, valor) => {
    // Validar que haya visualizado el PDF primero
    const tipoPDF = tipo === 'acepto_terminos' ? 'terminos' : 'tratamiento_datos';
    
    if (!pdfVisualizado[tipoPDF] && valor) {
      // Intentó marcar sin ver el PDF
      const mensajeError = tipo === 'acepto_terminos' 
        ? 'Debes leer los términos y condiciones antes de aceptar'
        : 'Debes leer la política de tratamiento de datos antes de aceptar';
      
      setMensajesPoliticas(prev => ({
        ...prev,
        [tipo === 'acepto_terminos' ? 'errorTerminos' : 'errorTratamientoDatos']: mensajeError
      }));
      
      return false;
    }

    // Actualizar estado
    setPoliticasAceptadas(prev => ({
      ...prev,
      [tipo]: valor
    }));

    // Actualizar mensajes
    if (valor) {
      const mensajeExito = tipo === 'acepto_terminos'
        ? '✓ Términos aceptados'
        : '✓ Tratamiento de datos aceptado';
      
      setMensajesPoliticas(prev => ({
        ...prev,
        [tipo === 'acepto_terminos' ? 'errorTerminos' : 'errorTratamientoDatos']: '',
        [tipo === 'acepto_terminos' ? 'exitoTerminos' : 'exitoTratamientoDatos']: mensajeExito
      }));
    } else {
      setMensajesPoliticas(prev => ({
        ...prev,
        [tipo === 'acepto_terminos' ? 'errorTerminos' : 'errorTratamientoDatos']: '',
        [tipo === 'acepto_terminos' ? 'exitoTerminos' : 'exitoTratamientoDatos']: ''
      }));
    }

    return true;
  }, [pdfVisualizado]);

  /**
   * Valida que ambas políticas estén aceptadas
   */
  const validarPoliticas = useCallback(() => {
    const terminosValidos = pdfVisualizado.terminos && politicasAceptadas.acepto_terminos;
    const tratamientoValido = pdfVisualizado.tratamiento_datos && politicasAceptadas.acepto_tratamiento_datos;

    if (!terminosValidos) {
      setMensajesPoliticas(prev => ({
        ...prev,
        errorTerminos: pdfVisualizado.terminos 
          ? 'Debes aceptar los términos y condiciones'
          : 'Debes leer y aceptar los términos y condiciones'
      }));
    }

    if (!tratamientoValido) {
      setMensajesPoliticas(prev => ({
        ...prev,
        errorTratamientoDatos: pdfVisualizado.tratamiento_datos
          ? 'Debes aceptar el tratamiento de datos personales'
          : 'Debes leer y aceptar la política de tratamiento de datos'
      }));
    }

    return terminosValidos && tratamientoValido;
  }, [pdfVisualizado, politicasAceptadas]);

  /**
   * Verifica si ambas políticas están completas
   */
  const politicasCompletas = useCallback(() => {
    return pdfVisualizado.terminos && 
           pdfVisualizado.tratamiento_datos &&
           politicasAceptadas.acepto_terminos && 
           politicasAceptadas.acepto_tratamiento_datos;
  }, [pdfVisualizado, politicasAceptadas]);

  /**
   * Resetea el estado de políticas
   */
  const resetPoliticas = useCallback(() => {
    setPdfVisualizado({
      terminos: false,
      tratamiento_datos: false
    });
    setPoliticasAceptadas({
      acepto_terminos: false,
      acepto_tratamiento_datos: false
    });
    setMensajesPoliticas({
      errorTerminos: '',
      exitoTerminos: '',
      errorTratamientoDatos: '',
      exitoTratamientoDatos: ''
    });
  }, []);

  return {
    // Estados
    pdfVisualizado,
    sessionId,
    politicasAceptadas,
    mensajesPoliticas,
    
    // Funciones
    registrarVisualizacionPDF,
    handlePoliticaChange,
    validarPoliticas,
    politicasCompletas,
    resetPoliticas
  };
};

export default usePoliticas;
