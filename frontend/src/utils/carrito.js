export function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
}

export function calcularCantidadTotal(carrito) {
  return carrito.reduce((cantidad, producto) => {
    return cantidad + producto.cantidad;
  }, 0);
}

export function agregarProductoAlCarrito(carrito, producto, talla = null) {
  const esMismoProducto = (item) =>
    item.codigo === producto.codigo && (item.talla ?? null) === talla;

  const productoExistente = carrito.some(esMismoProducto);

  if (productoExistente) {
    return carrito.map((item) =>
      esMismoProducto(item) ? { ...item, cantidad: item.cantidad + 1 } : item,
    );
  }

  const nuevoProducto = {
    ...producto,
    cantidad: 1,
  };

  if (talla !== null) {
    nuevoProducto.talla = talla;
  }

  return [...carrito, nuevoProducto];
}

// Eliminar un producto del carrito
export function eliminarProductoDelCarrito(carrito, indiceAEliminar) {
  return carrito.filter((_, indice) => indice !== indiceAEliminar);
}

// Cambiar la cantidad de un producto
export function cambiarCantidadProducto(carrito, codigo, cambio, talla = null) {
  return carrito.map((item) => {
    const esMismoProducto =
      item.codigo === codigo && (item.talla ?? null) === talla;

    if (esMismoProducto) {
      return {
        ...item,
        cantidad: Math.max(1, item.cantidad + cambio),
      };
    }

    return item;
  });
}
