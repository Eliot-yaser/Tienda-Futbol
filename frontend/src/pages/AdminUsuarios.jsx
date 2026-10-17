
import { useEffect, useMemo, useState } from "react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarUsuarios = () => {
      try {
        const datos = localStorage.getItem("usuariosRegistrados");
        const lista = datos ? JSON.parse(datos) : [];

        if (!Array.isArray(lista)) {
          throw new Error("Datos de usuarios no válidos");
        }

        setUsuarios(lista);
        setError("");
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsuarios([]);
        setError("No se pudieron cargar los usuarios.");
      }
    };

    cargarUsuarios();

    window.addEventListener("storage", cargarUsuarios);

    return () => {
      window.removeEventListener("storage", cargarUsuarios);
    };
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const nombre = `${usuario.nombre || ""} ${usuario.apellidos || ""}`;
      const correo = usuario.email || usuario.correo || "";

      const coincideBusqueda =
        nombre.toLowerCase().includes(texto) ||
        correo.toLowerCase().includes(texto);

      const coincideRol =
        filtroRol === "Todos" || usuario.rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-3">
        Administración de Usuarios
      </h2>

      <p className="text-muted">
        Consulta los usuarios registrados en Rey del Balón.
      </p>

      <div className="card shadow-sm p-4 mb-4">
        <h5>Total de usuarios: {usuarios.length}</h5>

        <div className="row g-3 mt-2">
          <div className="col-md-8">
            <label htmlFor="buscarUsuario" className="form-label">
              Buscar usuario
            </label>

            <input
              id="buscarUsuario"
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="filtroRol" className="form-label">
              Filtrar por rol
            </label>

            <select
              id="filtroRol"
              className="form-select"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">
            Usuarios encontrados: {usuariosFiltrados.length}
          </h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Rol</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario, index) => (
                  <tr key={`${usuario.email || usuario.correo}-${index}`}>
                    <td>{usuario.nombre || "-"}</td>
                    <td>{usuario.apellidos || "-"}</td>
                    <td>{usuario.email || usuario.correo || "-"}</td>
                    <td>{usuario.rol || "Sin rol"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuariosFiltrados.length === 0 && !error && (
              <p className="text-center text-muted py-3">
                No se encontraron usuarios.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
