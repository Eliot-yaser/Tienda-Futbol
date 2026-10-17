import Navbar from "./components/Navbar";
import ProductoCard from "./components/ProductoCard";
import productosBase from "./data/productos";
import { useState, useEffect } from "react";

function App() {
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito-react");

      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("carrito-react", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoAnterior) => {
      const existente = carritoAnterior.find(
        (item) => item.codigo === producto.codigo,
      );

      if (existente) {
        return carritoAnterior.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...carritoAnterior, { ...producto, cantidad: 1 }];
    });
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = (indiceAEliminar) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((_, indice) => indice !== indiceAEliminar),
    );
  };

  // Aumentar o disminuir cantidades
  const cambiarCantidad = (codigo, cambio) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.map((producto) =>
        producto.codigo === codigo
          ? {
              ...producto,
              cantidad: Math.max(1, producto.cantidad + cambio),
            }
          : producto,
      ),
    );
  };

  // Calcular el precio total
  const totalCarrito = carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);

  // Calcular la cantidad total de unidades
  const cantidadTotal = carrito.reduce((total, producto) => {
    return total + producto.cantidad;
  }, 0);

  return (
    <>
      <Navbar />

      <main id="inicio" className="container py-5">
        <h1>Bienvenido a Rey del Balón</h1>

        <p>Encuentra las mejores camisetas, balones y accesorios de fútbol.</p>

        <p className="fw-bold">🛒 Productos en el carrito: {cantidadTotal}</p>

        {carrito.length > 0 && (
          <div className="mt-4">
            <h2 className="h5">Tu carrito de compras</h2>

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
                      onClick={() => cambiarCantidad(producto.codigo, -1)}
                      disabled={producto.cantidad === 1}
                    >
                      -
                    </button>

                    <span>{producto.cantidad}</span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => cambiarCantidad(producto.codigo, 1)}
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

            <p className="fw-bold mt-3">
              Total de la compra: ${totalCarrito.toLocaleString("es-CL")}
            </p>
          </div>
        )}

        <section id="productos" className="mt-5">
          <h2>Nuestros productos</h2>

          <div className="row g-3 mt-3">
            {productosBase.slice(0, 6).map((producto) => (
              <div className="col-12 col-md-6 col-lg-4" key={producto.codigo}>
                <ProductoCard
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={producto.imagen}
                  onAgregar={() => agregarAlCarrito(producto)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
