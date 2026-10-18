import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Carrito.css";

function Carrito({
  carrito,
  cantidadTotal,
  totalCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
}) {
  // Ventanas de confirmación
  const dialogVaciarRef = useRef(null);
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

  return (
    <>
      <main className="container py-5 carrito-pagina">
        <h1>Mi carrito de compras 🛒</h1>

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
              <table className="carrito-tabla" aria-label="Productos en el carrito">
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
                        <span className="carrito-etiqueta-movil" aria-hidden="true">Talla</span>
                        <span>{producto.talla ?? "Única"}</span>
                      </td>

                      {/* Precio */}
                      <td className="carrito-precio">
                        <span className="carrito-etiqueta-movil" aria-hidden="true">Precio</span>
                        <span>${producto.precio.toLocaleString("es-CL")}</span>
                      </td>

                      {/* Cantidad */}
                      <td>
                        <span className="carrito-etiqueta-movil" aria-hidden="true">Cantidad</span>
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
                        <span className="carrito-etiqueta-movil" aria-hidden="true">Subtotal</span>
                        <span>
                          ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                        </span>
                      </td>

                      {/* Eliminar */}
                      <td>
                        <span className="carrito-etiqueta-movil" aria-hidden="true">Acciones</span>
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

                <Link to="/checkout" className="carrito-boton-pago">
                  💳 Proceder al Pago
                </Link>
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