import { CHECKOUT_VACIO, datosCheckoutInicial, validarDatosCheckout, prepararDatosEntrega } from "../utils/checkout.js";

describe("Checkout - datos y validaciones", () => {
  const validos = {
    ...CHECKOUT_VACIO,
    nombre: "Cliente", apellidos: "Prueba", email: "cliente@example.com",
    calle: "Calle Ficticia", numero: "123", region: "Región Metropolitana de Santiago",
    comuna: "La Florida", tipoEntrega: "Domicilio",
  };
  it("acepta un formulario válido", () => {
    expect(Object.keys(validarDatosCheckout(validos)).length).toBe(0);
  });
  it("rechaza email inválido", () => {
    expect(validarDatosCheckout({ ...validos, email: "incorrecto" }).email).toBeTruthy();
  });
  it("requiere calle y número para entrega a domicilio", () => {
    const errores = validarDatosCheckout({ ...validos, calle: "", numero: "" });
    expect(errores.calle).toBeTruthy();
    expect(errores.numero).toBeTruthy();
  });
  it("no exige dirección para retiro simulado", () => {
    const errores = validarDatosCheckout({ ...validos, tipoEntrega: "Retiro", calle: "", numero: "", region: "", comuna: "" });
    expect(Object.keys(errores).length).toBe(0);
  });
  it("rechaza una comuna que no pertenece a la región", () => {
    expect(validarDatosCheckout({ ...validos, comuna: "Concepción" }).comuna).toBeTruthy();
  });
  it("precarga datos de usuario sin copiar la contraseña", () => {
    const inicial = datosCheckoutInicial({ nombre: "Demo", apellidos: "Local", email: "demo@example.com" },
      [{ email: "demo@example.com", pass: "NO-COPIAR", region: "Región Metropolitana de Santiago", comuna: "La Florida", direccion: "Calle Ficticia" }]);
    expect(inicial.region).toBe("Región Metropolitana de Santiago");
    expect(inicial.calle).toBe("Calle Ficticia");
    expect(inicial.pass).toBeUndefined();
  });
  it("prepara datos de entrega y normaliza correo", () => {
    const resultado = prepararDatosEntrega({ ...validos, email: " DEMO@EXAMPLE.COM " });
    expect(resultado.cliente.email).toBe("demo@example.com");
    expect(resultado.entrega.tipo).toBe("Domicilio");
  });
});
