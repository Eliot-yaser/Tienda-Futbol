
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Registro.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const validarLogin = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validar correo
    if (!formatoCorreo.test(correo.trim())) {
      nuevosErrores.correo =
        "Ingresa un correo electrónico válido.";
    }

    // Validar contraseña
    if (password.length < 4 || password.length > 10) {
      nuevosErrores.password =
        "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    setErrores(nuevosErrores);
    setMensaje("");

    if (Object.keys(nuevosErrores).length === 0) {
      setMensaje(
        "Datos validados. El inicio de sesión real aún no está disponible."
      );
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
          Ingresa a tu cuenta para continuar tus compras.
        </p>

        {/* Correo electrónico */}
        <div className="mb-3">
          <label htmlFor="login-correo" className="form-label">
            Correo Electrónico *
          </label>

          <input
            id="login-correo"
            type="email"
            className={`form-control ${
              errores.correo ? "is-invalid" : ""
            }`}
            maxLength={100}
            placeholder="ejemplo@duoc.cl"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setErrores({ ...errores, correo: "" });
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
            className={`form-control ${
              errores.password ? "is-invalid" : ""
            }`}
            maxLength={10}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores({ ...errores, password: "" });
              setMensaje("");
            }}
          />

          {errores.password && (
            <div className="invalid-feedback" role="alert">
              {errores.password}
            </div>
          )}
        </div>

        {/* Botón de inicio de sesión */}
        <button type="submit" className="registro-boton">
          INGRESAR
        </button>

        {/* Aviso de validación */}
        {mensaje && (
          <div className="alert alert-info mt-3" role="status">
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
