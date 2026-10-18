import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos.js";
import { crearProducto, editarProducto, eliminarProducto } from "../utils/productos.js";
import "./AdminProductos.css";

const FORMULARIO_VACIO = {
  codigo: "", nombre: "", descripcion: "", categoria: "Camisetas",
  precio: "", stock: "", stockCritico: "", imagen: "",
};
const CLAVES_CATEGORIA = ["Camisetas", "Shorts", "Calzado", "Balones", "Medias", "Canilleras", "Guantes"];

export default function AdminProductos() {
  const productos = useProductos();
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].filter(Boolean),
    [productos],
  );
  // Categorías permitidas por el catálogo de la evaluación.
  const categoriasDisponibles = categorias.length ? categorias : CLAVES_CATEGORIA;

  const visibles = productos.filter((p) =>
    [p.codigo, p.nombre, p.categoria].some((valor) =>
      String(valor || "").toLowerCase().includes(busqueda.trim().toLowerCase()),
    ),
  );

  const cambiar = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setMensaje("");
    setError("");
  };

  const limpiar = () => {
    setFormulario(FORMULARIO_VACIO);
    setEditando(null);
    setMensaje("");
    setError("");
  };

  const editar = (producto) => {
    setEditando(producto.codigo);
    setFormulario({ ...producto });
    setError("");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = (evento) => {
    evento.preventDefault();
    try {
      if (editando) {
        editarProducto(editando, formulario);
        setMensaje(`Producto ${editando} actualizado correctamente.`);
      } else {
        const nuevo = crearProducto(formulario);
        setMensaje(`Producto ${nuevo.codigo} creado correctamente.`);
      }
      setEditando(null);
      setFormulario(FORMULARIO_VACIO);
      setError("");
    } catch (err) {
      setError(err.message || "No fue posible guardar el producto.");
      setMensaje("");
    }
  };

  const eliminar = (producto) => {
    if (!window.confirm(`¿Eliminar ${producto.codigo} - ${producto.nombre}?`)) return;
    try {
      eliminarProducto(producto.codigo);
      if (editando === producto.codigo) limpiar();
      setError("");
      setMensaje(`Producto ${producto.codigo} eliminado correctamente.`);
    } catch (err) {
      setError(err.message || "No fue posible eliminar el producto.");
      setMensaje("");
    }
  };

  return (
    <main className="container py-5 admin-productos">
      <header className="bg-dark text-white rounded-4 p-4 mb-4">
        <h1>📦 Gestión de productos</h1>
        <p className="mb-0">Crea, edita y elimina productos del catálogo de Rey del Balón.</p>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <section className="card shadow-sm mb-4" aria-label="Formulario de producto">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-3">{editando ? `Editar producto ${editando}` : "Agregar producto"}</h2>
          <form onSubmit={guardar}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label htmlFor="producto-codigo" className="form-label">Código</label>
                <input id="producto-codigo" className="form-control" required maxLength={20}
                  placeholder="EJ-001" value={formulario.codigo}
                  disabled={Boolean(editando)} onChange={(e) => cambiar("codigo", e.target.value)} />
              </div>
              <div className="col-12 col-md-8">
                <label htmlFor="producto-nombre" className="form-label">Nombre</label>
                <input id="producto-nombre" className="form-control" required value={formulario.nombre}
                  onChange={(e) => cambiar("nombre", e.target.value)} />
              </div>
              <div className="col-12">
                <label htmlFor="producto-descripcion" className="form-label">Descripción</label>
                <textarea id="producto-descripcion" className="form-control" rows={2} required
                  value={formulario.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="producto-categoria" className="form-label">Categoría</label>
                <select id="producto-categoria" className="form-select" required value={formulario.categoria}
                  disabled={Boolean(editando)} onChange={(e) => cambiar("categoria", e.target.value)}>
                  {categoriasDisponibles.map((categoria) =>
                    <option key={categoria} value={categoria}>{categoria}</option>
                  )}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="producto-imagen" className="form-label">URL de imagen</label>
                <input id="producto-imagen" type="url" className="form-control" required
                  placeholder="https://..." value={formulario.imagen}
                  onChange={(e) => cambiar("imagen", e.target.value)} />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="producto-precio" className="form-label">Precio (CLP)</label>
                <input id="producto-precio" type="number" min="1" step="1" required className="form-control"
                  value={formulario.precio} onChange={(e) => cambiar("precio", e.target.value)} />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="producto-stock" className="form-label">Stock inicial</label>
                <input id="producto-stock" type="number" min="0" step="1" required className="form-control"
                  disabled={Boolean(editando)} value={formulario.stock}
                  onChange={(e) => cambiar("stock", e.target.value)} />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="producto-stock-critico" className="form-label">Stock crítico</label>
                <input id="producto-stock-critico" type="number" min="0" step="1" required className="form-control"
                  value={formulario.stockCritico}
                  onChange={(e) => cambiar("stockCritico", e.target.value)} />
              </div>
            </div>
            <p className="text-secondary small mt-3 mb-3">
              En edición, la categoría, el código y el stock inicial se conservan para proteger el inventario.
              Las existencias por talla se configuran desde Inventario.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary" type="submit">
                {editando ? "Guardar cambios" : "Crear producto"}
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={limpiar}>Limpiar</button>
              <Link className="btn btn-outline-dark" to="/admin/inventario">Gestionar inventario</Link>
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm" aria-label="Listado de productos">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 className="h4 fw-bold mb-0">Catálogo: {productos.length} productos</h2>
            <div className="admin-productos-buscar">
              <label htmlFor="buscar-admin-producto" className="visually-hidden">Buscar producto</label>
              <input id="buscar-admin-producto" className="form-control" placeholder="Buscar por código, nombre o categoría"
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark"><tr>
                <th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Acciones</th>
              </tr></thead>
              <tbody>
                {visibles.map((p) =>
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td><td>{p.nombre}</td><td>{p.categoria}</td>
                    <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editar(p)}>Editar</button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {visibles.length === 0 && <p className="text-secondary">No hay productos que coincidan con la búsqueda.</p>}
        </div>
      </section>
      <Link className="btn btn-link mt-3" to="/admin">← Volver al administrador</Link>
    </main>
  );
}
