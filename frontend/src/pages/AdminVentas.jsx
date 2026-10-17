import { useState } from "react";
import { Link } from "react-router-dom";

// Recuperar las ventas registradas en el navegador
function cargarVentas() {
  try {
    const datos = localStorage.getItem("rey-balon-ventas");

    const ventas = datos ? JSON.parse(datos) : [];

    return Array.isArray(ventas) ? ventas : [];
  } catch {
    return [];
  }
}

// Formatear precios en pesos chilenos
function formatearPrecio(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CL")}`;
}

// Formatear la fecha de una compra
function formatearFecha(fecha) {
  const fechaVenta = new Date(fecha);

  if (Number.isNaN(fechaVenta.getTime())) {
    return "Fecha no disponible";
  }

  return fechaVenta.toLocaleString("es-CL");
}

function AdminVentas() {
  const [ventas] = useState(cargarVentas);

  // Ordenar las ventas desde la más reciente
  const ventasOrdenadas = [...ventas].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  // Calcular los ingresos de demostración
  const ingresosTotales = ventas.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0
  );

  return (
    <main className="container py-5">

      {/* Encabezado */}
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>📊 Historial de ventas</h1>

        <p className="mb-0">
          Consulta las compras registradas en Rey del Balón.
        </p>
      </div>

      {/* Resumen */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h6 text-secondary">
                Ventas realizadas
              </h2>

              <p className="display-5 fw-bold mb-0">
                {ventas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h6 text-secondary">
                Ingresos registrados
              </h2>

              <p
                className="display-6 fw-bold mb-0"
                style={{ color: "#16a34a" }}
              >
                {formatearPrecio(ingresosTotales)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Listado de ventas */}
      <section>
        <h2 className="h4 fw-bold mb-4">
          Detalle de ventas
        </h2>

        {ventasOrdenadas.length === 0 ? (
          <div className="alert alert-info">
            Todavía no hay ventas registradas.
          </div>
        ) : (
          ventasOrdenadas.map((venta, indice) => (
            <article
              key={`${venta.id ?? "venta"}-${indice}`}
              className="card border-0 shadow-sm mb-3"
            >
              <div className="card-body p-4">

                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="h5 fw-bold">
                      🧾 Venta #{venta.id}
                    </h3>

                    <p className="text-secondary mb-0">
                      {formatearFecha(venta.fecha)}
                    </p>
                  </div>

                  <strong
                    className="fs-4"
                    style={{ color: "#16a34a" }}
                  >
                    {formatearPrecio(venta.total)}
                  </strong>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Talla</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(venta.productos || []).map(
                        (producto, posicion) => (
                          <tr
                            key={`${producto.codigo}-${posicion}`}
                          >
                            <td>{producto.nombre}</td>

                            <td>
                              {producto.talla ?? "Única"}
                            </td>

                            <td>{producto.cantidad}</td>

                            <td>
                              {formatearPrecio(
                                producto.precio *
                                  producto.cantidad
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </article>
          ))
        )}
      </section>

      <Link
        to="/admin/inventario"
        className="btn btn-dark mt-3"
      >
        ← Volver al inventario
      </Link>

      <p className="text-secondary small mt-4">
        Las ventas corresponden a compras simuladas
        guardadas en este navegador. No representan
        pagos reales.
      </p>

    </main>
  );
}

export default AdminVentas;