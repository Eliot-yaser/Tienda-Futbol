// js/admin.js - Administrador con funciones de Crear, Editar y Eliminar

// ==========================================
// CONTROL DE ACCESO OBLIGATORIO (SEGURIDAD)
// ==========================================
(function verificarPermisosAdmin() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuario || usuario.rol !== "Administrador") {
        alert("⚠️ Acceso denegado: Esta sección es exclusiva para Administradores.");
        window.location.href = "index.html";
    }
})();

// Variables globales para controlar la edición
let indexEditandoProducto = null;
let indexEditandoUsuario = null;

// Datos por defecto si el storage está vacío
const USUARIOS_INICIALES = [
    { run: '19011022K', nombre: 'Isaac', apellidos: 'Arias', email: 'i.admin@gmail.com', rol: 'Administrador' },
    { run: '222222222', nombre: 'Eliot', apellidos: 'Kvaratskhelia', email: 'e.admin@gmail.com', rol: 'Administrador' }
];

const PRODUCTOS_INICIALES = [
    { codigo: 'CAM-001', nombre: 'Camiseta Selección Chilena 2026', precio: 59990, stock: 25, stockCritico: 5 },
    { codigo: 'CAM-002', nombre: 'Camiseta Selección de Alemania 2026', precio: 64990, stock: 20, stockCritico: 4 },
    { codigo: 'SHO-001', nombre: 'Short Selección Chilena 2026', precio: 29990, stock: 20, stockCritico: 4 },
    { codigo: 'BOT-001', nombre: 'Botines Mercurial Superfly', precio: 129990, stock: 10, stockCritico: 2 }
];

// Obtener Usuarios desde localStorage
function obtenerUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'));
    if (!usuarios || usuarios.length === 0) {
        usuarios = USUARIOS_INICIALES;
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    }
    return usuarios;
}

// Obtener Productos desde localStorage
function obtenerProductos() {
    let productos = JSON.parse(localStorage.getItem('admin_productos')) || JSON.parse(localStorage.getItem('productos'));
    if (!productos || productos.length === 0) {
        productos = PRODUCTOS_INICIALES;
        guardarProductos(productos);
    }
    return productos;
}

function guardarProductos(productos) {
    localStorage.setItem('admin_productos', JSON.stringify(productos));
    localStorage.setItem('productos', JSON.stringify(productos));
}

// ==========================================
// INICIALIZACIÓN Y EVENTOS DE FORMULARIOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    refrescarTodo();

    // Resetear modales al hacer clic en botones de "Nuevo"
    document.querySelector('[data-bs-target="#modalProducto"]')?.addEventListener('click', () => {
        indexEditandoProducto = null;
        const form = document.getElementById('form-producto');
        if (form) form.reset();
        const modalTitle = document.querySelector('#modalProducto .modal-title');
        if (modalTitle) modalTitle.textContent = 'Nuevo Producto';
    });

    document.querySelector('[data-bs-target="#modalUsuario"]')?.addEventListener('click', () => {
        indexEditandoUsuario = null;
        const form = document.getElementById('form-usuario');
        if (form) form.reset();
        const modalTitle = document.querySelector('#modalUsuario .modal-title');
        if (modalTitle) modalTitle.textContent = 'Nuevo Usuario';
    });

    // Formulario de Producto (Crear / Editar)
    document.getElementById('form-producto')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('prod-codigo')?.value.trim();
        const nombre = document.getElementById('prod-nombre')?.value.trim();
        const precio = parseFloat(document.getElementById('prod-precio')?.value);
        const stock = parseInt(document.getElementById('prod-stock')?.value);
        const stockCritico = parseInt(document.getElementById('prod-stock-critico')?.value) || 5;

        if (!codigo || codigo.length < 3) {
            alert('El código debe tener al menos 3 caracteres.');
            return;
        }

        let productos = obtenerProductos();

        if (indexEditandoProducto !== null && indexEditandoProducto >= 0) {
            // Modo Edición
            productos[indexEditandoProducto] = { codigo, nombre, precio, stock, stockCritico };
            indexEditandoProducto = null;
        } else {
            // Modo Nuevo
            productos.push({ codigo, nombre, precio, stock, stockCritico });
        }

        guardarProductos(productos);
        e.target.reset();
        cerrarModal('modalProducto');
        refrescarTodo();
    });

    // Formulario de Usuario (Crear / Editar)
    document.getElementById('form-usuario')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const run = document.getElementById('user-run')?.value.trim();
        const nombre = document.getElementById('user-nombre')?.value.trim();
        const correo = document.getElementById('user-correo')?.value.trim();
        const rol = document.getElementById('user-rol')?.value;

        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const esValido = dominiosPermitidos.some(d => correo.toLowerCase().endsWith(d));
        if (!esValido) {
            alert('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }

        let usuarios = obtenerUsuarios();

        if (indexEditandoUsuario !== null && indexEditandoUsuario >= 0) {
            // Modo Edición
            const userActual = usuarios[indexEditandoUsuario];
            usuarios[indexEditandoUsuario] = {
                ...userActual,
                run,
                nombre,
                email: correo,
                correo,
                rol
            };
            indexEditandoUsuario = null;
        } else {
            // Modo Nuevo
            if (usuarios.some(u => (u.email || u.correo || '').toLowerCase() === correo.toLowerCase())) {
                alert('Este correo ya está registrado.');
                return;
            }
            usuarios.push({ run, nombre, email: correo, correo, rol, pass: '1234' });
        }

        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
        e.target.reset();
        cerrarModal('modalUsuario');
        refrescarTodo();
    });
});

function refrescarTodo() {
    cargarProductos();
    cargarUsuarios();
    actualizarDashboard();
}

function cerrarModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
    }
}

// ==========================================
// RENDERIZADO DE TABLAS Y ACCIONES
// ==========================================

// Cargar Productos en la Tabla
function cargarProductos() {
    const tbody = document.getElementById('tabla-productos');
    if (!tbody) return;

    const productos = obtenerProductos();

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map((p, index) => {
        const stockCritico = p.stockCritico !== undefined ? p.stockCritico : 5;
        const esCritico = p.stock <= stockCritico;
        
        return `
            <tr class="${esCritico ? 'table-warning' : ''}">
                <td><code>${p.codigo || 'S/C'}</code></td>
                <td>${p.nombre}</td>
                <td>$${Number(p.precio || 0).toLocaleString('es-CL')}</td>
                <td>
                    <strong>${p.stock}</strong>
                    ${esCritico ? '<span class="badge bg-danger ms-1">Stock Crítico!</span>' : ''}
                </td>
                <td><span class="badge bg-secondary">${stockCritico}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarProducto(${index})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Cargar Usuarios en la Tabla
function cargarUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;

    const usuarios = obtenerUsuarios();

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map((u, index) => `
        <tr>
            <td>${u.run || 'N/A'}</td>
            <td>${u.nombre} ${u.apellidos || ''}</td>
            <td>${u.email || u.correo || 'N/A'}</td>
            <td>
                <span class="badge ${u.rol === 'Administrador' ? 'bg-danger' : 'bg-info text-dark'}">
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
    `).join('');
}

// Actualizar Tarjetas del Dashboard
function actualizarDashboard() {
    const productos = obtenerProductos();
    const usuarios = obtenerUsuarios();

    const criticos = productos.filter(p => {
        const limit = p.stockCritico !== undefined ? p.stockCritico : 5;
        return p.stock <= limit;
    }).length;

    const elProds = document.getElementById('dash-total-prods');
    const elCritico = document.getElementById('dash-stock-critico');
    const elUsers = document.getElementById('dash-total-users');

    if (elProds) elProds.textContent = productos.length;
    if (elCritico) elCritico.textContent = criticos;
    if (elUsers) elUsers.textContent = usuarios.length;
}

// ==========================================
// FUNCIONES DE EDICIÓN Y ELIMINACIÓN
// ==========================================

function editarProducto(index) {
    const productos = obtenerProductos();
    const p = productos[index];
    if (!p) return;

    indexEditandoProducto = index;

    document.getElementById('prod-codigo').value = p.codigo || '';
    document.getElementById('prod-nombre').value = p.nombre || '';
    document.getElementById('prod-precio').value = p.precio || 0;
    document.getElementById('prod-stock').value = p.stock || 0;
    document.getElementById('prod-stock-critico').value = p.stockCritico !== undefined ? p.stockCritico : 5;

    const modalTitle = document.querySelector('#modalProducto .modal-title');
    if (modalTitle) modalTitle.textContent = 'Editar Producto';

    const modalEl = document.getElementById('modalProducto');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function editarUsuario(index) {
    const usuarios = obtenerUsuarios();
    const u = usuarios[index];
    if (!u) return;

    indexEditandoUsuario = index;

    document.getElementById('user-run').value = u.run || '';
    document.getElementById('user-nombre').value = `${u.nombre || ''} ${u.apellidos || ''}`.trim();
    document.getElementById('user-correo').value = u.email || u.correo || '';
    document.getElementById('user-rol').value = u.rol || 'Cliente';

    const modalTitle = document.querySelector('#modalUsuario .modal-title');
    if (modalTitle) modalTitle.textContent = 'Editar Usuario';

    const modalEl = document.getElementById('modalUsuario');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function eliminarProducto(index) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    let productos = obtenerProductos();
    productos.splice(index, 1);
    guardarProductos(productos);
    refrescarTodo();
}

function eliminarUsuario(index) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    let usuarios = obtenerUsuarios();
    usuarios.splice(index, 1);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    refrescarTodo();
}