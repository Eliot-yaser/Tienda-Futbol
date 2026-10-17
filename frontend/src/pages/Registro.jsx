
import { useState } from "react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const validarRegistro = (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    // Validar nombre
    if (nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    // Validar correo electrónico
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido";
    }

    // Validar contraseña
    if (password.length < 8) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres";
    }

    // Mostrar todos los errores encontrados
    setErrores(nuevosErrores);
    setMensaje("");

    // Comprobar que no existan errores
    if (Object.keys(nuevosErrores).length === 0) {
      setMensaje("¡Formulario validado correctamente!");

      // Limpiar los campos después de validar
      setNombre("");
      setCorreo("");
      setPassword("");
    }
  };

  return (
    <main className="container py-5">
      <h1>Registro de usuario</h1>

      <form onSubmit={validarRegistro} noValidate>
        {/* Nombre completo */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre completo
          </label>

          <input
            id="nombre"
            type="text"
            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrores({ ...errores, nombre: "" });
              setMensaje("");
            }}
          />

          {errores.nombre && (
            <div className="invalid-feedback" role="alert">
              {errores.nombre}
            </div>
          )}
        </div>

        {/* Correo electrónico */}
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">
            Correo electrónico
          </label>

          <input
            id="correo"
            type="email"
            className={`form-control ${errores.correo ? "is-invalid" : ""}`}
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
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            className={`form-control ${errores.password ? "is-invalid" : ""}`}
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

        {/* Mensaje de validación correcta */}
        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
    </main>
  );
}

export default Registro;
