// Funciones puras para categorías y ofertas de la tienda.
export function obtenerCategorias(productos) {
  const resultado = new Map();
  for (const producto of productos) {
    const categoria = String(producto.categoria || "").trim();
    if (!categoria) continue;
    const anterior = resultado.get(categoria);
    if (anterior) {
      anterior.cantidad += 1;
    } else {
      resultado.set(categoria, {
        nombre: categoria,
        cantidad: 1,
        imagen: producto.imagen || "",
      });
    }
  }
  return [...resultado.values()];
}

export function productosDeCategoria(productos, categoria) {
  return productos.filter((producto) => producto.categoria === categoria);
}

// No inventar ofertas: solo mostrar descuentos activados por administración.
export function esOfertaValida(producto) {
  const precio = Number(producto.precio);
  const precioAnterior = Number(producto.precioAnterior);
  return producto.enOferta === true &&
    Number.isFinite(precio) && precio > 0 &&
    Number.isFinite(precioAnterior) && precioAnterior > precio;
}

export function obtenerOfertas(productos) {
  return productos.filter(esOfertaValida);
}

export function porcentajeDescuento(producto) {
  if (!esOfertaValida(producto)) return 0;
  return Math.round((1 - Number(producto.precio) / Number(producto.precioAnterior)) * 100);
}
