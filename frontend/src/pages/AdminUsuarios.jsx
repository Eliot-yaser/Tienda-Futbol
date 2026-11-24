
import { useEffect, useMemo, useState } from "react";
import { obtenerUsuariosAdmin } from "../utils/usuariosAdminApi";

const nombresRoles = {
  ADMINISTRADOR: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

export default function AdminUsuarios({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuarios desde Spring Boot y MySQL
  useEffect(() => {
    const controller = new AbortController();

    async function cargarUsuarios() {
      setCargando(true);
      setError("");
      setUsuarios([]);

      try {
        const datos = await obtenerUsuariosAdmin(
          usuario?.token,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setUsuarios(datos);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message || "No se pudieron cargar los usuarios."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarUsuarios();

    return () => controller.abort();
  }, [usuario?.token]);

  // Buscar por nombre o correo y filtrar por rol
  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return usuarios.filter((item) => {
      const nombre = `${item.nombre || ""} ${item.apellidos || ""}`;
      const correo = item.email || "";

      const coincideBusqueda =
        nombre.toLowerCase().includes(texto) ||
        correo.toLowerCase().includes(texto);

      const coincideRol =
        filtroRol === "Todos" || item.rol === filtroRol;

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
        <h5>
          Total de usuarios: {cargando ? "Cargando..." : usuarios.length}
        </h5>

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
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="alert alert-info">
          Cargando usuarios desde MySQL...
        </div>
      )}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">
              Usuarios encontrados: {usuariosFiltrados.length}
            </h5>

            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre || "-"}</td>
                      <td>{item.apellidos || "-"}</td>
                      <td>{item.email || "-"}</td>
                      <td>
                        {nombresRoles[item.rol] || item.rol || "Sin rol"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.activo ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {item.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {usuariosFiltrados.length === 0 && (
                <p className="text-center text-muted py-3">
                  No se encontraron usuarios.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
