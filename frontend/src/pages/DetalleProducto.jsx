import { Link, useParams } from "react-router-dom";
import { useProductos } from "../hooks/useProductos.js";
import { useEffect, useState } from "react";
import { obtenerTallasPorCategoria } from "../utils/tallas";
import { cargarInventario } from "../utils/inventario";

function DetalleProducto({ onAgregar }) {
  const productosBase = useProductos();
  // Obtener el código del producto desde la URL
  const { codigo } = useParams();

  const [tallaSeleccionada, setTallaSeleccionada] = useState("");

  useEffect(() => {
    setTallaSeleccionada("");
  }, [codigo]);

  // Buscar el producto seleccionado
  const producto = productosBase.find((item) => item.codigo === codigo);

  // Mostrar un mensaje si el producto no existe
  if (!producto) {
    return (
      <main className="container py-5 text-center">
        <h1>Producto no encontrado</h1>

        <Link to="/productos" className="btn btn-dark mt-3">
          ← Volver a Productos
        </Link>
      </main>
    );
  }

  const tallasDisponibles = obtenerTallasPorCategoria(producto.categoria);

  // Leer el inventario guardado por el administrador
  const inventarioGuardado = cargarInventario();

  // Obtener las existencias del producto actual
  const stockPorTalla = inventarioGuardado[producto.codigo] ?? {};
  const stockTotal = stockPorTalla._stockTotal ?? producto.stock;

  // Consultar las unidades de la talla seleccionada
  const stockTalla = tallaSeleccionada
    ? stockPorTalla[tallaSeleccionada]
    : undefined;

  // Buscar cuatro productos de la misma categoría
  const relacionados = productosBase
    .filter(
      (item) =>
        item.codigo !== producto.codigo &&
        item.categoria === producto.categoria,
    )
    .slice(0, 4);

  return (
    <main className="container py-5">
      {/* Información del producto */}
      <section className="row g-4 align-items-center bg-white border rounded-3 p-4">
        {/* Imagen grande */}
        <div className="col-12 col-md-6 text-center">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid"
            style={{
              maxHeight: "420px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Nombre, categoría, precio y descripción */}
        <div className="col-12 col-md-6">
          <p className="text-uppercase text-secondary fw-bold">
            {producto.categoria}
          </p>

          <h1 className="fw-bold mb-3">{producto.nombre}</h1>

          <h2 className="fw-bold mb-4" style={{ color: "#e11d48" }}>
            ${producto.precio.toLocaleString("es-CL")}
          </h2>

          <p className="text-secondary mb-4">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <div className="mb-4">
            {tallasDisponibles.length > 0 ? (
              <>
                <label htmlFor="talla-producto" className="form-label fw-bold">
                  Selecciona tu talla:
                </label>

                <select
                  id="talla-producto"
                  className="form-select"
                  value={tallaSeleccionada}
                  onChange={(e) => setTallaSeleccionada(e.target.value)}
                >
                  <option value="">-- Selecciona una talla --</option>

                  {tallasDisponibles.map((talla) => (
                    <option key={talla} value={talla}>
                      {talla}
                    </option>
                  ))}
                </select>

                {tallaSeleccionada && (
                  <p className="text-success fw-bold mt-2">
                    Talla seleccionada: {tallaSeleccionada}
                  </p>
                )}
              </>
            ) : (
              <p className="fw-bold">Talla única</p>
            )}

            {tallasDisponibles.length > 0 ? (
              tallaSeleccionada ? (
                stockTalla !== undefined ? (
                  <p className="text-success fw-bold mt-2">
                    ✅ Stock disponible en talla {tallaSeleccionada}:{" "}
                    {stockTalla} unidades
                  </p>
                ) : (
                  <p className="text-warning fw-bold mt-2">
                    Stock por talla pendiente de configurar.
                  </p>
                )
              ) : (
                <p className="text-secondary mt-2">
                  Selecciona una talla para consultar su disponibilidad.
                </p>
              )
            ) : (
              <p className="text-success fw-bold mt-2">
                ✅ Stock disponible: {stockTotal} unidades
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-danger me-3 mb-4"
            disabled={
              stockTotal <= 0 ||
              (tallasDisponibles.length > 0 &&
                (!tallaSeleccionada || stockTalla === 0))
            }
            onClick={() => onAgregar(producto, tallaSeleccionada || null)}
          >
            Agregar al carrito
          </button>

          <Link
            to="/productos"
            className="text-decoration-none fw-bold"
            style={{ color: "#e11d48" }}
          >
            ← Volver a Productos
          </Link>
        </div>
      </section>

      {/* Productos relacionados */}
      <section className="mt-5">
        <h2 className="fw-bold mb-4">Productos relacionados</h2>

        <div className="row g-3">
          {relacionados.map((relacionado) => (
            <div className="col-12 col-sm-6 col-lg-3" key={relacionado.codigo}>
              <article className="card h-100">
                <img
                  src={relacionado.imagen}
                  alt={relacionado.nombre}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "contain",
                    padding: "12px",
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h3 className="h6 fw-bold">{relacionado.nombre}</h3>

                  <p className="fw-bold" style={{ color: "#e11d48" }}>
                    ${relacionado.precio.toLocaleString("es-CL")}
                  </p>

                  <Link
                    to={`/producto/${relacionado.codigo}`}
                    className="btn btn-dark mt-auto"
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default DetalleProducto;
