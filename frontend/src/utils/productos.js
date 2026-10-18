import productosBase from "../data/productos.js";

const CLAVE_PRODUCTOS = "rey-balon-productos-v1";

// Al iniciar, conservar los 42 productos originales sin modificar el archivo base.
export function cargarProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS);
  if (datos === null) return productosBase.map((producto) => ({ ...producto }));

  const productos = JSON.parse(datos);
  if (!Array.isArray(productos)) {
    throw new Error("Los productos guardados no tienen un formato válido.");
  }
  return productos.map((producto) => ({ ...producto }));
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
  // storage no se dispara en la misma pestaña. Avisamos a los componentes React.
  window.dispatchEvent(new Event("rey-balon-productos-cambiaron"));
}

function validarProducto(datos) {
  const codigo = String(datos.codigo ?? "").trim().toUpperCase();
  const nombre = String(datos.nombre ?? "").trim();
  const descripcion = String(datos.descripcion ?? "").trim();
  const categoria = String(datos.categoria ?? "").trim();
  const imagen = String(datos.imagen ?? "").trim();
  const precio = Number(datos.precio);
  const stock = Number(datos.stock);
  const stockCritico = Number(datos.stockCritico);

  if (!/^[A-Z0-9-]{3,20}$/.test(codigo)) {
    throw new Error("El código debe tener 3 a 20 letras, números o guiones.");
  }
  if (!nombre || !descripcion || !imagen) {
    throw new Error("Nombre, descripción e imagen son obligatorios.");
  }
  const categoriasValidas = new Set(productosBase.map((p) => p.categoria));
  if (!categoriasValidas.has(categoria)) {
    throw new Error("Selecciona una categoría existente.");
  }
  if (!Number.isSafeInteger(precio) || precio <= 0) {
    throw new Error("El precio debe ser un entero mayor que cero.");
  }
  if (!Number.isSafeInteger(stock) || stock < 0 ||
      !Number.isSafeInteger(stockCritico) || stockCritico < 0 ||
      stockCritico > stock) {
    throw new Error("El stock y el stock crítico deben ser válidos.");
  }

  return { codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagen };
}

export function crearProducto(datos) {
  const productos = cargarProductos();
  const nuevo = validarProducto(datos);
  if (productos.some((p) => p.codigo === nuevo.codigo)) {
    throw new Error("Ya existe un producto con ese código.");
  }
  guardarProductos([...productos, nuevo]);
  return nuevo;
}

export function editarProducto(codigo, cambios) {
  const productos = cargarProductos();
  const indice = productos.findIndex((p) => p.codigo === codigo);
  if (indice < 0) throw new Error("Producto no encontrado.");
  const anterior = productos[indice];
  const actualizado = validarProducto({ ...anterior, ...cambios, codigo: anterior.codigo });

  // Estas propiedades repercuten en las tallas y existencias. Gestionarlas
  // desde inventario para no dejar cantidades inconsistentes.
  if (actualizado.categoria !== anterior.categoria || actualizado.stock !== anterior.stock) {
    throw new Error("La categoría y el stock base no se editan aquí; usa inventario.");
  }
  productos[indice] = actualizado;
  guardarProductos(productos);
  return actualizado;
}

export function eliminarProducto(codigo) {
  const productos = cargarProductos();
  const indice = productos.findIndex((p) => p.codigo === codigo);
  if (indice < 0) throw new Error("Producto no encontrado.");

  // Evitar eliminar productos que ya están en el carrito de alguna cuenta.
  for (let i = 0; i < localStorage.length; i += 1) {
    const clave = localStorage.key(i);
    if (!clave?.startsWith("carrito-react-")) continue;
    try {
      const carrito = JSON.parse(localStorage.getItem(clave) || "[]");
      if (!Array.isArray(carrito)) throw new Error("Carrito inválido");
      if (carrito.some((item) => item.codigo === codigo)) {
        throw new Error("Hay unidades de este producto en un carrito. No se puede eliminar.");
      }
    } catch (error) {
      throw new Error(error.message || "No se pudo revisar un carrito guardado.");
    }
  }

  guardarProductos(productos.filter((p) => p.codigo !== codigo));
}
