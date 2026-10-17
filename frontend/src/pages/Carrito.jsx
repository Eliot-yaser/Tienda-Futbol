import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Carrito.css";

function Carrito({
  carrito,
  cantidadTotal,
  totalCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  confirmarCompra,
}) {
  // Ventanas de confirmación
  const dialogVaciarRef = useRef(null);
  const dialogPagoRef = useRef(null);

  // Mensajes de compra
  const [errorCompra, setErrorCompra] = useState("");
  const [mensajeCompra, setMensajeCompra] = useState("");

  // Abrir confirmación para vaciar carrito
  const abrirConfirmacionVaciar = () => {
    dialogVaciarRef.current?.showModal();
  };

  // Cancelar vaciado
  const cancelarVaciado = () => {
    dialogVaciarRef.current?.close();
  };

  // Confirmar vaciado
  const confirmarVaciado = () => {
    vaciarCarrito();
    dialogVaciarRef.current?.close();
  };

  // Abrir confirmación de compra
  const abrirConfirmacionPago = () => {
    setErrorCompra("");
    dialogPagoRef.current?.showModal();
  };

  // Cancelar compra
  const cancelarCompra = () => {
    dialogPagoRef.current?.close();
    setErrorCompra("");
  };

  // Confirmar compra simulada
  const realizarCompra = () => {
    const resultado = confirmarCompra();

    if (resultado.exito) {
      setMensajeCompra(resultado.mensaje);
      setErrorCompra("");
      dialogPagoRef.current?.close();
    } else {
      setErrorCompra(resultado.mensaje);
    }
  };

  return (
    <>
      <main className="container py-5 carrito-pagina">
        <h1>Mi carrito de compras 🛒</h1>

        {/* Mensaje cuando una compra se completa */}
        {mensajeCompra && (
          <div
            className="alert alert-success mt-4"
            role="status"
          >
            <h2 className="h5 fw-bold">
              ✅ ¡Compra confirmada!
            </h2>

            <p className="mb-1">{mensajeCompra}</p>

            <p className="mb-0">
              Tu compra de demostración fue registrada
              y el inventario se actualizó.
            </p>
          </div>
        )}

        <p className="carrito-contador">
          Productos en el carrito: {cantidadTotal}
        </p>

        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <h2>Tu carrito está vacío</h2>

            <p>¡Explora nuestros productos de fútbol!</p>

            <Link
              to="/productos"
              className="carrito-volver"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            {/* Tabla del carrito */}
            <div className="table-responsive carrito-tabla-contenedor">
              <table className="carrito-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Talla</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {carrito.map((producto, indice) => (
                    <tr
                      key={`${producto.codigo}-${producto.talla ?? "unica"}`}
                    >
                      {/* Imagen y nombre */}
                      <td>
                        <div className="carrito-producto">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="carrito-imagen"
                          />

                          <span>{producto.nombre}</span>
                        </div>
                      </td>

                      {/* Talla */}
                      <td>
                        {producto.talla ?? "Única"}
                      </td>

                      {/* Precio */}
                      <td className="carrito-precio">
                        ${producto.precio.toLocaleString("es-CL")}
                      </td>

                      {/* Cantidad */}
                      <td>
                        <div className="carrito-cantidad">
                          <button
                            type="button"
                            aria-label={`Disminuir cantidad de ${producto.nombre}, talla ${producto.talla ?? "única"}`}
                            onClick={() =>
                              cambiarCantidad(
                                producto.codigo,
                                -1,
                                producto.talla ?? null
                              )
                            }
                            disabled={producto.cantidad === 1}
                          >
                            −
                          </button>

                          <span>{producto.cantidad}</span>

                          <button
                            type="button"
                            aria-label={`Aumentar cantidad de ${producto.nombre}, talla ${producto.talla ?? "única"}`}
                            onClick={() =>
                              cambiarCantidad(
                                producto.codigo,
                                1,
                                producto.talla ?? null
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="carrito-subtotal">
                        $
                        {(
                          producto.precio * producto.cantidad
                        ).toLocaleString("es-CL")}
                      </td>

                      {/* Eliminar */}
                      <td>
                        <button
                          type="button"
                          className="carrito-eliminar"
                          onClick={() =>
                            eliminarDelCarrito(indice)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            <div className="carrito-resumen">
              <div className="carrito-acciones">
                <Link
                  to="/productos"
                  className="carrito-seguir"
                >
                  ← Seguir comprando
                </Link>

                <button
                  type="button"
                  className="carrito-boton-vaciar"
                  onClick={abrirConfirmacionVaciar}
                >
                  🗑️ Vaciar carrito
                </button>

                <button
                  type="button"
                  className="carrito-boton-pago"
                  onClick={abrirConfirmacionPago}
                >
                  💳 Proceder al Pago
                </button>
              </div>

              <h2>
                Total: ${totalCarrito.toLocaleString("es-CL")}
              </h2>
            </div>
          </>
        )}

        {/* Ventana para vaciar carrito */}
        <dialog
          ref={dialogVaciarRef}
          className="carrito-dialogo"
          aria-labelledby="titulo-vaciar"
          aria-describedby="descripcion-vaciar"
        >
          <div className="carrito-dialogo-contenido">
            <div className="carrito-dialogo-icono">
              🗑️
            </div>

            <h2 id="titulo-vaciar">
              ¿Vaciar el carrito?
            </h2>

            <p id="descripcion-vaciar">
              Se eliminarán todos los productos
              y las tallas seleccionadas.
              ¿Deseas continuar?
            </p>

            <div className="carrito-dialogo-botones">
              <button
                type="button"
                className="carrito-dialogo-cancelar"
                onClick={cancelarVaciado}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="carrito-dialogo-confirmar"
                onClick={confirmarVaciado}
              >
                Sí, vaciar carrito
              </button>
            </div>
          </div>
        </dialog>

        {/* Ventana de confirmación de compra */}
        <dialog
          ref={dialogPagoRef}
          className="carrito-dialogo carrito-dialogo-pago"
          aria-labelledby="titulo-pago"
          aria-describedby="descripcion-pago"
        >
          <div className="carrito-dialogo-contenido">
            <div className="carrito-dialogo-icono">
              🛍️
            </div>

            <h2 id="titulo-pago">
              ¿Confirmar compra?
            </h2>

            <p id="descripcion-pago">
              Estás a punto de confirmar una compra
              de demostración.
              Se descontarán las unidades del inventario.
              No se realizará ningún cobro real.
            </p>

            <h3 className="h4 fw-bold mb-4">
              Total: ${totalCarrito.toLocaleString("es-CL")}
            </h3>

            {/* Error por falta de stock */}
            {errorCompra && (
              <div
                className="alert alert-danger text-start"
                role="alert"
              >
                ⚠️ {errorCompra}
              </div>
            )}

            <div className="carrito-dialogo-botones">
              <button
                type="button"
                className="carrito-dialogo-cancelar"
                onClick={cancelarCompra}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="carrito-dialogo-confirmar"
                onClick={realizarCompra}
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </dialog>
      </main>

      <footer className="carrito-footer">
        <p>
          © 2026 Rey Del Balon - Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
}

export default Carrito;