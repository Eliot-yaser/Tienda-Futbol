import { Link, useParams } from "react-router-dom";
import "./Blogs.css";

// Información original de los tres HTML
const articulos = [
  {
    id: "1",
    titulo: "Caso Curioso #1: La Evolución de los Balones de Fútbol",
    tituloDetalle: "La Evolución de los Balones de Fútbol",
    resumen:
      "Descubre cómo pasamos de balones de cuero pesado que absorbían agua a esferas termoselladas de alta precisión tecnológica.",
    contenido:
      "En los inicios del fútbol organizado, los balones estaban hechos de vejigas de animales cubiertas de cuero cosido a mano. Estos balones eran irregulares y ganaban muchísimo peso en días de lluvia. Hoy en día, la microfibra sintética y el termosellado garantizan trayectorias aerodinámicas perfectas.",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnS03_Dd_dwJzGs6J7v_QJ1sR_ChBzAtKNknYepVfj3XG4LdeRAEoDZlQ&s=10",
    alt: "Evolución de los balones de fútbol",
    imagenContain: false,
  },
  {
    id: "2",
    titulo: "Caso Curioso #2: ¿Por qué la camiseta de Chile es roja?",
    tituloDetalle: "¿Por qué la camiseta de Chile es roja?",
    resumen:
      "Conoce los orígenes de la indumentaria de 'La Roja' y la historia detrás de sus colores patrios en torneos internacionales.",
    contenido:
      "Originalmente, la selección chilena vestía de blanco. No fue hasta la década de 1940 que se adoptó definitivamente la clásica combinación tricolor: camiseta roja, pantalón azul y medias blancas, reflejando el espíritu de la bandera nacional.",
    imagen:
      "https://chinchileproducts.com/cdn/shop/files/Federacion-de-Futbol-de-Chile-Jersey.webp?v=1753385922&width=1946",
    alt: "Camiseta de la selección chilena",
    imagenContain: true,
  },
];

function Blogs() {
  const { id } = useParams();

  const articuloSeleccionado = articulos.find((articulo) => articulo.id === id);

  return (
    <>
      <main className="container py-5 blogs-pagina">
        {!id ? (
          <>
            <h2>Noticias e Historias Curiosas</h2>

            <div className="blogs-list">
              {articulos.map((articulo) => (
                <article className="blog-card" key={articulo.id}>
                  <img
                    src={articulo.imagen}
                    alt={articulo.alt}
                    className={
                      articulo.id === "2"
                        ? "blog-card-img blog-card-img-contain"
                        : "blog-card-img"
                    }
                  />

                  <div className="blog-card-content">
                    <h3>{articulo.titulo}</h3>

                    <p>{articulo.resumen}</p>

                    <Link to={`/blogs/${articulo.id}`} className="blog-btn">
                      Ver Caso Completo →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : articuloSeleccionado ? (
          <>
            <h2>{articuloSeleccionado.tituloDetalle}</h2>

            <article className="blog-detail-card">
              <img
                src={articuloSeleccionado.imagen}
                alt={articuloSeleccionado.alt}
                className={
                  articuloSeleccionado.imagenContain
                    ? "blog-detail-img blog-detail-img-contain"
                    : "blog-detail-img"
                }
              />

              <p className="blog-detail-text">
                {articuloSeleccionado.contenido}
              </p>

              <Link to="/blogs" className="blog-back-link">
                ← Volver a Blogs
              </Link>
            </article>
          </>
        ) : (
          <>
            <h2>Artículo no encontrado</h2>

            <p className="text-center">
              <Link to="/blogs">Volver a Blogs</Link>
            </p>
          </>
        )}
      </main>

      <footer className="blogs-footer">
        <p>© 2026 Rey Del Balon - Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default Blogs;
