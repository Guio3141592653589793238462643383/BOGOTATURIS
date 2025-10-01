import "../assets/css/FormSignUp.css";
import useFormValidation from "../Hooks/useFormValidation";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const FormSignUp = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();
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
    resetForm
  } = useFormValidation();

  // Manejador de envío del formulario (mejorado)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo el formulario primero
    const esValido = await validarTodoElFormulario();

    if (!esValido) {
      alert("Por favor completa todos los campos requeridos correctamente");
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
      terminos: formData.terminos
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

        // Limpiar formulario después del éxito
        resetForm();

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
                  onChange={(e) => {
                    handleInputChange(e);
                    validatePrimerNombre(e.target.value);
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e);
                    validateSegundoNombre(e.target.value);
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e);
                    validatePrimerApellido(e.target.value);
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e);
                    validateSegundoApellido(e.target.value);
                  }}
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
                pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
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

            {/* Términos y condiciones */}
            <div className="form-group">
              <label
                htmlFor="terminos"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <input
                  type="checkbox"
                  id="terminos"
                  name="terminos"
                  required
                  checked={formData.terminos}
                  onChange={handleInputChange}
                />
                Acepto los términos y condiciones *
              </label>
              <div
                className="mensaje-error"
                style={{ display: messages.errorTerminos ? "block" : "none" }}
              >
                {messages.errorTerminos}
              </div>
              <div
                className="mensaje-exito"
                style={{ display: messages.exitoTerminos ? "block" : "none" }}
              >
                {messages.exitoTerminos}
              </div>
            </div>

            {/* Botón de envío */}
            <div className="form-group">
              <button
                type="submit"
                id="btnEnviar"
                disabled={!formularioCompleto() || validatingEmail || validatingNacionalidad}
                className={
                  (formularioCompleto() && !validatingEmail && !validatingNacionalidad)
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
            <p>¡Descubre los mejores lugares de nuestra hermosa ciudad!</p>
            <button onClick={handleWelcomeClose}>
              Comenzar mi aventura
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default FormSignUp;
