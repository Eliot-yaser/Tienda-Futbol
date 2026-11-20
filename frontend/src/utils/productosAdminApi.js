const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Función central para las peticiones administrativas
export async function solicitarAdmin(ruta, metodo, token, datos = null) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}/api/v1/admin/productos${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(datos !== null ? { body: JSON.stringify(datos) } : {}),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
    }

    if (respuesta.status === 403) {
      throw new Error("No tienes permisos de administrador.");
    }

    const error = await respuesta.json().catch(() => null);

    throw new Error(
      error?.mensaje || `Error al procesar la solicitud (${respuesta.status}).`,
    );
  }

  return respuesta.json();
}

const CATEGORIAS_ID = {
  Camisetas: 1,
  Shorts: 2,
  Calzado: 3,
  Balones: 4,
  Medias: 5,
  Canilleras: 6,
  Guantes: 7,
};

export function prepararProductoAdmin(formulario) {
  const precio = Number(formulario.precio);
  const precioAnterior = Number(formulario.precioAnterior);

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error("El precio del producto debe ser mayor que cero.");
  }

  if (
    formulario.enOferta &&
    (!Number.isFinite(precioAnterior) || precioAnterior <= precio)
  ) {
    throw new Error("El precio anterior debe ser mayor que el precio actual.");
  }

  const idCategoria = CATEGORIAS_ID[formulario.categoria];

  if (!idCategoria) {
    throw new Error("Selecciona una categoría válida.");
  }

  const stock = Number(formulario.stock);
  const stockCritico = Number(formulario.stockCritico);

  if (formulario.stock === "" || !Number.isSafeInteger(stock) || stock < 0) {
    throw new Error("El stock debe ser un número entero mayor o igual a cero.");
  }

  if (
    formulario.stockCritico === "" ||
    !Number.isSafeInteger(stockCritico) ||
    stockCritico < 0
  ) {
    throw new Error(
      "El stock crítico debe ser un número entero mayor o igual a cero.",
    );
  }

  return {
    codigo: formulario.codigo,
    nombre: formulario.nombre,
    descripcion: formulario.descripcion,
    precio: Number(formulario.precio),
    stock: Number(formulario.stock),
    stockCritico: Number(formulario.stockCritico),
    imagenUrl: formulario.imagen || null,
    enOferta: formulario.enOferta === true,
    precioAnterior: formulario.enOferta
      ? Number(formulario.precioAnterior)
      : null,
    idCategoria,
  };
}
