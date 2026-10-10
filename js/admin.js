// ==========================================
// CONTROL DE ACCESO Y AUTENTICACIÓN
// ==========================================

function verificarPermisoAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario || usuario.rol !== 'Administrador') {
        alert("Acceso denegado. Esta sección es exclusiva para Administradores.");
        window.location.href = "index.html";
    }
}

let indexEditandoProducto = null;
let indexEditandoUsuario = null;

const USUARIOS_INICIALES = [
    { rut: "111111111", nombre: "Isaac Arias", email: "I.admin@gmail.com", correo: "I.admin@gmail.com", rol: "Administrador", pass: "1234", password: "1234" },
    { rut: "222222222", nombre: "Eliot Armijo", email: "E.admin@gmail.com", correo: "E.admin@gmail.com", rol: "Administrador", pass: "1234", password: "1234" }
];

const PRODUCTOS_INICIALES = [
    { codigo: "CHI-001", nombre: "Camiseta Selección Chilena 2024", precio: 45000, stock: 25, stockCritico: 5 },
    { codigo: "CHI-002", nombre: "Camiseta Selección de Alemania 2024", precio: 65000, stock: 20, stockCritico: 4 },
    { codigo: "CHI-003", nombre: "Short Selección Chilena 2024", precio: 25000, stock: 15, stockCritico: 3 },
    { codigo: "BOT-001", nombre: "Botines Mercurial Superfly", precio: 120000, stock: 10, stockCritico: 2 }
];

function obtenerUsuarios() {
    const adminsIniciales = (typeof USUARIOS_INICIALES !== 'undefined' && USUARIOS_INICIALES.length > 0)
        ? USUARIOS_INICIALES
        : [
            { rut: "11111111", nombre: "Isaac Arias", correo: "I.admin@gmail.com", email: "I.admin@gmail.com", rol: "Administrador" },
            { rut: "22222222", nombre: "Eliot Armijo", correo: "E.admin@gmail.com", email: "E.admin@gmail.com", rol: "Administrador" }
        ];

    let guardados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || 
                    JSON.parse(localStorage.getItem('usuarios')) || [];

    const mapaUsuarios = new Map();

    // 1. Cargar bases
    adminsIniciales.forEach(admin => {
        const correoKey = (admin.correo || admin.email || admin.rut || "").toLowerCase();
        if (correoKey) mapaUsuarios.set(correoKey, admin);
    });

    // 2. Aplicar ediciones guardadas
    guardados.forEach(u => {
        const correoKey = (u.correo || u.email || u.rut || "").toLowerCase();
        if (correoKey) {
            const base = mapaUsuarios.get(correoKey) || {};
            mapaUsuarios.set(correoKey, {
                ...base,
                ...u,
                rut: u.rut || base.rut || "11111111"
            });
        }
    });

    return Array.from(mapaUsuarios.values());
}

// Obtiene la lista completa de productos sincronizando localStorage con la lista base del catálogo
function obtenerProductos() {
    // 1. Intentar obtener productos guardados en el navegador
    let guardados = JSON.parse(localStorage.getItem('productos'));

    // Si existen productos guardados, responder SIEMPRE con esos
    if (guardados && Array.isArray(guardados) && guardados.length > 0) {
        return guardados;
    }

    // 2. Solo si el localStorage está totalmente vacío, cargar los productos iniciales
    const iniciales = (typeof PRODUCTOS_INICIALES !== 'undefined') ? PRODUCTOS_INICIALES : [];
    if (iniciales.length > 0) {
        localStorage.setItem('productos', JSON.stringify(iniciales));
    }
    return iniciales;
}
function guardarUsuario(e) {
    if (e) e.preventDefault();

    let usuarios = obtenerUsuarios() || [];
    const modalEl = document.getElementById("modalUsuario") || document.getElementById("modal-usuario") || document;

    const getInpVal = (terminos) => {
        const inputs = Array.from(modalEl.querySelectorAll("input, select"));
        const inp = inputs.find(i => terminos.some(t => (i.id || "").toLowerCase().includes(t) || (i.name || "").toLowerCase().includes(t)));
        return inp ? inp.value.trim() : "";
    };

    const uAntiguo = (indexEditandoUsuario !== null && indexEditandoUsuario >= 0 && usuarios[indexEditandoUsuario]) ? usuarios[indexEditandoUsuario] : {};

    const rut = getInpVal(["rut", "run"]) || uAntiguo.rut || "11111111";
    const nombre = getInpVal(["nombre"]) || uAntiguo.nombre || "Usuario";
    const correo = getInpVal(["correo", "email"]) || uAntiguo.correo || uAntiguo.email || "";
    const rol = getInpVal(["rol"]) || uAntiguo.rol || "Cliente";
    const pass = getInpVal(["pass", "contra", "password"]);
    const passConfirm = getInpVal(["confirm", "confirmar"]);

    // Validar coincidencia de contraseña solo si el usuario escribió algo en las casillas
    if (pass !== "" || passConfirm !== "") {
        if (pass !== passConfirm) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    }

    const usuarioGuardado = {
        rut: rut,
        nombre: nombre,
        correo: correo,
        email: correo,
        rol: rol,
        pass: pass !== "" ? pass : (uAntiguo.pass || uAntiguo.password || "1234"),
        password: pass !== "" ? pass : (uAntiguo.pass || uAntiguo.password || "1234")
    };

    if (indexEditandoUsuario !== null && indexEditandoUsuario >= 0) {
        usuarios[indexEditandoUsuario] = usuarioGuardado;
    } else {
        usuarios.push(usuarioGuardado);
    }

    // Guardar en localStorage
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Cerrar Modal
    if (modalEl && window.bootstrap) {
        const inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
    }

    indexEditandoUsuario = null;

    // Refrescar tabla y contadores del panel
    if (typeof cargarUsuarios === "function") cargarUsuarios();
    if (typeof actualizarDashboard === "function") actualizarDashboard();
}

function guardarProductos(productos) {
    localStorage.setItem('admin_productos', JSON.stringify(productos));
    localStorage.setItem('productos', JSON.stringify(productos));
}
function guardarProducto(e) {
    if (e) e.preventDefault();

    let productos = obtenerProductos() || [];
    const modalEl = document.getElementById("modalProducto") || document.getElementById("modal-producto") || document;

    const getInpVal = (terminos) => {
        const inputs = Array.from(modalEl.querySelectorAll("input, select"));
        const inp = inputs.find(i => terminos.some(t => (i.id || "").toLowerCase().includes(t) || (i.name || "").toLowerCase().includes(t)));
        return inp ? inp.value : "";
    };

    const editando = indexEditandoProducto !== null && indexEditandoProducto >= 0 && productos[indexEditandoProducto];
    // Se parte del producto original para NO perder imagen, descripción, categoría, etc.
    const pAntiguo = editando ? productos[indexEditandoProducto] : {};

    const codigo = getInpVal(["codigo"]).trim();
    const nombre = getInpVal(["nombre"]).trim();
    const precioTxt = getInpVal(["precio"]);
    const categoria = getInpVal(["categoria"]) || pAntiguo.categoria || "";
    const descripcion = getInpVal(["descripcion"]).trim();
    const imagen = getInpVal(["imagen"]).trim();
    const criticoTxt = getInpVal(["critico", "limite"]);
    const stockCritico = criticoTxt === "" ? (pAntiguo.stockCritico !== undefined ? pAntiguo.stockCritico : 3) : Number(criticoTxt);

    // Validaciones
    if (codigo.length < 3) { alert("El código debe tener al menos 3 caracteres."); return; }
    if (nombre === "" || nombre.length > 100) { alert("El nombre es requerido (máx. 100 caracteres)."); return; }
    if (precioTxt === "" || Number(precioTxt) < 0) { alert("El precio es requerido y no puede ser negativo."); return; }
    if (categoria === "") { alert("Selecciona una categoría."); return; }
    if (descripcion.length > 500) { alert("La descripción no puede superar los 500 caracteres."); return; }
    if (!Number.isInteger(stockCritico) || stockCritico < 0) { alert("El stock crítico debe ser un número entero mayor o igual a 0."); return; }

    const duplicado = productos.some((p, i) => p.codigo === codigo && i !== indexEditandoProducto);
    if (duplicado) { alert("Ya existe un producto con ese código."); return; }

    // Leer las cantidades por talla
    const inputsDinamicos = modalEl.querySelectorAll(".input-talla-dinamica");
    const objTallasNuevas = {};
    let totalStock = 0;
    let tallaInvalida = false;

    inputsDinamicos.forEach(inp => {
        const cant = Number(inp.value);
        if (!Number.isInteger(cant) || cant < 0) tallaInvalida = true;
        objTallasNuevas[inp.getAttribute("data-talla")] = cant > 0 ? cant : 0;
        totalStock += cant > 0 ? cant : 0;
    });
    if (tallaInvalida) { alert("El stock por talla debe ser un número entero mayor o igual a 0."); return; }

    const prodGuardado = {
        ...pAntiguo,
        codigo: codigo,
        nombre: nombre,
        precio: Number(precioTxt),
        categoria: categoria,
        descripcion: descripcion || pAntiguo.descripcion || "",
        imagen: imagen || pAntiguo.imagen || "",
        stock: totalStock,
        stockCritico: stockCritico,
        tallas: objTallasNuevas
    };

    if (editando) {
        productos[indexEditandoProducto] = prodGuardado;
    } else {
        productos.push(prodGuardado);
    }

    guardarProductos(productos);

    if (modalEl && window.bootstrap) {
        const inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
    }

    indexEditandoProducto = null;

    if (typeof cargarProductos === "function") cargarProductos();
    if (typeof cargarTablaStockCritico === "function") cargarTablaStockCritico();
    if (typeof actualizarDashboard === "function") actualizarDashboard();
}
// ==========================================
// INICIALIZACIÓN Y EVENTOS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    refrescarTodo();

    document.querySelector('[data-bs-target="#modalProducto"]')?.addEventListener('click', () => {
        indexEditandoProducto = null;
        const form = document.getElementById('form-producto');
        if (form) form.reset();
        renderizarCamposTallasModal({});
        const modalTitle = document.querySelector('#modalProducto .modal-title');
        if (modalTitle) modalTitle.textContent = "Nuevo Producto";
    });

    document.querySelector('[data-bs-target="#modalUsuario"]')?.addEventListener('click', () => {
        indexEditandoUsuario = null;
        const form = document.getElementById('form-usuario');
        if (form) form.reset();
        const modalTitle = document.querySelector('#modalUsuario .modal-title');
        if (modalTitle) modalTitle.textContent = "Nuevo Usuario";
    });

    document.getElementById('form-usuario')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const rut = document.getElementById('user-rut').value.trim();
        const nombre = document.getElementById('user-nombre').value.trim();
        const correo = document.getElementById('user-correo').value.trim();
        const rol = document.getElementById('user-rol').value || 'Cliente';

        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;

        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const esValido = dominiosPermitidos.some(domain => correo.toLowerCase().endsWith(domain));
        if (!esValido) {
            alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return;
        }

        let usuarios = obtenerUsuarios();

        if (indexEditandoUsuario !== null && indexEditandoUsuario >= 0) {
            let userActual = usuarios[indexEditandoUsuario];
            let passFinal = userActual.pass || userActual.password || "1234";

            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    alert("Las contraseñas no coinciden.");
                    return;
                }
                if (password.length < 4) {
                    alert("La contraseña debe tener al menos 4 caracteres.");
                    return;
                }
                passFinal = password;
            }

            usuarios[indexEditandoUsuario] = {
                ...userActual,
                rut,
                nombre,
                email: correo,
                correo,
                rol,
                pass: passFinal,
                password: passFinal
            };
            indexEditandoUsuario = null;
        } else {
            if (!password || !confirmPassword) {
                alert("Debes ingresar y confirmar la contraseña.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }
            if (password.length < 4) {
                alert("La contraseña debe tener al menos 4 caracteres.");
                return;
            }

            if (usuarios.some(u => (u.email || u.correo || "").toLowerCase() === correo.toLowerCase())) {
                alert("Este correo ya está registrado.");
                return;
            }

            usuarios.push({
                rut,
                nombre,
                email: correo,
                correo,
                rol,
                pass: password,
                password: password
            });
        }

        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
        e.target.reset();
        cerrarModal('modalUsuario');
        refrescarTodo();
    });
});

// ==========================================
// FUNCIÓN PRINCIPAL MOSTRAR / OCULTAR PANELES
// ==========================================

function toggleSeccion(nombre) {
    const idSeccion = `sec-${nombre}`;
    const seccionObjetivo = document.getElementById(idSeccion);
    if (!seccionObjetivo) return;

    const estaVisible = !seccionObjetivo.classList.contains('d-none');

    // Ocultar todas las secciones primero
    document.querySelectorAll('.seccion-panel').forEach(sec => sec.classList.add('d-none'));

    // Si NO estaba visible, la mostramos (efecto toggle abrir/cerrar)
    if (!estaVisible) {
        seccionObjetivo.classList.remove('d-none');
        seccionObjetivo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function refrescarTodo() {
    cargarProductos();
    cargarUsuarios();
    actualizarDashboard();
    cargarTablaStockCritico();
    cargarVentas();
}

function cerrarModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
    }
}

// ------------------------------------
// RENDERIZADO DE TABLAS
// ------------------------------------
// (Las funciones obtenerKeysTallasPorProducto y normalizarObjetoTallas están en js/tallas.js)



function cargarProductos() {
    const tbody = document.getElementById("tabla-productos") || document.querySelector("tbody");
    if (!tbody) return;

    const productos = obtenerProductos();

    if (!productos || productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No hay productos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = productos.map((p, index) => {
        const limit = p.stockCritico !== undefined ? p.stockCritico : 3;

        // Normalizar tallas según la categoría/tipo de producto
        const objTallas = normalizarObjetoTallas(p);
        const stockTotal = Object.values(objTallas).reduce((acc, val) => acc + (Number(val) || 0), 0);

        // Generar las etiquetas con el stock por talla
        const HTMLDesgloseTallas = Object.entries(objTallas).map(([talla, cant]) => `
            <div class="col-auto mb-1">
                <span class="badge bg-white text-dark border p-2">
                    <strong>Talla ${talla}:</strong> ${cant} u.
                </span>
            </div>
        `).join("");

        const esCritico = stockTotal <= limit;
        const precioFormateado = Number(p.precio || 0).toLocaleString("es-CL");

        return `
            <tr class="${esCritico ? 'table-warning' : ''}">
                <td><code>${p.codigo || 'N/A'}</code></td>
                <td>
                    <span class="fw-bold d-block">${p.nombre || 'Sin nombre'}</span>
                    <button class="btn btn-sm btn-link p-0 text-decoration-none small text-primary" onclick="toggleDesglose(${index})">
                        <i class="fa-solid fa-chevron-down me-1" id="icono-desglose-${index}"></i> Ver stock por talla
                    </button>
                </td>
                <td>$${precioFormateado}</td>
                <td>
                    <strong class="fs-6">${stockTotal} u.</strong>
                    ${esCritico ? '<span class="badge bg-danger ms-1">Stock Crítico</span>' : ''}
                </td>
                <td><span class="badge bg-secondary">${limit} u.</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarProducto(${index})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
            <tr id="desglose-row-${index}" style="display: none;" class="bg-light">
                <td colspan="6" class="p-3 bg-light border-top-0">
                    <div class="card card-body bg-light border-0 py-2">
                        <h6 class="fw-bold mb-2 text-secondary small"><i class="fa-solid fa-boxes-stacked me-1"></i> Desglose de Stock por Talla:</h6>
                        <div class="row g-2">
                            ${HTMLDesgloseTallas}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleDesglose(index) {
    const row = document.getElementById(`desglose-row-${index}`);
    const icono = document.getElementById(`icono-desglose-${index}`);
    if (row) {
        if (row.style.display === "none") {
            row.style.display = "table-row";
            if (icono) icono.className = "fa-solid fa-chevron-up me-1";
        } else {
            row.style.display = "none";
            if (icono) icono.className = "fa-solid fa-chevron-down me-1";
        }
    }
}

function refrescarTabla() {
    cargarProductos();
    actualizarDashboard();
    if (typeof cargarTablaStockCritico === "function") cargarTablaStockCritico();
}

function cargarUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;

    const usuarios = obtenerUsuarios();

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map((u, index) => {
        const esAdmin = u.rol === 'Administrador';

        return `
            <tr>
                <td><code>${u.rut || u.run || 'N/A'}</code></td>
                <td>${u.nombre || 'Sin nombre'}</td>
                <td>${u.correo || u.email || 'N/A'}</td>
                <td>
                    <span class="badge ${esAdmin ? 'bg-danger' : 'bg-info text-dark'}">
                        ${u.rol || 'Cliente'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarUsuario(${index})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function cargarTablaStockCritico() {
    const tbody = document.getElementById("tabla-dash-stock-critico") || document.getElementById("tabla-stock-critico");
    if (!tbody) return;

    const productos = obtenerProductos() || [];
    let productosCriticos = [];

    productos.forEach((p, indexReal) => {
        const limit = p.stockCritico !== undefined ? Number(p.stockCritico) : 3;
        const objTallas = typeof normalizarObjetoTallas === "function" ? normalizarObjetoTallas(p) : (p.tallas || {});

        if (objTallas && typeof objTallas === "object" && !Array.isArray(objTallas) && Object.keys(objTallas).length > 0) {
            Object.entries(objTallas).forEach(([talla, cant]) => {
                const cantidadNum = Number(cant) || 0;
                if (cantidadNum <= limit) {
                    productosCriticos.push({
                        codigo: p.codigo || "N/A",
                        nombre: p.nombre || "Sin Nombre",
                        tallaCritica: talla,
                        stockActual: cantidadNum,
                        limit: limit,
                        precio: p.precio || 0,
                        indexReal: indexReal
                    });
                }
            });
        } else {
            const stockTotal = Number(p.stock) || 0;
            if (stockTotal <= limit) {
                productosCriticos.push({
                    codigo: p.codigo || "N/A",
                    nombre: p.nombre || "Sin Nombre",
                    tallaCritica: "General",
                    stockActual: stockTotal,
                    limit: limit,
                    precio: p.precio || 0,
                    indexReal: indexReal
                });
            }
        }
    });

    // --- ACTUALIZAR TARJETA DE ALERTAS STOCK CRÍTICO ---
    const elementoContadorCritico = document.getElementById("dash-stock-critico") || 
                                    document.getElementById("cant-stock-critico") || 
                                    document.getElementById("alertas-stock-critico") || 
                                    document.querySelector(".bg-warning .fs-1, .bg-warning h2, .bg-warning div.display-4");

    if (elementoContadorCritico) {
        // Muestra el total de alertas por talla encontradas
        elementoContadorCritico.textContent = productosCriticos.length;
    }

    // Si no hay stock crítico
    if (productosCriticos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-success py-3 fw-bold">
                    <i class="fa-solid fa-circle-check me-1"></i> ¡Excelente! No hay productos en stock crítico.
                </td>
            </tr>`;
        return;
    }

    // Renderizar la tabla
    tbody.innerHTML = productosCriticos.map(p => {
        const funcionAccion = typeof irAMantenedorProductosYEditar === "function" 
            ? `irAMantenedorProductosYEditar(${p.indexReal})` 
            : `irAProducto(${p.indexReal})`;

        return `
            <tr class="table-warning">
                <td><code class="text-danger fw-bold">${p.codigo}</code></td>
                <td class="fw-bold">${p.nombre}</td>
                <td><span class="badge bg-dark fs-6">Talla ${p.tallaCritica}</span></td>
                <td><span class="badge bg-danger fs-6">${p.stockActual} u.</span></td>
                <td><span class="badge bg-secondary">${p.limit} u.</span></td>
                <td>$${Number(p.precio).toLocaleString("es-CL")}</td>
                <td>
                    <button class="btn btn-sm btn-info text-white fw-bold shadow-sm" onclick="${funcionAccion}" title="Ir a editar este producto">
                        <i class="fa-solid fa-eye me-1"></i> Ir al Producto
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function cargarVentas() {
    const tbody = document.getElementById("tabla-ventas");
    if (!tbody) return;

    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

    if (ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    Aún no se han registrado ventas en la tienda.
                </td>
            </tr>`;
        return;
    }

    const ventasInvertidas = [...ventas].reverse();

    tbody.innerHTML = ventasInvertidas.map(v => {
        const detalleProductos = (v.productos || []).map(p => `
            <div style="margin-bottom: 2px;">
                <strong>${p.cantidad || 1}x</strong> ${p.nombre} ${p.talla ? `<b>(${p.talla})</b>` : ''}
                <span class="text-muted">($${Number(p.precio || 0).toLocaleString("es-CL")})</span>
            </div>
        `).join('');

        return `
            <tr>
                <td><strong>${v.id}</strong></td>
                <td>${v.fecha}</td>
                <td><span class="badge bg-secondary">${v.metodo}</span></td>
                <td>${detalleProductos}</td>
                <td class="fw-bold text-success">$${Number(v.total || 0).toLocaleString("es-CL")}</td>
            </tr>
        `;
    }).join('');
}

// Actualización del panel
function actualizarDashboard() {
    const productos = obtenerProductos() || [];
    const usuarios = obtenerUsuarios() || [];
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

    let contadorCriticos = 0;

    productos.forEach(p => {
        const limit = p.stockCritico !== undefined ? Number(p.stockCritico) : 3;

        // Normalizamos las tallas para soportar balones, zapatos, camisetas y shorts
        const objTallas = typeof normalizarObjetoTallas === "function" 
            ? normalizarObjetoTallas(p) 
            : (p.tallas || {});

        if (objTallas && typeof objTallas === "object" && !Array.isArray(objTallas) && Object.keys(objTallas).length > 0) {
            Object.values(objTallas).forEach(cant => {
                const cantNum = Number(cant);
                if (!isNaN(cantNum) && cantNum <= limit) {
                    contadorCriticos++;
                }
            });
        } else if (p.stock !== undefined && Number(p.stock) <= limit) {
            contadorCriticos++;
        }
    });

    const elProds = document.getElementById("dash-total-prods");
    const elCriticos = document.getElementById("dash-stock-critico");
    const elUsers = document.getElementById("dash-total-users");
    const elVentas = document.getElementById("dash-total-ventas");

    if (elProds) elProds.textContent = productos.length;
    if (elCriticos) elCriticos.textContent = contadorCriticos;
    if (elUsers) elUsers.textContent = usuarios.length;
    if (elVentas) elVentas.textContent = ventas.length;
}


// Genera dinámicamente las casillas del modal según el tipo de producto (Botines, Balones, Ropa, etc.)
function renderizarCamposTallasModal(p) {
    const keysTallas = obtenerKeysTallasPorProducto(p);
    const objTallas = normalizarObjetoTallas(p);

    const modalEl = document.getElementById("modalProducto") || document.getElementById("modal-producto") || document;
    
    // Buscar el contenedor donde están actualmente las tallas en el modal
    let contenedorTallas = modalEl.querySelector("#contenedor-tallas-dinamico");

    if (!contenedorTallas) {
        // Si no se ha marcado aún, buscar por cualquier input de talla existente
        const primerInputTalla = modalEl.querySelector("input[id*='talla'], input[name*='talla'], input[id*='stock-']");
        if (primerInputTalla) {
            contenedorTallas = primerInputTalla.closest(".row") || primerInputTalla.closest(".mb-3") || primerInputTalla.parentElement.parentElement;
        }
    }

    if (!contenedorTallas) return;

    // Asignar ID identificador para futuras lecturas
    contenedorTallas.id = "contenedor-tallas-dinamico";

    // Dibujar los campos dinámicos
    let htmlTallas = `
        <div class="col-12 mb-2">
            <label class="form-label fw-bold small text-secondary">
                <i class="fa-solid fa-ruler-combined me-1"></i> Stock por Talla:
            </label>
        </div>
        <div class="row g-2 w-100 m-0">
    `;

    keysTallas.forEach(talla => {
        const cantidadActual = objTallas[talla] !== undefined ? objTallas[talla] : 0;
        htmlTallas += `
            <div class="col">
                <label class="form-label small mb-1 fw-bold text-center d-block">Talla ${talla}</label>
                <input type="number" 
                       min="0" 
                       class="form-control form-control-sm text-center input-talla-dinamica" 
                       data-talla="${talla}" 
                       value="${cantidadActual}">
            </div>
        `;
    });

    htmlTallas += `</div>`;
    contenedorTallas.innerHTML = htmlTallas;
}

// ==========================================
// EDICIÓN Y ELIMINACIÓN
// ==========================================
function editarProducto(index) {
    const productos = obtenerProductos();
    const p = productos[index];
    if (!p) return;

    indexEditandoProducto = index;

    const modalEl = document.getElementById("modalProducto") || document.getElementById("modal-producto") || document;
    const inputs = Array.from(modalEl.querySelectorAll("input, select"));

    const setVal = (terminos, val) => {
        const inp = inputs.find(i => terminos.some(t => (i.id || "").toLowerCase().includes(t) || (i.name || "").toLowerCase().includes(t)));
        if (inp) inp.value = val !== undefined && val !== null ? val : "";
    };

    setVal(["codigo"], p.codigo || "");
    setVal(["nombre"], p.nombre || "");
    setVal(["precio"], p.precio || 0);
    setVal(["categoria"], p.categoria || "");
    setVal(["descripcion"], p.descripcion || "");
    setVal(["imagen"], p.imagen || "");
    setVal(["critico", "limite"], p.stockCritico !== undefined ? p.stockCritico : 3);

    const tituloModal = document.querySelector("#modalProducto .modal-title");
    if (tituloModal) tituloModal.textContent = "Editar Producto";

    // Renderizar casillas del modal con las tallas del producto correspondiente
    renderizarCamposTallasModal(p);

    // Abrir modal de Bootstrap
    if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}
function editarUsuario(index) {
    const usuarios = obtenerUsuarios();
    const u = usuarios[index];
    if (!u) return;

    indexEditandoUsuario = index;

    document.getElementById('user-rut').value = u.rut || '';
    document.getElementById('user-nombre').value = u.nombre || '';
    document.getElementById('user-correo').value = u.correo || u.email || '';

    const selectRol = document.getElementById('user-rol');
    if (selectRol) {
        selectRol.value = (u.rol === 'Administrador') ? 'Administrador' : 'Cliente';
    }

    if (document.getElementById('user-password')) document.getElementById('user-password').value = '';
    if (document.getElementById('user-confirm-password')) document.getElementById('user-confirm-password').value = '';

    const modalTitle = document.querySelector('#modalUsuario .modal-title');
    if (modalTitle) modalTitle.textContent = "Editar Usuario";

    const modalEl = document.getElementById('modalUsuario');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function eliminarProducto(index) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    let productos = obtenerProductos();
    productos.splice(index, 1);
    guardarProductos(productos);
    refrescarTodo();
}

function eliminarUsuario(index) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    let usuarios = obtenerUsuarios();
    usuarios.splice(index, 1);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    refrescarTodo();
}
document.addEventListener("DOMContentLoaded", () => {
    actualizarDashboard();
    if (typeof cargarProductos === "function") cargarProductos();
    if (typeof cargarTablaStockCritico === "function") cargarTablaStockCritico();
    if (typeof cargarVentas === "function") cargarVentas();
    if (typeof cargarUsuarios === "function") cargarUsuarios();
});
document.addEventListener("DOMContentLoaded", () => {
    // Vincular al formulario del modal
    const formModal = document.querySelector("#modalProducto form") || document.querySelector("#modal-producto form");
    if (formModal) {
        formModal.addEventListener("submit", guardarProducto);
    }

    // Vincular al botón "Guardar" del modal
    const btnGuardar = document.querySelector("#modalProducto .btn-success") || 
                       document.querySelector("#modalProducto button[type='submit']") || 
                       document.querySelector("#modal-producto .btn-success");
    if (btnGuardar) {
        btnGuardar.onclick = guardarProducto;
    }
});
// Redirige la pantalla hacia la tabla de productos y abre el modal de edición
function irAProducto(indexOriginal) {
    // 1. Buscar la tabla o sección de Productos
    const tablaProductos = document.getElementById("tabla-productos") || document.querySelector("h2, h3, .table-responsive");

    if (tablaProductos) {
        // Desplazamiento suave hasta la sección de productos
        tablaProductos.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 2. Abrir automáticamente el modal de edición para ese producto
    setTimeout(() => {
        if (typeof editarProducto === "function") {
            editarProducto(indexOriginal);
        }
    }, 400); // Pequeña pausa para permitir el scroll
}

// Al elegir/cambiar la categoría en el modal, se muestran las tallas que corresponden
document.addEventListener("DOMContentLoaded", () => {
    const selCategoria = document.getElementById("prod-categoria");
    if (selCategoria) {
        selCategoria.addEventListener("change", () => {
            renderizarCamposTallasModal({
                nombre: document.getElementById("prod-nombre")?.value || "",
                codigo: "",
                categoria: selCategoria.value
            });
        });
    }
    renderizarCamposTallasModal({});
});