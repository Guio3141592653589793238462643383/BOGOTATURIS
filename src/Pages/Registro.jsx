import React from "react";
import "../index.css";

const FormSignUp = () => {
  return (
    <>

      <div className="container">
        <h1>Registrarte</h1>
        <div className="Progreso-formulario">
          <div className="barra-progreso" id="barraProgreso"></div>
        </div>
        <p style={{ textAlign: "center", color: "#131313ff", marginBottom: "30px" }}>
          Proceso:<span id="porcentajeProgreso">0%</span>
        </p>

        <form id="formularioAvanzado" noValidate>
          {/* Datos Personales */}
          <div className="form-group">
            <h4>Datos Personales</h4>
            <label htmlFor="nombreCompleto">Nombre Completo *</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              required
              autoFocus
              placeholder="Mínimo 2 nombres"
              pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{3,40}"
            />
            <div className="mensaje-error" id="errorNombre"></div>
            <div className="mensaje-exito" id="exitoNombre"></div>
          </div>

          <div className="form-group">
            <label htmlFor="apellidoCompleto">Apellido Completo *</label>
            <input
              type="text"
              id="apellidoCompleto"
              name="apellidoCompleto"
              required
              placeholder="Mínimo 2 de apellido"
              pattern="[A-Za-zÁÉÍÓÚáéíúóÑñÜü ]{3,40}"
            />
            <div className="mensaje-error" id="errorApellido"></div>
            <div className="mensaje-exito" id="exitoApellido"></div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              required
              placeholder="usuario@dominio.com"
              pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{5,50}$"
            />
            <div className="mensaje-error" id="errorCorreo"></div>
            <div className="mensaje-exito" id="exitoCorreo"></div>
          </div>

          {/* Confirmación correo */}
          <div className="form-group">
            <label htmlFor="confirmarCorreo">Confirmar correo electrónico *</label>
            <input
              type="email"
              id="confirmarCorreo"
              name="confirmarCorreo"
              required
              placeholder="Repite tu correo electrónico"
            />
            <div className="mensaje-error" id="errorConfirmarCorreo"></div>
            <div className="mensaje-exito" id="exitoConfirmarCorreo"></div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Clave *</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mínimo 8 caracteres"
              minLength="8"
            />
            <div className="password-strength" id="strengthBar"></div>
            <div className="mensaje-error" id="errorPassword"></div>
            <div className="mensaje-exito" id="exitoPassword"></div>
          </div>

          {/* Confirmación Password */}
          <div className="form-group">
            <label htmlFor="confirmarPassword">Confirmar clave *</label>
            <input
              type="password"
              id="confirmarPassword"
              name="confirmarPassword"
              required
              placeholder="Repite tu contraseña"
            />
            <div className="mensaje-error" id="errorConfirmar"></div>
            <div className="mensaje-exito" id="exitoConfirmar"></div>
          </div>

          {/* Nacionalidad */}
          <div className="form-group">
            <label htmlFor="nacionalidad">Seleccionar tu nacionalidad *</label>
            <select name="nacionalidad" id="nacionalidad" required>
              <option value="" disabled selected>Selecciona una opción</option>
              <option value="afganistan">Afganistán</option>
              <option value="albania">Albania</option>
              <option value="alemania">Alemania</option>
              <option value="andorra">Andorra</option>
              <option value="angola">Angola</option>
              <option value="antigua-barbuda">Antigua y Barbuda</option>
              <option value="arabia-saudita">Arabia Saudita</option>
              <option value="argelia">Argelia</option>
              <option value="argentina">Argentina</option>
              <option value="armenia">Armenia</option>
              <option value="australia">Australia</option>
              <option value="austria">Austria</option>
              <option value="azerbaiyan">Azerbaiyán</option>
              <option value="bahamas">Bahamas</option>
              <option value="bangladesh">Bangladés</option>
              <option value="barbados">Barbados</option>
              <option value="barein">Baréin</option>
              <option value="belgica">Bélgica</option>
              <option value="belice">Belice</option>
              <option value="benin">Benín</option>
              <option value="bielorrusia">Bielorrusia</option>
              <option value="birmania">Birmania</option>
              <option value="bolivia">Bolivia</option>
              <option value="bosnia">Bosnia y Herzegovina</option>
              <option value="botsuana">Botsuana</option>
              <option value="brasil">Brasil</option>
              <option value="brunei">Brunéi</option>
              <option value="bulgaria">Bulgaria</option>
              <option value="burkina-faso">Burkina Faso</option>
              <option value="burundi">Burundi</option>
              <option value="butan">Bután</option>
              <option value="cabo-verde">Cabo Verde</option>
              <option value="camboya">Camboya</option>
              <option value="camerun">Camerún</option>
              <option value="canada">Canadá</option>
              <option value="catar">Catar</option>
              <option value="chad">Chad</option>
              <option value="chile">Chile</option>
              <option value="china">China</option>
              <option value="chipre">Chipre</option>
              <option value="colombia">Colombia</option>
              <option value="comoras">Comoras</option>
              <option value="corea-norte">Corea del Norte</option>
              <option value="corea-sur">Corea del Sur</option>
              <option value="costa-marfil">Costa de Marfil</option>
              <option value="costa-rica">Costa Rica</option>
              <option value="croacia">Croacia</option>
              <option value="cuba">Cuba</option>
              <option value="dinamarca">Dinamarca</option>
              <option value="dominica">Dominica</option>
              <option value="ecuador">Ecuador</option>
              <option value="egipto">Egipto</option>
              <option value="el-salvador">El Salvador</option>
              <option value="emiratos-arabes">Emiratos Árabes Unidos</option>
              <option value="eritrea">Eritrea</option>
              <option value="eslovaquia">Eslovaquia</option>
              <option value="eslovenia">Eslovenia</option>
              <option value="espana">España</option>
              <option value="estados-unidos">Estados Unidos</option>
              <option value="estonia">Estonia</option>
              <option value="etiopia">Etiopía</option>
              <option value="filipinas">Filipinas</option>
              <option value="finlandia">Finlandia</option>
              <option value="fiyi">Fiyi</option>
              <option value="francia">Francia</option>
              <option value="gabon">Gabón</option>
              <option value="gambia">Gambia</option>
              <option value="georgia">Georgia</option>
              <option value="ghana">Ghana</option>
              <option value="granada">Granada</option>
              <option value="grecia">Grecia</option>
              <option value="guatemala">Guatemala</option>
              <option value="guinea">Guinea</option>
              <option value="guinea-bisau">Guinea-Bisáu</option>
              <option value="guinea-ecuatorial">Guinea Ecuatorial</option>
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
              <option value="islas-marshall">Islas Marshall</option>
              <option value="islas-salomon">Islas Salomón</option>
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
              <option value="letonia">Letonia</option>
              <option value="libano">Líbano</option>
              <option value="liberia">Liberia</option>
              <option value="libia">Libia</option>
              <option value="liechtenstein">Liechtenstein</option>
              <option value="lituania">Lituania</option>
              <option value="luxemburgo">Luxemburgo</option>
              <option value="madagascar">Madagascar</option>
              <option value="malasia">Malasia</option>
              <option value="malaui">Malaui</option>
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
              <option value="nueva-zelanda">Nueva Zelanda</option>
              <option value="oman">Omán</option>
              <option value="paises-bajos">Países Bajos</option>
              <option value="pakistan">Pakistán</option>
              <option value="palaos">Palaos</option>
              <option value="palestina">Palestina</option>
              <option value="panama">Panamá</option>
              <option value="papua-nueva-guinea">Papúa Nueva Guinea</option>
              <option value="paraguay">Paraguay</option>
              <option value="peru">Perú</option>
              <option value="polonia">Polonia</option>
              <option value="portugal">Portugal</option>
              <option value="reino-unido">Reino Unido</option>
              <option value="republica-centroafricana">República Centroafricana</option>
              <option value="republica-checa">República Checa</option>
              <option value="republica-congo">República del Congo</option>
              <option value="republica-democratica-congo">República Democrática del Congo</option>
              <option value="republica-dominicana">República Dominicana</option>
              <option value="ruanda">Ruanda</option>
              <option value="rumania">Rumanía</option>
              <option value="rusia">Rusia</option>
              <option value="samoa">Samoa</option>
              <option value="san-cristobal-nieves">San Cristóbal y Nieves</option>
              <option value="san-marino">San Marino</option>
              <option value="san-vicente-granadinas">San Vicente y las Granadinas</option>
              <option value="santa-lucia">Santa Lucía</option>
              <option value="santo-tome-principe">Santo Tomé y Príncipe</option>
              <option value="senegal">Senegal</option>
              <option value="serbia">Serbia</option>
              <option value="seychelles">Seychelles</option>
              <option value="sierra-leona">Sierra Leona</option>
              <option value="singapur">Singapur</option>
              <option value="siria">Siria</option>
              <option value="somalia">Somalia</option>
              <option value="sri-lanka">Sri Lanka</option>
              <option value="suazilandia">Suazilandia</option>
              <option value="sudafrica">Sudáfrica</option>
              <option value="sudan">Sudán</option>
              <option value="sudan-sur">Sudán del Sur</option>
              <option value="suecia">Suecia</option>
              <option value="suiza">Suiza</option>
              <option value="surinam">Surinam</option>
              <option value="tailandia">Tailandia</option>
              <option value="tanzania">Tanzania</option>
              <option value="tayikistan">Tayikistán</option>
              <option value="timor-oriental">Timor Oriental</option>
              <option value="togo">Togo</option>
              <option value="tonga">Tonga</option>
              <option value="trinidad-tobago">Trinidad y Tobago</option>
              <option value="tunez">Túnez</option>
              <option value="turkmenistan">Turkmenistán</option>
              <option value="turquia">Turquía</option>
              <option value="tuvalu">Tuvalu</option>
              <option value="ucrania">Ucrania</option>
              <option value="uganda">Uganda</option>
              <option value="uruguay">Uruguay</option>
              <option value="uzbekistan">Uzbekistán</option>
              <option value="vanuatu">Vanuatu</option>
              <option value="vaticano">Vaticano</option>
              <option value="venezuela">Venezuela</option>
              <option value="vietnam">Vietnam</option>
              <option value="yemen">Yemen</option>
              <option value="zambia">Zambia</option>
              <option value="zimbabwe">Zimbabue</option>
            </select>
            <div id="errorNacionalidad" className="mensaje-error"></div>
            <div id="exitoNacionalidad" className="mensaje-exito"></div>
          </div>

          {/* Intereses */}
          <div className="form-group-Intereses">
            <label htmlFor="intereses">Intereses Turísticos *</label>

            <div className="tablas-container" id="contenedor-intereses">
              {/* TABLA IZQUIERDA */}
              <table className="tabla-intereses">
                <tbody>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Aventureros" /></td><td className="texto-col">Aventureros</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Arte" /></td><td className="texto-col">Arte</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Cine" /></td><td className="texto-col">Cine</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Compras" /></td><td className="texto-col">Compras</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Gastronomía" /></td><td className="texto-col">Gastronomía</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Historia" /></td><td className="texto-col">Historia</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Museos" /></td><td className="texto-col">Museos</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Naturaleza" /></td><td className="texto-col">Naturaleza</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Parques" /></td><td className="texto-col">Parques</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Bares" /></td><td className="texto-col">Bares</td></tr>
                </tbody>
              </table>

              {/* TABLA DERECHA */}
              <table className="tabla-intereses" id="intereses">
                <tbody>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Danza" /></td><td className="texto-col">Danza</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Cultura" /></td><td className="texto-col">Cultura</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Fotografía" /></td><td className="texto-col">Fotografía</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Deportes" /></td><td className="texto-col">Deportes</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Playa" /></td><td className="texto-col">Playa</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Montaña" /></td><td className="texto-col">Montaña</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Arquitectura" /></td><td className="texto-col">Arquitectura</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Religión" /></td><td className="texto-col">Religión</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Eventos" /></td><td className="texto-col">Eventos</td></tr>
                  <tr><td className="checkbox-col"><input type="checkbox" name="intereses" value="Discotecas" /></td><td className="texto-col">Discotecas</td></tr>
                </tbody>
              </table>
            </div>
            <div id="exitoIntereses" className="mensaje-exito"></div>
            <div id="errorIntereses" className="mensaje-error"></div>
          </div>

          {/* Términos */}
          <div className="form-group">
            <input type="checkbox" id="terminos" name="terminos" required />
            <label htmlFor="terminos" style={{ display: "inline", marginLeft: "8px" }}>
              Acepto los términos y condiciones *
            </label>
            <div className="mensaje-error" id="errorTerminos"></div>
          </div>

          <button type="submit" id="btnEnviar">
            Enviar Formulario &#x1f600;
            
          </button>
             <p className="register-link">
          ¿Ya tienes cuenta? <a href="./login">Iniciar Sesión</a>
        </p>
        </form>
      </div>
    </>
  );
};

export default FormSignUp;
