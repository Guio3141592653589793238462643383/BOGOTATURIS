import "../assets/css/FormSignUp.css";
import useFormValidation from "../hooks/useFormValidation";
import Logo from "../assets/img/BogotaTurisLogo.png";

const FormSignUp = () => {
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
      nombreCompleto: formData.nombreCompleto,
      apellidoCompleto: formData.apellidoCompleto,
      correo: formData.correo,
      confirmarCorreo: formData.confirmarCorreo,
      password: formData.password,
      confirmarPassword: formData.confirmarPassword,
      nacionalidad: formData.nacionalidad,
      intereses: Array.isArray(formData.intereses) ? formData.intereses : [], 
      terminos: formData.terminos
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/usuario/registrar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datosFormulario)
      });
      
      const resultado = await response.json();
      
      if (response.ok) {
        console.log('Usuario registrado exitosamente:', resultado);
        alert(`¡Registro exitoso! Bienvenido ${resultado.primer_nombre}`);
        
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

  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src={Logo} alt="BogotaTuris Logo" />
          </div>
          <ul className="nav-links">
            <li>
              <a href="#">Inicio</a>
            </li>
            <li>
              <a href="#">Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="container">
        <h1>✍Registro</h1>
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
              <label htmlFor="nombreCompleto">Nombre Completo *</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                required
                autoFocus
                placeholder="Mínimo 2 nombres"
                pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{3,40}"
                className={
                  validationState.nombreCompleto === true
                    ? "valido"
                    : validationState.nombreCompleto === false
                    ? "invalido"
                    : ""
                }
              />
              <div
                className="mensaje-error"
                id="errorNombre"
                style={{ display: messages.errorNombre ? "block" : "none" }}
              >
                {messages.errorNombre}
              </div>
              <div
                className="mensaje-exito"
                id="exitoNombre"
                style={{ display: messages.exitoNombre ? "block" : "none" }}
              >
                {messages.exitoNombre}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="apellidoCompleto">Apellido Completo *</label>
              <input
                type="text"
                id="apellidoCompleto"
                name="apellidoCompleto"
                value={formData.apellidoCompleto}
                onChange={handleInputChange}
                required
                placeholder="Mínimo 2 apellidos"
                pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{3,40}"
                className={
                  validationState.apellidoCompleto === true
                    ? "valido"
                    : validationState.apellidoCompleto === false
                    ? "invalido"
                    : ""
                }
              />
              <div
                className="mensaje-error"
                id="errorApellido"
                style={{ display: messages.errorApellido ? "block" : "none" }}
              >
                {messages.errorApellido}
              </div>
              <div
                className="mensaje-exito"
                id="exitoApellido"
                style={{ display: messages.exitoApellido ? "block" : "none" }}
              >
                {messages.exitoApellido}
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
            
            {/* Contraseña con indicador de fortaleza */}
            <div className="form-group">
              <label htmlFor="password">Clave *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Minimo 8 caracteres"
                minLength="8"
                className={
                  validationState.password === true
                    ? "valido"
                    : validationState.password === false
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
                <small style={{ color: passwordStrength.color, marginTop: '2px', display: 'block' }}>
                  {formData.password.length > 0 && passwordStrength.texto}
                </small>
              </div>
              <div
                className="mensaje-error"
                style={{ display: messages.errorPassword ? "block" : "none" }}
              >
                {messages.errorPassword}
              </div>
              <div
                className="mensaje-exito"
                style={{ display: messages.exitoPassword ? "block" : "none" }}
              >
                {messages.exitoPassword}
              </div>
            </div>
            
            {/* Confirmación de clave */}
            <div className="form-group">
              <label htmlFor="confirmarPassword">Confirmar clave *</label>
              <input
                type="password"
                id="confirmarPassword"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleInputChange}
                required
                placeholder="Repite tu contraseña"
                className={
                  validationState.confirmarPassword === true
                    ? "valido"
                    : validationState.confirmarPassword === false
                    ? "invalido"
                    : ""
                }
              />
              <div
                className="mensaje-error"
                id="errorConfirmar"
                style={{
                  display: messages.errorConfirmarPassword ? "block" : "none",
                }}
              >
                {messages.errorConfirmarPassword}
              </div>
              <div
                className="mensaje-exito"
                id="exitoConfirmar"
                style={{
                  display: messages.exitoConfirmarPassword ? "block" : "none",
                }}
              >
                {messages.exitoConfirmarPassword}
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
            <div className={`form-group-Intereses ${
              validationState.intereses === true 
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
                style={{display: 'flex', alignItems: 'center', gap: '8px'}}
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
      </div>
    </>
  );
};

export default FormSignUp;