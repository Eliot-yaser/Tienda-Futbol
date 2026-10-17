
import { Link } from "react-router-dom";
import "./Carrito.css";

function Carrito({
  carrito,
  cantidadTotal,
  totalCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
}) {
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

            <Link to="/productos" className="carrito-volver">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive carrito-tabla-contenedor">
              <table className="carrito-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {carrito.map((producto, indice) => (
                    <tr key={producto.codigo}>
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

                      {/* Precio unitario */}
                      <td className="carrito-precio">
                        ${producto.precio.toLocaleString("es-CL")}
                      </td>

                      {/* Controles de cantidad */}
                      <td>
                        <div className="carrito-cantidad">
                          <button
                            type="button"
                            aria-label={`Disminuir cantidad de ${producto.nombre}`}
                            onClick={() =>
                              cambiarCantidad(producto.codigo, -1)
                            }
                            disabled={producto.cantidad === 1}
                          >
                            −
                          </button>

                          <span>{producto.cantidad}</span>

                          <button
                            type="button"
                            aria-label={`Aumentar cantidad de ${producto.nombre}`}
                            onClick={() =>
                              cambiarCantidad(producto.codigo, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="carrito-subtotal">
                        ${(
                          producto.precio * producto.cantidad
                        ).toLocaleString("es-CL")}
                      </td>

                      {/* Eliminar */}
                      <td>
                        <button
                          type="button"
                          className="carrito-eliminar"
                          onClick={() => eliminarDelCarrito(indice)}
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
              <Link to="/productos" className="carrito-seguir">
                ← Seguir comprando
              </Link>

              <h2>
                Total: ${totalCarrito.toLocaleString("es-CL")}
              </h2>
            </div>
          </>
        )}
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
