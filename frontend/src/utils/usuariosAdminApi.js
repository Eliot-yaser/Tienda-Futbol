
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function obtenerUsuariosAdmin(token, signal) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  const respuesta = await fetch(
    `${API_BASE}/api/v1/admin/usuarios`,
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
      "No tienes permisos para consultar los usuarios."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron cargar los usuarios desde MySQL."
    );
  }

  const usuarios = await respuesta.json();

  if (!Array.isArray(usuarios)) {
    throw new Error(
      "La API devolvió un listado de usuarios inválido."
    );
  }

  return usuarios;
}
