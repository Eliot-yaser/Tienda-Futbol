// Variable para la talla activa en el modal
let tallaSeleccionadaActual = "";

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();

    if (document.getElementById("grid-productos")) {
        renderizarProductos();
    }

    if (document.getElementById("lista-carrito")) {
        renderizarCarrito();
    }
});

// Función segura para obtener la lista de productos sin romper la consola
function obtenerListaProductos() {
    try {
        const productosGuardados = JSON.parse(localStorage.getItem("productos"));
        if (productosGuardados && productosGuardados.length > 0) {
            return productosGuardados;
        }
    } catch (e) {
        console.error("Error al leer localStorage:", e);
    }

    // Si existe la variable global productosBase (de productos.js) la utiliza
    if (typeof productosBase !== 'undefined' && Array.isArray(productosBase) && productosBase.length > 0) {
        return productosBase;
    }

    // Catálogo de respaldo por si no existe en ningún otro lado
    return [
        {
            codigo: "P001",
            nombre: "Camiseta Selección Chilena 2026",
            categoria: "CAMISETAS",
            precio: 59990,
            imagen: "https://via.placeholder.com/250?text=Camiseta+Chile",
            descripcion: "Edición oficial de La Roja para las Eliminatorias y Torneos Internacionales 2026. Fabricada con tecnología de absorción de humedad AEROREADY.",
            tallas: ["S", "M", "L", "XL", "XXL"]
        },
        {
            codigo: "P002",
            nombre: "Botines Mercurial Superfly",
            categoria: "CALZADO",
            precio: 129990,
            imagen: "https://via.placeholder.com/250?text=Botines+Mercurial",
            descripcion: "Diseñados para máxima velocidad en canchas de césped natural. Cuentan con cuello Dynamic Fit para un ajuste anatómico perfecto.",
            tallas: ["39", "40", "41", "42", "43", "44"]
        },
        {
            codigo: "P003",
            nombre: "Balón Oficial Champions League",
            categoria: "ACCESORIOS",
            precio: 34990,
            imagen: "https://via.placeholder.com/250?text=Balon+Champions",
            descripcion: "Balón de fútbol oficial con sellado térmico sin costuras para una trayectoria más precisa. Certificación FIFA Quality Pro.",
            tallas: ["N° 5 (Oficial)"]
        },
        {
            codigo: "P004",
            nombre: "Guantes de Arquero Pro Grip",
            categoria: "ACCESORIOS",
            precio: 29990,
            imagen: "https://via.placeholder.com/250?text=Guantes+Arquero",
            descripcion: "Palma de látex alemán de 4mm para un agarre insuperable en seco o mojado. Incluye varillas de protección en los dedos.",
            tallas: ["8", "9", "10", "11"]
        }
    ];
}

// Renderizar la grilla de productos
function renderizarProductos() {
    const contenedor = document.getElementById("grid-productos");
    if (!contenedor) return;

    const productos = obtenerListaProductos();
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos disponibles actualmente.</p>";
        return;
    }

    productos.forEach(prod => {
        const precio = Number(prod.precio) || 0;
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("product-card");
        
        // Al hacer clic en cualquier parte de la tarjeta abre el detalle
        tarjeta.onclick = () => abrirModalProducto(prod.codigo);

        tarjeta.innerHTML = `
            <img src="${prod.imagen || ''}" alt="${prod.nombre || 'Producto'}" class="product-img">
            <h3>${prod.nombre || 'Producto'}</h3>
            <p class="category">${prod.categoria || 'General'}</p>
            <p class="price">$${precio.toLocaleString("es-CL")}</p>
            <button onclick="event.stopPropagation(); abrirModalProducto('${prod.codigo}')" class="btn-add">Ver Detalle / Tallas</button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Ventana Emergente con Descripción y Tallas
function abrirModalProducto(codigo) {
    const productos = obtenerListaProductos();
    const prod = productos.find(p => p.codigo === codigo);
    if (!prod) return;

    // Detectar tallas disponibles
    let tallas = prod.tallas;
    if (!tallas || tallas.length === 0) {
        const cat = (prod.categoria || "").toUpperCase();
        if (cat.includes("CALZADO") || cat.includes("ZAPAT")) {
            tallas = ["39", "40", "41", "42", "43"];
        } else if (cat.includes("ACCESORIO") || cat.includes("BALON")) {
            tallas = ["Talla Única"];
        } else {
            tallas = ["S", "M", "L", "XL"];
        }
    }

    tallaSeleccionadaActual = tallas[0];

    // Limpiar modal previo si existiera
    cerrarModal();

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.id = "modal-producto";
    modal.onclick = (e) => { if (e.target === modal) cerrarModal(); };

    modal.innerHTML = `
        <div class="modal-container">
            <button class="modal-close-btn" onclick="cerrarModal()">✕</button>
            <div class="modal-image-col">
                <img src="${prod.imagen || ''}" alt="${prod.nombre}">
            </div>
            <div class="modal-info-col">
                <div>
                    <span class="modal-category">${prod.categoria || 'General'}</span>
                    <h2 class="modal-title">${prod.nombre}</h2>
                    <div class="modal-price">$${Number(prod.precio).toLocaleString("es-CL")}</div>
                    <p class="modal-description">${prod.descripcion || 'Producto oficial de alto rendimiento deportivo.'}</p>
                    
                    <div class="modal-sizes-title">Seleccionar Talla:</div>
                    <div class="modal-sizes-grid">
                        ${tallas.map((talla, index) => `
                            <button class="btn-size ${index === 0 ? 'active' : ''}" onclick="seleccionarTalla(this, '${talla}')">${talla}</button>
                        `).join('')}
                    </div>
                </div>

                <button class="btn-modal-add" onclick="agregarAlCarritoConTalla('${prod.codigo}')">
                    🛒 Agregar al Carrito
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Cambiar la talla activa en el modal
function seleccionarTalla(boton, talla) {
    document.querySelectorAll('.btn-size').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    tallaSeleccionadaActual = talla;
}

// Cerrar ventana modal
function cerrarModal() {
    const modal = document.getElementById("modal-producto");
    if (modal) modal.remove();
}

// Agregar producto con talla al carrito
function agregarAlCarritoConTalla(codigo) {
    const productos = obtenerListaProductos();
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoEncontrado = productos.find(p => p.codigo === codigo);
    if (!productoEncontrado) return;

    const nombreConTalla = `${productoEncontrado.nombre} (${tallaSeleccionadaActual})`;

    const itemEnCarrito = carrito.find(item => item.codigo === codigo && item.talla === tallaSeleccionadaActual);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad = (itemEnCarrito.cantidad || 1) + 1;
    } else {
        carrito.push({
            codigo: productoEncontrado.codigo,
            nombre: nombreConTalla,
            precio: productoEncontrado.precio,
            imagen: productoEncontrado.imagen,
            talla: tallaSeleccionadaActual,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    cerrarModal();

    // Muestra la notificación verde superior derecha
    mostrarNotificacionToast(nombreConTalla);
}

// Renderizar la tabla del carrito
function renderizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const elementoTotal = document.getElementById("total-carrito");

    if (!contenedor) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="6" style="text-align:center;">El carrito está vacío</td></tr>';
        if (elementoTotal) elementoTotal.textContent = "$0";
        return;
    }

    let total = 0;

    carrito.forEach((prod, index) => {
        const precio = Number(prod.precio) || 0;
        const cantidad = Number(prod.cantidad) || 1;
        const subtotal = precio * cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${prod.imagen || ''}" width="50" alt="${prod.nombre || 'Producto'}"></td>
            <td>${prod.nombre || 'Sin nombre'}</td>
            <td>$${precio.toLocaleString("es-CL")}</td>
            <td>
                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                <span style="margin: 0 5px;">${cantidad}</span>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
            </td>
            <td>$${subtotal.toLocaleString("es-CL")}</td>
            <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
        `;
        contenedor.appendChild(fila);
    });

    if (elementoTotal) {
        elementoTotal.textContent = `$${total.toLocaleString("es-CL")}`;
    }
}

// Cambiar cantidad por índice
function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito[index]) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Eliminar un producto del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Vaciar el carrito completo
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Actualizar contador superior del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 1), 0);
    const contador = document.getElementById("cart-count");
    if (contador) {
        contador.textContent = totalItems;
    }
}

// Notificación Flotante Verde (Esquina Superior Derecha)
function mostrarNotificacionToast(nombreProducto) {
    const previa = document.querySelector('.toast-notification');
    if (previa) previa.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✅</span>
            <div>
                <strong>¡Agregado exitosamente!</strong>
                <p>${nombreProducto}</p>
            </div>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}