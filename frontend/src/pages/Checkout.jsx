import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  REGIONES_COMUNAS, datosCheckoutInicial, validarDatosCheckout, prepararDatosEntrega,
} from "../utils/checkout.js";
import "./Checkout.css";

const pesos = (valor) => `$${Number(valor || 0).toLocaleString("es-CL")}`;

function obtenerUsuariosLocales() {
  try {
    const valor = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}

export default function Checkout({ carrito, totalCarrito, usuario, confirmarCompra }) {
  const navigate = useNavigate();
  const enviandoRef = useRef(false);
  const [datos, setDatos] = useState(() => datosCheckoutInicial(usuario, obtenerUsuariosLocales()));
  const [errores, setErrores] = useState({});

  const cambiar = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior, [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}),
    }));
    setErrores((anterior) => ({ ...anterior, [campo]: "" }));
  };

  const confirmar = (evento) => {
    evento.preventDefault();
    if (enviandoRef.current || carrito.length === 0) return;
    const fallas = validarDatosCheckout(datos);
    setErrores(fallas);
    if (Object.keys(fallas).length > 0) return;

    enviandoRef.current = true;
    const carritoResumen = carrito.map(({ codigo, nombre, precio, cantidad, talla }) =>
      ({ codigo, nombre, precio, cantidad, talla: talla ?? null }));
    const datosPedido = prepararDatosEntrega(datos);

    // Modo de prueba explícito: no se registra venta ni se descuenta stock.
    if (datos.resultadoPago === "Rechazado") {
      navigate("/compra-error", {
        replace: true,
        state: { mensaje: "Pago rechazado en la simulación. No se registró la venta.", carrito: carritoResumen, total: totalCarrito },
      });
      return;
    }

    const resultado = confirmarCompra(datosPedido);
    if (resultado.exito) {
      navigate("/compra-exitosa", { replace: true, state: { venta: resultado.venta } });
    } else {
      navigate("/compra-error", {
        replace: true,
        state: { mensaje: resultado.mensaje, carrito: carritoResumen, total: totalCarrito },
      });
    }
  };

  if (carrito.length === 0) {
    return <main className="container py-5"><h1>Finalizar compra</h1>
      <div className="alert alert-info">Tu carrito está vacío.</div>
      <Link className="btn btn-dark" to="/productos">Ver productos</Link>
    </main>;
  }

  const campo = (id, label, options = {}) => (
    <div className={options.clase || "col-12 col-md-6"}>
      <label className="form-label" htmlFor={`checkout-${id}`}>{label}</label>
      <input id={`checkout-${id}`} className={`form-control ${errores[id] ? "is-invalid" : ""}`}
        type={options.tipo || "text"} maxLength={options.max || 120}
        value={datos[id]} onChange={(e) => cambiar(id, e.target.value)}
        required={Boolean(options.requerido)} autoComplete={options.autoComplete}/>
      {errores[id] && <div className="invalid-feedback">{errores[id]}</div>}
    </div>
  );

  return <main className="container py-5 checkout-pagina">
    <h1 className="fw-bold mb-2">Finalizar compra</h1>
    <p className="text-secondary mb-4">Completa los datos del pedido. Todo el proceso de pago es simulado.</p>
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        <form id="formulario-checkout" className="card shadow-sm" onSubmit={confirmar} noValidate>
          <div className="card-body p-4">
            <h2 className="h5 fw-bold mb-3">Datos del cliente</h2>
            <div className="row g-3">
              {campo("nombre", "Nombre *", { requerido: true, autoComplete: "given-name" })}
              {campo("apellidos", "Apellidos *", { requerido: true, autoComplete: "family-name" })}
              {campo("email", "Correo electrónico *", { requerido: true, tipo: "email", clase: "col-12", autoComplete: "email" })}
            </div>
            <hr className="my-4" />
            <h2 className="h5 fw-bold mb-3">Entrega</h2>
            <div className="mb-3">
              <label htmlFor="checkout-tipoEntrega" className="form-label">Forma de entrega</label>
              <select id="checkout-tipoEntrega" className="form-select" value={datos.tipoEntrega}
                onChange={(e) => cambiar("tipoEntrega", e.target.value)}>
                <option value="Domicilio">Entrega a domicilio (simulada)</option>
                <option value="Retiro">Retiro en tienda (simulado)</option>
              </select>
              {errores.tipoEntrega && <p className="text-danger">{errores.tipoEntrega}</p>}
            </div>
            {datos.tipoEntrega === "Domicilio" ? <div className="row g-3">
              {campo("calle", "Calle / dirección *", { requerido: true, clase: "col-12", autoComplete: "street-address" })}
              {campo("numero", "Número *", { requerido: true })}
              {campo("departamento", "Departamento / casa (opcional)")}
              <div className="col-12 col-md-6">
                <label htmlFor="checkout-region" className="form-label">Región *</label>
                <select id="checkout-region" className={`form-select ${errores.region ? "is-invalid" : ""}`}
                  value={datos.region} onChange={(e) => cambiar("region", e.target.value)} required>
                  <option value="">Selecciona una región</option>
                  {Object.keys(REGIONES_COMUNAS).map((region) => <option value={region} key={region}>{region}</option>)}
                </select>
                {errores.region && <div className="invalid-feedback">{errores.region}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="checkout-comuna" className="form-label">Comuna *</label>
                <select id="checkout-comuna" className={`form-select ${errores.comuna ? "is-invalid" : ""}`}
                  value={datos.comuna} onChange={(e) => cambiar("comuna", e.target.value)}
                  disabled={!datos.region} required>
                  <option value="">Selecciona una comuna</option>
                  {(REGIONES_COMUNAS[datos.region] || []).map((comuna) => <option value={comuna} key={comuna}>{comuna}</option>)}
                </select>
                {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
              </div>
            </div> : <div className="alert alert-info">Coordinación de retiro de demostración; no se cobra ni se envía un pedido real.</div>}
            <div className="mt-3">
              <label htmlFor="checkout-indicaciones" className="form-label">Indicaciones (opcional)</label>
              <textarea id="checkout-indicaciones" rows="2" maxLength="250" className="form-control"
                value={datos.indicaciones} onChange={(e) => cambiar("indicaciones", e.target.value)}/>
            </div>
            <hr className="my-4" />
            <h2 className="h5 fw-bold mb-3">Pago de demostración</h2>
            <label className="form-label" htmlFor="checkout-resultadoPago">Resultado del pago (prueba)</label>
            <select id="checkout-resultadoPago" className="form-select" value={datos.resultadoPago}
              onChange={(e) => cambiar("resultadoPago", e.target.value)}>
              <option value="Aprobado">Simular pago aprobado</option>
              <option value="Rechazado">Simular pago rechazado</option>
            </select>
            <p className="text-secondary small mt-2">No se solicita tarjeta, no se cobra dinero y no se conecta a una pasarela real.</p>
            <div className="d-flex gap-3 flex-wrap mt-4">
              <Link className="btn btn-outline-dark" to="/carrito">Volver al carrito</Link>
              <button type="submit" className="btn btn-success fw-bold">Confirmar compra simulada</button>
            </div>
          </div>
        </form>
      </div>
      <aside className="col-12 col-lg-5" aria-label="Resumen de compra">
        <div className="card shadow-sm checkout-resumen">
          <div className="card-body p-4">
            <h2 className="h5 fw-bold mb-3">Resumen de tu pedido</h2>
            <div className="table-responsive"><table className="table table-sm align-middle">
              <thead><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr></thead>
              <tbody>{carrito.map((item) => <tr key={`${item.codigo}-${item.talla ?? "unica"}`}>
                <td>{item.nombre} {item.talla ? <small className="text-secondary">({item.talla})</small> : null}</td>
                <td>{item.cantidad}</td><td>{pesos(item.precio * item.cantidad)}</td>
              </tr>)}</tbody>
            </table></div>
            <div className="d-flex justify-content-between border-top pt-3 fw-bold fs-5">
              <span>Total:</span><span>{pesos(totalCarrito)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>;
}
