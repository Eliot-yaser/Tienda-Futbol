import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

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
import AdminVentas from "./pages/AdminVentas";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsuarios from "./pages/AdminUsuarios";
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

    return Array.isArray(carritoGuardado) ? carritoGuardado : [];
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

  const comprobarStock = (carritoActual, producto, talla = null) => {
    // Leer el inventario actualizado
    const inventario = cargarInventario();

    const datosProducto = inventario[producto.codigo] ?? {};

    // Stock total actual
    const stockTotal = datosProducto._stockTotal ?? producto.stock;

    // Verificar que el stock total sea válido
    if (!Number.isSafeInteger(stockTotal) || stockTotal < 0) {
      return "El inventario de este producto no es válido.";
    }

    // Contar todas las unidades de este producto
    // que ya están en el carrito
    const cantidadTotalEnCarrito = carritoActual
      .filter((item) => item.codigo === producto.codigo)
      .reduce((total, item) => total + item.cantidad, 0);

    // No superar el stock total
    if (cantidadTotalEnCarrito >= stockTotal) {
      return `No quedan más unidades disponibles de ` + `${producto.nombre}.`;
    }

    // Consultar las tallas del producto
    const tallasDisponibles = obtenerTallasPorCategoria(producto.categoria);

    // Productos que requieren talla
    if (tallasDisponibles.length > 0) {
      // Comprobar la talla seleccionada
      if (!tallasDisponibles.includes(talla)) {
        return `Selecciona una talla válida para ` + `${producto.nombre}.`;
      }

      // Stock disponible de la talla
      const stockTalla = datosProducto[talla];

      // Comprobar que el administrador haya configurado
      // correctamente esa talla
      if (!Number.isSafeInteger(stockTalla) || stockTalla < 0) {
        return (
          `El stock de ${producto.nombre}, ` +
          `talla ${talla}, todavía no está configurado.`
        );
      }

      // Contar unidades de la talla dentro del carrito
      const cantidadTallaEnCarrito = carritoActual
        .filter(
          (item) =>
            item.codigo === producto.codigo && (item.talla ?? null) === talla,
        )
        .reduce((total, item) => total + item.cantidad, 0);

      // Impedir superar las unidades disponibles
      if (cantidadTallaEnCarrito >= stockTalla) {
        return (
          `Solo hay ${stockTalla} unidades disponibles ` +
          `de ${producto.nombre}, talla ${talla}.`
        );
      }
    }

    // Si todo está correcto, no existe error
    return null;
  };

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  const agregarAlCarrito = (producto, talla = null) => {
    // Comprobar el stock antes de agregar
    const errorStock = comprobarStock(carrito, producto, talla);

    if (errorStock) {
      mostrarNotificacion("error", errorStock);
      return;
    }

    // Agregar una unidad
    const carritoActualizado = agregarProductoAlCarrito(
      carrito,
      producto,
      talla,
    );

    setCarrito(carritoActualizado);

    // Mostrar mensaje de éxito
    const descripcionTalla = talla ? ` - Talla ${talla}` : "";

    mostrarNotificacion(
      "exito",
      `${producto.nombre}${descripcionTalla} se agregó al carrito.`,
    );
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

  const confirmarCompra = () => {
    try {
      // Leer inventario actual
      const inventarioActual = cargarInventario();

      // Validar la compra y preparar descuentos
      const inventarioNuevo = prepararCompra(
        carrito,
        productosBase,
        inventarioActual,
      );

      // Recuperar ventas anteriores
      const ventasGuardadas = JSON.parse(
        localStorage.getItem("rey-balon-ventas") || "[]",
      );

      if (!Array.isArray(ventasGuardadas)) {
        throw new Error("No se pudo leer el historial de ventas.");
      }

      // Preparar registro de venta
      const venta = {
        id: Date.now(),
        fecha: new Date().toISOString(),

        productos: carrito.map((producto) => ({
          codigo: producto.codigo,
          nombre: producto.nombre,
          talla: producto.talla ?? null,
          precio: producto.precio,
          cantidad: producto.cantidad,
        })),

        total: calcularTotalCarrito(carrito),
      };

      // Guardar respaldo del historial
      const respaldoVentas = localStorage.getItem("rey-balon-ventas");

      // Guardar venta
      localStorage.setItem(
        "rey-balon-ventas",
        JSON.stringify([...ventasGuardadas, venta]),
      );

      try {
        // Descontar inventario
        guardarInventario(inventarioNuevo);
      } catch (error) {
        // Restaurar historial si falló el guardado
        if (respaldoVentas === null) {
          localStorage.removeItem("rey-balon-ventas");
        } else {
          localStorage.setItem("rey-balon-ventas", respaldoVentas);
        }

        throw error;
      }

      // Vaciar carrito después de comprar
      setCarrito([]);

      return {
        exito: true,
        mensaje: "¡Compra realizada correctamente!",
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

  const cambiarCantidad = (codigo, cambio, talla = null) => {
    // Solo comprobar existencias al aumentar
    if (cambio > 0) {
      const producto = productosBase.find((item) => item.codigo === codigo);

      if (!producto) {
        mostrarNotificacion("error", "Este producto ya no está disponible.");
        return;
      }

      const errorStock = comprobarStock(carrito, producto, talla);

      if (errorStock) {
        mostrarNotificacion("error", errorStock);
        return;
      }
    }

    // Cambiar únicamente la variante correspondiente
    setCarrito((carritoAnterior) =>
      cambiarCantidadProducto(carritoAnterior, codigo, cambio, talla),
    );
  };

  // ==========================================
  // CÁLCULOS DEL CARRITO
  // ==========================================

  const totalCarrito = calcularTotalCarrito(carrito);

  const cantidadTotal = calcularCantidadTotal(carrito);

  // Categorías
  const categorias = [
    "Todas",
    ...new Set(productosBase.map((producto) => producto.categoria)),
  ];

  // Filtrar productos
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productosBase
      : productosBase.filter(
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

        {/* Panel exclusivo del vendedor */}
        <Route
          path="/vendedor"
          element={
            <RutaProtegida usuario={usuario} rolPermitido="Vendedor">
              <main className="container py-5">
                <div className="bg-dark text-white rounded-4 p-4 mb-4">
                  <h1>📋 Panel de Vendedor</h1>
                  <p className="mb-0">Bienvenido a Rey del Balón.</p>
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h2 className="h4">Interfaz en preparación</h2>

                    <p className="text-secondary">
                      Próximamente incorporaremos las funcionalidades del
                      vendedor según la versión original.
                    </p>

                    <Link to="/productos" className="btn btn-dark">
                      Ver productos
                    </Link>
                  </div>
                </div>
              </main>
            </RutaProtegida>
          }
        />

        {/* Productos */}
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
          element={<DetalleProducto onAgregar={agregarAlCarrito} />}
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
              confirmarCompra={confirmarCompra}
            />
          }
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
