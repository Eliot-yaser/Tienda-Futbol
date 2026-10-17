import { useEffect, useMemo, useState } from "react";
import productosBase from "../data/productos";
import { cargarInventario } from "../utils/inventario";
import { obtenerTallasPorCategoria } from "../utils/tallas";
import "./VendedorDashboard.css";

// Este panel es de consulta: nunca modifica productos, ventas ni inventario.
function cargarVentas() {
  try {
    const datos = localStorage.getItem("rey-balon-ventas");
    const ventas = datos ? JSON.parse(datos) : [];
    return Array.isArray(ventas) ? ventas : [];
  } catch {
    return [];
  }
}

function leerDatos() {
  return { inventario: cargarInventario(), ventas: cargarVentas() };
}

function moneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CL")}`;
}

function fechaLegible(valor) {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? "Fecha no disponible"
    : fecha.toLocaleString("es-CL");
}

function stockVigente(producto, inventario) {
  const guardado = inventario[producto.codigo]?._stockTotal;
  return Number.isSafeInteger(guardado) && guardado >= 0
    ? guardado
    : producto.stock;
}

function resumenTallas(producto, inventario) {
  const tallas = obtenerTallasPorCategoria(producto.categoria);
  if (tallas.length === 0) return "Talla única / no aplica";

  const cantidades = inventario[producto.codigo] ?? {};
  return tallas
    .map((talla) => {
      const stock = cantidades[talla];
      const disponible = Number.isSafeInteger(stock) && stock >= 0
        ? stock
        : "Sin configurar";
      return `${talla}: ${disponible}`;
    })
    .join(" · ");
}

export default function VendedorDashboard() {
  const [pestana, setPestana] = useState("productos");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [datos, setDatos] = useState(leerDatos);

  // Refrescar cuando el inventario o las ventas cambien desde otra pestaña.
  useEffect(() => {
    const actualizarDesdeOtraPestana = (evento) => {
      if (
        evento.key === null ||
        evento.key === "rey-balon-inventario" ||
        evento.key === "rey-balon-ventas"
      ) {
        setDatos(leerDatos());
      }
    };
    window.addEventListener("storage", actualizarDesdeOtraPestana);
    return () => window.removeEventListener("storage", actualizarDesdeOtraPestana);
  }, []);

  const categorias = useMemo(
    () => ["Todas", ...new Set(productosBase.map((p) => p.categoria))],
    [],
  );

  const productos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return productosBase.filter((producto) => {
      const coincideTexto = [producto.nombre, producto.codigo, producto.categoria]
        .some((valor) => String(valor ?? "").toLowerCase().includes(termino));
      return coincideTexto && (categoria === "Todas" || producto.categoria === categoria);
    });
  }, [busqueda, categoria]);

  const ventasOrdenadas = useMemo(
    () => [...datos.ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [datos.ventas],
  );

  const ingresos = datos.ventas.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0,
  );

  return (
    <main className="container py-5 vendedor-panel">
      <header className="bg-dark text-white rounded-4 p-4 mb-4 vendedor-encabezado">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="h2 fw-bold mb-2 text-white">⚽ Panel del vendedor</h1>
            <p className="mb-0">Consulta el catálogo y las ventas de Rey del Balón.</p>
          </div>
          <span className="badge bg-light text-dark align-self-start">Solo lectura</span>
        </div>
      </header>

      <div className="row g-3 mb-4" aria-label="Resumen de tienda">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 vendedor-indicador">
            <div className="card-body">
              <p className="text-secondary mb-1">📦 Productos registrados</p>
              <p className="fs-2 fw-bold mb-0">{productosBase.length}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 vendedor-indicador">
            <div className="card-body">
              <p className="text-secondary mb-1">🧾 Ventas registradas</p>
              <p className="fs-2 fw-bold mb-0">{datos.ventas.length}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 vendedor-indicador">
            <div className="card-body">
              <p className="text-secondary mb-1">💰 Ingresos simulados</p>
              <p className="fs-3 fw-bold mb-0">{moneda(ingresos)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <div className="btn-group" role="group" aria-label="Secciones del vendedor">
          <button
            type="button"
            className={`btn ${pestana === "productos" ? "btn-dark" : "btn-outline-dark"}`}
            aria-pressed={pestana === "productos"}
            onClick={() => setPestana("productos")}
          >
            📦 Productos
          </button>
          <button
            type="button"
            className={`btn ${pestana === "ventas" ? "btn-dark" : "btn-outline-dark"}`}
            aria-pressed={pestana === "ventas"}
            onClick={() => setPestana("ventas")}
          >
            🧾 Ventas
          </button>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={() => setDatos(leerDatos())}>
          ↻ Actualizar datos
        </button>
      </div>

      {pestana === "productos" ? (
        <section className="card shadow-sm vendedor-contenido" aria-labelledby="titulo-vendedor-productos">
          <div className="card-body p-3 p-md-4">
            <h2 id="titulo-vendedor-productos" className="h4 fw-bold mb-3">Consulta de productos</h2>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-8">
                <label htmlFor="buscar-productos-vendedor" className="form-label">Buscar producto</label>
                <input
                  id="buscar-productos-vendedor"
                  className="form-control"
                  placeholder="Nombre, código o categoría"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="filtrar-categoria-vendedor" className="form-label">Categoría</label>
                <select
                  id="filtrar-categoria-vendedor"
                  className="form-select"
                  value={categoria}
                  onChange={(evento) => setCategoria(evento.target.value)}
                >
                  {categorias.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>
              </div>
            </div>
            <p className="text-secondary">Productos encontrados: {productos.length}</p>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle vendedor-tabla">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Stock total</th>
                    <th scope="col">Stock por talla</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.codigo}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>{moneda(producto.precio)}</td>
                      <td>{stockVigente(producto, datos.inventario)}</td>
                      <td className="vendedor-tallas">{resumenTallas(producto, datos.inventario)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {productos.length === 0 && <p className="alert alert-info mb-0">No se encontraron productos.</p>}
            <p className="small text-secondary mb-0">
              Las tallas sin configurar requieren que un administrador asigne inventario.
            </p>
          </div>
        </section>
      ) : (
        <section aria-labelledby="titulo-vendedor-ventas">
          <h2 id="titulo-vendedor-ventas" className="h4 fw-bold mb-3">Historial de ventas</h2>
          {ventasOrdenadas.length === 0 ? (
            <div className="alert alert-info">Todavía no hay ventas registradas en este navegador.</div>
          ) : ventasOrdenadas.map((venta, indice) => (
            <article key={`${venta.id ?? "venta"}-${indice}`} className="card shadow-sm mb-3 vendedor-contenido">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div>
                    <h3 className="h5 fw-bold mb-1">Venta #{venta.id ?? indice + 1}</h3>
                    <span className="text-secondary small">{fechaLegible(venta.fecha)}</span>
                  </div>
                  <strong className="fs-5">{moneda(venta.total)}</strong>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Talla</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(venta.productos) ? venta.productos : []).map((producto, posicion) => (
                        <tr key={`${producto.codigo ?? "item"}-${posicion}`}>
                          <td>{producto.nombre}</td>
                          <td>{producto.talla ?? "Única"}</td>
                          <td>{producto.cantidad}</td>
                          <td>{moneda(Number(producto.precio) * Number(producto.cantidad))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <p className="text-secondary small mt-4 mb-0">
        Panel demostrativo de solo consulta. La información se almacena en este navegador;
        las compras no representan pagos reales.
      </p>
    </main>
  );
}
