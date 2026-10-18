import { Link, useLocation } from "react-router-dom";
import "./Checkout.css";
const pesos = (valor) => `$${Number(valor || 0).toLocaleString("es-CL")}`;

export default function CompraResultado({ exito }) {
  const { state } = useLocation();
  const venta = exito ? state?.venta : null;
  const productos = exito ? venta?.productos : state?.carrito;

  if (exito && !venta) {
    return <main className="container py-5"><div className="alert alert-info">No hay un comprobante reciente para mostrar.</div>
      <Link className="btn btn-dark" to="/">Volver a la tienda</Link></main>;
  }

  return <main className="container py-5 checkout-resultado">
    <section className="card shadow-sm mx-auto">
      <div className="card-body p-4 p-md-5">
        <h1 className={`h3 fw-bold ${exito ? "text-success" : "text-danger"}`}>
          {exito ? "✅ ¡Compra realizada!" : "❌ No se pudo realizar el pago"}
        </h1>
        <p>{exito ? "Tu compra simulada se registró y descontó existencias." :
          (state?.mensaje || "No se pudo completar la operación simulada.")}</p>
        {venta && <>
          <p className="mb-1"><strong>Número de pedido:</strong> {venta.id}</p>
          <p className="mb-1"><strong>Cliente:</strong> {venta.cliente?.nombre} {venta.cliente?.apellidos}</p>
          <p className="mb-1"><strong>Correo:</strong> {venta.cliente?.email}</p>
          <p><strong>Entrega:</strong> {venta.entrega?.tipo === "Retiro" ? "Retiro simulado en tienda" :
            [venta.entrega?.calle, venta.entrega?.numero, venta.entrega?.departamento, venta.entrega?.comuna, venta.entrega?.region]
              .filter(Boolean).join(", ")}</p>
        </>}
        {Array.isArray(productos) && <div className="table-responsive mt-4">
          <table className="table table-striped align-middle"><thead><tr><th>Producto</th><th>Talla</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
            <tbody>{productos.map((item, i) => <tr key={`${item.codigo}-${item.talla ?? "unica"}-${i}`}>
              <td>{item.nombre}</td><td>{item.talla || "Única"}</td><td>{item.cantidad}</td>
              <td>{pesos(item.precio * item.cantidad)}</td>
            </tr>)}</tbody></table></div>}
        {productos?.length > 0 && <p className="fs-5 fw-bold text-end">Total: {pesos(exito ? venta.total : state?.total)}</p>}
        <p className="small text-secondary">Demostración local. No se procesó un pago real.</p>
        <div className="d-flex flex-wrap gap-2">
          {exito ? <Link className="btn btn-success" to="/productos">Seguir comprando</Link> :
            <Link className="btn btn-danger" to="/checkout">Volver a intentar</Link>}
          <Link className="btn btn-outline-dark" to="/">Ir al inicio</Link>
        </div>
      </div>
    </section>
  </main>;
}
