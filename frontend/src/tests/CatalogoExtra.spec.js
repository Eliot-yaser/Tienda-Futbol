import { obtenerCategorias, productosDeCategoria, obtenerOfertas,
  porcentajeDescuento, esOfertaValida } from "../utils/catalogoExtra.js";
import { cargarProductos, editarProducto, crearProducto } from "../utils/productos.js";

const CLAVE = "rey-balon-productos-v1";
const PRUEBA = {
  codigo: "OFE-001", nombre: "Balón de prueba", descripcion: "Balón usado en test",
  categoria: "Balones", imagen: "/test.png", stock: 5, stockCritico: 1,
  precio: 10000, enOferta: true, precioAnterior: 15000,
};

describe("Categorías y ofertas de Rey del Balón", () => {
  beforeEach(() => localStorage.removeItem(CLAVE));
  afterEach(() => localStorage.removeItem(CLAVE));

  it("agrupa los 42 productos base en las siete categorías", () => {
    const categorias = obtenerCategorias(cargarProductos());
    expect(categorias.length).toBe(7);
    expect(categorias.reduce((suma, c) => suma + c.cantidad, 0)).toBe(42);
  });

  it("filtra por categoría sin alterar el catálogo", () => {
    const productos = cargarProductos();
    const camisetas = productosDeCategoria(productos, "Camisetas");
    expect(camisetas.length).toBe(6);
    expect(camisetas.every((p) => p.categoria === "Camisetas")).toBeTrue();
    expect(productos.length).toBe(42);
  });

  it("no inventa ofertas en los productos originales", () => {
    expect(obtenerOfertas(cargarProductos()).length).toBe(0);
  });

  it("publica una oferta real con precio anterior mayor", () => {
    const producto = crearProducto(PRUEBA);
    expect(esOfertaValida(producto)).toBeTrue();
    expect(obtenerOfertas(cargarProductos()).some((p) => p.codigo === PRUEBA.codigo)).toBeTrue();
  });

  it("calcula el porcentaje de descuento desde ambos precios", () => {
    expect(porcentajeDescuento(PRUEBA)).toBe(33);
  });

  it("impide un precio anterior menor o igual al actual", () => {
    expect(() => crearProducto({ ...PRUEBA, precioAnterior: 10000 })).toThrowError(/precio anterior/);
  });

  it("edita y persiste la oferta del producto sin cambiar su stock", () => {
    editarProducto("CAM-001", { enOferta: true, precioAnterior: 79990 });
    const producto = cargarProductos().find((p) => p.codigo === "CAM-001");
    expect(producto.enOferta).toBeTrue();
    expect(producto.precioAnterior).toBe(79990);
    expect(producto.stock).toBe(25);
  });

  it("retirar una oferta la excluye del catálogo de descuentos", () => {
    crearProducto(PRUEBA);
    editarProducto(PRUEBA.codigo, { enOferta: false });
    expect(obtenerOfertas(cargarProductos())).toEqual([]);
    expect(cargarProductos().find((p) => p.codigo === PRUEBA.codigo).precioAnterior).toBeNull();
  });
});
