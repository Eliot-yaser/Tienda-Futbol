
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function registrarCompraApi(datosPedido, carrito, token) {
  if (!token) {
    throw new Error("Debes iniciar sesión para realizar una compra.");
  }

  if (!Array.isArray(carrito) || carrito.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const { cliente, entrega } = datosPedido;

  const solicitud = {
    nombreCliente: cliente.nombre,
    apellidosCliente: cliente.apellidos,
    emailCliente: cliente.email,

    tipoEntrega:
      entrega.tipo === "Domicilio" ? "DOMICILIO" : "RETIRO",

    calle: entrega.calle,
    numero: entrega.numero,
    departamento: entrega.departamento,
    region: entrega.region,
    comuna: entrega.comuna,
    indicaciones: entrega.indicaciones,

    productos: carrito.map((producto) => ({
      codigo: producto.codigo,
      talla: producto.talla ?? null,
      cantidad: producto.cantidad,
    })),
  };

  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE}/api/v1/compras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(solicitud),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Intenta nuevamente."
    );
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);

    if (respuesta.status === 401) {
      throw new Error(
        "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente."
      );
    }

    if (respuesta.status === 403) {
      throw new Error("No tienes permiso para registrar esta compra.");
    }

    throw new Error(
      error?.mensaje || `No se pudo registrar la compra (${respuesta.status}).`
    );
  }

  return await respuesta.json();
}
