import Navbar from "./components/Navbar";
import ProductoCard from "./components/ProductoCard";
import productosBase from "./data/productos";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";

function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  // Recuperar el carrito desde localStorage
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito-react");
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      return [];
    }
  });

  // Guardar el carrito cuando cambie
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
  const categorias = [
    "Todas",
    ...new Set(productosBase.map((producto) => producto.categoria)),
  ];

  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productosBase
      : productosBase.filter(
          (producto) => producto.categoria === categoriaSeleccionada,
        );

  return (
    <>
      <Navbar />

      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Inicio />} />

        {/* Página de productos */}
        <Route
          path="/productos"
          element={
            <main className="container py-5">
              <h1>Bienvenido a Rey del Balón</h1>

              <p>
                Encuentra las mejores camisetas, balones y accesorios de fútbol.
              </p>

              <p className="fw-bold">
                🛒 Productos en el carrito: {cantidadTotal}
              </p>

              {/* Catálogo de productos */}
              <section id="productos" className="mt-5">
                <h2>Nuestros productos</h2>

                {/* Filtro de categorías */}
                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">
                    Filtrar por categoría:
                  </label>

                  <select
                    id="categoria"
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-3 mt-3">
                  {productosFiltrados.map((producto) => (
                    <div
                      className="col-12 col-md-6 col-lg-4"
                      key={producto.codigo}
                    >
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
          }
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              cantidadTotal={cantidadTotal}
              totalCarrito={totalCarrito}
              cambiarCantidad={cambiarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
            />
          }
        />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </>
  );
}

export default App;
