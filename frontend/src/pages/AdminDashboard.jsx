import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos.js";
import { obtenerResumenDashboard } from "../utils/dashboardApi.js";

// Los indicadores, ventas y alertas provienen del backend MySQL.
function formatearPrecio(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CL")}`;
}

function AdminDashboard({ usuario }) {
  // El token procede del login JWT gestionado por App.jsx.
  const token = usuario?.token;
  const productosBase = useProductos();
  const [resumen, setResumen] = useState(null);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const [seccionAbierta, setSeccionAbierta] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();

    if (!token) {
      setResumen(null);
      setEstado("error");
      setError("No hay una sesión JWT válida. Cierra sesión e inicia nuevamente.");
      return () => controlador.abort();
    }

    setEstado("cargando");
    setError("");

    obtenerResumenDashboard(token, controlador.signal)
      .then((datos) => {
        if (controlador.signal.aborted) return;
        setResumen(datos);
        setEstado("listo");
      })
      .catch((fallo) => {
        if (controlador.signal.aborted) return;
        setResumen(null);
        setEstado("error");
        setError(fallo.message || "No se pudo consultar el dashboard.");
      });

    return () => controlador.abort();
  }, [token, intento]);

  const alertas = resumen?.alertas ?? [];
  const ingresosTotales = resumen?.ingresosTotales ?? 0;
  const totalVentas = resumen?.ventasRealizadas ?? 0;
  const mostrarValor = (valor) => estado === "listo" ? valor : "—";

  const abrirSeccion = (seccion) => {
    setSeccionAbierta((actual) =>
      actual === seccion ? null : seccion
    );
  };

  const indicadores = [
    {
      id: "productos",
      nombre: "Productos registrados",
      valor: mostrarValor(resumen?.productosRegistrados),
      icono: "📦",
      color: "#1769e9",
      texto: "#ffffff",
    },
    {
      id: "alertas",
      nombre: "Alertas de stock crítico",
      valor: mostrarValor(resumen?.alertasStockCritico),
      icono: "⚠️",
      color: "#f3b500",
      texto: "#332500",
    },
    {
      id: "usuarios",
      nombre: "Usuarios registrados",
      valor: mostrarValor(resumen?.usuariosRegistrados),
      icono: "👥",
      color: "#188553",
      texto: "#ffffff",
    },
    {
      id: "ventas",
      nombre: "Ventas realizadas",
      valor: mostrarValor(resumen?.ventasRealizadas),
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

      {estado === "cargando" && (
        <div className="alert alert-info" role="status">
          Consultando las estadísticas del servidor...
        </div>
      )}

      {estado === "error" && (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{error}</p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setIntento((n) => n + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

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
                        {producto.stock ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Link to="/admin/productos" className="btn btn-primary">
                Crear, editar y eliminar productos →
              </Link>
              <Link to="/admin/inventario" className="btn btn-dark">
                Gestionar inventario por talla →
              </Link>
            </div>
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

            {estado !== "listo" ? (
              <p className="text-secondary">
                No hay datos de inventario disponibles. Comprueba la conexión.
              </p>
            ) : alertas.length === 0 ? (
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

           
          <p className="text-secondary">
            Consulta los usuarios registrados en la tienda,
            sus correos electrónicos y los roles asignados.
          </p>

          <Link
            to="/admin/usuarios"
            className="btn btn-success fw-bold"
          >
            👥 Ver usuarios registrados →
          </Link>
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
              {mostrarValor(totalVentas)}
            </p>

            <p>
              <strong>Ingresos simulados:</strong>{" "}
              {estado === "listo" ? formatearPrecio(ingresosTotales) : "—"}
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
            <Link to="/admin/productos" className="btn btn-primary">
              📦 Gestionar productos
            </Link>
            <Link
              to="/admin/usuarios"
              className="btn btn-primary"
            >
              👥 Administrar usuarios
            </Link>

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
        Indicadores y alertas consultados desde MySQL mediante la API.
        Los módulos de usuarios, historial de ventas e inventario
        son pantallas independientes pendientes de revisión.
      </p>
    </main>
  );
}

export default AdminDashboard;