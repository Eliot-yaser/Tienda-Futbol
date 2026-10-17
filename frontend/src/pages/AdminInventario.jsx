import { useState } from "react";
import productosBase from "../data/productos";
import { obtenerTallasPorCategoria } from "../utils/tallas";
import { cargarInventario, guardarInventario } from "../utils/inventario";

// Productos que requieren selección de talla
const productosConTallas = productosBase.filter(
  (producto) => obtenerTallasPorCategoria(producto.categoria).length > 0,
);

function AdminInventario() {
  const codigoInicial = productosConTallas[0]?.codigo ?? "";

  const [codigoSeleccionado, setCodigoSeleccionado] = useState(codigoInicial);

  const [cantidades, setCantidades] = useState(() => {
    const inventario = cargarInventario();
    return inventario[codigoInicial] ?? {};
  });

  const [cantidadReposicion, setCantidadReposicion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Buscar el producto seleccionado
  const producto = productosConTallas.find(
    (item) => item.codigo === codigoSeleccionado,
  );

  if (!producto) {
    return (
      <main className="container py-5">
        <p>No hay productos disponibles.</p>
      </main>
    );
  }

  // Obtener tallas
  const tallas = obtenerTallasPorCategoria(producto.categoria);

  // Leer inventario guardado
  const inventarioGuardado = cargarInventario();

  // Usar stock actualizado si existe
  const stockTotalActual =
    inventarioGuardado[producto.codigo]?._stockTotal ?? producto.stock;

  // Calcular unidades asignadas
  const totalAsignado = tallas.reduce(
    (total, talla) => total + (Number(cantidades[talla]) || 0),
    0,
  );

  // Calcular unidades disponibles para asignar
  const sinAsignar = stockTotalActual - totalAsignado;

  // Detectar cantidades incorrectas
  const hayCantidadInvalida = tallas.some((talla) => {
    const valor = cantidades[talla];

    if (valor === undefined || valor === "") {
      return false;
    }

    const numero = Number(valor);

    return !Number.isSafeInteger(numero) || numero < 0;
  });

  // Detectar si las cantidades superan el stock
  const superaStock = totalAsignado > stockTotalActual;

  // Decidir si podemos guardar
  const puedeGuardar = !hayCantidadInvalida && !superaStock;

  // Cambiar de producto
  const cambiarProducto = (codigo) => {
    const inventario = cargarInventario();

    setCodigoSeleccionado(codigo);
    setCantidades(inventario[codigo] ?? {});
    setCantidadReposicion("");
    setMensaje("");
    setError("");
  };

  // Modificar cantidad de una talla
  const cambiarStock = (talla, valor) => {
    setCantidades((anterior) => ({
      ...anterior,
      [talla]: valor,
    }));

    setMensaje("");
    setError("");
  };

  // Guardar existencias por talla
  const guardarCambios = () => {
    if (!puedeGuardar) {
      setError("Revisa las cantidades antes de guardar.");
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

    const datosAnteriores = inventario[codigoSeleccionado] ?? {};

    // Conservar metadatos como _stockTotal
    const datosActualizados = {
      ...datosAnteriores,
    };

    // Quitar las tallas anteriores
    tallas.forEach((talla) => {
      delete datosActualizados[talla];
    });

    // Incorporar las tallas nuevas
    Object.assign(datosActualizados, stockPorTalla);

    // Comprobar otra vez el stock guardado
    const limiteActual = datosAnteriores._stockTotal ?? producto.stock;

    if (totalAsignado > limiteActual) {
      setError("El inventario cambió. Revisa el stock disponible.");
      return;
    }

    guardarInventario({
      ...inventario,
      [codigoSeleccionado]: datosActualizados,
    });

    setError("");
    setMensaje("¡Inventario guardado correctamente!");
  };

  // Registrar una reposición de stock
  const reponerStock = () => {
    const cantidad = Number(cantidadReposicion);

    if (
      cantidadReposicion.trim() === "" ||
      !Number.isSafeInteger(cantidad) ||
      cantidad <= 0
    ) {
      setError("Ingresa una cantidad de reposición entera y mayor que cero.");
      setMensaje("");
      return;
    }

    const inventario = cargarInventario();

    const datosAnteriores = inventario[codigoSeleccionado] ?? {};

    const totalAnterior = datosAnteriores._stockTotal ?? producto.stock;

    const nuevoTotal = totalAnterior + cantidad;

    if (!Number.isSafeInteger(nuevoTotal)) {
      setError("La cantidad de reposición es demasiado grande.");
      return;
    }

    // Aumentar el stock total sin modificar las tallas
    guardarInventario({
      ...inventario,
      [codigoSeleccionado]: {
        ...datosAnteriores,
        _stockTotal: nuevoTotal,
      },
    });

    setCantidadReposicion("");
    setError("");

    setMensaje(`¡Reposición exitosa! Se agregaron ${cantidad} unidades.`);
  };

  return (
    <main className="container py-5">
      {/* Encabezado */}
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>⚙️ Administración de inventario</h1>

        <p className="mb-0">
          Gestiona las existencias por talla de Rey del Balón.
        </p>
      </div>

      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 mb-4">Seleccionar producto</h2>

          {/* Selector de productos */}
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

          {/* Información del producto */}
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
                <strong>Stock total:</strong> {stockTotalActual}
              </p>

              <p>
                <strong>Stock crítico:</strong> {producto.stockCritico}
              </p>

              <p>
                <strong>Unidades asignadas:</strong> {totalAsignado}
              </p>

              <p>
                <strong>Unidades sin asignar:</strong>{" "}
                <span
                  className={
                    superaStock ? "text-danger fw-bold" : "text-success fw-bold"
                  }
                >
                  {sinAsignar}
                </span>
              </p>
            </div>
          </div>

          {/* Existencias por talla */}
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
                  onChange={(e) => cambiarStock(talla, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Validación inmediata */}
          {hayCantidadInvalida && (
            <div className="alert alert-danger mt-3" role="alert">
              ⚠️ Las cantidades deben ser números enteros mayores o iguales a
              cero.
            </div>
          )}

          {superaStock && !hayCantidadInvalida && (
            <div className="alert alert-danger mt-3" role="alert">
              ⚠️ Has superado el stock disponible por{" "}
              <strong>{-sinAsignar} unidades</strong>. Corrige las cantidades o
              realiza una reposición.
            </div>
          )}

          {!hayCantidadInvalida && !superaStock && (
            <p className="text-success mt-3">
              ✅ Puedes asignar <strong>{sinAsignar} unidades más</strong>.
            </p>
          )}

          {/* Guardar tallas */}
          <button
            type="button"
            className="btn fw-bold mt-2"
            style={{
              backgroundColor: "#e11d48",
              color: "white",
            }}
            onClick={guardarCambios}
            disabled={!puedeGuardar}
          >
            💾 Guardar cambios
          </button>

          {/* Reposición de inventario */}
          <div className="border rounded-3 p-4 mt-5">
            <h3 className="h5 fw-bold mb-2">📦 Reponer stock</h3>

            <p className="text-secondary">
              Registra nuevas unidades que llegan a la tienda. Después podrás
              distribuirlas entre las tallas.
            </p>

            <label htmlFor="cantidad-reposicion" className="form-label fw-bold">
              Unidades nuevas
            </label>

            <div className="d-flex gap-3 flex-wrap">
              <input
                id="cantidad-reposicion"
                type="number"
                min="1"
                step="1"
                className="form-control"
                style={{ maxWidth: "220px" }}
                placeholder="Ejemplo: 10"
                value={cantidadReposicion}
                onChange={(e) => {
                  setCantidadReposicion(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                className="btn btn-success fw-bold"
                onClick={reponerStock}
              >
                📦 Registrar reposición
              </button>
            </div>
          </div>

          {/* Mensajes */}
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
        </div>
      </section>
    </main>
  );
}

export default AdminInventario;
