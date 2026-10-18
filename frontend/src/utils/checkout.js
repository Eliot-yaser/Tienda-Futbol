// Checkout local: validaciones sin procesar pagos reales.
export const REGIONES_COMUNAS = {
  "Región Metropolitana de Santiago": ["Santiago", "Providencia", "Peñalolen", "Las Condes", "La Florida", "Maipú", "Puente Alto", "San Bernardo", "Macul"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "San Antonio"],
  "Región del Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"],
  "Región de Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
};

export const CHECKOUT_VACIO = {
  nombre: "", apellidos: "", email: "", calle: "", numero: "", departamento: "",
  region: "", comuna: "", indicaciones: "", tipoEntrega: "Domicilio",
  resultadoPago: "Aprobado",
};

// El inicio de sesión solo guarda nombre/correo/rol. Se buscan los otros datos
// en las cuentas locales para rellenar el formulario, sin copiar contraseñas.
export function datosCheckoutInicial(usuario, usuariosRegistrados = []) {
  if (!usuario) return { ...CHECKOUT_VACIO };
  const cuenta = Array.isArray(usuariosRegistrados) ? usuariosRegistrados.find(
    (u) => String(u.email || u.correo || "").trim().toLowerCase() ===
      String(usuario.email || "").trim().toLowerCase(),
  ) : null;
  const region = cuenta?.region || "";
  const comuna = cuenta?.comuna || "";
  return {
    ...CHECKOUT_VACIO,
    nombre: usuario.nombre || cuenta?.nombre || "",
    apellidos: usuario.apellidos || cuenta?.apellidos || "",
    email: usuario.email || cuenta?.email || "",
    calle: cuenta?.direccion || "",
    region: REGIONES_COMUNAS[region]?.includes(comuna) ? region : "",
    comuna: REGIONES_COMUNAS[region]?.includes(comuna) ? comuna : "",
  };
}

export function validarDatosCheckout(datos) {
  const errores = {};
  const campo = (clave) => String(datos[clave] || "").trim();
  if (!campo("nombre")) errores.nombre = "Ingresa tu nombre.";
  if (!campo("apellidos")) errores.apellidos = "Ingresa tus apellidos.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo("email"))) {
    errores.email = "Ingresa un correo válido.";
  }
  if (!["Domicilio", "Retiro"].includes(datos.tipoEntrega)) {
    errores.tipoEntrega = "Selecciona un tipo de entrega válido.";
  }
  if (datos.tipoEntrega === "Domicilio") {
    if (!campo("calle")) errores.calle = "Ingresa la calle y dirección.";
    if (!campo("numero")) errores.numero = "Ingresa el número.";
    if (!REGIONES_COMUNAS[datos.region]) errores.region = "Selecciona una región.";
    if (!REGIONES_COMUNAS[datos.region]?.includes(datos.comuna)) {
      errores.comuna = "Selecciona una comuna válida.";
    }
  }
  if (!["Aprobado", "Rechazado"].includes(datos.resultadoPago)) {
    errores.resultadoPago = "Selecciona un resultado de pago de prueba.";
  }
  return errores;
}

export function prepararDatosEntrega(datos) {
  return {
    cliente: {
      nombre: String(datos.nombre).trim(),
      apellidos: String(datos.apellidos).trim(),
      email: String(datos.email).trim().toLowerCase(),
    },
    entrega: {
      tipo: datos.tipoEntrega,
      calle: datos.tipoEntrega === "Domicilio" ? String(datos.calle).trim() : "",
      numero: datos.tipoEntrega === "Domicilio" ? String(datos.numero).trim() : "",
      departamento: datos.tipoEntrega === "Domicilio" ? String(datos.departamento || "").trim() : "",
      region: datos.tipoEntrega === "Domicilio" ? datos.region : "",
      comuna: datos.tipoEntrega === "Domicilio" ? datos.comuna : "",
      indicaciones: String(datos.indicaciones || "").trim(),
    },
  };
}
