
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const validarLogin = async (e) => {
    e.preventDefault();

    if (cargando) return;

    const nuevosErrores = {};
    const correoLimpio = correo.trim().toLowerCase();
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correoLimpio)) {
      nuevosErrores.correo =
        "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      nuevosErrores.password =
        "Ingresa tu contraseña.";
    }

    setErrores(nuevosErrores);
    setMensaje("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        `${API_BASE}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: correoLimpio,
            password,
          }),
        }
      );

      const datos = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        if (respuesta.status === 400 ||
          respuesta.status === 401 ||
          respuesta.status === 403) {
          setMensaje(
            "Correo o contraseña incorrectos, o cuenta inactiva."
          );
        } else {
          setMensaje(
            "No fue posible iniciar sesión. Intenta nuevamente."
          );
        }
        return;
      }

      if (
        !datos ||
        typeof datos.token !== "string" ||
        !datos.token ||
        typeof datos.rol !== "string" ||
        !datos.email
      ) {
        throw new Error("Respuesta de autenticación incompleta.");
      }

      // Convertir el rol del backend al formato
      // que utilizan las páginas actuales de React.
      const rolBackend = datos.rol.toUpperCase();

      const rolesFrontend = {
        ADMINISTRADOR: "Administrador",
        VENDEDOR: "Vendedor",
        CLIENTE: "Cliente",
      };

      const rolFrontend = rolesFrontend[rolBackend];

      if (!rolFrontend) {
        throw new Error("Rol de usuario no reconocido.");
      }

      // Mantener la estructura que utiliza App.jsx.
      const usuarioSesion = {
        idUsuario: datos.idUsuario,
        nombre: datos.nombre,
        apellidos: "",
        email: datos.email,
        rol: rolFrontend,
        token: datos.token,
        refreshToken: datos.refreshToken,
        tipo: datos.tipo || "Bearer",
      };


      // Compatibilidad temporal con el sistema
      // de sesiones existente de la EVA3.
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(usuarioSesion)
      );

      // Notificar a App.jsx.
      onLogin?.(usuarioSesion);

      // Redirigir según rol.
      if (rolBackend === "ADMINISTRADOR") {
        navigate("/admin", { replace: true });
      } else if (rolBackend === "VENDEDOR") {
        navigate("/vendedor", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setMensaje(
        "No fue posible conectar con el servidor de autenticación."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="registro-pagina">
      <form
        className="registro-tarjeta"
        onSubmit={validarLogin}
        noValidate
      >
        <h1 className="registro-titulo">
          ¡Hola de nuevo!
        </h1>

        <p className="text-secondary text-center mb-4">
          Ingresa a tu cuenta para continuar.
        </p>

        <div className="mb-3">
          <label
            htmlFor="login-correo"
            className="form-label"
          >
            Correo Electrónico *
          </label>

          <input
            id="login-correo"
            type="email"
            className={`form-control ${errores.correo ? "is-invalid" : ""
              }`}
            maxLength={150}
            placeholder="ejemplo@duoc.cl"
            value={correo}
            autoComplete="email"
            disabled={cargando}
            onChange={(e) => {
              setCorreo(e.target.value);
              setErrores((anterior) => ({
                ...anterior,
                correo: "",
              }));
              setMensaje("");
            }}
          />

          {errores.correo && (
            <div
              className="invalid-feedback"
              role="alert"
            >
              {errores.correo}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label
            htmlFor="login-password"
            className="form-label"
          >
            Contraseña *
          </label>

          <input
            id="login-password"
            type="password"
            className={`form-control ${errores.password ? "is-invalid" : ""
              }`}
            placeholder="••••••••"
            value={password}
            autoComplete="current-password"
            disabled={cargando}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores((anterior) => ({
                ...anterior,
                password: "",
              }));
              setMensaje("");
            }}
          />

          {errores.password && (
            <div
              className="invalid-feedback"
              role="alert"
            >
              {errores.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="registro-boton"
          disabled={cargando}
        >
          {cargando ? "INGRESANDO..." : "INGRESAR"}
        </button>

        {mensaje && (
          <div
            className="alert alert-danger mt-3"
            role="alert"
          >
            {mensaje}
          </div>
        )}

        <p className="text-center text-secondary small mt-3">
          Recuperación de contraseña no disponible por ahora.
        </p>

        <p className="text-center mt-4 mb-0">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registro"
            className="fw-bold text-decoration-none"
            style={{ color: "#e11d48" }}
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
