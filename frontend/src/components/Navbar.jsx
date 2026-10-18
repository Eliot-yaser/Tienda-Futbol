import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cantidadTotal, usuario, onCerrarSesion }) {
  const claseEnlace = ({ isActive }) =>
    isActive ? "rey-enlace activo" : "rey-enlace";

  // Determinar qué panel corresponde al usuario
  const rutaPanel =
    usuario?.rol === "Administrador"
      ? "/admin"
      : usuario?.rol === "Vendedor"
        ? "/vendedor"
        : null;

  const nombrePanel =
    usuario?.rol === "Administrador"
      ? "⚙️ Panel de Administración"
      : "📋 Panel de Vendedor";

  return (
    <header className="rey-navbar">
      <div className="container rey-navbar-contenido">
        {/* Logo */}
        <NavLink to="/" className="rey-logo">
          Rey del Balón ⚽
        </NavLink>

        {/* Navegación principal */}
        <nav className="rey-menu" aria-label="Menú principal">
          <NavLink to="/" end className={claseEnlace}>
            Inicio
          </NavLink>

          <NavLink to="/productos" className={claseEnlace}>
            Productos
          </NavLink>

          <NavLink to="/categorias" className={claseEnlace}>
            Categorías
          </NavLink>

          <NavLink to="/ofertas" className={claseEnlace}>
            Ofertas
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

        {/* Carrito y usuario */}
        <div className="rey-acciones">
          <NavLink to="/carrito" className="rey-carrito">
            🛒 Carrito ({cantidadTotal})
          </NavLink>

          {usuario ? (
            <details className="rey-usuario-menu">
              <summary className="rey-usuario-boton">
                👤 Hola, {usuario.nombre}
                <span aria-hidden="true"> ▾</span>
              </summary>

              <div className="rey-usuario-desplegable">
                {/* Rol del usuario */}
                <div className="rey-usuario-info">
                  <strong>
                    {usuario.nombre} {usuario.apellidos || ""}
                  </strong>

                  <span>Rol: {usuario.rol || "Cliente"}</span>
                </div>

                {/* Acceso al panel administrativo o vendedor */}
                {rutaPanel && (
                  <NavLink to={rutaPanel} className="rey-usuario-enlace">
                    {nombrePanel}
                  </NavLink>
                )}

                {/* Cerrar sesión */}
                <button
                  type="button"
                  className="rey-usuario-salir"
                  onClick={onCerrarSesion}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </details>
          ) : (
            <NavLink to="/login" className="rey-registro">
              Iniciar Sesión
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
