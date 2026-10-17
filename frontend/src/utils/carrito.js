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

export function agregarProductoAlCarrito(carrito, producto) {
  const existente = carrito.find((item) => item.codigo === producto.codigo);

  if (existente) {
    return carrito.map((item) =>
      item.codigo === producto.codigo
        ? { ...item, cantidad: item.cantidad + 1 }
        : item,
    );
  }

  return [...carrito, { ...producto, cantidad: 1 }];
}

// Eliminar un producto del carrito
export function eliminarProductoDelCarrito(carrito, indiceAEliminar) {
  return carrito.filter((_, indice) => indice !== indiceAEliminar);
}

// Cambiar la cantidad de un producto
export function cambiarCantidadProducto(carrito, codigo, cambio) {
  return carrito.map((producto) =>
    producto.codigo === codigo
      ? {
          ...producto,
          cantidad: Math.max(1, producto.cantidad + cambio),
        }
      : producto,
  );
}
