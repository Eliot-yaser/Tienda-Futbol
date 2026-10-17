import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cantidadTotal }) {
  const claseEnlace = ({ isActive }) =>
    isActive ? "rey-enlace activo" : "rey-enlace";

  return (
    <header className="rey-navbar">
      <div className="container rey-navbar-contenido">
        {/* Izquierda: logo */}
        <NavLink to="/" className="rey-logo">
          Rey del Balón ⚽
        </NavLink>

        {/* Centro: páginas principales */}
        <nav className="rey-menu" aria-label="Menú principal">
          <NavLink to="/" end className={claseEnlace}>
            Inicio
          </NavLink>

          <NavLink to="/productos" className={claseEnlace}>
            Productos
          </NavLink>

          <NavLink to="/nosotros" className={claseEnlace}>
            Nosotros
          </NavLink>

          <NavLink to="/blogs" className={claseEnlace}>
            Blogs
          </NavLink>

          <NavLink to="/contacto" className={claseEnlace}>
            Contacto
          </NavLink>
        </nav>

        {/* Derecha: carrito y registro */}
        <div className="rey-acciones">
          <NavLink to="/carrito" className="rey-carrito">
            🛒 Carrito ({cantidadTotal})
          </NavLink>

          <NavLink to="/login" className="rey-registro">
            Iniciar Sesión
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
