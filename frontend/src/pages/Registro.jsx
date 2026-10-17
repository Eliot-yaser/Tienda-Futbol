import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inicializarUsuarios } from "../utils/usuarios";
import "./Registro.css";
import "./RegistroOriginal.css";

const regionesYComunas = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: [
      "Santiago",
      "Providencia",
      "Peñalolen",
      "Las Condes",
      "La Florida",
      "Maipú",
      "Puente Alto",
      "San Bernardo",
      "Macul",
    ],
  },
  {
    region: "Región de Valparaíso",
    comunas: [
      "Valparaíso",
      "Viña del Mar",
      "Quilpué",
      "Villa Alemana",
      "Concón",
      "San Antonio",
    ],
  },
  {
    region: "Región del Biobío",
    comunas: [
      "Concepción",
      "Talcahuano",
      "San Pedro de la Paz",
      "Chiguayante",
      "Los Ángeles",
    ],
  },
  {
    region: "Región de Antofagasta",
    comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
  },
];

const formularioInicial = {
  run: "",
  nombre: "",
  apellidos: "",
  email: "",
  fechaNac: "",
  region: "",
  comuna: "",
  direccion: "",
  pass: "",
  passConfirm: "",
};

// Validación del RUN chileno
function validarRunChileno(valor) {
  const run = valor.trim().toUpperCase();

  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    return false;
  }

  // Excepción presente en el proyecto original
  if (run === "19011022K") {
    return true;
  }

  const cuerpo = run.slice(0, -1);
  const digito = run.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);

  const digitoEsperado =
    resultado === 11 ? "0" : resultado === 10 ? "K" : String(resultado);

  return digito === digitoEsperado;
}

// Dominios permitidos en el registro original
function validarCorreo(correo) {
  const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

  const correoLimpio = correo.trim().toLowerCase();

  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio) &&
    dominios.some((dominio) => correoLimpio.endsWith(dominio))
  );
}

function Registro({ onRegistro }) {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(formularioInicial);

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const comunasDisponibles =
    regionesYComunas.find((item) => item.region === formulario.region)
      ?.comunas ?? [];

  // Redirigir después de registrar al cliente
  useEffect(() => {
    if (!registroExitoso) return;

    const temporizador = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);

    return () => clearTimeout(temporizador);
  }, [registroExitoso, navigate]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}),
    }));

    setErrores((anterior) => ({
      ...anterior,
      [campo]: "",
      ...(campo === "region" ? { comuna: "" } : {}),
    }));

    setMensaje("");
    setErrorGeneral("");
  };

  const validarRegistro = (e) => {
    e.preventDefault();

    if (registroExitoso) return;

    const nuevosErrores = {};

    const run = formulario.run.trim().toUpperCase();
    const nombre = formulario.nombre.trim();
    const apellidos = formulario.apellidos.trim();
    const email = formulario.email.trim().toLowerCase();
    const direccion = formulario.direccion.trim();

    // Validar RUN
    if (!run) {
      nuevosErrores.run = "El RUN es obligatorio.";
    } else if (!validarRunChileno(run)) {
      nuevosErrores.run = "RUN inválido. Escríbelo sin puntos ni guion.";
    }

    // Validar nombre y apellidos
    if (!nombre) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!apellidos) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    }

    // Validar correo
    if (!email) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!validarCorreo(email)) {
      nuevosErrores.email =
        "Solo se permiten correos @duoc.cl, " +
        "@profesor.duoc.cl y @gmail.com.";
    }

    // Fecha de nacimiento opcional
    if (
      formulario.fechaNac &&
      formulario.fechaNac > new Date().toISOString().slice(0, 10)
    ) {
      nuevosErrores.fechaNac = "La fecha de nacimiento no puede ser futura.";
    }

    // Validar región y comuna
    if (!formulario.region) {
      nuevosErrores.region = "Selecciona una región.";
    }

    if (!formulario.comuna || !comunasDisponibles.includes(formulario.comuna)) {
      nuevosErrores.comuna = "Selecciona una comuna.";
    }

    // Validar dirección
    if (!direccion) {
      nuevosErrores.direccion = "La dirección es obligatoria.";
    }

    // Validar contraseña
    if (formulario.pass.length < 4 || formulario.pass.length > 10) {
      nuevosErrores.pass = "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    if (formulario.pass !== formulario.passConfirm) {
      nuevosErrores.passConfirm = "Las contraseñas no coinciden.";
    }

    setErrores(nuevosErrores);
    setErrorGeneral("");
    setMensaje("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      // Asegurar que existan las cuentas fijas
      inicializarUsuarios();

      const datos = localStorage.getItem("usuariosRegistrados");

      const usuarios = datos ? JSON.parse(datos) : [];

      if (!Array.isArray(usuarios)) {
        throw new Error("Lista de usuarios inválida.");
      }

      // Evitar correo duplicado
      const existeCorreo = usuarios.some(
        (usuario) =>
          String(usuario.email || usuario.correo || "")
            .trim()
            .toLowerCase() === email,
      );

      if (existeCorreo) {
        setErrores({
          email: "Este correo ya está registrado.",
        });
        return;
      }

      // Evitar RUN duplicado
      const existeRun = usuarios.some((usuario) => {
        const runGuardado = String(usuario.run || usuario.rut || "")
          .toUpperCase()
          .replace(/[^0-9K]/g, "");

        return runGuardado === run;
      });

      if (existeRun) {
        setErrores({
          run: "Este RUN ya está registrado.",
        });
        return;
      }

      // Todos los registros públicos son clientes
      const nuevoUsuario = {
        run,
        nombre,
        apellidos,
        email,
        fechaNac: formulario.fechaNac,
        region: formulario.region,
        comuna: formulario.comuna,
        direccion,
        pass: formulario.pass,
        rol: "Cliente",
      };

      // Guardar cuenta
      localStorage.setItem(
        "usuariosRegistrados",
        JSON.stringify([...usuarios, nuevoUsuario]),
      );

      // Crear sesión de cliente
      const usuarioSesion = {
        nombre,
        apellidos,
        email,
        rol: "Cliente",
      };

      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSesion));

      // Sincronizar la sesión y el carrito con App.jsx
      onRegistro?.(usuarioSesion);

      setMensaje(
        `¡Cuenta de ${nombre} creada correctamente! ` +
          "Ingresando a la tienda...",
      );

      setRegistroExitoso(true);
    } catch (error) {
      console.error("Error al registrar:", error);

      setErrorGeneral("No fue posible crear la cuenta. Intenta nuevamente.");
    }
  };

  // Generar un campo de texto reutilizable
  const campo = (nombreCampo, etiqueta, placeholder = "", tipo = "text") => (
    <div className="registro-original-grupo">
      <label htmlFor={`reg-${nombreCampo}`}>{etiqueta}</label>

      <input
        id={`reg-${nombreCampo}`}
        type={tipo}
        placeholder={placeholder}
        value={formulario[nombreCampo]}
        onChange={(e) => actualizarCampo(nombreCampo, e.target.value)}
        className={errores[nombreCampo] ? "registro-original-invalido" : ""}
        autoComplete={
          nombreCampo === "email"
            ? "email"
            : nombreCampo === "nombre"
              ? "given-name"
              : nombreCampo === "apellidos"
                ? "family-name"
                : nombreCampo === "direccion"
                  ? "street-address"
                  : nombreCampo === "pass"
                    ? "new-password"
                    : "off"
        }
      />

      {errores[nombreCampo] && (
        <small className="registro-original-error" role="alert">
          {errores[nombreCampo]}
        </small>
      )}
    </div>
  );

  return (
    <main className="registro-pagina registro-original-pagina">
      <div className="registro-original-panel">
        <h1>Crea tu cuenta</h1>

        <p className="registro-original-descripcion">
          Completa los datos requeridos para registrarte.
        </p>

        <form onSubmit={validarRegistro} noValidate>
          {campo("run", "RUN (SIN PUNTOS NI GUION) *", "19011022K")}

          {campo("nombre", "NOMBRE *", "Juan")}

          {campo("apellidos", "APELLIDOS *", "Pérez González")}

          {campo("email", "CORREO ELECTRÓNICO *", "ejemplo@duoc.cl", "email")}

          {campo("fechaNac", "FECHA DE NACIMIENTO (OPCIONAL)", "", "date")}

          <div className="registro-original-grupo">
            <label htmlFor="reg-region">REGIÓN *</label>

            <select
              id="reg-region"
              value={formulario.region}
              onChange={(e) => actualizarCampo("region", e.target.value)}
              className={errores.region ? "registro-original-invalido" : ""}
            >
              <option value="">-- Selecciona una Región --</option>

              {regionesYComunas.map((item) => (
                <option key={item.region} value={item.region}>
                  {item.region}
                </option>
              ))}
            </select>

            {errores.region && (
              <small className="registro-original-error" role="alert">
                {errores.region}
              </small>
            )}
          </div>

          <div className="registro-original-grupo">
            <label htmlFor="reg-comuna">COMUNA *</label>

            <select
              id="reg-comuna"
              value={formulario.comuna}
              disabled={!formulario.region}
              onChange={(e) => actualizarCampo("comuna", e.target.value)}
              className={errores.comuna ? "registro-original-invalido" : ""}
            >
              <option value="">
                {formulario.region
                  ? "-- Selecciona una Comuna --"
                  : "-- Selecciona primero una Región --"}
              </option>

              {comunasDisponibles.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>

            {errores.comuna && (
              <small className="registro-original-error" role="alert">
                {errores.comuna}
              </small>
            )}
          </div>

          {campo("direccion", "DIRECCIÓN *", "Av. Siempre Viva 123")}

          {campo(
            "pass",
            "CONTRASEÑA (4 A 10 CARACTERES) *",
            "••••••••",
            "password",
          )}

          {campo(
            "passConfirm",
            "CONFIRMAR CONTRASEÑA *",
            "••••••••",
            "password",
          )}

          {mensaje && (
            <div className="alert alert-success" role="status">
              {mensaje}
            </div>
          )}

          {errorGeneral && (
            <div className="alert alert-danger" role="alert">
              {errorGeneral}
            </div>
          )}

          <button
            type="submit"
            className="registro-original-boton"
            disabled={registroExitoso}
          >
            CREAR CUENTA
          </button>
        </form>
      </div>
    </main>
  );
}

export default Registro;
