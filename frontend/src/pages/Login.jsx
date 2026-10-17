import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { inicializarUsuarios } from "../utils/usuarios";
import "./Registro.css";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  // Validar los datos e iniciar sesión
  const validarLogin = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const correoLimpio = correo.trim().toLowerCase();

    // Validar correo
    if (!formatoCorreo.test(correoLimpio)) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }

    // Validar contraseña
    if (password.length < 4 || password.length > 10) {
      nuevosErrores.password =
        "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    setErrores(nuevosErrores);
    setMensaje("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      // Crear las cuentas de prueba que todavía no existan
      inicializarUsuarios();

      // Obtener usuarios guardados
      const datos = localStorage.getItem("usuariosRegistrados");

      const usuarios = datos ? JSON.parse(datos) : [];

      if (!Array.isArray(usuarios)) {
        throw new Error("La lista de usuarios no es válida.");
      }

      // Buscar correo y contraseña
      const usuarioEncontrado = usuarios.find((usuario) => {
        const emailUsuario = String(usuario.email || usuario.correo || "")
          .trim()
          .toLowerCase();

        const passwordUsuario = String(usuario.pass ?? usuario.password ?? "");

        return emailUsuario === correoLimpio && passwordUsuario === password;
      });

      // Si no existe o la contraseña es incorrecta
      if (!usuarioEncontrado) {
        setErrores({
          correo: "El correo o la contraseña son incorrectos.",
        });

        return;
      }

      // Guardar solamente los datos necesarios para la sesión
      const usuarioSesion = {
        nombre: usuarioEncontrado.nombre,
        apellidos: usuarioEncontrado.apellidos || "",
        email: correoLimpio,
        rol: usuarioEncontrado.rol || "Cliente",
      };

      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSesion));
      // Avisar a React que cambió el usuario conectado
      onLogin(usuarioSesion);

      // Redirigir según el rol
      if (usuarioSesion.rol === "Administrador") {
        navigate("/admin", { replace: true });
      } else if (usuarioSesion.rol === "Vendedor") {
        navigate("/vendedor", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setMensaje("No fue posible iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <main className="registro-pagina">
      <form className="registro-tarjeta" onSubmit={validarLogin} noValidate>
        <h1 className="registro-titulo">¡Hola de nuevo!</h1>

        <p className="text-secondary text-center mb-4">
          Ingresa a tu cuenta para continuar.
        </p>

        {/* Correo electrónico */}
        <div className="mb-3">
          <label htmlFor="login-correo" className="form-label">
            Correo Electrónico *
          </label>

          <input
            id="login-correo"
            type="email"
            className={`form-control ${errores.correo ? "is-invalid" : ""}`}
            maxLength={100}
            placeholder="ejemplo@duoc.cl"
            value={correo}
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
            <div className="invalid-feedback" role="alert">
              {errores.correo}
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">
            Contraseña *
          </label>

          <input
            id="login-password"
            type="password"
            className={`form-control ${errores.password ? "is-invalid" : ""}`}
            maxLength={10}
            placeholder="••••••••"
            value={password}
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
            <div className="invalid-feedback" role="alert">
              {errores.password}
            </div>
          )}
        </div>

        {/* Botón de ingreso */}
        <button type="submit" className="registro-boton">
          INGRESAR
        </button>

        {/* Mensaje de error general */}
        {mensaje && (
          <div className="alert alert-danger mt-3" role="alert">
            {mensaje}
          </div>
        )}

        <p className="text-center text-secondary small mt-3">
          Recuperación de contraseña no disponible por ahora.
        </p>

        {/* Enlace al registro */}
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
