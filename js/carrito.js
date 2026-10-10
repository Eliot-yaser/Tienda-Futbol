// Variable para la talla seleccionada del producto
let tallaSeleccionadaActual = "";
// Producto que se está mostrando en el detalle (para actualizar el stock al cambiar de talla)
let productoDetalleActual = null;

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();

    if (document.getElementById("grid-productos")) {
        renderizarProductos();
    }

    if (document.getElementById("lista-carrito")) {
        renderizarCarrito();
    }
    if (document.getElementById("detalle-producto")) {
        renderizarDetalleProducto();
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

    // Detectar si estamos en la página principal
    const rutaActual = window.location.pathname;
    const esHome =
        rutaActual.endsWith("index.html") ||
        rutaActual.endsWith("/");

    let productosAMostrar = productos;

    // En el Home solo mostramos 4 productos destacados
    if (esHome) {
        const codigosDestacados = [
            "CAM-001",
            "BOT-001",
            "BAL-001",
            "GUA-001"
        ];

        productosAMostrar = productos.filter(prod =>
            codigosDestacados.includes(prod.codigo)
        );
    }

    productosAMostrar.forEach(prod => {
        const precio = Number(prod.precio) || 0;

        const tarjeta = document.createElement("div");

        const categoriaClase = "cat-" + (prod.categoria || "general")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");

        tarjeta.classList.add("product-card", categoriaClase);

        // Al hacer clic en cualquier parte de la tarjeta abre el detalle
        tarjeta.onclick = () => {
            window.location.href =
                `detalle-producto.html?codigo=${prod.codigo}`;
        };

        tarjeta.innerHTML = `
            <img
                src="${prod.imagen || ''}"
                alt="${prod.nombre || 'Producto'}"
                class="product-img">

            <h3>${prod.nombre || 'Producto'}</h3>

            <p class="category">
                ${prod.categoria || 'General'}
            </p>

            <p class="price">
                $${precio.toLocaleString("es-CL")}
            </p>

            <button
                onclick="event.stopPropagation(); window.location.href='detalle-producto.html?codigo=${prod.codigo}'"
                class="btn-add">

                Añadir al Carrito
            </button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

function renderizarDetalleProducto() {
    const contenedor = document.getElementById("detalle-producto");
    if (!contenedor) return;

    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("codigo");

    const productos = obtenerListaProductos();
    const prod = productos.find(p => p.codigo === codigo);

    if (!prod) {
        contenedor.innerHTML = `
            <div class="detalle-error">
                <h2>Producto no encontrado</h2>
                <a href="productos.html" class="detalle-volver">← Volver a Productos</a>
            </div>
        `;
        return;
    }

    // Tallas y stock reales del producto (mismas tallas que usa el administrador)
    const objTallas = normalizarObjetoTallas(prod);
    const tallas = Object.keys(objTallas);
    const stockTotal = Object.values(objTallas).reduce((a, v) => a + (Number(v) || 0), 0);

    productoDetalleActual = prod;
    const primeraConStock = tallas.find(t => Number(objTallas[t]) > 0);
    tallaSeleccionadaActual = primeraConStock !== undefined ? primeraConStock : "";

    let relacionados = productos.filter(
        p =>
            p.codigo !== prod.codigo &&
            (p.categoria || "").toLowerCase() ===
            (prod.categoria || "").toLowerCase()
    );

    if (relacionados.length < 4) {
        const adicionales = productos.filter(
            p =>
                p.codigo !== prod.codigo &&
                !relacionados.some(r => r.codigo === p.codigo)
        );

        relacionados = relacionados.concat(adicionales);
    }

    relacionados = relacionados.slice(0, 4);

    contenedor.innerHTML = `
        <section class="detalle-principal">

            <div class="modal-container">

                <div class="modal-image-col">
                    <img src="${prod.imagen || ""}" alt="${prod.nombre || "Producto"}">
                </div>

                <div class="modal-info-col">

                    <div>
                        <span class="modal-category">
                            ${prod.categoria || "General"}
                        </span>

                        <h1 class="modal-title">
                            ${prod.nombre || "Producto"}
                        </h1>

                        <div class="modal-price">
                            $${Number(prod.precio || 0).toLocaleString("es-CL")}
                        </div>

                        <p class="modal-description">
                            ${prod.descripcion || "Sin descripción disponible."}
                        </p>

                        <div class="modal-sizes-title">
                            Seleccionar Talla:
                        </div>

                        <div class="modal-sizes-grid">
                            ${tallas.map(talla => {
                                const cant = Number(objTallas[talla]) || 0;
                                const agotada = cant <= 0;
                                const activa = talla === tallaSeleccionadaActual;
                                return `
                                <button
                                    class="btn-size ${activa ? "active" : ""}"
                                    ${agotada ? "disabled title='Sin stock'" : ""}
                                    style="${agotada ? "opacity:.4;text-decoration:line-through;cursor:not-allowed;" : ""}"
                                    onclick="seleccionarTalla(this, '${talla}')">
                                    ${talla}
                                </button>`;
                            }).join("")}
                        </div>

                        <p id="info-stock-talla" class="stock-info" style="margin-top:10px;font-weight:600;">
                            ${stockTotal <= 0
                                ? "❌ Producto agotado"
                                : textoStockTalla(prod, tallaSeleccionadaActual)}
                        </p>
                    </div>

                    <button
                        class="btn-modal-add"
                        ${stockTotal <= 0 ? "disabled style='opacity:.5;cursor:not-allowed;'" : ""}
                        onclick="agregarAlCarritoConTalla('${prod.codigo}')">

                        ${stockTotal <= 0 ? "Sin stock" : "🛒 Agregar al Carrito"}

                    </button>

                    <a href="productos.html" class="detalle-volver">
                        ← Volver a Productos
                    </a>

                </div>

            </div>

        </section>

        <section class="productos-relacionados">

            <h2>Productos relacionados</h2>

            <div class="related-grid">

                ${relacionados.map(rel => `
                    <article
                        class="related-card"
                        onclick="window.location.href='detalle-producto.html?codigo=${rel.codigo}'">

                        <img
                            src="${rel.imagen || ""}"
                            alt="${rel.nombre || "Producto"}">

                        <div class="related-card-info">

                            <span class="related-category">
                                ${rel.categoria || "General"}
                            </span>

                            <h3>
                                ${rel.nombre || "Producto"}
                            </h3>

                            <p class="related-price">
                                $${Number(rel.precio || 0).toLocaleString("es-CL")}
                            </p>

                            <button
                                class="btn-related"
                                onclick="event.stopPropagation(); window.location.href='detalle-producto.html?codigo=${rel.codigo}'">

                                Ver detalle

                            </button>

                        </div>

                    </article>
                `).join("")}

            </div>

        </section>
    `;
}


// Texto que muestra cuánto stock queda en la talla elegida
function textoStockTalla(prod, talla) {
    if (!talla) return "Selecciona una talla";
    const disp = stockDisponibleTalla(prod, talla);
    const limite = prod.stockCritico !== undefined ? Number(prod.stockCritico) : 3;
    if (disp <= 0) return "❌ Talla agotada";
    if (disp <= limite) return `⚠️ ¡Últimas ${disp} unidades en talla ${talla}!`;
    return `✅ ${disp} unidades disponibles en talla ${talla}`;
}

function seleccionarTalla(boton, talla) {
    if (boton.disabled) return;
    document.querySelectorAll('.btn-size').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    tallaSeleccionadaActual = talla;

    const info = document.getElementById("info-stock-talla");
    if (info && productoDetalleActual) {
        info.textContent = textoStockTalla(productoDetalleActual, talla);
    }
}

// Cantidad de un producto+talla que ya está en el carrito
function cantidadEnCarrito(carrito, codigo, talla) {
    return carrito
        .filter(item => item.codigo === codigo && String(item.talla) === String(talla))
        .reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
}

// Agregar producto con talla al carrito (respetando el stock de esa talla)
function agregarAlCarritoConTalla(codigo) {
    const productos = obtenerListaProductos();
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoEncontrado = productos.find(p => p.codigo === codigo);
    if (!productoEncontrado) return;

    if (!tallaSeleccionadaActual) {
        mostrarAvisoStock("Sin stock", "Selecciona una talla con stock disponible.");
        return;
    }

    const disponible = stockDisponibleTalla(productoEncontrado, tallaSeleccionadaActual);
    const yaEnCarrito = cantidadEnCarrito(carrito, codigo, tallaSeleccionadaActual);

    if (yaEnCarrito + 1 > disponible) {
        mostrarAvisoStock(
            "Stock insuficiente",
            `Solo hay ${disponible} unidad(es) en talla ${tallaSeleccionadaActual} y ya las tienes en tu carrito.`
        );
        return;
    }

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
    mostrarNotificacionToast(nombreConTalla);
}

// Renderizar la tabla del carrito
function renderizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const elementoTotal = document.getElementById("total-carrito");

    if (!contenedor) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    contenedor.innerHTML = "";

    // Carrito vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="6" class="cart-empty">
                    El carrito está vacío
                </td>
            </tr>
        `;

        if (elementoTotal) {
            elementoTotal.textContent = "$0";
        }

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
            <td>
                <img
                    src="${prod.imagen || ''}"
                    alt="${prod.nombre || 'Producto'}"
                    class="cart-product-img"
                >
            </td>

            <td>
                ${prod.nombre || 'Sin nombre'}
            </td>

            <td>
                $${precio.toLocaleString("es-CL")}
            </td>

            <td>
                <div class="cart-quantity">
                    <button
                        onclick="cambiarCantidad(${index}, -1)"
                        aria-label="Disminuir cantidad">
                        -
                    </button>

                    <span class="cart-quantity-value">
                        ${cantidad}
                    </span>

                    <button
                        onclick="cambiarCantidad(${index}, 1)"
                        aria-label="Aumentar cantidad">
                        +
                    </button>
                </div>
            </td>

            <td>
                $${subtotal.toLocaleString("es-CL")}
            </td>

            <td>
                <button
                    onclick="eliminarDelCarrito(${index})"
                    class="cart-delete-btn">
                    Eliminar
                </button>
            </td>
        `;

        contenedor.appendChild(fila);
    });

    if (elementoTotal) {
        elementoTotal.textContent =
            `$${total.toLocaleString("es-CL")}`;
    }
}

// Cambiar cantidad por índice
function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito[index]) {
        const nueva = (carrito[index].cantidad || 1) + cambio;

        // No permitir superar el stock de la talla
        if (cambio > 0) {
            const prod = obtenerListaProductos().find(p => p.codigo === carrito[index].codigo);
            if (prod) {
                const disponible = stockDisponibleTalla(prod, carrito[index].talla);
                if (nueva > disponible) {
                    mostrarAvisoStock(
                        "Stock insuficiente",
                        `Solo hay ${disponible} unidad(es) disponibles en talla ${carrito[index].talla}.`
                    );
                    return;
                }
            }
        }

        carrito[index].cantidad = nueva;
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
// --- MANEJO DEL MODAL DE PAGO Y DESCUENTO DE STOCK Y REGISTRO DE VENTAS ---

function abrirModalPago() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    
    // Restablecer vista de pasos al abrir
    document.getElementById('paso-formulario').style.display = 'block';
    document.getElementById('paso-cargando').style.display = 'none';
    document.getElementById('paso-exito').style.display = 'none';
    document.getElementById('modal-pago').style.display = 'flex';
}

function cerrarModalPago() {
    document.getElementById('modal-pago').style.display = 'none';
}

function cambiarMetodoPago() {
    const metodo = document.querySelector('input[name="metodo-pago"]:checked').value;
    
    // Mostrar u ocultar secciones según opción
    document.getElementById('sec-tarjeta').style.display = (metodo === 'tarjeta') ? 'block' : 'none';
    document.getElementById('sec-webpay').style.display = (metodo === 'webpay') ? 'block' : 'none';
    document.getElementById('sec-transferencia').style.display = (metodo === 'transferencia') ? 'block' : 'none';
    
    // Cambiar texto dinámico del botón de pago
    const btnSubmit = document.getElementById('btn-submit-pago');
    if (metodo === 'webpay') {
        btnSubmit.textContent = "Ir a Webpay Plus 🚀";
    } else if (metodo === 'transferencia') {
        btnSubmit.textContent = "Confirmar Pedido 🧾";
    } else {
        btnSubmit.textContent = "Confirmar y Pagar 💳";
    }

    // Activar o desactivar campos obligatorios de la tarjeta
    const cardInputs = document.querySelectorAll('#sec-tarjeta input');
    cardInputs.forEach(input => {
        if (metodo === 'tarjeta') {
            input.setAttribute('required', 'true');
        } else {
            input.removeAttribute('required');
        }
    });
}

function procesarPago(event) {
    if (event && event.preventDefault) event.preventDefault();

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    if (carrito.length === 0) return;

    const metodoInput = document.querySelector('input[name="metodo-pago"]:checked');
    const metodo = metodoInput ? metodoInput.value : 'webpay';

    // Validar que haya stock suficiente en la talla de cada producto ANTES de cobrar
    const problemas = [];
    carrito.forEach(item => {
        const prod = productos.find(p => String(p.codigo).trim() === String(item.codigo).trim());
        const cant = Number(item.cantidad) || 1;
        if (!prod) {
            problemas.push(`"${item.nombre}" ya no existe en el catálogo.`);
            return;
        }
        const disp = stockDisponibleTalla(prod, item.talla);
        if (cant > disp) {
            problemas.push(`"${prod.nombre}" talla ${item.talla}: pediste ${cant} y solo hay ${disp}.`);
        }
    });
    if (problemas.length > 0) {
        alert("No se puede completar la compra por falta de stock:\n\n- " + problemas.join("\n- ") +
              "\n\nAjusta o elimina esos productos del carrito.");
        return;
    }

    // Paso 1: Ocultar formulario y activar animación de carga
    const pasoForm = document.getElementById('paso-formulario');
    const pasoCargando = document.getElementById('paso-cargando');
    if (pasoForm) pasoForm.style.display = 'none';
    if (pasoCargando) pasoCargando.style.display = 'block';

    const loadingTitle = document.getElementById('loading-title');
    if (loadingTitle) {
        if (metodo === 'webpay') loadingTitle.textContent = "Conectando con Webpay Plus (Transbank)...";
        else if (metodo === 'transferencia') loadingTitle.textContent = "Generando datos de transferencia...";
        else loadingTitle.textContent = "Procesando pago con tarjeta...";
    }

    // Paso 2: Procesamiento
    setTimeout(() => {
        // Descontar el stock de la TALLA comprada
        carrito.forEach(itemCarrito => {
            const cantComprada = Number(itemCarrito.cantidad) || 1;
            const prod = productos.find(p => String(p.codigo).trim() === String(itemCarrito.codigo).trim());
            if (!prod) return;

            // Garantiza que el producto tenga su desglose por talla
            prod.tallas = normalizarObjetoTallas(prod);

            const tallaBuscada = String(itemCarrito.talla || "").trim().toLowerCase();
            const keyTalla = Object.keys(prod.tallas).find(k => String(k).trim().toLowerCase() === tallaBuscada);

            if (keyTalla !== undefined) {
                prod.tallas[keyTalla] = Math.max(0, (Number(prod.tallas[keyTalla]) || 0) - cantComprada);
            }

            // Stock total = suma de todas las tallas
            prod.stock = Object.values(prod.tallas).reduce((acc, v) => acc + (Number(v) || 0), 0);
        });

        // Guardar catálogo con stock actualizado
        localStorage.setItem('productos', JSON.stringify(productos));
        if (localStorage.getItem('admin_productos')) {
            localStorage.setItem('admin_productos', JSON.stringify(productos));
        }

        // Registrar la venta en ventas
        let total = carrito.reduce((acc, p) => acc + (Number(p.precio) * Number(p.cantidad)), 0);
        let numOrden = "RDB-" + Math.floor(100000 + Math.random() * 900000);
        let metodoNombre = metodo === 'webpay' ? 'Webpay Plus' : (metodo === 'transferencia' ? 'Transferencia Bancaria' : 'Tarjeta Débito/Crédito');

        let nuevaVenta = {
            id: numOrden,
            fecha: new Date().toLocaleString('es-CL'),
            metodo: metodoNombre,
            total: total,
            productos: carrito.map(item => ({
                id: item.id || item.codigo || "",
                nombre: (item.nombre || "").replace(/\s*\([^\)]*\)/g, '').trim(),
                talla: item.talla || item.tallaSeleccionada || "",
                precio: item.precio,
                cantidad: item.cantidad,
                subtotal: Number(item.precio) * Number(item.cantidad)
            }))
        };

        let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        ventas.unshift(nuevaVenta);
        localStorage.setItem('ventas', JSON.stringify(ventas));

        // Vaciar el carrito
        localStorage.removeItem('carrito');

        // Llenar información del recibo
        const rOrden = document.getElementById('recibo-orden');
        const rMetodo = document.getElementById('recibo-metodo');
        const rTotal = document.getElementById('recibo-total');
        if (rOrden) rOrden.textContent = numOrden;
        if (rMetodo) rMetodo.textContent = metodoNombre;
        if (rTotal) rTotal.textContent = "$" + total.toLocaleString('es-CL');

        const pasoExito = document.getElementById('paso-exito');
        if (pasoCargando) pasoCargando.style.display = 'none';
        if (pasoExito) pasoExito.style.display = 'block';

        if (typeof mostrarCarrito === 'function') mostrarCarrito();
        if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();

    }, 1500);
}

// Aviso de stock (nombre propio para que login.js no lo sobrescriba)
function mostrarAvisoStock(titulo, mensaje) {
    const previa = document.querySelector('.toast-notification');
    if (previa) previa.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">⚠️</span>
            <div>
                <strong>${titulo}</strong>
                <p>${mensaje}</p>
            </div>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}