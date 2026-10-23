import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cantidadTotal, usuario, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
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

        {/* Mostrar enlaces al tocar el botón en pantallas pequeñas */}
        <button
          type="button"
          className="rey-menu-toggle"
          aria-controls="rey-menu-principal"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span aria-hidden="true">{menuAbierto ? "✕" : "☰"}</span>
        </button>

        {/* Navegación principal */}
        <nav
          id="rey-menu-principal"
          className={`rey-menu${menuAbierto ? " rey-menu-abierto" : ""}`}
          aria-label="Menú principal"
          onClick={() => setMenuAbierto(false)}
        >
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
            <details key={location.pathname} className="rey-usuario-menu">
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
