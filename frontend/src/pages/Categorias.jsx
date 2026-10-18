import { Link, useParams, useNavigate } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import { useProductos } from "../hooks/useProductos.js";
import { obtenerCategorias, productosDeCategoria } from "../utils/catalogoExtra.js";
import "./CatalogoExtra.css";

export default function Categorias() {
  const productos = useProductos();
  const navigate = useNavigate();
  const { categoria } = useParams();
  const categorias = obtenerCategorias(productos);
  const actual = categorias.find((item) => item.nombre === categoria);
  const visibles = categoria ? productosDeCategoria(productos, categoria) : [];

  return <main className="container py-5 rey-catalogo-extra">
    <header className="bg-dark text-white p-4 rounded-4 mb-4">
      <h1 className="fw-bold">Categorías</h1>
      <p className="mb-0">Encuentra tu equipamiento de fútbol según el tipo de producto.</p>
    </header>
    <nav aria-label="Categorías disponibles" className="rey-categorias-grid mb-4">
      {categorias.map((item) => <Link key={item.nombre}
        className={`rey-categoria-card ${actual?.nombre === item.nombre ? "actual" : ""}`}
        to={`/categorias/${encodeURIComponent(item.nombre)}`}>
        {item.imagen && <img alt="" src={item.imagen} loading="lazy" />}
        <span><strong>{item.nombre}</strong><small>{item.cantidad} productos</small></span>
      </Link>)}
    </nav>
    {categorias.length === 0 && <p className="alert alert-info">Aún no hay categorías disponibles.</p>}
    {categoria && !actual && <div className="alert alert-warning" role="alert">
      No encontramos esa categoría. Selecciona una de las categorías disponibles.
    </div>}
    {actual && <section>
      <h2 className="h3 fw-bold mb-3">{actual.nombre} ({visibles.length})</h2>
      <div className="row g-4">
        {visibles.map((producto) => <div className="col-12 col-sm-6 col-lg-4" key={producto.codigo}>
          <ProductoCard {...producto} etiquetaBoton="Ver detalle"
            onAgregar={() => navigate(`/producto/${encodeURIComponent(producto.codigo)}`)} />
        </div>)}
      </div>
    </section>}
    {!categoria && categorias.length > 0 && <p className="text-secondary">
      Selecciona una categoría para ver sus productos.
    </p>}
    <Link to="/productos" className="btn btn-outline-dark mt-4">Ver todos los productos</Link>
  </main>;
}
