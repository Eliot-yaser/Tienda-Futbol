
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// Evitar varias renovaciones simultáneas.
let renovacionPendiente = null;

// Leer la sesión actual sin mostrar los tokens.
function leerSesion() {
  try {
    const datos = localStorage.getItem("usuarioLogueado");
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}

// Solicitar un nuevo JWT al backend.
async function renovarToken() {
  if (renovacionPendiente) {
    return renovacionPendiente;
  }

  renovacionPendiente = (async () => {
    const sesion = leerSesion();

    if (!sesion?.refreshToken) {
      throw new Error(
        "Tu sesión ha expirado. Inicia sesión nuevamente."
      );
    }

    const respuesta = await fetch(
      `${API_BASE}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          refreshToken: sesion.refreshToken,
        }),
      }
    );

    if (!respuesta.ok) {
      throw new Error(
        "No fue posible renovar la sesión. Inicia sesión nuevamente."
      );
    }

    const datos = await respuesta.json();

    if (
      !datos ||
      typeof datos.token !== "string" ||
      !datos.token ||
      typeof datos.refreshToken !== "string" ||
      !datos.refreshToken
    ) {
      throw new Error(
        "El servidor devolvió una renovación inválida."
      );
    }

    // Evitar actualizar una sesión distinta.
    const sesionActual = leerSesion();

    if (
      !sesionActual ||
      sesionActual.refreshToken !== sesion.refreshToken
    ) {
      throw new Error(
        "La sesión cambió durante la renovación."
      );
    }

    const sesionActualizada = {
      ...sesionActual,
      token: datos.token,
      refreshToken: datos.refreshToken,
      tipo: datos.tipo || sesionActual.tipo || "Bearer",
    };

    // Conservar los tokens renovados.
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify(sesionActualizada)
    );

    // Avisar a React que la sesión cambió.
    window.dispatchEvent(
      new CustomEvent("rey-balon-sesion-actualizada", {
        detail: sesionActualizada,
      })
    );

    return datos.token;
  })();

  try {
    return await renovacionPendiente;
  } finally {
    renovacionPendiente = null;
  }
}

// Consultar ventas con un JWT.
function solicitarVentas(token, signal) {
  return fetch(`${API_BASE}/api/v1/admin/ventas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    signal,
    cache: "no-store",
  });
}

// Obtener ventas reales desde Spring Boot y MySQL.
export async function obtenerVentasAdmin(token, signal) {
  // Priorizar el JWT más reciente de la sesión.
  const tokenActual = leerSesion()?.token || token;

  if (!tokenActual) {
    throw new Error(
      "Debes iniciar sesión para consultar las ventas."
    );
  }

  let respuesta = await solicitarVentas(
    tokenActual,
    signal
  );

  // Si el JWT expiró, renovarlo y repetir la consulta.
  if (respuesta.status === 401) {
    const nuevoToken = await renovarToken();

    if (signal?.aborted) {
      throw new Error("Consulta cancelada.");
    }

    respuesta = await solicitarVentas(
      nuevoToken,
      signal
    );
  }

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
