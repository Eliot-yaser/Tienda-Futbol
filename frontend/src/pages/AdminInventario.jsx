import { useState } from "react";
import productosBase from "../data/productos";
import { obtenerTallasPorCategoria } from "../utils/tallas";
import {
  cargarInventario,
  guardarInventario,
} from "../utils/inventario";

// Productos que tienen selección de tallas
const productosConTallas = productosBase.filter(
  (producto) =>
    obtenerTallasPorCategoria(producto.categoria).length > 0
);

function AdminInventario() {
  const codigoInicial = productosConTallas[0]?.codigo ?? "";

  const [codigoSeleccionado, setCodigoSeleccionado] =
    useState(codigoInicial);

  const [cantidades, setCantidades] = useState(() => {
    const inventario = cargarInventario();
    return inventario[codigoInicial] ?? {};
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const producto = productosConTallas.find(
    (item) => item.codigo === codigoSeleccionado
  );

  if (!producto) {
    return <p>No hay productos disponibles.</p>;
  }

  const tallas = obtenerTallasPorCategoria(producto.categoria);

  // Sumar las unidades asignadas a las tallas
  const totalAsignado = tallas.reduce(
    (total, talla) => total + (Number(cantidades[talla]) || 0),
    0
  );

  const sinAsignar = producto.stock - totalAsignado;

  // Cambiar el producto seleccionado
  const cambiarProducto = (codigo) => {
    const inventario = cargarInventario();

    setCodigoSeleccionado(codigo);
    setCantidades(inventario[codigo] ?? {});
    setMensaje("");
    setError("");
  };

  // Cambiar el stock de una talla
  const cambiarStock = (talla, valor) => {
    setCantidades((anterior) => ({
      ...anterior,
      [talla]: valor,
    }));

    setMensaje("");
    setError("");
  };

  // Guardar las cantidades
  const guardarCambios = () => {
    const cantidadesInvalidas = tallas.some((talla) => {
      const valor = cantidades[talla];

      return (
        valor !== undefined &&
        valor !== "" &&
        (!Number.isInteger(Number(valor)) || Number(valor) < 0)
      );
    });

    if (cantidadesInvalidas) {
      setError("Ingresa cantidades enteras mayores o iguales a cero.");
      return;
    }

    if (totalAsignado > producto.stock) {
      setError(
        `No puedes asignar más de ${producto.stock} unidades.`
      );
      return;
    }

    const stockPorTalla = {};

    tallas.forEach((talla) => {
      const valor = cantidades[talla];

      if (valor !== undefined && valor !== "") {
        stockPorTalla[talla] = Number(valor);
      }
    });

    const inventario = cargarInventario();

    guardarInventario({
      ...inventario,
      [codigoSeleccionado]: stockPorTalla,
    });

    setError("");
    setMensaje("¡Inventario guardado correctamente!");
  };

  return (
    <main className="container py-5">
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>⚙️ Administración de inventario</h1>
        <p className="mb-0">
          Gestiona las existencias por talla de Rey del Balón.
        </p>
      </div>

      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 mb-4">Seleccionar producto</h2>

          <select
            className="form-select mb-4"
            value={codigoSeleccionado}
            onChange={(e) => cambiarProducto(e.target.value)}
          >
            {productosConTallas.map((item) => (
              <option key={item.codigo} value={item.codigo}>
                {item.codigo} - {item.nombre}
              </option>
            ))}
          </select>

          <div className="row g-4 mb-4">
            <div className="col-md-4 text-center">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid"
                style={{
                  maxHeight: "220px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div className="col-md-8">
              <h3 className="h5">{producto.nombre}</h3>

              <p>
                <strong>Stock total:</strong> {producto.stock}
              </p>

              <p>
                <strong>Stock crítico:</strong>{" "}
                {producto.stockCritico}
              </p>

              <p>
                <strong>Unidades asignadas:</strong>{" "}
                {totalAsignado}
              </p>

              <p>
                <strong>Unidades sin asignar:</strong>{" "}
                {sinAsignar}
              </p>
            </div>
          </div>

          <h3 className="h5 mb-3">Existencias por talla</h3>

          <div className="row g-3">
            {tallas.map((talla) => (
              <div className="col-6 col-md-3" key={talla}>
                <label
                  htmlFor={`stock-${talla}`}
                  className="form-label fw-bold"
                >
                  Talla {talla}
                </label>

                <input
                  id={`stock-${talla}`}
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  placeholder="Sin asignar"
                  value={cantidades[talla] ?? ""}
                  onChange={(e) =>
                    cambiarStock(talla, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {sinAsignar < 0 && (
            <p className="text-danger fw-bold mt-3">
              Has superado el stock total del producto.
            </p>
          )}

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="alert alert-success mt-4" role="status">
              ✅ {mensaje}
            </div>
          )}

          <button
            type="button"
            className="btn mt-4 fw-bold"
            style={{
              backgroundColor: "#e11d48",
              color: "white",
            }}
            onClick={guardarCambios}
          >
            💾 Guardar cambios
          </button>
        </div>
      </section>
    </main>
  );
}

export default AdminInventario;