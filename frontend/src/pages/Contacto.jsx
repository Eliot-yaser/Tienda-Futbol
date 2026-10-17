import "./Contacto.css";
import { useState } from "react";

function Contacto() {
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    comentario: "",
  });

  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  // Actualizar los campos del formulario
  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setDatos((anteriores) => ({
      ...anteriores,
      [name]: value,
    }));

    setExito(false);
  };

  // Validar los datos al enviar
  const enviarFormulario = (evento) => {
    evento.preventDefault();

    const nuevosErrores = {};

    const nombre = datos.nombre.trim();
    const email = datos.email.trim();
    const telefono = datos.telefono.trim();
    const comentario = datos.comentario.trim();

    // Validación del nombre
    if (!nombre) {
      nuevosErrores.nombre = "El nombre es requerido.";
    } else if (nombre.length > 100) {
      nuevosErrores.nombre = "Máximo 100 caracteres.";
    }

    // Validación del correo
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominio = email.split("@")[1]?.toLowerCase();

    const dominiosPermitidos = [
      "duoc.cl",
      "profesor.duoc.cl",
      "gmail.com",
    ];

    if (!email) {
      nuevosErrores.email = "El correo es requerido.";
    } else if (
      !formatoCorreo.test(email) ||
      !dominiosPermitidos.includes(dominio)
    ) {
      nuevosErrores.email =
        "Solo correos válidos @duoc.cl, @profesor.duoc.cl y @gmail.com";
    }

    // Validación del teléfono opcional
    if (telefono) {
      const formatoTelefono = /^[+]?[0-9\s-]{8,15}$/;

      if (!formatoTelefono.test(telefono)) {
        nuevosErrores.telefono =
          "Ingresa un teléfono válido (ej: +56912345678).";
      }
    }

    // Validación del comentario
    if (!comentario) {
      nuevosErrores.comentario = "El comentario es requerido.";
    } else if (comentario.length > 500) {
      nuevosErrores.comentario = "Máximo 500 caracteres.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setExito(true);

      setDatos({
        nombre: "",
        email: "",
        telefono: "",
        comentario: "",
      });
    } else {
      setExito(false);
    }
  };

  return (
    <>
      <main className="container py-5 contacto-pagina">
        <h2>Formulario de Contacto</h2>

        <form
          className="contacto-tarjeta"
          onSubmit={enviarFormulario}
          noValidate
        >
          {/* Nombre */}
          <div className="contacto-grupo">
            <label htmlFor="contact-nombre">
              Nombre Completo *
            </label>

            <input
              type="text"
              id="contact-nombre"
              name="nombre"
              maxLength={100}
              placeholder="Tu Nombre"
              value={datos.nombre}
              onChange={actualizarCampo}
            />

            {errores.nombre && (
              <span className="contacto-error" role="alert">
                {errores.nombre}
              </span>
            )}
          </div>

          {/* Correo */}
          <div className="contacto-grupo">
            <label htmlFor="contact-email">
              Correo Electrónico *
            </label>

            <input
              type="email"
              id="contact-email"
              name="email"
              maxLength={100}
              placeholder="ejemplo@duoc.cl"
              value={datos.email}
              onChange={actualizarCampo}
            />

            {errores.email && (
              <span className="contacto-error" role="alert">
                {errores.email}
              </span>
            )}
          </div>

          {/* Teléfono */}
          <div className="contacto-grupo">
            <label htmlFor="contact-telefono">
              Teléfono / Celular (Opcional)
            </label>

            <input
              type="tel"
              id="contact-telefono"
              name="telefono"
              maxLength={15}
              placeholder="+56 9 1234 5678"
              value={datos.telefono}
              onChange={actualizarCampo}
            />

            {errores.telefono && (
              <span className="contacto-error" role="alert">
                {errores.telefono}
              </span>
            )}
          </div>

          {/* Comentario */}
          <div className="contacto-grupo">
            <label htmlFor="contact-comentario">
              Comentario *
            </label>

            <textarea
              id="contact-comentario"
              name="comentario"
              maxLength={500}
              rows={5}
              placeholder="Escribe tu mensaje..."
              value={datos.comentario}
              onChange={actualizarCampo}
            />

            {errores.comentario && (
              <span className="contacto-error" role="alert">
                {errores.comentario}
              </span>
            )}
          </div>

          <button type="submit" className="contacto-boton">
            ENVIAR MENSAJE
          </button>

          {exito && (
            <p className="contacto-exito" role="status">
              ¡Formulario validado correctamente!
              Este mensaje es una demostración y no se ha enviado.
            </p>
          )}
        </form>
      </main>

      <footer className="contacto-footer">
        <p>
          © 2026 Rey Del Balon - Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
}

export default Contacto;
