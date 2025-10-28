import "../assets/css/FormSignUp.css";
import useFormValidation from "../hooks/useFormValidation";
import usePoliticas from "../hooks/usePoliticas";
import PDFModal from "../components/PDFModal";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const FormSignUp = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();
  const [showTerminosModal, setShowTerminosModal] = useState(false); 
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const {
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
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
    validarTodoElFormulario,
    resetForm,
    updateValidationState
  } = useFormValidation();

  // Hook de políticas
  const {
    pdfVisualizado,
    sessionId,
    politicasAceptadas,
    mensajesPoliticas,
    registrarVisualizacionPDF,
    handlePoliticaChange,
    validarPoliticas,
    politicasCompletas,
    resetPoliticas
  } = usePoliticas();

  // Sincronizar el estado de políticas con validationState
  useEffect(() => {
    // Actualizar acepto_terminos
    if (pdfVisualizado.terminos && politicasAceptadas.acepto_terminos) {
      updateValidationState('acepto_terminos', true);
    } else {
      updateValidationState('acepto_terminos', null);
    }
  }, [pdfVisualizado.terminos, politicasAceptadas.acepto_terminos, updateValidationState]);

  useEffect(() => {
    // Actualizar acepto_tratamiento_datos
    if (pdfVisualizado.tratamiento_datos && politicasAceptadas.acepto_tratamiento_datos) {
      updateValidationState('acepto_tratamiento_datos', true);
    } else {
      updateValidationState('acepto_tratamiento_datos', null);
    }
  }, [pdfVisualizado.tratamiento_datos, politicasAceptadas.acepto_tratamiento_datos, updateValidationState]);

  // Manejador de envío del formulario (mejorado)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo el formulario primero
    const esValido = await validarTodoElFormulario();

    if (!esValido) {
      alert("Por favor completa todos los campos requeridos correctamente");
      return;
    }

    // Validar políticas
    if (!validarPoliticas()) {
      alert("Debes leer y aceptar las políticas antes de registrarte");
      return;
    }

    const datosFormulario = {
      primer_nombre: formData.primer_nombre,
      segundo_nombre: formData.segundo_nombre || null,
      primer_apellido: formData.primer_apellido,
      segundo_apellido: formData.segundo_apellido || null,
      correo: formData.correo,
      clave: formData.clave,
      nacionalidad: formData.nacionalidad,
      intereses: Array.isArray(formData.intereses) ? formData.intereses : [],
      acepto_terminos: politicasAceptadas.acepto_terminos,
      acepto_tratamiento_datos: politicasAceptadas.acepto_tratamiento_datos,
      session_id: sessionId
    };



    try {
      const response = await fetch("http://localhost:8000/api/usuario/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(datosFormulario),
      })

      const resultado = await response.json();

      if (response.ok) {
        console.log('Usuario registrado exitosamente:', resultado);
        setShowWelcomeModal(true);

        // Limpiar formulario y políticas después del éxito
        resetForm();
        resetPoliticas();

        // Opcional: redirigir a otra página
        // window.location.href = '/login';

      } else {
        console.error('Error del servidor:', resultado);

        // Manejar diferentes tipos de errores del backend
        let mensajeError = 'Error en el registro. Verifica los datos.';

        if (resultado.detail) {
          if (typeof resultado.detail === 'object') {
            // Error con información de campo específico
            if (resultado.detail.detail) {
              mensajeError = resultado.detail.detail;
            }
            if (resultado.detail.campo) {
              mensajeError += ` (Campo: ${resultado.detail.campo})`;
            }
          } else if (typeof resultado.detail === 'string') {
            mensajeError = resultado.detail;
          }
        }

        alert(`Error: ${mensajeError}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:8000');
    }
  };

  const progreso = calcularProgreso();

  // Generar opciones de nacionalidades dinámicamente
  const renderNacionalidades = () => {
    if (loadingNacionalidades) {
      return <option value="">Cargando nacionalidades...</option>;
    }

    if (nacionalidades.length === 0) {
      return (
        <option value="" disabled>
          No se encontraron nacionalidades
        </option>
      );
    }

    return (
      <>
        <option value="" disabled>
          Selecciona una opción
        </option>
        {nacionalidades.map((nac) => (
          <option key={nac.id_nac} value={nac.id_nac}>
            {nac.nacionalidad}
          </option>
        ))}
      </>
    );
  };

  // Generar intereses dinámicamente desde el servidor
  const renderIntereses = () => {
    if (loadingIntereses || interesesDisponibles.length === 0) {
      // Fallback con intereses estáticos
      const interesesEstaticos = [
        "Aventureros", "Arte", "Gastronomía", "Naturaleza", "Conciertos",
        "Escalada", "Museos", "Eventos", "Yoga", "Bares", "Danza",
        "Cultura", "Deportes", "Historia", "Festivales", "Talleres",
        "Cocinar", "Ecoturismo", "Concursos", "Discotecas"
      ];

      return interesesEstaticos.map((interes, index) => (
        <tr key={`static-${index}`}>
          <td className="checkbox-col">
            <input
              type="checkbox"
              name="intereses"
              value={interes}
              checked={formData.intereses?.includes(interes)}
              onChange={handleInteresesChange}
            />
          </td>
          <td className="texto-col">{interes}</td>
        </tr>
      ));
    }

    // Dividir intereses en dos columnas
    const mitad = Math.ceil(interesesDisponibles.length / 2);
    const primeraColumna = interesesDisponibles.slice(0, mitad);
    const segundaColumna = interesesDisponibles.slice(mitad);

    return {
      primeraColumna: primeraColumna.map((interes) => (
        <tr key={`col1-${interes.id_inte}`}>
          <td className="checkbox-col">
            <input
              type="checkbox"
              name="intereses"
              value={interes.interes}
              checked={formData.intereses?.includes(interes.interes)}
              onChange={handleInteresesChange}
            />
          </td>
          <td className="texto-col">{interes.interes}</td>
        </tr>
      )),
      segundaColumna: segundaColumna.map((interes) => (
        <tr key={`col2-${interes.id_inte}`}>
          <td className="checkbox-col">
            <input
              type="checkbox"
              name="intereses"
              value={interes.interes}
              checked={formData.intereses?.includes(interes.interes)}
              onChange={handleInteresesChange}
            />
          </td>
          <td className="texto-col">{interes.interes}</td>
        </tr>
      ))
    };
  };

  const interesesRenderizados = renderIntereses();
    const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    navigate('/login');

  };

  return (
    <>
      <div className="container">
        <h1  className="titulo-navbar">✍Registro</h1>
        <div className="Progreso-formulario">
          <div
            className="barra-progreso"
            id="barraProgreso"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Proceso: <span id="porcentajeProgreso">{progreso}%</span>
        </p>

        <form id="formularioAvanzado" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-group">
              <h4>Datos Personales</h4>
              {/* Primer Nombre */}
              <div className="form-group">
                <label htmlFor="primer_nombre">Primer Nombre *</label>
                <input
                  type="text"
                  id="primer_nombre"
                  name="primer_nombre"
                  value={formData.primer_nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Emily"
                  pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{2,40}"
                  className={
                    validationState.primer_nombre === true
                      ? "valido"
                      : validationState.primer_nombre === false
                        ? "invalido"
                        : ""
                  }
                />
                <div
                  className="mensaje-error"
                  style={{ display: messages.errorPrimerNombre ? "block" : "none" }}
                >
                  {messages.errorPrimerNombre}
                </div>
                <div
                  className="mensaje-exito"
                  style={{ display: messages.exitoPrimerNombre ? "block" : "none" }}
                >
                  {messages.exitoPrimerNombre}
                </div>
              </div>

              {/* Segundo Nombre (opcional) */}
              <div className="form-group">
                <label htmlFor="segundo_nombre">Segundo Nombre</label>
                <input
                  type="text"
                  id="segundo_nombre"
                  name="segundo_nombre"
                  value={formData.segundo_nombre || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: Andrea"
                  pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{2,40}"
                  className={
                    validationState.segundo_nombre === true
                      ? "valido"
                      : validationState.segundo_nombre === false
                        ? "invalido"
                        : ""
                  }
                />
                <div
                  className="mensaje-error"
                  style={{ display: messages.errorSegundoNombre ? "block" : "none" }}
                >
                  {messages.errorSegundoNombre}
                </div>
                <div
                  className="mensaje-exito"
                  style={{ display: messages.exitoSegundoNombre ? "block" : "none" }}
                >
                  {messages.exitoSegundoNombre}
                </div>
              </div>

              {/* Primer Apellido */}
              <div className="form-group">
                <label htmlFor="primer_apellido">Primer Apellido *</label>
                <input
                  type="text"
                  id="primer_apellido"
                  name="primer_apellido"
                  value={formData.primer_apellido}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Remicio"
                  pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{2,40}"
                  className={
                    validationState.primer_apellido === true
                      ? "valido"
                      : validationState.primer_apellido === false
                        ? "invalido"
                        : ""
                  }
                />
                <div
                  className="mensaje-error"
                  style={{ display: messages.errorPrimerApellido ? "block" : "none" }}
                >
                  {messages.errorPrimerApellido}
                </div>
                <div
                  className="mensaje-exito"
                  style={{ display: messages.exitoPrimerApellido ? "block" : "none" }}
                >
                  {messages.exitoPrimerApellido}
                </div>
              </div>

              {/* Segundo Apellido (opcional) */}
              <div className="form-group">
                <label htmlFor="segundo_apellido">Segundo Apellido</label>
                <input
                  type="text"
                  id="segundo_apellido"
                  name="segundo_apellido"
                  value={formData.segundo_apellido || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: López"
                  pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{2,40}"
                  className={
                    validationState.segundo_apellido === true
                      ? "valido"
                      : validationState.segundo_apellido === false
                        ? "invalido"
                        : ""
                  }
                />
                <div
                  className="mensaje-error"
                  style={{ display: messages.errorSegundoApellido ? "block" : "none" }}
                >
                  {messages.errorSegundoApellido}
                </div>
                <div
                  className="mensaje-exito"
                  style={{ display: messages.exitoSegundoApellido ? "block" : "none" }}
                >
                  {messages.exitoSegundoApellido}
                </div>
              </div>
            </div>

            {/* Email con validación mejorada */}
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                placeholder="usuario@dominio.com"
                className={
                  validationState.correo === true
                    ? "valido"
                    : validationState.correo === false
                      ? "invalido"
                      : ""
                }
              />

              <div
                className="mensaje-error"
                id="errorCorreo"
                style={{ display: messages.errorCorreo ? "block" : "none" }}
              >
                {messages.errorCorreo}
              </div>
              <div
                className="mensaje-exito"
                id="exitoCorreo"
                style={{ display: messages.exitoCorreo ? "block" : "none" }}
              >
                {messages.exitoCorreo}
              </div>
            </div>

            {/*Confirmación de Correo electronico */}
            <div className="form-group">
              <label htmlFor="confirmarCorreo">
                Confirmar correo electronico *
              </label>
              <input
                type="email"
                id="confirmarCorreo"
                name="confirmarCorreo"
                value={formData.confirmarCorreo}
                onChange={handleInputChange}
                required
                placeholder="Repite tu correo electronico"
                className={
                  validationState.confirmarCorreo === true
                    ? "valido"
                    : validationState.confirmarCorreo === false
                      ? "invalido"
                      : ""
                }
              />
              <div
                className="mensaje-error"
                id="errorConfirmarCorreo"
                style={{
                  display: messages.errorConfirmarCorreo ? "block" : "none",
                }}
              >
                {messages.errorConfirmarCorreo}
              </div>
              <div
                className="mensaje-exito"
                id="exitoConfirmarCorreo"
                style={{
                  display: messages.exitoConfirmarCorreo ? "block" : "none",
                }}
              >
                {messages.exitoConfirmarCorreo}
              </div>
            </div>

            {/* Clave con indicador de fortaleza */}
            <div className="form-group">
              <label htmlFor="clave">Clave *</label>
              <input
                type="password"
                id="clave"
                name="clave"
                value={formData.clave}
                onChange={handleInputChange}
                required
                placeholder="Ingresar numeros, una mayuscula, minuscula"
                minLength="8"
                className={
                  validationState.clave === true
                    ? "valido"
                    : validationState.clave === false
                      ? "invalido"
                      : ""
                }
              />

              {/* Indicador visual de fortaleza */}
              <div className="password-strength-container">
                <div
                  className="password-strength-bar"
                  style={{
                    width: `${(passwordStrength.nivel / 4) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                ></div>
                <small
                  style={{
                    color: passwordStrength.color,
                    marginTop: "2px",
                    display: "block"
                  }}
                >
                  {formData.clave.length > 0 && passwordStrength.texto}
                </small>
              </div>

              <div
                className="mensaje-error"
                style={{ display: messages.errorClave ? "block" : "none" }}
              >
                {messages.errorClave}
              </div>
              <div
                className="mensaje-exito"
                style={{ display: messages.exitoClave ? "block" : "none" }}
              >
                {messages.exitoClave}
              </div>
            </div>


            {/* Confirmación de clave */}
            <div className="form-group">
              <label htmlFor="confirmarClave">Confirmar clave *</label>
              <input
                type="password"
                id="confirmarClave"
                name="confirmarClave"
                value={formData.confirmarClave}

                onChange={handleInputChange}
                required
                placeholder="Repite tu contraseña"
                className={
                  validationState.ConfirmarClave === true
                    ? "valido"
                    : validationState.ConfirmarClave === false
                      ? "invalido"
                      : ""
                }
              />
              <div
                className="mensaje-error"
                id="errorConfirmar"
                style={{
                  display: messages.errorConfirmarClave ? "block" : "none",
                }}
              >
                {messages.errorConfirmarClave}
              </div>
              <div
                className="mensaje-exito"
                id="exitoConfirmar"
                style={{
                  display: messages.exitoConfirmarClave ? "block" : "none",
                }}
              >
                {messages.exitoConfirmarClave}
              </div>
            </div>

            {/* Nacionalidad con seleccionar - DINÁMICO */}
            <div className="form-group">
              <label htmlFor="nacionalidad">
                Seleccionar tu nacionalidad *
              </label>
              <select
                name="nacionalidad"
                id="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleInputChange}
                required
                disabled={loadingNacionalidades}
                className={
                  validationState.nacionalidad === true
                    ? "valido"
                    : validationState.nacionalidad === false
                      ? "invalido"
                      : ""
                }
              >
                {renderNacionalidades()}
              </select>
              {validatingNacionalidad && (
                <small style={{ color: '#17a2b8' }}>Verificando nacionalidad...</small>
              )}
              <div
                id="errorNacionalidad"
                className="mensaje-error"
                style={{
                  display: messages.errorNacionalidad ? "block" : "none",
                }}
              >
                {messages.errorNacionalidad}
              </div>
              <div
                id="exitoNacionalidad"
                className="mensaje-exito"
                style={{
                  display: messages.exitoNacionalidad ? "block" : "none",
                }}
              >
                {messages.exitoNacionalidad}
              </div>
            </div>

            {/* Intereses Turísticos - DINÁMICOS */}
            <div className={`form-group-Intereses ${validationState.intereses === true
              ? "valido"
              : validationState.intereses === false
                ? "invalido"
                : ""
              }`}>
              <label htmlFor="intereses">Intereses Turísticos *</label>
              {loadingIntereses && (
                <p style={{ textAlign: 'center', color: '#666' }}>
                  Cargando intereses disponibles...
                </p>
              )}

              <div className="tablas-container" id="contenedor-intereses">
                {/* TABLA IZQUIERDA */}
                <table className="tabla-intereses">
                  <tbody>
                    {Array.isArray(interesesRenderizados)
                      ? interesesRenderizados.slice(0, Math.ceil(interesesRenderizados.length / 2))
                      : interesesRenderizados.primeraColumna || []}
                  </tbody>
                </table>

                {/* TABLA DERECHA */}
                <table className="tabla-intereses">
                  <tbody>
                    {Array.isArray(interesesRenderizados)
                      ? interesesRenderizados.slice(Math.ceil(interesesRenderizados.length / 2))
                      : interesesRenderizados.segundaColumna || []}
                  </tbody>
                </table>
              </div>

              <div
                className="mensaje-error"
                style={{ display: messages.errorIntereses ? "block" : "none" }}
              >
                {messages.errorIntereses}
              </div>
              <div
                className="mensaje-exito"
                style={{ display: messages.exitoIntereses ? "block" : "none" }}
              >
                {messages.exitoIntereses}
              </div>
            </div>

            {/* Políticas y Consentimientos */}
            <div className="form-group">
              <label style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: '#2c3e50',
                marginBottom: '15px',
                display: 'block'
              }}>
                Políticas y Consentimientos *
              </label>
              
              {/* Términos y Condiciones */}
              <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                backgroundColor: '#f9f9f9' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'space-between' }}>
                  <input
                    type="checkbox"
                    checked={politicasAceptadas.acepto_terminos}
                    onChange={(e) => handlePoliticaChange('acepto_terminos', e.target.checked)}
                    disabled={!pdfVisualizado.terminos}
                    style={{ flexShrink: 0, width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>
                      Acepto los términos y condiciones *
                    </span>
                    {pdfVisualizado.terminos && (
                      <span style={{ color: '#28a745', fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap' }}>
                        ✓ Visualizado
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTerminosModal(true)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      textTransform: 'none',
                      letterSpacing: 'normal',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      width: 'auto',
                      marginTop: '0',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📄 Leer documento
                  </button>
                </div>
                {mensajesPoliticas.errorTerminos && (
                  <div className="mensaje-error" style={{ marginTop: '8px' }}>
                    {mensajesPoliticas.errorTerminos}
                  </div>
                )}
                {mensajesPoliticas.exitoTerminos && (
                  <div className="mensaje-exito" style={{ marginTop: '8px' }}>
                    {mensajesPoliticas.exitoTerminos}
                  </div>
                )}
              </div>

              {/* Tratamiento de Datos */}
              <div style={{ 
                padding: '15px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                backgroundColor: '#f9f9f9' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'space-between' }}>
                  <input
                    type="checkbox"
                    checked={politicasAceptadas.acepto_tratamiento_datos}
                    onChange={(e) => handlePoliticaChange('acepto_tratamiento_datos', e.target.checked)}
                    disabled={!pdfVisualizado.tratamiento_datos}
                    style={{ flexShrink: 0, width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>
                      Acepto el tratamiento de datos personales *
                    </span>
                    {pdfVisualizado.tratamiento_datos && (
                      <span style={{ color: '#28a745', fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap' }}>
                        ✓ Visualizado
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTratamientoModal(true)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      textTransform: 'none',
                      letterSpacing: 'normal',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      width: 'auto',
                      marginTop: '0',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📄 Leer documento
                  </button>
                </div>
                {mensajesPoliticas.errorTratamientoDatos && (
                  <div className="mensaje-error" style={{ marginTop: '8px' }}>
                    {mensajesPoliticas.errorTratamientoDatos}
                  </div>
                )}
                {mensajesPoliticas.exitoTratamientoDatos && (
                  <div className="mensaje-exito" style={{ marginTop: '8px' }}>
                    {mensajesPoliticas.exitoTratamientoDatos}
                  </div>
                )}
              </div>
            </div>

            {/* Botón de envío */}
            <div className="form-group">

              <button
                type="submit"
                id="btnEnviar"
                disabled={!formularioCompleto() || !politicasCompletas() || validatingEmail || validatingNacionalidad}
                className={
                  (formularioCompleto() && politicasCompletas() && !validatingEmail && !validatingNacionalidad)
                    ? "btn-habilitado"
                    : "btn-deshabilitado"
                }
              >
                {(validatingEmail || validatingNacionalidad)
                  ? "Validando..."
                  : "Registrarse"
                }
              </button>
            </div>
          </div>
        </form>
        {/* Modal de bienvenida */}
      {showWelcomeModal && (
        <div className="modal-overlay" onClick={() => setShowWelcomeModal(false)}>
          <div className="welcome-modal" onClick={e => e.stopPropagation()}>
            <div className="welcome-icon">🎉</div>
            <h2>¡Registro Exitoso!</h2>
            <p>Bienvenido a <strong>BogotaTuris</strong></p>
            
            <div style={{
              background: '#e3f2fd',
              padding: '20px',
              borderRadius: '10px',
              margin: '20px 0',
              borderLeft: '4px solid #2196f3'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2', fontSize: '1.2rem' }}>
                📧 Verifica tu correo electrónico
              </h3>
              <p style={{ margin: '0', color: '#424242', lineHeight: '1.6' }}>
                Te hemos enviado un correo de verificación a <strong>{formData.correo}</strong>.
                <br />
                Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.
              </p>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              ¡Descubre los mejores lugares de nuestra hermosa ciudad!
            </p>
            <button onClick={handleWelcomeClose}>
              Ir al Login
            </button>
          </div>
        </div>
      )}

      {/* Modal de Términos y Condiciones */}
      <PDFModal
        isOpen={showTerminosModal}
        onClose={() => setShowTerminosModal(false)}
        pdfUrl="http://localhost:8000/api/politicas/pdf/terminos"
        titulo="Términos y Condiciones"
        onVisualizacionCompleta={(tiempo) => {
          registrarVisualizacionPDF('terminos', tiempo);
        }}
      />

      {/* Modal de Tratamiento de Datos */}
      <PDFModal
        isOpen={showTratamientoModal}
        onClose={() => setShowTratamientoModal(false)}
        pdfUrl="http://localhost:8000/api/politicas/pdf/tratamiento-datos"
        titulo="Tratamiento de Datos Personales"
        onVisualizacionCompleta={(tiempo) => {
          registrarVisualizacionPDF('tratamiento_datos', tiempo);
        }}
      />
      </div>
    </>
  );
};

export default FormSignUp;
