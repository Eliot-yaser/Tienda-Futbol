import { useEffect, useMemo, useState } from "react";
import { useProductos } from "../hooks/useProductos.js";
import { consultarStockProducto } from "../utils/stockApi.js";
import { obtenerTallasPorCategoria } from "../utils/tallas";
import { obtenerVentasAdmin } from "../utils/ventasAdminApi";
import "./VendedorDashboard.css";

// Panel de solo consulta: no crea, modifica ni elimina registros.
// Ventas e inventario se consultan al backend, no al almacenamiento local.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function leerDatos() {
  return { ventas: [] };
}

function moneda(valor) {
  return `$${Number(valor ?? 0).toLocaleString("es-CL")}`;
}

function fechaLegible(valor) {
  if (!valor) return "Fecha no disponible";

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? "Fecha no disponible"
    : fecha.toLocaleString("es-CL");
}

// Mostrar exclusivamente el stock confirmado por MySQL.
function stockVigente(producto, inventario, cargandoStock) {
  if (cargandoStock) return "Cargando...";
  const stock = inventario[producto.codigo]?.stockTotal;
  return Number.isSafeInteger(stock) && stock >= 0 ? stock : "No disponible";
}

function resumenTallas(producto, inventario, cargandoStock) {
  const tallas = obtenerTallasPorCategoria(producto.categoria);
  if (tallas.length === 0) return "Talla única / no aplica";
  if (cargandoStock) return "Cargando...";

  const cantidades = inventario[producto.codigo]?.stockPorTalla;
  if (!cantidades) return "No disponible";

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

export default function VendedorDashboard({ usuario }) {
  const productosBase = useProductos();
  const [pestana, setPestana] = useState("productos");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [datos, setDatos] = useState(leerDatos);
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [errorVentas, setErrorVentas] = useState("");
  const [recargaVentas, setRecargaVentas] = useState(0);

  // Estado independiente para el stock del catálogo desde MySQL.
  const [inventarioReal, setInventarioReal] = useState({});
  const [cargandoStock, setCargandoStock] = useState(true);
  const [errorStock, setErrorStock] = useState("");
  const [recargaStock, setRecargaStock] = useState(0);

  // Las ventas se consultan desde Spring Boot y MySQL utilizando el JWT.
  useEffect(() => {
    const controller = new AbortController();

    async function consultarVentas() {
      setCargandoVentas(true);
      setErrorVentas("");
      setDatos((anterior) => ({ ...anterior, ventas: [] }));

      try {
        if (!usuario?.token) {
          throw new Error("Debes iniciar sesión para consultar las ventas.");
        }

        const ventas = await obtenerVentasAdmin(
          usuario.token,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setDatos((anterior) => ({
            ...anterior,
            ventas: Array.isArray(ventas) ? ventas : [],
          }));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorVentas(
            error.message || "No se pudieron consultar las ventas.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargandoVentas(false);
        }
      }
    }

    consultarVentas();
    return () => controller.abort();
  }, [usuario?.token, recargaVentas]);

  // Consultar el stock TOTAL desde el catálogo público de Spring Boot.
  // Consultar el stock POR TALLA desde la API pública ya existente.
  // No usar endpoints administrativos ni modificar información.
  useEffect(() => {
    const controller = new AbortController();

    async function consultarInventario() {
      setCargandoStock(true);
      setErrorStock("");
      setInventarioReal({}); // No mostrar cifras antiguas mientras se actualiza.

      try {
        const respuesta = await fetch(`${API_BASE}/api/v1/productos`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el catálogo desde MySQL.");
        }

        const catalogo = await respuesta.json();
        if (!Array.isArray(catalogo)) {
          throw new Error("La respuesta del catálogo no es válida.");
        }

        const porCodigo = new Map(catalogo.map((item) => [item.codigo, item]));
        const inventarioActualizado = {};
        const productosConTallas = [];

        for (const producto of productosBase) {
          const registro = porCodigo.get(producto.codigo);
          if (!registro) continue;

          const stockTotal = registro.stock == null ? null : Number(registro.stock);
          inventarioActualizado[producto.codigo] = {
            stockTotal: Number.isSafeInteger(stockTotal) && stockTotal >= 0
              ? stockTotal
              : null,
            stockPorTalla: null,
          };

          if (obtenerTallasPorCategoria(producto.categoria).length > 0) {
            productosConTallas.push({
              codigo: producto.codigo,
              idProducto: registro.idProducto,
            });
          }
        }

        // Una talla fallida no impide mostrar el resto del catálogo.
        const resultados = await Promise.allSettled(
          productosConTallas.map(async ({ codigo, idProducto }) => {
            const detalle = await consultarStockProducto(idProducto);
            return { codigo, stockPorTalla: detalle.stockPorTalla };
          }),
        );

        let fallos = 0;
        for (const resultado of resultados) {
          if (resultado.status === "fulfilled") {
            const { codigo, stockPorTalla } = resultado.value;
            inventarioActualizado[codigo].stockPorTalla = stockPorTalla;
          } else {
            fallos += 1;
          }
        }

        if (!controller.signal.aborted) {
          setInventarioReal(inventarioActualizado);
          if (fallos > 0) {
            setErrorStock(
              `No fue posible consultar las tallas de ${fallos} producto(s).`,
            );
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorStock(error.message || "No se pudo consultar el inventario.");
        }
      } finally {
        if (!controller.signal.aborted) setCargandoStock(false);
      }
    }

    consultarInventario();
    return () => controller.abort();
  }, [productosBase, recargaStock]);

  const actualizarDatos = () => {
    setRecargaVentas((anterior) => anterior + 1);
    setRecargaStock((anterior) => anterior + 1);
  };

  const categorias = useMemo(
    () => ["Todas", ...new Set(productosBase.map((p) => p.categoria))],
    [productosBase],
  );

  const productos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return productosBase.filter((producto) => {
      const coincideTexto = [
        producto.nombre,
        producto.codigo,
        producto.categoria,
      ].some((valor) => String(valor ?? "").toLowerCase().includes(termino));

      return (
        coincideTexto &&
        (categoria === "Todas" || producto.categoria === categoria)
      );
    });
  }, [busqueda, categoria, productosBase]);

  const ventasOrdenadas = useMemo(
    () => [...datos.ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [datos.ventas],
  );

  const ingresos = datos.ventas.reduce(
    (total, venta) => total + Number(venta.total ?? 0),
    0,
  );

  return (
    <main className="container py-5 vendedor-panel">
      <header className="bg-dark text-white rounded-4 p-4 mb-4 vendedor-encabezado">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="h2 fw-bold mb-2 text-white">⚽ Panel del vendedor</h1>
            <p className="mb-0">
              Consulta el catálogo y las ventas de Rey del Balón.
            </p>
          </div>
          <span className="badge bg-light text-dark align-self-start">
            Solo lectura
          </span>
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
              <p className="fs-2 fw-bold mb-0">
                {cargandoVentas ? "…" : errorVentas ? "—" : datos.ventas.length}
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100 vendedor-indicador">
            <div className="card-body">
              <p className="text-secondary mb-1">💰 Ingresos simulados</p>
              <p className="fs-3 fw-bold mb-0">
                {cargandoVentas ? "…" : errorVentas ? "—" : moneda(ingresos)}
              </p>
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
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={actualizarDatos}
          disabled={cargandoVentas || cargandoStock}
        >
          ↻ Actualizar datos
        </button>
      </div>

      {pestana === "productos" ? (
        <section
          className="card shadow-sm vendedor-contenido"
          aria-labelledby="titulo-vendedor-productos"
        >
          <div className="card-body p-3 p-md-4">
            <h2 id="titulo-vendedor-productos" className="h4 fw-bold mb-3">
              Consulta de productos
            </h2>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-8">
                <label htmlFor="buscar-productos-vendedor" className="form-label">
                  Buscar producto
                </label>
                <input
                  id="buscar-productos-vendedor"
                  className="form-control"
                  placeholder="Nombre, código o categoría"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="filtrar-categoria-vendedor" className="form-label">
                  Categoría
                </label>
                <select
                  id="filtrar-categoria-vendedor"
                  className="form-select"
                  value={categoria}
                  onChange={(evento) => setCategoria(evento.target.value)}
                >
                  {categorias.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errorStock && (
              <div className="alert alert-warning" role="alert">
                {errorStock} Los valores no disponibles no se reemplazan por datos locales.
              </div>
            )}
            {cargandoStock && (
              <div className="alert alert-info">Consultando inventario desde MySQL...</div>
            )}
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
                      <td>{stockVigente(producto, inventarioReal, cargandoStock)}</td>
                      <td className="vendedor-tallas">
                        {resumenTallas(producto, inventarioReal, cargandoStock)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {productos.length === 0 && (
              <p className="alert alert-info mb-0">No se encontraron productos.</p>
            )}
            <p className="small text-secondary mb-0">
              Las existencias se consultan desde Spring Boot y MySQL en modo de solo lectura.
            </p>
          </div>
        </section>
      ) : (
        <section aria-labelledby="titulo-vendedor-ventas">
          <h2 id="titulo-vendedor-ventas" className="h4 fw-bold mb-3">
            Historial de ventas
          </h2>

          {cargandoVentas ? (
            <div className="alert alert-info">Cargando ventas desde MySQL...</div>
          ) : errorVentas ? (
            <div className="alert alert-danger" role="alert">
              {errorVentas}
            </div>
          ) : ventasOrdenadas.length === 0 ? (
            <div className="alert alert-info">
              Todavía no hay ventas registradas en MySQL.
            </div>
          ) : (
            ventasOrdenadas.map((venta, indice) => (
              <article
                key={`${venta.id ?? "venta"}-${indice}`}
                className="card shadow-sm mb-3 vendedor-contenido"
              >
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                      <h3 className="h5 fw-bold mb-1">
                        Venta #{venta.id ?? indice + 1}
                      </h3>
                      <span className="text-secondary small">
                        {fechaLegible(venta.fecha)}
                      </span>
                      {venta.cliente && (
                        <p className="mb-1 mt-2">
                          <strong>Cliente:</strong> {venta.cliente}
                        </p>
                      )}
                      {venta.resultadoPago && (
                        <span className="badge bg-success">
                          {venta.resultadoPago}
                        </span>
                      )}
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
                        {(Array.isArray(venta.productos) ? venta.productos : []).map(
                          (producto, posicion) => (
                            <tr key={`${producto.codigo ?? "item"}-${posicion}`}>
                              <td>{producto.nombre}</td>
                              <td>{producto.talla || "Única"}</td>
                              <td>{producto.cantidad}</td>
                              <td>
                                {moneda(
                                  producto.subtotal ??
                                    Number(producto.precio ?? 0) *
                                      Number(producto.cantidad ?? 0),
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      <p className="text-secondary small mt-4 mb-0">
        Panel de solo consulta. Las ventas provienen de Spring Boot y MySQL;
        las compras son simuladas y no representan pagos reales.
      </p>
    </main>
  );
}
