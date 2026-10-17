import { Link } from "react-router-dom";
import "./ProductoCard.css";

function ProductoCard({ codigo, nombre, precio, imagen, onAgregar }) {
  return (
    <article className="card h-100 rey-producto">
      <img
        src={imagen}
        className="card-img-top rey-producto-img"
        alt={nombre}
      />

      <div className="card-body d-flex flex-column text-center">
        <h3 className="card-title h5">
          {codigo ? (
            <Link to={`/producto/${codigo}`} className="rey-producto-link">
              {nombre}
            </Link>
          ) : (
            nombre
          )}
        </h3>

        <p className="card-text rey-producto-precio">
          Precio: ${precio.toLocaleString("es-CL")}
        </p>

        <button
          type="button"
          className="rey-producto-boton mt-auto"
          onClick={onAgregar}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductoCard;
