import { Link, useNavigate } from "react-router-dom";
import ProductoCard from "../components/ProductoCard.jsx";
import { useProductos } from "../hooks/useProductos.js";
import { obtenerOfertas } from "../utils/catalogoExtra.js";
import "./CatalogoExtra.css";

export default function Ofertas() {
  const productos = useProductos();
  const navigate = useNavigate();
  const ofertas = obtenerOfertas(productos);

  return <main className="container py-5 rey-catalogo-extra">
    <header className="bg-dark text-white p-4 rounded-4 mb-4">
      <h1 className="fw-bold">Ofertas</h1>
      <p className="mb-0">Productos con descuentos publicados por la tienda.</p>
    </header>
    {ofertas.length === 0 ? <div className="alert alert-info" role="status">
      Todavía no hay productos con ofertas activas. Puedes explorar el catálogo completo.
    </div> : <>
      <p className="text-secondary">{ofertas.length} productos en oferta</p>
      <div className="row g-4">
        {ofertas.map((producto) => <div className="col-12 col-sm-6 col-lg-4" key={producto.codigo}>
          <ProductoCard {...producto} etiquetaBoton="Ver detalle"
            onAgregar={() => navigate(`/producto/${encodeURIComponent(producto.codigo)}`)} />
        </div>)}
      </div>
    </>}
    <Link className="btn btn-outline-dark mt-4" to="/productos">Ver todos los productos</Link>
  </main>;
}
