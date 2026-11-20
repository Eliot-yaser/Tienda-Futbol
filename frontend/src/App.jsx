import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import ProductoCard from "./components/ProductoCard";

// Catálogo persistido
import { cargarProductos } from "./utils/productos.js";
import { useProductos } from "./hooks/useProductos.js";

// Páginas
import Inicio from "./pages/Inicio";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import CompraResultado from "./pages/CompraResultado";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import DetalleProducto from "./pages/DetalleProducto";
import AdminInventario from "./pages/AdminInventario";
import AdminVentas from "./pages/AdminVentas";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductos from "./pages/AdminProductos";
import VendedorDashboard from "./pages/VendedorDashboard";
import AdminUsuarios from "./pages/AdminUsuarios";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas";
import { inicializarUsuarios } from "./utils/usuarios";

// Funciones del carrito
import {
  calcularTotalCarrito,
  calcularCantidadTotal,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  cambiarCantidadProducto,
} from "./utils/carrito.js";

// Inventario y tallas
import {
  cargarInventario,
  guardarInventario,
  prepararCompra,
} from "./utils/inventario";

import { obtenerTallasPorCategoria } from "./utils/tallas";
import { consultarStockProducto } from "./utils/stockApi.js";

import { registrarCompraApi } from "./utils/comprasApi.js";

// Estilos
import "./Notificacion.css";
// Crear una clave diferente para cada usuario
function obtenerClaveCarrito(usuario) {
  if (usuario?.email) {
    const correo = String(usuario.email).trim().toLowerCase();

    return `carrito-react-${correo}`;
  }

  // Carrito independiente para visitantes
  return "carrito-react-invitado";
}

// Recuperar el carrito correspondiente al usuario
function cargarCarritoUsuario(usuario) {
  try {
    const clave = obtenerClaveCarrito(usuario);

    const datosGuardados = localStorage.getItem(clave);

    if (!datosGuardados) {
      return [];
    }

    const carritoGuardado = JSON.parse(datosGuardados);

    if (!Array.isArray(carritoGuardado)) return [];

    // Mantener precio y nombre actuales si el administrador actualiza el catálogo.
    const catalogo = cargarProductos();
    return carritoGuardado.map((item) => {
      const producto = catalogo.find((p) => p.codigo === item.codigo);
      return producto
        ? {
            ...item,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
          }
        : item;
    });
  } catch {
    return [];
  }
}
// Restringir cada panel al rol correspondiente (demostración local).
// El visitante va al inicio de sesión y los otros roles a su pantalla.
function RutaProtegida({ usuario, rolPermitido, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== rolPermitido) {
    const destino =
      usuario.rol === "Administrador"
        ? "/admin"
        : usuario.rol === "Vendedor"
          ? "/vendedor"
          : "/";

    return <Navigate to={destino} replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const productos = useProductos();
  const validacionStockEnCurso = useRef(false);

  // Recuperar el usuario que inició sesión
  const [usuario, setUsuario] = useState(() => {
    try {
      const datos = localStorage.getItem("usuarioLogueado");
      return datos ? JSON.parse(datos) : null;
    } catch {
      return null;
    }
  });

  // Cerrar sesión conservando el carrito de esa cuenta
  const cerrarSesion = () => {
    // Asegurar que el carrito actual quede guardado
    localStorage.setItem(obtenerClaveCarrito(usuario), JSON.stringify(carrito));

    // Eliminar solamente la sesión
    localStorage.removeItem("usuarioLogueado");

    // Cambiar al carrito independiente de visitantes
    setUsuario(null);
    setCarrito(cargarCarritoUsuario(null));

    navigate("/", { replace: true });
  };

  // Iniciar sesión y cargar el carrito de esa cuenta
  const manejarInicioSesion = (nuevoUsuario) => {
    // Guardar el carrito de la sesión anterior
    localStorage.setItem(obtenerClaveCarrito(usuario), JSON.stringify(carrito));

    // Activar la nueva cuenta
    setUsuario(nuevoUsuario);

    // Cargar únicamente sus productos
    setCarrito(cargarCarritoUsuario(nuevoUsuario));
  };

  // Inicializar las cuentas de demostración
  useEffect(() => {
    inicializarUsuarios();
  }, []);

  // Categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Notificaciones de éxito o error
  const [notificacion, setNotificacion] = useState(null);

  // Recuperar solamente el carrito del usuario actual
  const [carrito, setCarrito] = useState(() => cargarCarritoUsuario(usuario));

  // Si cambian precios o nombres en el catálogo, actualizar el carrito visible.
  useEffect(() => {
    setCarrito((anterior) => {
      let hayCambios = false;
      const actualizado = anterior.map((item) => {
        const producto = productos.find((p) => p.codigo === item.codigo);
        if (!producto) return item;
        if (
          item.nombre !== producto.nombre ||
          item.precio !== producto.precio ||
          item.imagen !== producto.imagen
        ) {
          hayCambios = true;
          return {
            ...item,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
          };
        }
        return item;
      });
      return hayCambios ? actualizado : anterior;
    });
  }, [productos]);

  // Guardar el carrito de la cuenta activa
  useEffect(() => {
    const clave = obtenerClaveCarrito(usuario);

    localStorage.setItem(clave, JSON.stringify(carrito));
  }, [carrito, usuario]);

  // Ocultar notificaciones después de 3 segundos
  useEffect(() => {
    if (!notificacion) return;

    const temporizador = setTimeout(() => {
      setNotificacion(null);
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [notificacion]);

  // Mostrar una notificación
  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({
      tipo,
      mensaje,
    });
  };

  // Abrir el detalle del producto
  const irAlDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  // ==========================================
  // VALIDAR EL STOCK ANTES DE AGREGAR
  // ==========================================

  // Verificar el stock actual en MySQL antes de sumar unidades al carrito.
  // La validacion definitiva de una compra debe realizarla el backend.
  const comprobarStock = async (
    carritoActual,
    producto,
    talla = null,
    unidades = 1,
  ) => {
    if (!producto?.idProducto) {
      return "No se pudo identificar el producto en MySQL. Intenta recargar la tienda.";
    }

    const tallasDisponibles = obtenerTallasPorCategoria(producto.categoria);
    if (tallasDisponibles.length > 0 && !tallasDisponibles.includes(talla)) {
      return `Selecciona una talla valida para ${producto.nombre}.`;
    }

    // Revalidar tanto el stock general como el de cada talla con datos del servidor.
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const [respuestaProducto, inventario] = await Promise.all([
      fetch(`${apiBase}/api/v1/productos/${producto.idProducto}`, {
        cache: "no-store",
      }),
      consultarStockProducto(producto.idProducto),
    ]);
    if (!respuestaProducto.ok) {
      throw new Error("No fue posible verificar el producto en MySQL.");
    }

    const productoActual = await respuestaProducto.json();
    if (productoActual.codigo !== producto.codigo) {
      throw new Error("La informacion del producto no coincide con MySQL.");
    }

    const stockTotal = Number(productoActual.stock);
    if (!Number.isSafeInteger(stockTotal) || stockTotal < 0) {
      throw new Error("El inventario total del producto no es valido.");
    }

    const cantidadTotalEnCarrito = carritoActual
      .filter((item) => item.codigo === producto.codigo)
      .reduce((total, item) => total + item.cantidad, 0);

    if (cantidadTotalEnCarrito + unidades > stockTotal) {
      return `Solo hay ${stockTotal} unidades disponibles de ${producto.nombre} en total.`;
    }

    if (tallasDisponibles.length > 0) {
      const stockTalla = inventario.stockPorTalla[talla];
      if (!Number.isSafeInteger(stockTalla) || stockTalla < 0) {
        return `La talla ${talla} de ${producto.nombre} no tiene stock configurado en MySQL.`;
      }

      const cantidadTallaEnCarrito = carritoActual
        .filter(
          (item) =>
            item.codigo === producto.codigo && (item.talla ?? null) === talla,
        )
        .reduce((total, item) => total + item.cantidad, 0);

      if (cantidadTallaEnCarrito + unidades > stockTalla) {
        return `Solo hay ${stockTalla} unidades disponibles de ${producto.nombre}, talla ${talla}.`;
      }
    }

    return null;
  };

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  const agregarAlCarrito = async (producto, talla = null) => {
    // Impedir agregar varias veces mientras la API responde.
    if (validacionStockEnCurso.current) return;
    validacionStockEnCurso.current = true;

    try {
      const errorStock = await comprobarStock(carrito, producto, talla);
      if (errorStock) {
        mostrarNotificacion("error", errorStock);
        return;
      }

      setCarrito((actual) => agregarProductoAlCarrito(actual, producto, talla));
      const descripcionTalla = talla ? ` - Talla ${talla}` : "";
      mostrarNotificacion(
        "exito",
        `${producto.nombre}${descripcionTalla} se agrego al carrito.`,
      );
    } catch (error) {
      console.error("No se pudo validar el stock:", error);
      mostrarNotificacion(
        "error",
        "No se pudo verificar el stock en MySQL. Intenta nuevamente.",
      );
    } finally {
      validacionStockEnCurso.current = false;
    }
  };

  // ==========================================
  // VACIAR CARRITO
  // ==========================================

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // ==========================================
  // CONFIRMAR COMPRA SIMULADA
  // ==========================================

  const confirmarCompra = async ({ cliente, entrega }) => {
    try {
      // El JWT debe provenir del login conectado a Spring Boot.
      const token = usuario?.token;

      // Registrar la compra mediante la API REST.
      const respuesta = await registrarCompraApi(
        { cliente, entrega },
        carrito,
        token,
      );

      // Adaptar la respuesta al formato que utiliza React.
      const venta = {
        id: respuesta.idBoleta,
        fecha: new Date().toISOString(),
        cliente,
        entrega,
        productos: respuesta.productos,
        total: respuesta.total,
        estado: respuesta.estado,
        resultadoPago: respuesta.resultadoPago,
      };

      // Vaciar el carrito solamente si el backend confirmó la compra.
      setCarrito([]);

      return {
        exito: true,
        mensaje: "¡Compra registrada correctamente!",
        venta,
      };
    } catch (error) {
      return {
        exito: false,
        mensaje: error.message || "No se pudo completar la compra.",
      };
    }
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const eliminarDelCarrito = (indiceAEliminar) => {
    setCarrito((carritoAnterior) =>
      eliminarProductoDelCarrito(carritoAnterior, indiceAEliminar),
    );
  };

  // ==========================================
  // CAMBIAR CANTIDAD CON CONTROL DE STOCK
  // ==========================================

  const cambiarCantidad = async (codigo, cambio, talla = null) => {
    if (validacionStockEnCurso.current) return;

    // Disminuir no requiere consultar stock, y conserva el minimo de 1 unidad.
    if (cambio <= 0) {
      setCarrito((actual) =>
        cambiarCantidadProducto(actual, codigo, cambio, talla),
      );
      return;
    }

    validacionStockEnCurso.current = true;
    try {
      const producto = productos.find((item) => item.codigo === codigo);
      if (!producto) {
        mostrarNotificacion("error", "Este producto ya no esta disponible.");
        return;
      }

      const errorStock = await comprobarStock(carrito, producto, talla, cambio);
      if (errorStock) {
        mostrarNotificacion("error", errorStock);
        return;
      }

      setCarrito((actual) =>
        cambiarCantidadProducto(actual, codigo, cambio, talla),
      );
    } catch (error) {
      console.error("No se pudo validar el stock:", error);
      mostrarNotificacion(
        "error",
        "No se pudo verificar el stock en MySQL. Intenta nuevamente.",
      );
    } finally {
      validacionStockEnCurso.current = false;
    }
  };

  // ==========================================
  // CÁLCULOS DEL CARRITO
  // ==========================================

  const totalCarrito = calcularTotalCarrito(carrito);

  const cantidadTotal = calcularCantidadTotal(carrito);

  // Categorías
  const categorias = [
    "Todas",
    ...new Set(productos.map((producto) => producto.categoria)),
  ];

  // Filtrar productos
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter(
          (producto) => producto.categoria === categoriaSeleccionada,
        );

  return (
    <>
      {/* Barra de navegación */}
      <Navbar
        cantidadTotal={cantidadTotal}
        usuario={usuario}
        onCerrarSesion={cerrarSesion}
      />

      {/* Notificaciones */}
      {notificacion && (
        <div
          className={`rey-notificacion ${
            notificacion.tipo === "error" ? "rey-notificacion-error" : ""
          }`}
          role={notificacion.tipo === "error" ? "alert" : "status"}
        >
          <span className="rey-notificacion-icono">
            {notificacion.tipo === "error" ? "⚠️" : "✅"}
          </span>

          <div>
            <strong>
              {notificacion.tipo === "error"
                ? "Stock insuficiente"
                : "¡Producto agregado!"}
            </strong>

            <p>{notificacion.mensaje}</p>
          </div>
        </div>
      )}

      {/* Rutas */}
      <Routes>
        {/* Inicio */}
        <Route path="/" element={<Inicio onAgregar={irAlDetalle} />} />

        {/* Paneles exclusivos del administrador */}
        <Route
          path="/admin/productos"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Administrador">
              <AdminProductos />
            </RutaProtegida>
          }
        />

        {/* Listado de usuarios del administrador */}
        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Administrador">
              <AdminUsuarios />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/inventario"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Administrador">
              <AdminInventario />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/ventas"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Administrador">
              <AdminVentas />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Administrador">
              <AdminDashboard />
            </RutaProtegida>
          }
        />

        {/* Panel exclusivo del vendedor: consulta sin permisos administrativos */}
        <Route
          path="/vendedor"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Vendedor">
              <VendedorDashboard />
            </RutaProtegida>
          }
        />

        {/* Categorías y ofertas públicas */}
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />

        {/* Productos */}
        <Route
          path="/productos"
          element={
            <main className="container py-5">
              <section id="productos">
                <h1 className="fw-bold mb-2">Nuestros productos</h1>
                <p className="text-muted mb-4">
                  Descubre camisetas, balones y accesorios para disfrutar del
                  fútbol.
                </p>

                {/* Filtro */}
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

                {/* Tarjetas */}
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
                        enOferta={producto.enOferta}
                        precioAnterior={producto.precioAnterior}
                        onAgregar={() => irAlDetalle(producto)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </main>
          }
        />

        {/* Detalle */}
        <Route
          path="/producto/:codigo"
          element={
            <DetalleProducto
              onAgregar={agregarAlCarrito}
              productosBase={productos}
            />
          }
        />

        {/* Carrito */}
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

        {/* Checkout de demostración y resultados */}
        <Route
          path="/checkout"
          element={
            <Checkout
              carrito={carrito}
              totalCarrito={totalCarrito}
              usuario={usuario}
              confirmarCompra={confirmarCompra}
            />
          }
        />
        <Route path="/compra-exitosa" element={<CompraResultado exito />} />
        <Route
          path="/compra-error"
          element={<CompraResultado exito={false} />}
        />

        {/* Registro */}
        <Route
          path="/registro"
          element={<Registro onRegistro={manejarInicioSesion} />}
        />

        {/* Inicio de sesión */}
        <Route
          path="/login"
          element={<Login onLogin={manejarInicioSesion} />}
        />

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
