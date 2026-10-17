import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <h2 className="mb-0">Rey del Balón ⚽</h2>

        <nav className="d-flex gap-4">
          <Link to="/" className="text-white text-decoration-none">
            Inicio
          </Link>

          <Link to="/productos" className="text-white text-decoration-none">
            Productos
          </Link>

          <Link to="/carrito" className="text-white text-decoration-none">
            Carrito
          </Link>
          <Link to="/registro" className="text-white text-decoration-none">
            Registro
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
