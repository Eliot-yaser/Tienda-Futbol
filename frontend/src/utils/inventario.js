import { obtenerTallasPorCategoria } from "./tallas.js";

const CLAVE_INVENTARIO = "rey-balon-inventario";

// Stock inicial de productos seleccionados
const INVENTARIO_INICIAL = {
  // Camiseta Selección Chilena 2026
  "CAM-001": {
    _stockTotal: 25,
    S: 5,
    M: 8,
    L: 7,
    XL: 5,
  },

  // Camiseta Colo-Colo Oficial 2026
  "CAM-005": {
    _stockTotal: 30,
    S: 6,
    M: 10,
    L: 9,
    XL: 5,
  },

  // Short Selección Chilena 2026
  "SHO-001": {
    _stockTotal: 20,
    S: 4,
    M: 6,
    L: 6,
    XL: 4,
  },

  // Botines Mercurial Superfly
  "BOT-001": {
    _stockTotal: 10,
    "38": 1,
    "39": 1,
    "40": 2,
    "41": 2,
    "42": 2,
    "43": 2,
    "44": 0,
    "45": 0,
  },
};

// Completar el stock inicial sin sobrescribir el inventario guardado
function completarInventario(guardado) {
  const resultado = { ...guardado };

  for (const [codigo, inicial] of Object.entries(INVENTARIO_INICIAL)) {
    const anterior = resultado[codigo];

    // Si el producto todavía no tiene inventario, usar el inicial
    if (
      !anterior ||
      typeof anterior !== "object" ||
      Array.isArray(anterior)
    ) {
      resultado[codigo] = { ...inicial };
      continue;
    }

    // Conservar el stock total guardado anteriormente
    const total = Number.isSafeInteger(anterior._stockTotal)
      ? Math.max(0, anterior._stockTotal)
      : inicial._stockTotal;

    const tallas = Object.keys(inicial).filter(
      (talla) => talla !== "_stockTotal"
    );

    // Calcular las unidades que ya estaban asignadas
    const asignado = tallas.reduce((suma, talla) => {
      const cantidad = anterior[talla];

      return (
        suma +
        (Number.isSafeInteger(cantidad) && cantidad >= 0
          ? cantidad
          : 0)
      );
    }, 0);

    let disponible = Math.max(0, total - asignado);

    const actualizado = { ...anterior };

    // Completar solamente las tallas que no estén configuradas
    for (const talla of tallas) {
      if (
        Object.prototype.hasOwnProperty.call(
          actualizado,
          talla
        )
      ) {
        continue;
      }

      actualizado[talla] = Math.min(
        inicial[talla],
        disponible
      );

      disponible -= actualizado[talla];
    }

    resultado[codigo] = actualizado;
  }

  return resultado;
}

// Recuperar el inventario guardado
export function cargarInventario() {
  try {
    const datosGuardados = localStorage.getItem(
      CLAVE_INVENTARIO
    );

    if (!datosGuardados) {
      return completarInventario({});
    }

    const inventario = JSON.parse(datosGuardados);

    if (
      inventario &&
      typeof inventario === "object" &&
      !Array.isArray(inventario)
    ) {
      return completarInventario(inventario);
    }

    return completarInventario({});
  } catch {
    return completarInventario({});
  }
}

// Guardar los cambios del administrador
export function guardarInventario(inventario) {
  localStorage.setItem(
    CLAVE_INVENTARIO,
    JSON.stringify(inventario)
  );
}

// Validar una compra y calcular el inventario actualizado
export function prepararCompra(
  carrito,
  productosBase,
  inventarioActual
) {
  if (carrito.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  // Copia del inventario para no modificar el original
  const inventarioNuevo = { ...inventarioActual };

  for (const item of carrito) {
    // Buscar el producto original
    const producto = productosBase.find(
      (p) => p.codigo === item.codigo
    );

    if (!producto) {
      throw new Error(
        `El producto ${item.codigo} ya no existe.`
      );
    }

    const cantidad = item.cantidad;
    const talla = item.talla ?? null;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(
        `Cantidad inválida para ${producto.nombre}.`
      );
    }

    const tallasDisponibles = obtenerTallasPorCategoria(
      producto.categoria
    );

    // Comprobar que la talla sea válida
    if (
      tallasDisponibles.length > 0 &&
      !tallasDisponibles.includes(talla)
    ) {
      throw new Error(
        `Selecciona una talla válida para ${producto.nombre}.`
      );
    }

    // Inventario actual de este producto
    const datosActuales = inventarioNuevo[item.codigo] ?? {};

    // Stock total vigente; inicialmente usamos el del catálogo
    const stockTotal =
      datosActuales._stockTotal ?? producto.stock;

    if (cantidad > stockTotal) {
      throw new Error(
        `No hay suficientes unidades de ${producto.nombre}. ` +
        `Disponibles: ${stockTotal}.`
      );
    }

    // Comprobar el stock específico de la talla
    if (tallasDisponibles.length > 0) {
      const stockTalla = datosActuales[talla];

      if (stockTalla === undefined) {
        throw new Error(
          `El administrador debe configurar el stock ` +
          `de ${producto.nombre}, talla ${talla}.`
        );
      }

      if (
        !Number.isInteger(stockTalla) ||
        stockTalla < 0
      ) {
        throw new Error(
          `El inventario de ${producto.nombre} es inválido.`
        );
      }

      if (cantidad > stockTalla) {
        throw new Error(
          `Solo quedan ${stockTalla} unidades de ` +
          `${producto.nombre}, talla ${talla}.`
        );
      }
    }

    // Preparar el nuevo stock total
    const productoActualizado = {
      ...datosActuales,
      _stockTotal: stockTotal - cantidad,
    };

    // Descontar también las unidades de la talla comprada
    if (tallasDisponibles.length > 0) {
      productoActualizado[talla] =
        datosActuales[talla] - cantidad;
    }

    inventarioNuevo[item.codigo] = productoActualizado;
  }

  return inventarioNuevo;
}
