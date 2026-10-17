import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import ProductoCard from "./components/ProductoCard";

// Datos
import productosBase from "./data/productos";

// Páginas
import Inicio from "./pages/Inicio";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import DetalleProducto from "./pages/DetalleProducto";
import AdminInventario from "./pages/AdminInventario";

// Funciones del carrito
import {
  calcularTotalCarrito,
  calcularCantidadTotal,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  cambiarCantidadProducto,
} from "./utils/carrito.js";

// Estilos
import "./Notificacion.css";

function App() {
  const navigate = useNavigate();

  // Estado del filtro de categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Estado de la notificación
  const [notificacion, setNotificacion] = useState(null);

  // Recuperar el carrito desde localStorage
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito-react");

      const datos = carritoGuardado ? JSON.parse(carritoGuardado) : [];

      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  });

  // Guardar el carrito cuando cambie
  useEffect(() => {
    localStorage.setItem("carrito-react", JSON.stringify(carrito));
  }, [carrito]);

  // Ocultar la notificación después de 3 segundos
  useEffect(() => {
    if (!notificacion) return;

    const temporizador = setTimeout(() => {
      setNotificacion(null);
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [notificacion]);

  // Ir al detalle para seleccionar talla
  const irAlDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  // Agregar el producto con su talla
  const agregarAlCarrito = (producto, talla = null) => {
    setCarrito((carritoActual) =>
      agregarProductoAlCarrito(carritoActual, producto, talla),
    );

    const descripcionTalla = talla ? ` - Talla ${talla}` : "";

    setNotificacion(`${producto.nombre}${descripcionTalla}`);
  };

  // Vaciar todos los productos del carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Eliminar un producto o una talla del carrito
  const eliminarDelCarrito = (indiceAEliminar) => {
    setCarrito((carritoAnterior) =>
      eliminarProductoDelCarrito(carritoAnterior, indiceAEliminar),
    );
  };

  // Aumentar o disminuir cantidades según código y talla
  const cambiarCantidad = (codigo, cambio, talla = null) => {
    setCarrito((carritoAnterior) =>
      cambiarCantidadProducto(carritoAnterior, codigo, cambio, talla),
    );
  };

  // Calcular el precio total
  const totalCarrito = calcularTotalCarrito(carrito);

  // Calcular la cantidad total de unidades
  const cantidadTotal = calcularCantidadTotal(carrito);

  // Obtener categorías disponibles
  const categorias = [
    "Todas",
    ...new Set(productosBase.map((producto) => producto.categoria)),
  ];

  // Filtrar productos por categoría
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productosBase
      : productosBase.filter(
          (producto) => producto.categoria === categoriaSeleccionada,
        );

  return (
    <>
      {/* Barra de navegación */}
      <Navbar cantidadTotal={cantidadTotal} />

      {/* Notificación al agregar un producto */}
      {notificacion && (
        <div className="rey-notificacion" role="status">
          <span className="rey-notificacion-icono">✅</span>

          <div>
            <strong>¡Producto agregado!</strong>
            <p>{notificacion} se agregó al carrito.</p>
          </div>
        </div>
      )}

      {/* Rutas de la aplicación */}
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Inicio onAgregar={irAlDetalle} />} />

        <Route path="/admin/inventario" element={<AdminInventario />} />

        {/* Catálogo de productos */}
        <Route
          path="/productos"
          element={
            <main className="container py-5">
              <h1>Bienvenido a Rey del Balón</h1>

              <p>
                Encuentra las mejores camisetas, balones y accesorios de fútbol.
              </p>

              <p className="fw-bold">
                🛒 Productos en el carrito: {cantidadTotal}
              </p>

              <section id="productos" className="mt-5">
                <h2>Nuestros productos</h2>

                {/* Filtro de categorías */}
                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">
                    Filtrar por categoría:
                  </label>

                  <select
                    id="categoria"
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(evento) =>
                      setCategoriaSeleccionada(evento.target.value)
                    }
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tarjetas de productos */}
                <div className="row g-3 mt-3">
                  {productosFiltrados.map((producto) => (
                    <div
                      className="col-12 col-md-6 col-lg-4"
                      key={producto.codigo}
                    >
                      <ProductoCard
                        codigo={producto.codigo}
                        nombre={producto.nombre}
                        precio={producto.precio}
                        imagen={producto.imagen}
                        onAgregar={() => irAlDetalle(producto)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </main>
          }
        />

        {/* Detalle de producto */}
        <Route
          path="/producto/:codigo"
          element={<DetalleProducto onAgregar={agregarAlCarrito} />}
        />

        {/* Carrito de compras */}
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              cantidadTotal={cantidadTotal}
              totalCarrito={totalCarrito}
              cambiarCantidad={cambiarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
              vaciarCarrito={vaciarCarrito}
            />
          }
        />

        {/* Registro */}
        <Route path="/registro" element={<Registro />} />

        {/* Inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Nosotros */}
        <Route path="/nosotros" element={<Nosotros />} />

        {/* Blogs */}
        <Route path="/blogs" element={<Blogs />} />

        <Route path="/blogs/:id" element={<Blogs />} />

        {/* Contacto */}
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </>
  );
}

export default App;
