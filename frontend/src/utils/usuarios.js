// Cuentas iniciales para la demostración local
const usuariosIniciales = [
  {
    nombre: "Isaac",
    apellidos: "Arias",
    email: "i.admin@gmail.com",
    pass: "1234",
    rol: "Administrador",
  },
  {
    nombre: "Eliot",
    apellidos: "Kvaratskhelia",
    email: "e.admin@gmail.com",
    pass: "1234",
    rol: "Administrador",
  },
  {
    nombre: "Vendedor",
    apellidos: "Demo",
    email: "vendedor.demo@gmail.com",
    pass: "demo1234",
    rol: "Vendedor",
  },
  {
    nombre: "Cliente",
    apellidos: "Demo",
    email: "cliente.demo@gmail.com",
    pass: "demo1234",
    rol: "Cliente",
  },
];

// Crear las cuentas que todavía no existen
export function inicializarUsuarios() {
  try {
    const datos = localStorage.getItem("usuariosRegistrados");

    const usuarios = datos ? JSON.parse(datos) : [];

    if (!Array.isArray(usuarios)) {
      return;
    }

    // Comprobar los correos existentes
    const correosExistentes = new Set(
      usuarios.map((usuario) =>
        String(usuario.email || usuario.correo || "")
          .trim()
          .toLowerCase(),
      ),
    );

    // Agregar solamente las cuentas faltantes
    const cuentasNuevas = usuariosIniciales.filter(
      (usuario) => !correosExistentes.has(usuario.email.toLowerCase()),
    );

    if (cuentasNuevas.length > 0) {
      localStorage.setItem(
        "usuariosRegistrados",
        JSON.stringify([...usuarios, ...cuentasNuevas]),
      );
    }
  } catch (error) {
    console.error("No fue posible inicializar los usuarios:", error);
  }
}
