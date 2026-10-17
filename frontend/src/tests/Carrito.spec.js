import {
  calcularTotalCarrito,
  calcularCantidadTotal,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  cambiarCantidadProducto,
} from "../utils/carrito.js";

describe("Pruebas del carrito de Rey del Balón", () => {
  // Prueba 1: carrito vacío
  it("Debe devolver 0 cuando el carrito está vacío", () => {
    const carrito = [];

    const total = calcularTotalCarrito(carrito);

    expect(total).toBe(0);
  });

  // Prueba 2: productos con cantidades
  it("Debe calcular el total de 3 camisetas", () => {
    const carrito = [
      {
        codigo: "CHI001",
        nombre: "Camiseta Selección Chilena 2026",
        precio: 59990,
        cantidad: 3,
      },
    ];

    const total = calcularTotalCarrito(carrito);

    expect(total).toBe(179970);
  });

  // Prueba 3: carrito vacío
  it("Debe contar 0 unidades si el carrito está vacío", () => {
    const carrito = [];

    const cantidad = calcularCantidadTotal(carrito);

    expect(cantidad).toBe(0);
  });

  // Prueba 4: productos con distintas cantidades
  it("Debe contar correctamente todas las unidades", () => {
    const carrito = [
      { nombre: "Camiseta Chile", cantidad: 3 },
      { nombre: "Balón de fútbol", cantidad: 2 },
    ];

    const cantidad = calcularCantidadTotal(carrito);

    expect(cantidad).toBe(5);
  });

  // Prueba 5: agregar un producto nuevo
  it("Debe agregar un producto nuevo con cantidad 1", () => {
    const producto = {
      codigo: "CAM001",
      nombre: "Camiseta Chile",
      precio: 59990,
    };

    const resultado = agregarProductoAlCarrito([], producto);

    expect(resultado.length).toBe(1);
    expect(resultado[0].cantidad).toBe(1);
  });

  // Prueba 6: agregar un producto existente
  it("Debe aumentar la cantidad sin duplicar el producto", () => {
    const producto = {
      codigo: "CAM001",
      nombre: "Camiseta Chile",
      precio: 59990,
    };

    const carritoInicial = [{ ...producto, cantidad: 1 }];

    const resultado = agregarProductoAlCarrito(carritoInicial, producto);

    expect(resultado.length).toBe(1);
    expect(resultado[0].cantidad).toBe(2);
  });

  // Prueba 7: eliminar un producto
  it("Debe eliminar un producto y conservar los demás", () => {
    const carrito = [
      { codigo: "CAM001", nombre: "Camiseta Chile", cantidad: 1 },
      { codigo: "BAL001", nombre: "Balón", cantidad: 2 },
    ];

    const resultado = eliminarProductoDelCarrito(carrito, 0);

    expect(resultado.length).toBe(1);
    expect(resultado[0].codigo).toBe("BAL001");
  });

  // Prueba 8: impedir cantidades menores a 1
  it("No debe permitir que la cantidad baje de 1", () => {
    const carrito = [
      { codigo: "CAM001", nombre: "Camiseta Chile", cantidad: 1 },
    ];

    const resultado = cambiarCantidadProducto(carrito, "CAM001", -1);

    expect(resultado[0].cantidad).toBe(1);
  });

  // Prueba 11: agregar un producto existente sin modificar otros
  it("Debe aumentar solo el producto seleccionado", () => {
    const carrito = [
      { codigo: "CAM001", precio: 59990, cantidad: 1 },
      { codigo: "BAL001", precio: 29990, cantidad: 2 },
    ];

    const resultado = agregarProductoAlCarrito(carrito, {
      codigo: "CAM001",
      precio: 59990,
    });

    expect(resultado[0].cantidad).toBe(2);
    expect(resultado[1].cantidad).toBe(2);
    expect(resultado.length).toBe(2);
  });

  // Prueba 12: cambiar cantidad sin afectar otros productos
  it("Debe modificar la cantidad solo del producto indicado", () => {
    const carrito = [
      { codigo: "CAM001", cantidad: 1 },
      { codigo: "BAL001", cantidad: 3 },
    ];

    const resultado = cambiarCantidadProducto(carrito, "CAM001", 1);

    expect(resultado[0].cantidad).toBe(2);
    expect(resultado[1].cantidad).toBe(3);
  });
});
