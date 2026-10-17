const CLAVE_INVENTARIO = "rey-balon-inventario";
import { obtenerTallasPorCategoria } from "./tallas.js";

// Recuperar el inventario guardado
export function cargarInventario() {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_INVENTARIO);

    if (!datosGuardados) {
      return {};
    }

    const inventario = JSON.parse(datosGuardados);

    if (
      inventario &&
      typeof inventario === "object" &&
      !Array.isArray(inventario)
    ) {
      return inventario;
    }

    return {};
  } catch {
    return {};
  }
}

// Guardar los cambios del administrador
export function guardarInventario(inventario) {
  localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
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
