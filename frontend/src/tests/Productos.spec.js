import {
  cargarProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
} from "../utils/productos.js";

const CLAVE = "rey-balon-productos-v1";
const CLAVE_INVENTARIO = "rey-balon-inventario";
const NUEVO = {
  codigo: "PRU-001",
  nombre: "Producto de prueba",
  descripcion: "Producto usado en Jasmine",
  precio: 12000,
  stock: 10,
  stockCritico: 2,
  categoria: "Balones",
  imagen: "/prueba.png",
};

describe("CRUD de productos de Rey del Balón", () => {
  beforeEach(() => {
    localStorage.removeItem(CLAVE);
    localStorage.removeItem(CLAVE_INVENTARIO);
  });
  afterEach(() => {
    localStorage.removeItem(CLAVE);
    localStorage.removeItem(CLAVE_INVENTARIO);
  });

  it("conserva el catálogo original cuando no hay cambios guardados", () => {
    expect(cargarProductos().length).toBe(42);
  });

  it("crea un producto y lo conserva al leer nuevamente", () => {
    crearProducto(NUEVO);
    expect(cargarProductos().some((p) => p.codigo === "PRU-001")).toBeTrue();
    expect(cargarProductos().length).toBe(43);
  });

  it("rechaza códigos duplicados sin perder los productos", () => {
    crearProducto(NUEVO);
    expect(() => crearProducto(NUEVO)).toThrowError(/Ya existe/);
    expect(cargarProductos().length).toBe(43);
  });

  it("edita el nombre y precio conservando el código", () => {
    crearProducto(NUEVO);
    editarProducto("PRU-001", { nombre: "Balón actualizado", precio: 14990 });
    const p = cargarProductos().find((item) => item.codigo === "PRU-001");
    expect(p.nombre).toBe("Balón actualizado");
    expect(p.precio).toBe(14990);
    expect(p.codigo).toBe("PRU-001");
  });

  it("impide cambiar el stock base desde el editor", () => {
    crearProducto(NUEVO);
    expect(() => editarProducto("PRU-001", { stock: 100 })).toThrowError(/inventario/);
  });

  it("elimina un producto sin borrar el catálogo base", () => {
    crearProducto(NUEVO);
    eliminarProducto("PRU-001");
    expect(cargarProductos().length).toBe(42);
  });

  it("rechaza precios inválidos", () => {
    expect(() => crearProducto({ ...NUEVO, precio: -1 })).toThrowError(/precio/);
  });

  it("elimina solo el inventario del producto borrado", () => {
    crearProducto(NUEVO);
    localStorage.setItem("rey-balon-inventario", JSON.stringify({
      "PRU-001": { _stockTotal: 8 },
      "CAM-001": { _stockTotal: 25 },
    }));

    eliminarProducto("PRU-001");
    const inventario = JSON.parse(localStorage.getItem("rey-balon-inventario"));
    expect(inventario["PRU-001"]).toBeUndefined();
    expect(inventario["CAM-001"]._stockTotal).toBe(25);
  });

  it("no reutiliza existencias huérfanas al crear un código antiguo", () => {
    localStorage.setItem("rey-balon-inventario", JSON.stringify({
      "PRU-001": { _stockTotal: 999 },
    }));
    crearProducto(NUEVO);

    const inventario = JSON.parse(localStorage.getItem("rey-balon-inventario"));
    expect(inventario["PRU-001"]).toBeUndefined();
    expect(cargarProductos().find((p) => p.codigo === "PRU-001").stock).toBe(10);
  });
});
