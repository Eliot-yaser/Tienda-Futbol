
function Carrito({
  carrito,
  cantidadTotal,
  totalCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
}) {
  return (
    <main className="container py-5">
      <h1>Mi carrito de compras 🛒</h1>

      <p>Productos en el carrito: {cantidadTotal}</p>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group">
            {carrito.map((producto, indice) => (
              <li
                key={producto.codigo}
                className="list-group-item d-flex justify-content-between align-items-center gap-3 flex-wrap"
              >
                <span>
                  {producto.nombre} - $
                  {producto.precio.toLocaleString("es-CL")} c/u
                </span>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      cambiarCantidad(producto.codigo, -1)
                    }
                    disabled={producto.cantidad === 1}
                  >
                    -
                  </button>

                  <span>{producto.cantidad}</span>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      cambiarCantidad(producto.codigo, 1)
                    }
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarDelCarrito(indice)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-4">
            Total: ${totalCarrito.toLocaleString("es-CL")}
          </h3>
        </>
      )}
    </main>
  );
}

export default Carrito;
