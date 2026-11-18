
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// Consultar existencias reales desde Spring Boot
export async function consultarStockProducto(idProducto) {
  if (!Number.isSafeInteger(Number(idProducto)) ||
      Number(idProducto) <= 0) {
    throw new Error("El identificador del producto no es valido.");
  }

  const respuesta = await fetch(
    `${API_BASE}/api/v1/productos/${idProducto}/tallas`,
    { cache: "no-store" }
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo consultar el stock desde MySQL."
    );
  }

  const tallas = await respuesta.json();

  if (!Array.isArray(tallas)) {
    throw new Error("Respuesta de inventario invalida.");
  }

  const stockPorTalla = {};

  for (const item of tallas) {
    const stock = Number(item.stock);

    if (!item.talla ||
        !Number.isSafeInteger(stock) ||
        stock < 0) {
      throw new Error("Datos de stock invalidos.");
    }

    stockPorTalla[item.talla] = stock;
  }

  return {
    stockPorTalla,
    tieneTallas: tallas.length > 0,
    stockTotalTallas: Object.values(stockPorTalla)
      .reduce((total, cantidad) => total + cantidad, 0),
  };
}
