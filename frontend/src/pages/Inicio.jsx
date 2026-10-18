
import { Link } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos.js";
import "./Inicio.css";

function Inicio({ onAgregar }) {
  const productosBase = useProductos();
  const categoriasDestacadas = ["Camisetas", "Calzado", "Balones"];

  const destacados = categoriasDestacadas
    .map((categoria) =>
      productosBase.find((producto) => producto.categoria === categoria)
    )
    .filter(Boolean);

  return (
    <main>
      {/* Portada con estadio */}
      <section className="inicio-hero">
        <div className="inicio-hero-contenido">
          <h1>Equípate como los Profesionales</h1>

          <p>
            Las mejores camisetas, botines y accesorios
            oficiales del fútbol mundial.
          </p>

          <Link to="/productos" className="inicio-boton">
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container py-5 inicio-destacados">
        <h2 className="text-center fw-bold mb-3">
          Productos Destacados
        </h2>

        <p className="text-center text-muted mb-4">
          Descubre algunos de nuestros productos favoritos.
        </p>

        <div className="row g-4">
          {destacados.map((producto) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={producto.codigo}
            >
              <ProductoCard
                codigo={producto.codigo}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                onAgregar={() => onAgregar(producto)}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Inicio;
