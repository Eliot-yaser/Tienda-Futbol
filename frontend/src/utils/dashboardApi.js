
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function obtenerResumenDashboard(
  token,
  signal
) {
  if (!token) {
    throw new Error(
      "Debes iniciar sesión como administrador."
    );
  }

  const respuesta = await fetch(
    `${API_BASE}/api/v1/admin/dashboard/resumen`,
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
      "No tienes permisos para consultar el dashboard."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron obtener las estadísticas de MySQL."
    );
  }

  const datos = await respuesta.json();

  if (
    typeof datos.productosRegistrados !== "number" ||
    typeof datos.usuariosRegistrados !== "number" ||
    typeof datos.ventasRealizadas !== "number" ||
    typeof datos.alertasStockCritico !== "number" ||
    !Array.isArray(datos.alertas)
  ) {
    throw new Error(
      "La API devolvió estadísticas incompletas."
    );
  }

  return datos;
}
