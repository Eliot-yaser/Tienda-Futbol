
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function obtenerVentasAdmin(token, signal) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  const respuesta = await fetch(
    `${API_BASE}/api/v1/admin/ventas`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal,
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
      "No tienes permisos para consultar las ventas."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo obtener el historial de ventas desde MySQL."
    );
  }

  const ventas = await respuesta.json();

  if (!Array.isArray(ventas)) {
    throw new Error(
      "La API devolvió un historial de ventas inválido."
    );
  }

  return ventas;
}
