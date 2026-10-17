import Navbar from "./components/Navbar";
import ProductoCard from "./components/ProductoCard";
import productosBase from "./data/productos";
import { useState } from "react";

function App() {
  const [carrito, setCarrito] = useState([]);
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoAnterior) => [...carritoAnterior, producto]);
  };

  return (
    <>
      <Navbar />
      <main id="inicio" className="container py-5">
        <h1>Bienvenido a Rey del Balón</h1>
        <p>Encuentra las mejores camisetas, balones y accesorios de fútbol.</p>
        <p className="fw-bold">🛒 Productos en el carrito: {carrito.length}</p>
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
