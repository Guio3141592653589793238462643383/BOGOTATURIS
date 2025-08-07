// 🎯 SISTEMA DE VALIDACIÓN AVANZADA
const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select, [type="checkbox"]');
const btnEnviar = document.getElementById('btnEnviar');

// Estado de validación de cada campo
let estadoValidacion = {};

// Inicializar estado de todos los campos
campos.forEach((campo) => {
    estadoValidacion[campo.name] = false;
});

// 🎯 VALIDACIONES ESPECÍFICAS POR CAMPO

// Validación del nombre
document.getElementById('nombreCompleto').addEventListener('input', function () {
    const valor = this.value.trim();
    const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);
    
    if (valor.length < 3) {
        mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
        marcarCampo(this, false);
    } else if (nombres.length < 2) {
        mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoNombre', '✓ Nombre válido');
        marcarCampo(this, true);
    }
});

// Validación del email
document.getElementById('correo').addEventListener('input', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
        mostrarError('errorCorreo', 'Formato de email inválido');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoCorreo', '✓ Email válido');
        marcarCampo(this, true);
    }
});
// Validación de confirmación de correo electronico 
document.getElementById('confirmarCorreo').addEventListener('input', function () {
    const correo = document.getElementById('correo').value;
    if (this.value !== correo) {
        mostrarError('errorConfirmarCorreo', 'Los correos no coinciden');
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmarCorreo', '✓ Correos coinciden');
        marcarCampo(this, true);
    }
});
// Validación de contraseña con indicador de fortaleza
document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const fortaleza = calcularFortalezaPassword(password);
    actualizarBarraFortaleza(fortaleza);

    if (password.length > 8) {
        mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
        marcarCampo(this, false);
    } else if (fortaleza.nivel < 2) {
        mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
        marcarCampo(this, true);
    }

    // Revalidar confirmación si existe
    const confirmar = document.getElementById('confirmarPassword');
    if (confirmar.value) {
        confirmar.dispatchEvent(new Event('input'));
    }
});


// Validación de confirmación de contraseña
document.getElementById('confirmarPassword').addEventListener('input', function () {
    const password = document.getElementById('password').value;
    if (this.value !== password) {
        mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
        marcarCampo(this, true);
    }
});
// Validación de intereses
const interesesCheckboxes = document.querySelectorAll('#intereses input[type="checkbox"]');
const otroInteres = document.getElementById('otroInteres');

interesesCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        const checkedCount = document.querySelectorAll('#intereses input[type="checkbox"]:checked').length;
        const otroInteresValue = otroInteres.value.trim();

        if (checkedCount === 0 && otroInteresValue === '') {
            mostrarError('errorIntereses', 'Selecciona al menos un interés');
            marcarCampo(this, false);
        } else {
            ocultarMensaje('errorIntereses');
            marcarCampo(this, true);
        }
    });
});

otroInteres.addEventListener('input', function () {
    const checkedCount = document.querySelectorAll('#intereses input[type="checkbox"]:checked').length;

    if (checkedCount === 0 && this.value.trim() === '') {
        mostrarError('errorIntereses', 'Selecciona al menos un interés');
        marcarCampo(this, false);
    } else {
        ocultarMensaje('errorIntereses');
        marcarCampo(this, true);
    }
});

// Validación de fecha de nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function () {
    const fechaNacimiento = new Date(this.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    
    if (edad < 18) {
        mostrarError('errorFecha', 'Debes ser mayor de 18 años');
        marcarCampo(this, false);
    } else if (edad > 100) {
        mostrarError('errorFecha', 'Fecha no válida');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
        marcarCampo(this, true);
    }
});



// Validación de términos
document.getElementById('terminos').addEventListener('change', function () {
    if (!this.checked) {
        mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
        marcarCampo(this, false);
    } else {
        ocultarMensaje('errorTerminos');
        marcarCampo(this, true);
    }
});

// 🎯 FUNCIONES AUXILIARES

function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    ocultarMensaje(idElemento.replace('error', 'exito'));
}

function mostrarExito(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    ocultarMensaje(idElemento.replace('exito', 'error'));
}

function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
    estadoValidacion[campo.name] = esValido;
    if (esValido) {
        campo.classList.remove('invalido');
        campo.classList.add('valido');
    } else {
        campo.classList.remove('valido');
        campo.classList.add('invalido');
    }
    actualizarProgreso();
    actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
    let puntos = 0;
    let feedback = [];
    
    if (password.length >= 8) puntos++;
    if (password.length >= 12) puntos++;
    if (/[a-z]/.test(password)) puntos++;
    if (/[A-Z]/.test(password)) puntos++;
    if (/[0-9]/.test(password)) puntos++;
    if (/[^A-Za-z0-9]/.test(password)) puntos++;
    
    const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
    const nivel = Math.min(Math.floor(puntos / 1.2), 4);
    
    return { nivel, texto: niveles[nivel], puntos };
}


function actualizarBarraFortaleza(fortaleza) {
    const barra = document.getElementById('strengthBar');
    const clases = [
        'strength-weak',
        'strength-medium',
        'strength-strong',
        'strength-very-strong',
    ];
    barra.className = 'password-strength ' + clases[fortaleza.nivel];
}


function actualizarProgreso() {
    const totalCampos = Object.keys(estadoValidacion).length;
    const camposValidos = Object.values(estadoValidacion).filter((valido) => valido).length;
    const porcentaje = Math.round((camposValidos / totalCampos) * 100);
    
    document.getElementById('barraProgreso').style.width = porcentaje + '%';
    document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
    const todosValidos = Object.values(estadoValidacion).every((valido) => valido);
    btnEnviar.disabled = !todosValidos;
}

// 🎯 MANEJO DEL ENVÍO DEL FORMULARIO
formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const datosFormulario = new FormData(this);
    let resumenHTML = '';

    for (let [campo, valor] of datosFormulario.entries()) {
        if (valor && valor.trim() !== '') {
            const nombreCampo = obtenerNombreCampo(campo);
            resumenHTML += `
                <div class="dato-resumen">
                    <span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}
                </div>
            `;
        }
    }

    document.getElementById('contenidoResumen').innerHTML = resumenHTML;
    document.getElementById('resumenDatos').style.display = 'block';

    // Scroll suave hacia el resumen
    document.getElementById('resumenDatos').scrollIntoView({
        behavior: 'smooth',
    });

    console.log('📊 Formulario enviado con validación completa:', Object.fromEntries(datosFormulario));
});

function obtenerNombreCampo(campo) {
    const nombres = {
        nombreCompleto: 'Nombre completo',
        correo: 'Correo electrónico',
        confirmarEmail:'Confrimacion de correo electronico',
        password: 'Contraseña',
        confirmarPassword: 'Confirmación de contraseña',
        fechaNacimiento: 'Fecha de nacimiento',
        intereses: 'Intereses',
        otroInteres: 'Otro interés',
        terminos: 'Términos aceptados',
    };
    return nombres[campo] || campo;
}

function reiniciarFormulario() {
    formulario.reset();
    document.getElementById('resumenDatos').style.display = 'none';

    // Reiniciar estado de validación
    Object.keys(estadoValidacion).forEach((campo) => {
        estadoValidacion[campo] = false;
    });

    // Limpiar clases y mensajes
    campos.forEach((campo) => {
        campo.classList.remove('valido', 'invalido');
    });

    document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((mensaje) => {
        mensaje.style.display = 'none';
    });

    actualizarProgreso();
    actualizarBotonEnvio();

    // Limpiar barra de fortaleza
    document.getElementById('strengthBar').className = 'password-strength';
}