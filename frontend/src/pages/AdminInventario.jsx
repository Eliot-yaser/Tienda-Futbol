
import { useEffect, useMemo, useState } from "react";
import { useProductos } from "../hooks/useProductos.js";
import {
  obtenerInventarioAdmin,
  actualizarTallasAdmin,
  reponerInventarioAdmin,
} from "../utils/inventarioAdminApi.js";

const STOCK_MAXIMO = 4294967295;

// Convertir las existencias recibidas desde MySQL
// al formato utilizado por los campos de React.
function obtenerCantidades(inventario) {
  return Object.fromEntries(
    (inventario.tallas ?? []).map((item) => [
      item.talla,
      String(item.stock),
    ])
  );
}

function AdminInventario({ usuario }) {
  const productosBase = useProductos();

  // Utilizar solo productos que tengan un ID de MySQL.
  const productosMysql = useMemo(
    () =>
      productosBase.filter(
        (item) =>
          Number.isSafeInteger(Number(item.idProducto)) &&
          Number(item.idProducto) > 0
      ),
    [productosBase]
  );

  const [codigoSeleccionado, setCodigoSeleccionado] = useState("");
  const [inventario, setInventario] = useState(null);
  const [cantidades, setCantidades] = useState({});
  const [cantidadReposicion, setCantidadReposicion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [operando, setOperando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Seleccionar el primer producto cuando llegue el catalogo.
  useEffect(() => {
    if (productosMysql.length === 0) return;

    setCodigoSeleccionado((actual) =>
      productosMysql.some((item) => item.codigo === actual)
        ? actual
        : productosMysql[0].codigo
    );
  }, [productosMysql]);

  const producto = productosMysql.find(
    (item) => item.codigo === codigoSeleccionado
  );

  const idProducto = producto?.idProducto;
  const codigoProducto = producto?.codigo;

  // Consultar el inventario real al seleccionar un producto.
  useEffect(() => {
    if (!idProducto) return;

    const controller = new AbortController();

    async function cargarInventario() {
      setCargando(true);
      setInventario(null);
      setCantidades({});
      setError("");
      setMensaje("");

      try {
        const datos = await obtenerInventarioAdmin(
          idProducto,
          usuario?.token,
          controller.signal
        );

        if (datos.codigo !== codigoProducto) {
          throw new Error(
            "El producto recibido no coincide con el seleccionado."
          );
        }

        if (!controller.signal.aborted) {
          setInventario(datos);
          setCantidades(obtenerCantidades(datos));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message || "No se pudo consultar el inventario."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarInventario();

    return () => controller.abort();
  }, [idProducto, codigoProducto, usuario?.token]);

  function cambiarProducto(codigo) {
    if (operando) return;

    setCodigoSeleccionado(codigo);
    setCantidadReposicion("");
    setMensaje("");
    setError("");
    setInventario(null);
  }

  function cambiarStock(talla, valor) {
    setCantidades((anterior) => ({
      ...anterior,
      [talla]: valor,
    }));

    setMensaje("");
    setError("");
  }

  const tallas = inventario?.tallas ?? [];

  // Calcular el total de unidades que aparecen en el formulario.
  const totalAsignado = tallas.reduce((total, item) => {
    const cantidad = Number(cantidades[item.talla]);

    return total + (Number.isFinite(cantidad) ? cantidad : 0);
  }, 0);

  const stockTotal = Number(inventario?.stockTotal ?? 0);
  const sinAsignar = stockTotal - totalAsignado;

  const hayCantidadInvalida = tallas.some((item) => {
    const valor = String(cantidades[item.talla] ?? "");

    if (!/^\d+$/.test(valor)) return true;

    const numero = Number(valor);

    return (
      !Number.isSafeInteger(numero) ||
      numero < 0 ||
      numero > STOCK_MAXIMO
    );
  });

  const superaStock = totalAsignado > stockTotal;

  const puedeGuardar =
    inventario !== null &&
    tallas.length > 0 &&
    !hayCantidadInvalida &&
    !superaStock &&
    !cargando &&
    !operando;

  // Guardar cantidades por talla directamente en MySQL.
  async function guardarCambios() {
    if (!puedeGuardar) {
      setError("Revisa las cantidades antes de guardar.");
      return;
    }

    setOperando(true);
    setError("");
    setMensaje("");

    try {
      const cantidadesActualizadas = Object.fromEntries(
        tallas.map((item) => [
          item.talla,
          Number(cantidades[item.talla]),
        ])
      );

      // Comprobar si hubo cambios desde que se cargo el formulario.
      const actual = await obtenerInventarioAdmin(
        inventario.idProducto,
        usuario?.token
      );

      const huboCambios =
        Number(actual.stockTotal) !== Number(inventario.stockTotal) ||
        actual.tallas.length !== tallas.length ||
        actual.tallas.some((item) => {
          const anterior = tallas.find(
            (talla) => talla.talla === item.talla
          );

          return (
            !anterior ||
            Number(anterior.stock) !== Number(item.stock)
          );
        });

      if (huboCambios) {
        setInventario(actual);
        setCantidades(obtenerCantidades(actual));

        throw new Error(
          "El inventario cambio mientras lo editabas. " +
          "Se actualizaron las cantidades; revisalas antes de guardar."
        );
      }

      const resultado = await actualizarTallasAdmin(
        inventario.idProducto,
        cantidadesActualizadas,
        usuario?.token
      );

      setInventario(resultado);
      setCantidades(obtenerCantidades(resultado));
      setMensaje("¡Existencias por talla guardadas en MySQL!");
    } catch (err) {
      setError(err.message || "No se pudieron guardar las tallas.");
    } finally {
      setOperando(false);
    }
  }

  // Registrar una reposicion directamente en MySQL.
  async function reponerStock() {
    const valor = cantidadReposicion.trim();
    const cantidad = Number(valor);

    if (
      !/^[1-9]\d*$/.test(valor) ||
      !Number.isSafeInteger(cantidad) ||
      cantidad > STOCK_MAXIMO
    ) {
      setError(
        "Ingresa una cantidad entera mayor que cero y valida."
      );
      setMensaje("");
      return;
    }

    if (!inventario || operando) return;

    setOperando(true);
    setError("");
    setMensaje("");

    try {
      const resultado = await reponerInventarioAdmin(
        inventario.idProducto,
        cantidad,
        usuario?.token
      );

      setInventario(resultado);
      setCantidades(obtenerCantidades(resultado));
      setCantidadReposicion("");

      setMensaje(
        `¡Reposicion exitosa! Se agregaron ${cantidad} unidades en MySQL.`
      );
    } catch (err) {
      setError(err.message || "No se pudo registrar la reposicion.");
    } finally {
      setOperando(false);
    }
  }

  return (
    <main className="container py-5">
      {/* Encabezado */}
      <div className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>⚙️ Administración de inventario</h1>
        <p className="mb-0">
          Gestiona las existencias reales de Rey del Balón.
        </p>
      </div>

      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 mb-4">Seleccionar producto</h2>

          {/* Selector */}
          {productosMysql.length === 0 ? (
            <div className="alert alert-warning">
              No hay productos disponibles con ID de MySQL.
              Comprueba que el backend y el catálogo estén funcionando.
            </div>
          ) : (
            <select
              className="form-select mb-4"
              value={codigoSeleccionado}
              onChange={(e) => cambiarProducto(e.target.value)}
              disabled={operando}
            >
              {productosMysql.map((item) => (
                <option key={item.idProducto} value={item.codigo}>
                  {item.codigo} - {item.nombre}
                </option>
              ))}
            </select>
          )}

          {/* Estado de carga */}
          {cargando && (
            <div className="alert alert-info">
              Cargando inventario desde MySQL...
            </div>
          )}

          {/* Informacion del producto */}
          {inventario && producto && !cargando && (
            <>
              <div className="row g-4 mb-4">
                <div className="col-md-4 text-center">
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="img-fluid"
                      style={{
                        maxHeight: "220px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                <div className="col-md-8">
                  <h3 className="h5">{inventario.nombre}</h3>

                  <p>
                    <strong>Stock total:</strong>{" "}
                    {inventario.stockTotal}
                  </p>

                  <p>
                    <strong>Stock crítico:</strong>{" "}
                    {inventario.stockCritico}
                  </p>

                  <p>
                    <strong>Unidades asignadas:</strong>{" "}
                    {totalAsignado}
                  </p>

                  <p>
                    <strong>Unidades sin asignar a tallas:</strong>{" "}
                    <span
                      className={
                        superaStock
                          ? "text-danger fw-bold"
                          : "text-success fw-bold"
                      }
                    >
                      {sinAsignar}
                    </span>
                  </p>
                </div>
              </div>

              {/* Existencias por talla */}
              {tallas.length > 0 ? (
                <>
                  <h3 className="h5 mb-3">
                    Existencias por talla
                  </h3>

                  <div className="row g-3">
                    {tallas.map((item) => (
                      <div
                        className="col-6 col-md-3"
                        key={item.idProductoTalla}
                      >
                        <label
                          htmlFor={`stock-${item.talla}`}
                          className="form-label fw-bold"
                        >
                          Talla {item.talla}
                        </label>

                        <input
                          id={`stock-${item.talla}`}
                          type="number"
                          min="0"
                          step="1"
                          className="form-control"
                          value={cantidades[item.talla] ?? ""}
                          onChange={(e) =>
                            cambiarStock(item.talla, e.target.value)
                          }
                          disabled={operando}
                        />
                      </div>
                    ))}
                  </div>

                  {hayCantidadInvalida && (
                    <div
                      className="alert alert-danger mt-3"
                      role="alert"
                    >
                      Las cantidades deben ser números enteros
                      mayores o iguales a cero.
                    </div>
                  )}

                  {superaStock && !hayCantidadInvalida && (
                    <div
                      className="alert alert-danger mt-3"
                      role="alert"
                    >
                      Has superado el stock disponible por{" "}
                      <strong>{-sinAsignar} unidades</strong>.
                    </div>
                  )}

                  {!hayCantidadInvalida && !superaStock && (
                    <p className="text-success mt-3">
                      ✅ Puedes asignar{" "}
                      <strong>{sinAsignar} unidades más</strong>.
                    </p>
                  )}

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
                    {operando
                      ? "Procesando..."
                      : "💾 Guardar cambios"}
                  </button>
                </>
              ) : (
                <div className="alert alert-info">
                  Este producto no utiliza tallas. Puedes gestionar
                  sus existencias mediante la reposición de stock.
                </div>
              )}

              {/* Reposicion */}
              <div className="border rounded-3 p-4 mt-5">
                <h3 className="h5 fw-bold mb-2">
                  📦 Reponer stock
                </h3>

                <p className="text-secondary">
                  Registra nuevas unidades directamente en MySQL.
                  Si el producto tiene tallas, después podrás
                  distribuir las unidades recibidas.
                </p>

                <label
                  htmlFor="cantidad-reposicion"
                  className="form-label fw-bold"
                >
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
                    disabled={operando}
                  />

                  <button
                    type="button"
                    className="btn btn-success fw-bold"
                    onClick={reponerStock}
                    disabled={operando}
                  >
                    {operando
                      ? "Procesando..."
                      : "📦 Registrar reposición"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Mensajes */}
          {error && (
            <div
              className="alert alert-danger mt-4"
              role="alert"
            >
              {error}
            </div>
          )}

          {mensaje && (
            <div
              className="alert alert-success mt-4"
              role="status"
            >
              ✅ {mensaje}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminInventario;
