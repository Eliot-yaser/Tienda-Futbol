
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// Ejecutar solicitudes autenticadas al inventario
async function solicitarInventario(ruta, token, opciones = {}) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  const respuesta = await fetch(
    `${API_BASE}/api/v1/admin/inventario${ruta}`,
    {
      ...opciones,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(opciones.body
          ? { "Content-Type": "application/json" }
          : {}),
      },
      cache: "no-store",
    }
  );

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión ha expirado. Inicia sesión nuevamente."
    );
  }

  if (respuesta.status === 403) {
    throw new Error(
      "No tienes permisos para administrar el inventario."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo realizar la operación de inventario (HTTP ${respuesta.status}).`
    );
  }

  return respuesta.json();
}

// Consultar existencias reales de un producto
export async function obtenerInventarioAdmin(
  idProducto,
  token,
  signal
) {
  return solicitarInventario(`/${idProducto}`, token, {
    method: "GET",
    signal,
  });
}

// Guardar la distribución de existencias por talla
export async function actualizarTallasAdmin(
  idProducto,
  cantidades,
  token
) {
  return solicitarInventario(`/${idProducto}/tallas`, token, {
    method: "PUT",
    body: JSON.stringify({ cantidades }),
  });
}

// Registrar nuevas unidades en el inventario
export async function reponerInventarioAdmin(
  idProducto,
  cantidad,
  token
) {
  return solicitarInventario(
    `/${idProducto}/reposiciones`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ cantidad }),
    }
  );
}
