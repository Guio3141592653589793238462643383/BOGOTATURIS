import "../assets/css/FormSignUp.css";
import useFormValidation from "../hooks/useFormValidation";

const FormSignUp = () => {
  const {
    formData,
    validationState,
    messages,
    passwordStrength,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
  } = useFormValidation();

  // Al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el formulario esté completo antes de enviar
    if (!formularioCompleto()) {
      alert("Por favor completa todos los campos requeridos");
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
    
    console.log("Datos a enviar:", datosFormulario); // Para debugging
    
    try {
      const response = await fetch('/api/usuario/registrar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datosFormulario)
      });
      
      if (response.ok) {
        const resultado = await response.json();
        console.log('Usuario registrado exitosamente:', resultado);
        
        // Mostrar mensaje de éxito
        alert(`¡Registro exitoso! Bienvenido ${resultado.primer_nombre}`);
        
        // Opcional: Limpiar formulario o redirigir
        // window.location.href = '/login';
        
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        
        // Manejar errores específicos del backend
        if (errorData.detail) {
          if (typeof errorData.detail === 'object' && errorData.detail.detail) {
            alert(`Error: ${errorData.detail.detail}`);
          } else if (typeof errorData.detail === 'string') {
            alert(`Error: ${errorData.detail}`);
          } else {
            alert('Error en el registro. Verifica los datos.');
          }
        } else {
          alert('Error desconocido. Intenta de nuevo.');
        }
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Verifica tu conexión a internet e intenta de nuevo.');
    }
  };

  const progreso = calcularProgreso();

  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src="" alt="BogotaTuris Logo" />
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
            {/* Email con validación personalizada*/}
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
                pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{5,50}$"
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
            {/* Nacionalidad con seleccionar */}
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
                className={
                  validationState.nacionalidad === true
                    ? "valido"
                    : validationState.nacionalidad === false
                    ? "invalido"
                    : ""
                }
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="colombia">Colombia</option>
                <option value="afganistan">Afganistán</option>
                <option value="albania">Albania</option>
                <option value="alemania">Alemania</option>
                <option value="andorra">Andorra</option>
                <option value="angola">Angola</option>
                <option value="antigua_y_barbuda">Antigua y Barbuda</option>
                <option value="arabia_saudita">Arabia Saudita</option>
                <option value="argelia">Argelia</option>
                <option value="argentina">Argentina</option>
                <option value="armenia">Armenia</option>
                <option value="australia">Australia</option>
                <option value="austria">Austria</option>
                <option value="azerbaiyan">Azerbaiyán</option>
                <option value="bahamas">Bahamas</option>
                <option value="banglades">Bangladés</option>
                <option value="barbados">Barbados</option>
                <option value="belgica">Bélgica</option>
                <option value="belice">Belice</option>
                <option value="benin">Benín</option>
                <option value="bielorrusia">Bielorrusia</option>
                <option value="birmania">Birmania</option>
                <option value="bolivia">Bolivia</option>
                <option value="bosnia_y_herzegovina">
                  Bosnia y Herzegovina
                </option>
                <option value="botswana">Botswana</option>
                <option value="brasil">Brasil</option>
                <option value="brunei">Brunéi</option>
                <option value="bulgaria">Bulgaria</option>
                <option value="burkina_faso">Burkina Faso</option>
                <option value="burundi">Burundi</option>
                <option value="butan">Bután</option>
                <option value="cabo_verde">Cabo Verde</option>
                <option value="camboya">Camboya</option>
                <option value="camerun">Camerún</option>
                <option value="canada">Canadá</option>
                <option value="catar">Catar</option>
                <option value="chad">Chad</option>
                <option value="chile">Chile</option>
                <option value="china">China</option>
                <option value="chipre">Chipre</option>
                <option value="comoras">Comoras</option>
                <option value="corea_del_norte">Corea del Norte</option>
                <option value="corea_del_sur">Corea del Sur</option>
                <option value="costa_de_marfil">Costa de Marfil</option>
                <option value="costa_rica">Costa Rica</option>
                <option value="croacia">Croacia</option>
                <option value="cuba">Cuba</option>
                <option value="dinamarca">Dinamarca</option>
                <option value="dominica">Dominica</option>
                <option value="ecuador">Ecuador</option>
                <option value="egipto">Egipto</option>
                <option value="el_salvador">El Salvador</option>
                <option value="emiratos_arabes_unidos">
                  Emiratos Árabes Unidos
                </option>
                <option value="eritrea">Eritrea</option>
                <option value="eslovaquia">Eslovaquia</option>
                <option value="eslovenia">Eslovenia</option>
                <option value="espana">España</option>
                <option value="estados_unidos">Estados Unidos</option>
                <option value="estonia">Estonia</option>
                <option value="etiopia">Etiopía</option>
                <option value="fiji">Fiyi</option>
                <option value="filipinas">Filipinas</option>
                <option value="finlandia">Finlandia</option>
                <option value="francia">Francia</option>
                <option value="gabon">Gabón</option>
                <option value="gambia">Gambia</option>
                <option value="georgia">Georgia</option>
                <option value="ghana">Ghana</option>
                <option value="granada">Granada</option>
                <option value="grecia">Grecia</option>
                <option value="guatemala">Guatemala</option>
                <option value="guinea">Guinea</option>
                <option value="guinea_ecuatorial">Guinea Ecuatorial</option>
                <option value="guinea_bissau">Guinea-Bisáu</option>
                <option value="guyana">Guyana</option>
                <option value="haiti">Haití</option>
                <option value="honduras">Honduras</option>
                <option value="hungria">Hungría</option>
                <option value="india">India</option>
                <option value="indonesia">Indonesia</option>
                <option value="irak">Irak</option>
                <option value="iran">Irán</option>
                <option value="irlanda">Irlanda</option>
                <option value="islandia">Islandia</option>
                <option value="islas_marshall">Islas Marshall</option>
                <option value="islas_salomon">Islas Salomón</option>
                <option value="israel">Israel</option>
                <option value="italia">Italia</option>
                <option value="jamaica">Jamaica</option>
                <option value="japon">Japón</option>
                <option value="jordania">Jordania</option>
                <option value="kazajistan">Kazajistán</option>
                <option value="kenia">Kenia</option>
                <option value="kirguistan">Kirguistán</option>
                <option value="kiribati">Kiribati</option>
                <option value="kosovo">Kosovo</option>
                <option value="kuwait">Kuwait</option>
                <option value="laos">Laos</option>
                <option value="lesoto">Lesoto</option>
                <option value="letonia">Letonia</option>
                <option value="libano">Líbano</option>
                <option value="liberia">Liberia</option>
                <option value="libia">Libia</option>
                <option value="liechtenstein">Liechtenstein</option>
                <option value="lituania">Lituania</option>
                <option value="luxemburgo">Luxemburgo</option>
                <option value="macedonia_del_norte">Macedonia del Norte</option>
                <option value="madagascar">Madagascar</option>
                <option value="malasia">Malasia</option>
                <option value="malawi">Malawi</option>
                <option value="maldivas">Maldivas</option>
                <option value="mali">Malí</option>
                <option value="malta">Malta</option>
                <option value="marruecos">Marruecos</option>
                <option value="mauricio">Mauricio</option>
                <option value="mauritania">Mauritania</option>
                <option value="mexico">México</option>
                <option value="micronesia">Micronesia</option>
                <option value="moldavia">Moldavia</option>
                <option value="monaco">Mónaco</option>
                <option value="mongolia">Mongolia</option>
                <option value="montenegro">Montenegro</option>
                <option value="mozambique">Mozambique</option>
                <option value="namibia">Namibia</option>
                <option value="nauru">Nauru</option>
                <option value="nepal">Nepal</option>
                <option value="nicaragua">Nicaragua</option>
                <option value="niger">Níger</option>
                <option value="nigeria">Nigeria</option>
                <option value="noruega">Noruega</option>
                <option value="nueva_zelanda">Nueva Zelanda</option>
                <option value="oman">Omán</option>
                <option value="pakistan">Pakistán</option>
                <option value="palau">Palau</option>
                <option value="palestina">Palestina</option>
                <option value="panama">Panamá</option>
                <option value="papua_nueva_guinea">Papúa Nueva Guinea</option>
                <option value="paraguay">Paraguay</option>
                <option value="paises_bajos">Países Bajos</option>
                <option value="peru">Perú</option>
                <option value="polonia">Polonia</option>
                <option value="portugal">Portugal</option>
                <option value="reino_unido">Reino Unido</option>
                <option value="republica_centroafricana">
                  República Centroafricana
                </option>
                <option value="republica_checa">República Checa</option>
                <option value="republica_democratica_del_congo">
                  República Democrática del Congo
                </option>
                <option value="republica_dominicana">
                  República Dominicana
                </option>
                <option value="ruanda">Ruanda</option>
                <option value="rumania">Rumania</option>
                <option value="rusia">Rusia</option>
                <option value="samoa">Samoa</option>
                <option value="san_cristobal_y_nieves">
                  San Cristóbal y Nieves
                </option>
                <option value="san_marino">San Marino</option>
                <option value="san_vicente_y_las_granadinas">
                  San Vicente y las Granadinas
                </option>
                <option value="santa_lucia">Santa Lucía</option>
                <option value="santo_tome_y_principe">
                  Santo Tomé y Príncipe
                </option>
                <option value="senegal">Senegal</option>
                <option value="serbia">Serbia</option>
                <option value="seychelles">Seychelles</option>
                <option value="sierra_leona">Sierra Leona</option>
                <option value="singapur">Singapur</option>
                <option value="siria">Siria</option>
                <option value="somalia">Somalia</option>
                <option value="sri_lanka">Sri Lanka</option>
                <option value="sudafrica">Sudáfrica</option>
                <option value="sudan">Sudán</option>
                <option value="sudan_del_sur">Sudán del Sur</option>
                <option value="suecia">Suecia</option>
                <option value="suiza">Suiza</option>
                <option value="surinam">Surinam</option>
                <option value="swazilandia">Swazilandia</option>
                <option value="tailandia">Tailandia</option>
                <option value="tanzania">Tanzania</option>
                <option value="tayikistan">Tayikistán</option>
                <option value="timor_oriental">Timor Oriental</option>
                <option value="togo">Togo</option>
                <option value="tonga">Tonga</option>
                <option value="trinidad_y_tobago">Trinidad y Tobago</option>
                <option value="tunez">Túnez</option>
                <option value="turkmenistan">Turkmenistán</option>
                <option value="turquia">Turquía</option>
                <option value="tuvalu">Tuvalu</option>
                <option value="ucrania">Ucrania</option>
                <option value="uganda">Uganda</option>
                <option value="uruguay">Uruguay</option>
                <option value="uzbekistan">Uzbekistán</option>
                <option value="vanuatu">Vanuatu</option>
                <option value="venezuela">Venezuela</option>
                <option value="vietnam">Vietnam</option>
                <option value="yemen">Yemen</option>
                <option value="zambia">Zambia</option>
                <option value="zimbabwe">Zimbabue</option>
              </select>
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
            <div className={`form-group-Intereses ${
              validationState.intereses === true 
                ? "valido" 
                : validationState.intereses === false 
                ? "invalido" 
                : ""
            }`}>
              <label htmlFor="intereses">Intereses Turísticos *</label>

              <div className="tablas-container" id="contenedor-intereses">
                {/* TABLA IZQUIERDA */}
                <table className="tabla-intereses">
                  <tbody>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Aventureros"
                          checked={formData.intereses?.includes("Aventureros")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Aventureros</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Arte"
                          checked={formData.intereses?.includes("Arte")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Arte</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Gastronomía"
                          checked={formData.intereses?.includes("Gastronomía")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Gastronomía</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Naturaleza"
                          checked={formData.intereses?.includes("Naturaleza")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Naturaleza</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Conciertos"
                          checked={formData.intereses?.includes("Conciertos")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Conciertos</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Escalada"
                          checked={formData.intereses?.includes("Escalada")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Escalada</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Museos"
                          checked={formData.intereses?.includes("Museos")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Museos</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Eventos"
                          checked={formData.intereses?.includes("Eventos")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Eventos</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Yoga"
                          checked={formData.intereses?.includes("Yoga")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Yoga</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Bares"
                          checked={formData.intereses?.includes("Bares")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Bares</td>
                    </tr>
                  </tbody>
                </table>

                {/* TABLA DERECHA */}
                <table
                  className="tabla-intereses"
                  id="intereses"
                  name="intereses"
                >
                  <tbody>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Danza"
                          checked={formData.intereses?.includes("Danza")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Danza</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Cultura"
                          checked={formData.intereses?.includes("Cultura")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Cultura</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Deportes"
                          checked={formData.intereses?.includes("Deportes")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Deportes</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Historia"
                          checked={formData.intereses?.includes("Historia")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Historia</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Festivales"
                          checked={formData.intereses?.includes("Festivales")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Festivales</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Talleres"
                          checked={formData.intereses?.includes("Talleres")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Talleres</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Cocinar"
                          checked={formData.intereses?.includes("Cocinar")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Cocinar</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Ecoturismo"
                          checked={formData.intereses?.includes("Ecoturismo")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Ecoturismo</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          name="intereses"
                          value="Concursos"
                          checked={formData.intereses?.includes("Concursos")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Concursos</td>
                    </tr>
                    <tr>
                      <td className="checkbox-col">
                        <input 
                          type="checkbox"
                          name="intereses"
                          value="Discotecas"
                          checked={formData.intereses?.includes("Discotecas")}
                          onChange={handleInteresesChange}
                        />
                      </td>
                      <td className="texto-col">Discotecas</td>
                    </tr>
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
            <div className="form-group">
              <button
                type="submit"
                id="btnEnviar"
                disabled={!formularioCompleto()}
                className={
                  formularioCompleto() ? "btn-habilitado" : "btn-deshabilitado"
                }
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormSignUp;