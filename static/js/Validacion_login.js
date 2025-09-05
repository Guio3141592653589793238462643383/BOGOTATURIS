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
}

// Modifica el evento de submit del formulario
document.getElementById('loginForm').addEventListener('input', function(event) {
    const campo = event.target;

    if (campo.id === 'correo') {
        if (!/\S+@\S+\.\S+/.test(campo.value)) {
            mostrarError('errorCorreo', 'Por favor, ingresa un correo electrónico válido.');
            marcarCampo(campo, false);
        } else {
            mostrarExito('exitoCorreo', '✓ Email válido');
            marcarCampo(campo, true);
        }
    } else if (campo.id === 'password') {
        if (campo.value.length < 8) {
            mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres.');
            marcarCampo(campo, false);
        } else {
            mostrarExito('exitoPassword', '✓ Contraseña válida');
            marcarCampo(campo, true);
        }
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener valores de los campos
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;
    let valid = true;

    // Validación de correo electrónico
    const errorCorreo = document.getElementById('errorCorreo');
    const exitoCorreo = document.getElementById('exitoCorreo');
    if (!/\S+@\S+\.\S+/.test(correo)) {
        mostrarError('errorCorreo', 'Por favor, ingresa un correo electrónico válido.');
        valid = false;
    } else {
        mostrarExito('exitoCorreo', '✓ Email válido');
    }

    // Validación de contraseña
    const errorPassword = document.getElementById('errorPassword');
    const exitoPassword = document.getElementById('exitoPassword');
    if (password.length < 8) {
        mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres.');
        valid = false;
    } else {
        mostrarExito('exitoPassword', '✓ Contraseña válida');
    }

    // Si todo es válido, enviar los datos al backend
    if (valid) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, password }),
            });

            if (response.ok) {
                alert("Inicio de sesión exitoso.");
                errorCorreo.style.display = 'none';
                errorPassword.style.display = 'none';
                exitoCorreo.style.display = 'block';
                exitoPassword.style.display = 'block';
                // Redirigir o realizar otra acción
            } else {
                alert("Error en el inicio de sesión. Verifica tus credenciales.");
                errorCorreo.style.display = 'block';
                errorPassword.style.display = 'block';
                exitoCorreo.style.display = 'none';
                exitoPassword.style.display = 'none';
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    }
});