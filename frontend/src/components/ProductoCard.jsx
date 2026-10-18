import { Link } from "react-router-dom";
import "./ProductoCard.css";
import { porcentajeDescuento, esOfertaValida } from "../utils/catalogoExtra.js";

function ProductoCard({ codigo, nombre, precio, imagen, onAgregar,
  enOferta = false, precioAnterior = null, etiquetaBoton = "Agregar al carrito" }) {
  const oferta = { precio, enOferta, precioAnterior };
  const tieneDescuento = esOfertaValida(oferta);
  return (
    <article className="card h-100 rey-producto">
      <img
        src={imagen}
        className="card-img-top rey-producto-img"
        alt={nombre}
      />

      <div className="card-body d-flex flex-column text-center">
        {tieneDescuento && <span className="badge bg-danger align-self-center mb-2">
          Oferta -{porcentajeDescuento(oferta)}%
        </span>}
        <h3 className="card-title h5">
          {codigo ? (
            <Link to={`/producto/${codigo}`} className="rey-producto-link">
              {nombre}
            </Link>
          ) : (
            nombre
          )}
        </h3>

        {tieneDescuento && <p className="text-secondary text-decoration-line-through mb-0">
          Antes: ${Number(precioAnterior).toLocaleString("es-CL")}
        </p>}
        <p className="card-text rey-producto-precio">
          Precio: ${precio.toLocaleString("es-CL")}
        </p>

        <button
          type="button"
          className="rey-producto-boton mt-auto"
          onClick={onAgregar}
        >
          {etiquetaBoton}
        </button>
      </div>
    </article>
  );
}

export default ProductoCard;
