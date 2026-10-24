import { obtenerTallasPorCategoria } from "./tallas.js";

const CLAVE_INVENTARIO = "rey-balon-inventario";

// Stock inicial de 30 productos seleccionados
const INVENTARIO_INICIAL = {

  // ==============================
  // CAMISETAS (5 productos)
  // ==============================

  // Camiseta Selección Chilena 2026
  "CAM-001": {
    _stockTotal: 25,
    S: 5, M: 8, L: 7, XL: 5,
  },

  // Camiseta Selección de Alemania 2026
  "CAM-002": {
    _stockTotal: 20,
    S: 4, M: 6, L: 6, XL: 4,
  },

  // Camiseta Selección de Francia 2026
  "CAM-003": {
    _stockTotal: 18,
    S: 3, M: 5, L: 6, XL: 4,
  },

  // Camiseta Selección de Portugal 2026
  "CAM-004": {
    _stockTotal: 15,
    S: 3, M: 4, L: 5, XL: 3,
  },

  // Camiseta Colo-Colo Oficial 2026
  "CAM-005": {
    _stockTotal: 30,
    S: 6, M: 10, L: 9, XL: 5,
  },

  // ==============================
  // SHORTS (5 productos)
  // ==============================

  // Short Selección Chilena 2026
  "SHO-001": {
    _stockTotal: 20,
    S: 4, M: 6, L: 6, XL: 4,
  },

  // Short Selección de Alemania 2026
  "SHO-002": {
    _stockTotal: 18,
    S: 3, M: 5, L: 6, XL: 4,
  },

  // Short Selección de Francia 2026
  "SHO-003": {
    _stockTotal: 18,
    S: 3, M: 5, L: 6, XL: 4,
  },

  // Short Selección de Portugal 2026
  "SHO-004": {
    _stockTotal: 16,
    S: 3, M: 5, L: 5, XL: 3,
  },

  // Short Colo-Colo Oficial 2026
  "SHO-005": {
    _stockTotal: 22,
    S: 4, M: 7, L: 7, XL: 4,
  },

  // ==============================
  // BOTINES (5 productos)
  // ==============================

  // Botines Mercurial Superfly
  "BOT-001": {
    _stockTotal: 10,
    "38": 1, "39": 1, "40": 2, "41": 2,
    "42": 2, "43": 2, "44": 0, "45": 0,
  },

  // Botines Phantom GX
  "BOT-002": {
    _stockTotal: 12,
    "38": 1, "39": 1, "40": 2, "41": 2,
    "42": 2, "43": 2, "44": 1, "45": 1,
  },

  // Botines Predator Elite
  "BOT-003": {
    _stockTotal: 9,
    "38": 0, "39": 1, "40": 1, "41": 2,
    "42": 2, "43": 2, "44": 1, "45": 0,
  },

  // Botines Copa Pure
  "BOT-004": {
    _stockTotal: 14,
    "38": 1, "39": 2, "40": 2, "41": 3,
    "42": 2, "43": 2, "44": 1, "45": 1,
  },

  // Botines Future Ultimate
  "BOT-005": {
    _stockTotal: 11,
    "38": 0, "39": 1, "40": 2, "41": 2,
    "42": 2, "43": 2, "44": 1, "45": 1,
  },

  // ==============================
  // MEDIAS (5 productos)
  // ==============================

  // Medias Selección Chilena
  "MED-001": {
    _stockTotal: 35,
    S: 6, M: 10, L: 11, XL: 8,
  },

  // Medias Selección de Alemania
  "MED-002": {
    _stockTotal: 30,
    S: 5, M: 8, L: 10, XL: 7,
  },

  // Medias Selección de Francia
  "MED-003": {
    _stockTotal: 30,
    S: 6, M: 8, L: 9, XL: 7,
  },

  // Medias Selección de Portugal
  "MED-004": {
    _stockTotal: 28,
    S: 5, M: 8, L: 9, XL: 6,
  },

  // Medias Colo-Colo
  "MED-005": {
    _stockTotal: 35,
    S: 6, M: 10, L: 11, XL: 8,
  },

  // ==============================
  // CANILLERAS (5 productos)
  // ==============================

  // Canilleras Mercurial Lite
  "CAN-001": {
    _stockTotal: 25,
    S: 7, M: 10, L: 8,
  },

  // Canilleras Predator
  "CAN-002": {
    _stockTotal: 22,
    S: 6, M: 9, L: 7,
  },

  // Canilleras Ultra Flex
  "CAN-003": {
    _stockTotal: 28,
    S: 8, M: 11, L: 9,
  },

  // Canilleras Pro Shield
  "CAN-004": {
    _stockTotal: 20,
    S: 5, M: 9, L: 6,
  },

  // Canilleras Strike Guard
  "CAN-005": {
    _stockTotal: 30,
    S: 9, M: 12, L: 9,
  },

  // ==============================
  // GUANTES DE ARQUERO (5 productos)
  // ==============================

  // Guantes de Arquero Pro Grip
  "GUA-001": {
    _stockTotal: 15,
    "7": 3, "8": 4, "9": 5, "10": 3,
  },

  // Guantes Predator Pro
  "GUA-002": {
    _stockTotal: 12,
    "7": 2, "8": 4, "9": 4, "10": 2,
  },

  // Guantes Vapor Grip
  "GUA-003": {
    _stockTotal: 14,
    "7": 3, "8": 4, "9": 5, "10": 2,
  },

  // Guantes Future Ultimate
  "GUA-004": {
    _stockTotal: 16,
    "7": 3, "8": 5, "9": 5, "10": 3,
  },

  // Guantes Match Control
  "GUA-005": {
    _stockTotal: 20,
    "7": 4, "8": 6, "9": 6, "10": 4,
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
