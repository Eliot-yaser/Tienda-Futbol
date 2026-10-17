function ProductoCard({ nombre, precio, imagen, onAgregar }) {
  return (
    <div className="card h-100">
      <img
        src={imagen}
        className="card-img-top"
        alt={nombre}
        style={{ height: "220px", objectFit: "contain", padding: "12px" }}
      />

      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{nombre}</h3>

        <p className="card-text">Precio: ${precio.toLocaleString("es-CL")}</p>

        <button className="btn btn-primary mt-auto" onClick={onAgregar}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;
