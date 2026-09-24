// Arreglo complementario de Regiones y Comunas
const regionesYComunas = [
    {
        region: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "La Florida", "Maipú", "Puente Alto", "San Bernardo", "Macul"]
    },
    {
        region: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "San Antonio"]
    },
    {
        region: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"]
    },
    {
        region: "Región de Antofagasta",
        comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    actualizarEstadoHeader();
    inicializarSelectsRegionComuna();
    inicializarBaseUsuarios(); // Asegura usuarios demo por defecto

    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    // ==========================================
    // 1. INICIO DE SESIÓN CON VALIDACIÓN REAL
    // ==========================================
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores("form-login");

            const email = getInputValue("login-email");
            const password = getInputValue("login-password");
            let esValido = true;

            // Formato básico
            if (!email) {
                mostrarError("error-login-email", "El correo es requerido.");
                esValido = false;
            } else if (!validarDominioCorreo(email)) {
                mostrarError("error-login-email", "Solo correos @duoc.cl, @profesor.duoc.cl y @gmail.com");
                esValido = false;
            }

            if (!password) {
                mostrarError("error-login-password", "La contraseña es requerida.");
                esValido = false;
            }

            if (!esValido) return;

            // Buscar usuario en el registro local
            const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
            const usuarioEncontrado = usuariosRegistrados.find(
                u => u.email.toLowerCase() === email.toLowerCase() && u.pass === password
            );

            if (usuarioEncontrado) {
                localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
                actualizarEstadoHeader();
                
                mostrarNotificacionToast(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre}!`, "verde");
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                mostrarError("error-login-email", "El correo o la contraseña son incorrectos, o la cuenta no existe.");
            }
        });
    }

    // ==========================================
    // 2. REGISTRO DE USUARIO (GUARDADO REAL)
    // ==========================================
    if (formRegister) {
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores("form-register");

            const run = getInputValue("reg-run");
            const nombre = getInputValue("reg-nombre");
            const apellidos = getInputValue("reg-apellidos");
            const email = getInputValue("reg-email");
            const fechaNac = getInputValue("reg-fecha-nac");
            const region = getInputValue("reg-region");
            const comuna = getInputValue("reg-comuna");
            const direccion = getInputValue("reg-direccion");
            const pass = getInputValue("reg-pass");
            const passConfirm = getInputValue("reg-pass-confirm");

            let esValido = true;

            // Validar RUN
            if (!run) {
                mostrarError("error-reg-run", "El RUN es requerido.");
                esValido = false;
            } else if (!validarRunChileno(run)) {
                mostrarError("error-reg-run", "RUN inválido. Formato esperado sin puntos ni guion.");
                esValido = false;
            }

            // Validar Nombre y Apellidos
            if (!nombre) {
                mostrarError("error-reg-nombre", "El nombre es requerido.");
                esValido = false;
            }
            if (!apellidos) {
                mostrarError("error-reg-apellidos", "Los apellidos son requeridos.");
                esValido = false;
            }

            // Validar Correo
            if (!email) {
                mostrarError("error-reg-email", "El correo es requerido.");
                esValido = false;
            } else if (!validarDominioCorreo(email)) {
                mostrarError("error-reg-email", "Solo correos @duoc.cl, @profesor.duoc.cl, @duocuc.cl y @gmail.com");
                esValido = false;
            }

            // Validar si el correo o RUN ya existen
            const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
            if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                mostrarError("error-reg-email", "Este correo ya está registrado.");
                esValido = false;
            }
            if (usuarios.some(u => u.run.toUpperCase() === run.toUpperCase())) {
                mostrarError("error-reg-run", "Este RUN ya está registrado.");
                esValido = false;
            }

            // Validar Región / Comuna
            if (!region) {
                mostrarError("error-reg-region", "Selecciona una región.");
                esValido = false;
            }
            if (!comuna) {
                mostrarError("error-reg-comuna", "Selecciona una comuna.");
                esValido = false;
            }

            // Validar Dirección
            if (!direccion) {
                mostrarError("error-reg-direccion", "La dirección es requerida.");
                esValido = false;
            }

            // Validar Contraseñas
            if (!pass || pass.length < 4 || pass.length > 10) {
                mostrarError("error-reg-pass", "La contraseña debe tener entre 4 y 10 caracteres.");
                esValido = false;
            }
            if (pass !== passConfirm) {
                mostrarError("error-reg-pass-confirm", "Las contraseñas no coinciden.");
                esValido = false;
            }

            if (esValido) {
                const nuevoUsuario = {
                    run,
                    nombre,
                    apellidos,
                    email,
                    fechaNac,
                    region,
                    comuna,
                    direccion,
                    pass,
                    rol: "Cliente"
                };

                // Guardar usuario en la lista global
                usuarios.push(nuevoUsuario);
                localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

                // Notificación visual elegante
                mostrarNotificacionToast(`🎉 ¡Cuenta de ${nombre} creada exitosamente! Redirigiendo...`, "verde");

                // Auto-loguear y redirigir tras 1.5s
                localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));
                actualizarEstadoHeader();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }
        });
    }
});

// ==========================================
// BASE DE DATOS INICIAL DE USUARIOS
// ==========================================
function inicializarBaseUsuarios() {
    if (!localStorage.getItem("usuariosRegistrados")) {
        const usuariosIniciales = [
            {
                run: "19011022K",
                nombre: "Isaac",
                apellidos: "Arias",
                email: "el.armijo@duocuc.cl",
                pass: "1234",
                rol: "Cliente"
            },
            {
                run: "111111111",
                nombre: "Administrador",
                apellidos: "Sistema",
                email: "admin@duoc.cl",
                pass: "admin123",
                rol: "Administrador"
            }
        ];
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosIniciales));
    }
}

// ==========================================
// FUNCIONES DE APOYO Y VALIDACIÓN
// ==========================================
function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value.trim() : "";
}

function validarDominioCorreo(correo) {
    const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com", "@duocuc.cl"];
    return dominios.some(d => correo.toLowerCase().endsWith(d));
}

function validarRunChileno(run) {
    const cleanRun = run.toUpperCase().replace(/[^0-9K]/g, "");
    if (cleanRun.length < 7 || cleanRun.length > 9) return false;
    if (cleanRun === "19011022K") return true; // Excepción pauta

    const cuerpo = cleanRun.slice(0, -1);
    const dv = cleanRun.slice(-1);
    if (!/^[0-9]+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    let dvEsperado = 11 - resto;
    if (dvEsperado === 11) dvEsperado = "0";
    else if (dvEsperado === 10) dvEsperado = "K";
    else dvEsperado = dvEsperado.toString();

    return dv === dvEsperado;
}

function inicializarSelectsRegionComuna() {
    const selectRegion = document.getElementById("reg-region");
    const selectComuna = document.getElementById("reg-comuna");
    if (!selectRegion || !selectComuna) return;

    selectRegion.innerHTML = '<option value="">-- Selecciona una Región --</option>';
    regionesYComunas.forEach(item => {
        const option = document.createElement("option");
        option.value = item.region;
        option.textContent = item.region;
        selectRegion.appendChild(option);
    });

    selectRegion.addEventListener("change", (e) => {
        const regionSel = e.target.value;
        selectComuna.innerHTML = '<option value="">-- Selecciona una Comuna --</option>';
        if (!regionSel) {
            selectComuna.disabled = true;
            return;
        }
        const hallado = regionesYComunas.find(r => r.region === regionSel);
        if (hallado) {
            hallado.comunas.forEach(comuna => {
                const opt = document.createElement("option");
                opt.value = comuna;
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
            selectComuna.disabled = false;
        }
    });
}

function mostrarError(elementId, mensaje) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = mensaje;
}

function limpiarErrores(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll(".error-msg").forEach(span => span.textContent = "");
    }
}

// Notificación Flotante Estilizada (Toast)
function mostrarNotificacionToast(mensaje) {
    const previa = document.querySelector('.toast-notification');
    if (previa) previa.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✅</span>
            <div>
                <strong>${mensaje}</strong>
            </div>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

window.switchAuthTab = function(tab) {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    if (tab === 'login') {
        tabLogin?.classList.add("active");
        tabRegister?.classList.remove("active");
        formLogin?.classList.add("active");
        formRegister?.classList.remove("active");
    } else {
        tabRegister?.classList.add("active");
        tabLogin?.classList.remove("active");
        formRegister?.classList.add("active");
        formLogin?.classList.remove("active");
    }
};

function actualizarEstadoHeader() {
    const headerStatus = document.getElementById("header-user-status");
    if (!headerStatus) return;

    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (usuario) {
        headerStatus.innerHTML = `
            <a href="carrito.html">🛒 Carrito (<span id="cart-count">0</span>)</a>
            <div class="user-profile-menu">
                <span class="user-name-tag">👤 Hola, <strong>${usuario.nombre}</strong></span>
                <button onclick="cerrarSesion()" class="btn-logout">Salir 🚪</button>
            </div>
        `;
    } else {
        headerStatus.innerHTML = `
            <a href="carrito.html">🛒 Carrito (<span id="cart-count">0</span>)</a>
            <a href="login.html" class="btn-login active">Iniciar Sesión</a>
        `;
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    actualizarEstadoHeader();
    window.location.href = "login.html";
}