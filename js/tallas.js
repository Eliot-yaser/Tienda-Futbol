// Devuelve las tallas que corresponden a un producto según su categoría/nombre/código
function obtenerKeysTallasPorProducto(p) {
    const texto = ((p.nombre || '') + ' ' + (p.categoria || '') + ' ' + (p.codigo || '')).toLowerCase();

    // 1. Balones
    if (texto.includes('balon') || texto.includes('balón') || texto.includes('pelota') || texto.startsWith('bal')) {
        return ['3', '4', '5'];
    }
    // 2. Calzado
    if (texto.includes('zapato') || texto.includes('calzado') || texto.includes('botin') || texto.includes('chutera') || texto.startsWith('zap')) {
        return ['38', '39', '40', '41', '42', '43'];
    }
    // 3. Guantes de arquero
    if (texto.includes('guante') || texto.includes('arquero') || texto.includes('glove') || texto.startsWith('gua')) {
        return ['7', '8', '9', '10', '11'];
    }
    // 4. Canilleras
    if (texto.includes('canillera') || texto.includes('espinillera') || texto.startsWith('can')) {
        return ['S', 'M', 'L'];
    }
    // 5. Camisetas, shorts, medias y ropa en general
    return ['S', 'M', 'L', 'XL'];
}

// Devuelve el objeto { talla: cantidad }. Si el producto no lo tiene (o tiene
// tallas de otra categoría) reparte el stock total entre las tallas correctas.
function normalizarObjetoTallas(p) {
    const keysEsperadas = obtenerKeysTallasPorProducto(p);

    if (p.tallas && typeof p.tallas === "object" && !Array.isArray(p.tallas)) {
        const keysActuales = Object.keys(p.tallas);
        const coincideCategoria = keysActuales.some(k => keysEsperadas.includes(k));
        if (coincideCategoria && keysActuales.length > 0) {
            return p.tallas;
        }
    }

    const stockBase = Number(p.stock) || 0;
    const cantPorTalla = Math.floor(stockBase / keysEsperadas.length);
    const residuo = stockBase % keysEsperadas.length;

    const objRes = {};
    keysEsperadas.forEach((key, idx) => {
        objRes[key] = cantPorTalla + (idx === 0 ? residuo : 0);
    });
    return objRes;
}

// Stock disponible de una talla concreta (0 si la talla no existe)
function stockDisponibleTalla(producto, talla) {
    const tallas = normalizarObjetoTallas(producto);
    const clave = Object.keys(tallas).find(
        k => String(k).trim().toLowerCase() === String(talla).trim().toLowerCase()
    );
    return clave !== undefined ? (Number(tallas[clave]) || 0) : 0;
}

// Guarda en localStorage el desglose por talla de TODOS los productos que aún no lo tengan,
// y mantiene `stock` = suma de las tallas. Así la compra siempre descuenta la talla correcta.
function sincronizarTallasProductos() {
    let productos;
    try {
        productos = JSON.parse(localStorage.getItem("productos"));
    } catch (e) {
        return;
    }
    if (!Array.isArray(productos)) return;

    let hayCambios = false;
    productos.forEach(p => {
        const norm = normalizarObjetoTallas(p);
        if (norm !== p.tallas) {
            p.tallas = norm;
            hayCambios = true;
        }
        const total = Object.values(p.tallas).reduce((acc, v) => acc + (Number(v) || 0), 0);
        if (total !== Number(p.stock)) {
            p.stock = total;
            hayCambios = true;
        }
    });

    if (hayCambios) {
        localStorage.setItem("productos", JSON.stringify(productos));
        if (localStorage.getItem("admin_productos")) {
            localStorage.setItem("admin_productos", JSON.stringify(productos));
        }
    }
}