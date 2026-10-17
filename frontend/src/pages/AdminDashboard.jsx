import { useState } from "react";
import { Link } from "react-router-dom";
import productosBase from "../data/productos";
import { cargarInventario } from "../utils/inventario";
import { obtenerTallasPorCategoria } from "../utils/tallas";

// Recuperar el historial de ventas
function cargarVentas() {
  try {
    const datos = localStorage.getItem("rey-balon-ventas");
    const ventas = datos ? JSON.parse(datos) : [];

    return Array.isArray(ventas) ? ventas : [];
  } catch {
    return [];
  }
}

// Mostrar los precios en pesos chilenos
function formatearPrecio(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CL")}`;
}

// Obtener el stock total vigente de un producto
function obtenerStockTotal(producto, inventario) {
  return (
    inventario[producto.codigo]?._stockTotal ??
    producto.stock
  );
}

// Detectar productos o tallas con stock crítico
function obtenerAlertas(inventario) {
  const alertas = [];

  productosBase.forEach((producto) => {
    const datos = inventario[producto.codigo] ?? {};
    const tallas = obtenerTallasPorCategoria(
      producto.categoria
    );

    const tallasConfiguradas = tallas.filter(
      (talla) =>
        Number.isSafeInteger(datos[talla]) &&
        datos[talla] >= 0
    );

    // Revisar cada talla que tenga inventario configurado
    if (tallasConfiguradas.length > 0) {
      tallasConfiguradas.forEach((talla) => {
        if (datos[talla] <= producto.stockCritico) {
          alertas.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            talla,
            stock: datos[talla],
            limite: producto.stockCritico,
          });
        }
      });

      return;
    }

    // Productos de talla única o sin desglose configurado
    const stockTotal = obtenerStockTotal(
      producto,
      inventario
    );

    if (
      Number.isSafeInteger(stockTotal) &&
      stockTotal <= producto.stockCritico
    ) {
      alertas.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        talla: "Total",
        stock: stockTotal,
        limite: producto.stockCritico,
      });
    }
  });

  return alertas;
}

function AdminDashboard() {
  const [inventario] = useState(cargarInventario);
  const [ventas] = useState(cargarVentas);

  // Controlar cuál sección está desplegada
  const [seccionAbierta, setSeccionAbierta] =
    useState(null);

  const alertas = obtenerAlertas(inventario);

  const ingresosTotales = ventas.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0
  );

  const abrirSeccion = (seccion) => {
    setSeccionAbierta((actual) =>
      actual === seccion ? null : seccion
    );
  };

  const indicadores = [
    {
      id: "productos",
      nombre: "Productos registrados",
      valor: productosBase.length,
      icono: "📦",
      color: "#1769e9",
      texto: "#ffffff",
    },
    {
      id: "alertas",
      nombre: "Alertas de stock crítico",
      valor: alertas.length,
      icono: "⚠️",
      color: "#f3b500",
      texto: "#332500",
    },
    {
      id: "usuarios",
      nombre: "Usuarios registrados",
      valor: "Pendiente",
      icono: "👥",
      color: "#188553",
      texto: "#ffffff",
    },
    {
      id: "ventas",
      nombre: "Ventas realizadas",
      valor: ventas.length,
      icono: "🧾",
      color: "#7040b9",
      texto: "#ffffff",
    },
  ];

  return (
    <main className="container py-5">

      {/* Encabezado */}
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>⚙️ Panel de Administración</h1>

        <p className="mb-0">
          Bienvenido al panel administrativo de Rey del Balón.
        </p>
      </div>

      {/* Indicadores principales */}
      <div className="row g-3 mb-4">
        {indicadores.map((indicador) => (
          <div
            className="col-12 col-sm-6 col-lg-3"
            key={indicador.id}
          >
            <button
              type="button"
              className="w-100 h-100 border-0 rounded-3 p-4 text-start shadow-sm"
              style={{
                backgroundColor: indicador.color,
                color: indicador.texto,
              }}
              onClick={() => abrirSeccion(indicador.id)}
              aria-expanded={
                seccionAbierta === indicador.id
              }
            >
              <span className="fs-3">
                {indicador.icono}
              </span>

              <h2 className="h6 mt-3">
                {indicador.nombre}
              </h2>

              <p className="fs-3 fw-bold mb-2">
                {indicador.valor}
              </p>

              <span className="small fw-bold">
                {seccionAbierta === indicador.id
                  ? "▲ Ocultar información"
                  : "▼ Ver información"}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Gestión de productos */}
      {seccionAbierta === "productos" && (
        <section
          className="card border-0 shadow-sm mb-4"
          id="admin-seccion-productos"
        >
          <div className="card-body p-4">
            <h2 className="h4 fw-bold mb-3">
              📦 Productos registrados
            </h2>

            <p className="text-secondary">
              Consulta el catálogo y sus existencias actuales.
            </p>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock total</th>
                  </tr>
                </thead>

                <tbody>
                  {productosBase.map((producto) => (
                    <tr key={producto.codigo}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        {obtenerStockTotal(
                          producto,
                          inventario
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              to="/admin/inventario"
              className="btn btn-dark mt-3"
            >
              Gestionar inventario por talla →
            </Link>
          </div>
        </section>
      )}

      {/* Alertas de stock crítico */}
      {seccionAbierta === "alertas" && (
        <section
          className="card border-0 shadow-sm mb-4"
          id="admin-seccion-alertas"
        >
          <div className="card-body p-4">
            <h2 className="h4 fw-bold mb-3">
              ⚠️ Alertas de inventario
            </h2>

            {alertas.length === 0 ? (
              <div className="alert alert-success">
                No se detectaron existencias bajo el
                límite crítico configurado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Talla</th>
                      <th>Stock</th>
                      <th>Límite crítico</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alertas.map((alerta) => (
                      <tr
                        key={`${alerta.codigo}-${alerta.talla}`}
                      >
                        <td>{alerta.nombre}</td>
                        <td>{alerta.talla}</td>
                        <td className="text-danger fw-bold">
                          {alerta.stock}
                        </td>
                        <td>{alerta.limite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-secondary small mt-3">
              Por ahora se utiliza el límite crítico
              del producto para las tallas configuradas.
            </p>

            <Link
              to="/admin/inventario"
              className="btn btn-warning fw-bold"
            >
              Revisar inventario →
            </Link>
          </div>
        </section>
      )}

      {/* Gestión de usuarios pendiente */}
      {seccionAbierta === "usuarios" && (
        <section
          className="card border-0 shadow-sm mb-4"
          id="admin-seccion-usuarios"
        >
          <div className="card-body p-4">
            <h2 className="h4 fw-bold">
              👥 Gestión de usuarios
            </h2>

            <p className="mb-0">
              Este módulo está pendiente de implementación.
              Más adelante recuperaremos los usuarios,
              sus roles y los controles de administración
              de la tienda original.
            </p>
          </div>
        </section>
      )}

      {/* Resumen de ventas */}
      {seccionAbierta === "ventas" && (
        <section
          className="card border-0 shadow-sm mb-4"
          id="admin-seccion-ventas"
        >
          <div className="card-body p-4">
            <h2 className="h4 fw-bold mb-3">
              🧾 Ventas realizadas
            </h2>

            <p>
              <strong>Ventas registradas:</strong>{" "}
              {ventas.length}
            </p>

            <p>
              <strong>Ingresos simulados:</strong>{" "}
              {formatearPrecio(ingresosTotales)}
            </p>

            <Link
              to="/admin/ventas"
              className="btn btn-success fw-bold"
            >
              Ver historial de ventas →
            </Link>
          </div>
        </section>
      )}

      {/* Accesos administrativos */}
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-3">
            Accesos rápidos
          </h2>

          <div className="d-flex flex-wrap gap-3">
            <Link
              to="/admin/inventario"
              className="btn btn-dark"
            >
              📦 Administrar inventario
            </Link>

            <Link
              to="/admin/ventas"
              className="btn btn-success"
            >
              🧾 Historial de ventas
            </Link>

            <Link
              to="/productos"
              className="btn btn-outline-dark"
            >
              ⚽ Ver tienda
            </Link>
          </div>
        </div>
      </section>

      <p className="text-secondary small mt-4">
        Panel de demostración. Los datos de ventas e
        inventario están guardados en este navegador.
      </p>
    </main>
  );
}

export default AdminDashboard;