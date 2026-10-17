import "./Nosotros.css";

function Nosotros() {
  return (
    <>
      <main className="container py-5 nosotros-pagina">
        <h2 className="mb-4">Sobre Nosotros</h2>

        <div className="about-card">

          <h3 className="about-title">
            Nuestra Historia y Pasión
          </h3>

          <p className="about-text">
            <strong>Rey Del Balon</strong> nació en 2026 con la
            misión de acercar la indumentaria de fútbol profesional
            a todos los apasionados del deporte. Nos especializamos
            en distribuir camisetas oficiales, calzado de alto
            rendimiento y accesorios deportivos de la más alta calidad.
          </p>

          <h3 className="about-title">
            Equipo de Desarrolladores
          </h3>

          <p className="about-text">
            Este proyecto fue desarrollado por el equipo
            de informática de Duoc UC:
          </p>

          <ul className="developers-list">
            <li>
              <strong>Eliot Armijo</strong> - Desarrollador Frontend /
              Integración JavaScript
            </li>

            <li>
              <strong>Isaac Arias</strong> - Desarrollador Frontend /
              Integración JavaScript
            </li>
          </ul>

        </div>
      </main>

      <footer className="footer nosotros-footer">
        <p>© 2026 Rey Del Balon - Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default Nosotros;
