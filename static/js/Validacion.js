
const formulario = document.getElementById('formularioAvanzado');
const btnEnviar = document.getElementById('btnEnviar');
const camposAValidar = document.querySelectorAll(
    '#nombreCompleto, #apellidoCompleto, #correo, #confirmarCorreo, #password, #confirmarPassword, #nacionalidad, #terminos'
);

const contenedorIntereses = document.querySelector('.form-group-Intereses');

let estadoValidacion = {};

// FUNCIONES AUXILIARES
function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        ocultarMensaje(idElemento.replace('error', 'exito'));
    }
}

function mostrarExito(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        ocultarMensaje(idElemento.replace('exito', 'error'));
    }
}

function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
    let campoId = campo.id || campo.classList[0];
    estadoValidacion[campoId] = esValido;

    campo.classList.remove('valido', 'invalido');

    if (esValido) {
        campo.classList.add('valido');
    } else {
        campo.classList.add('invalido');
    }

    actualizarProgreso();
    actualizarBotonEnvio();
}

function actualizarProgreso() {
    const totalCampos = camposAValidar.length + 1; // +1 para los intereses
    const camposValidos = Object.values(estadoValidacion).filter((valido) => valido).length;
    const porcentaje = Math.round((camposValidos / totalCampos) * 100);

    document.getElementById('barraProgreso').style.width = porcentaje + '%';
    document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
    const totalValidaciones = camposAValidar.length + 1;
    const validacionesCompletas = Object.values(estadoValidacion).filter((valido) => valido).length;
    btnEnviar.disabled = validacionesCompletas !== totalValidaciones;
}

// 🎯 LÓGICA DE VALIDACIÓN POR CAMPO
function validarCampo(campo) {
    const valor = campo.value;
    switch (campo.id) {
        case 'nombreCompleto':
            const nombres = valor.trim().split(' ').filter(n => n.length > 0);
            const esNombreValido = nombres.length >= 2 && valor.length >= 3;
            if (!esNombreValido) {
                mostrarError('errorNombre', 'Ingresa al menos 2 nombres completos');
            } else {
                mostrarExito('exitoNombre', '✓ Nombre completo válido');
            }
            marcarCampo(campo, esNombreValido);
            break;
        case 'apellidoCompleto':
            const apellidos = valor.trim().split(' ').filter(a => a.length > 0);
            const esApellidoValido = apellidos.length >= 2 && valor.length >= 3;
            if (!esApellidoValido) {
                mostrarError('errorApellido', 'Ingresa al menos 2 apellidos completos');
            } else {
                mostrarExito('exitoApellido', '✓ Apellido completo válido');
            }
            marcarCampo(campo, esApellidoValido);
            break;
        case 'correo':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const correoValido = emailRegex.test(valor);
            if (!correoValido) {
                mostrarError('errorCorreo', 'Formato de email inválido');
            } else {
                mostrarExito('exitoCorreo', '✓ Email válido');
            }
            marcarCampo(campo, correoValido);
            // Revalidar confirmación si está lleno
            if (document.getElementById('confirmarCorreo').value) {
                validarCampo(document.getElementById('confirmarCorreo'));
            }
            break;
        case 'confirmarCorreo':
            const correoOriginal = document.getElementById('correo').value;
            const coincidenCorreos = valor === correoOriginal && valor.length > 0;
            if (!coincidenCorreos) {
                mostrarError('errorConfirmarCorreo', 'Los correos no coinciden');
            } else {
                mostrarExito('exitoConfirmarCorreo', '✓ Correos coinciden');
            }
            marcarCampo(campo, coincidenCorreos);
            break;
        case 'password':
            const fortaleza = calcularFortalezaPassword(valor);
            actualizarBarraFortaleza(fortaleza);
            const esFuerte = valor.length >= 8 && fortaleza.nivel >= 1;
            if (!esFuerte) {
                mostrarError('errorPassword', 'Contraseña débil. Debe tener 8+ caracteres y ser compleja.');
            } else {
                mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
            }
            marcarCampo(campo, esFuerte);
            // Revalidar confirmación si está lleno
            if (document.getElementById('confirmarPassword').value) {
                validarCampo(document.getElementById('confirmarPassword'));
            }
            break;
        case 'confirmarPassword':
            const passwordOriginal = document.getElementById('password').value;
            const coincidenPasswords = valor === passwordOriginal && valor.length > 0;
            if (!coincidenPasswords) {
                mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
            } else {
                mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
            }
            marcarCampo(campo, coincidenPasswords);
            break;
        case 'nacionalidad':
            const nacionalidadValida = valor !== "" && valor !== null;
            if (!nacionalidadValida) {
                mostrarError('errorNacionalidad', 'Debes seleccionar tu nacionalidad');
            } else {
                mostrarExito('exitoNacionalidad', '✓ Nacionalidad seleccionada');
            }
            marcarCampo(campo, nacionalidadValida);
            break;
        case 'terminos':
            const terminosAceptados = campo.checked;
            if (!terminosAceptados) {
                mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
            } else {
                ocultarMensaje('errorTerminos');
            }
            marcarCampo(campo, terminosAceptados);
            break;
    }
}
// 🎯 VALIDACIÓN DE INTERESES 
const checkboxesIntereses = contenedorIntereses.querySelectorAll('input[name="intereses"]');

function validarIntereses() {
    const seleccionados = contenedorIntereses.querySelectorAll('input[name="intereses"]:checked');
    const esValido = seleccionados.length > 0;
    if (!esValido) {
        mostrarError('errorIntereses', 'Selecciona al menos un interés turístico');
        ocultarMensaje('exitoIntereses');
    } else {
        ocultarMensaje('errorIntereses');
        const mensaje = seleccionados.length === 1 ? '✓ Has seleccionado 1 interés' : `✓ Has seleccionado ${seleccionados.length} intereses`;
        mostrarExito('exitoIntereses', mensaje);
    }
    marcarCampo(contenedorIntereses, esValido);
}
checkboxesIntereses.forEach(checkbox => {
    checkbox.addEventListener('change', validarIntereses);
});
// 🎯 LÓGICA DE FORTALEZA DE CONTRASEÑA 
function calcularFortalezaPassword(password) {
    let nivel = 0;
    let texto = 'Muy Débil';
    if (/[a-z]/.test(password)) nivel++;
    if (/[A-Z]/.test(password)) nivel++;
    if (/[0-9]/.test(password)) nivel++;
    if (/[^A-Za-z0-9]/.test(password)) nivel++;
    switch (nivel) {
        case 1:
            texto = 'Débil';
            break;
        case 2:
            texto = 'Aceptable';
            break;
        case 3:
            texto = 'Fuerte';
            break;
        case 4:
            texto = 'Muy Fuerte';
            break;
    }
    return {
        nivel,
        texto
    };
}
function actualizarBarraFortaleza(fortaleza) {
    const barra = document.getElementById('strengthBar');
    if (!barra) return;
    let ancho = 0;
    let color = '';
    switch (fortaleza.nivel) {
        case 1:
            ancho = 25;
            color = '#dc3545';
            break;
        case 2:
            ancho = 50;
            color = '#ffc107';
            break;
        case 3:
            ancho = 75;
            color = '#17a2b8';
            break;
        case 4:
            ancho = 100;
            color = '#28a745';
            break;
    }
    barra.style.width = ancho + '%';
    barra.style.backgroundColor = color;
}
// 🎯 INICIALIZACIÓN Y EVENT LISTENERS
function inicializarValidacion() {

    camposAValidar.forEach(campo => {
        if (campo.type === 'checkbox') {
            campo.addEventListener('change', () => validarCampo(campo));
        } else {
            campo.addEventListener('input', () => validarCampo(campo));
            campo.addEventListener('blur', () => validarCampo(campo));
        }

        marcarCampo(campo, false);
    });
    
    marcarCampo(contenedorIntereses, false);
}

document.addEventListener('DOMContentLoaded', inicializarValidacion);

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    camposAValidar.forEach(campo => validarCampo(campo));
    validarIntereses();
    
    if (Object.values(estadoValidacion).every(valido => valido)) {
        alert('Formulario enviado con éxito!');
        
    }
}
);