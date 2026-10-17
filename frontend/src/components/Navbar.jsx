function Navbar() {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">

        <h2 className="mb-0">Rey del Balón ⚽</h2>

        <nav className="d-flex gap-4">
          <a href="#inicio" className="text-white text-decoration-none">
            Inicio
          </a>

          <a href="#productos" className="text-white text-decoration-none">
            Productos
          </a>

          <a href="#carrito" className="text-white text-decoration-none">
            Carrito
          </a>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;