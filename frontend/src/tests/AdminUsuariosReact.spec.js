import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import AdminUsuarios from "../pages/AdminUsuarios.jsx";

describe("Componente React AdminUsuarios", () => {
  const cuentasPrueba = [
    { nombre: "Ana", apellidos: "Prueba", email: "ana@example.com", rol: "Cliente", pass: "no-mostrar" },
    { nombre: "Beto", apellidos: "Vendedor", email: "beto@example.com", rol: "Vendedor", pass: "no-mostrar" },
    { nombre: "Cami", apellidos: "Admin", email: "cami@example.com", rol: "Administrador", pass: "no-mostrar" },
  ];

  beforeEach(() => {
    localStorage.setItem("usuariosRegistrados", JSON.stringify(cuentasPrueba));
  });

  afterEach(() => {
    cleanup();
    localStorage.removeItem("usuariosRegistrados");
  });

  it("muestra los usuarios y el contador sin exponer contraseñas", () => {
    render(<AdminUsuarios />);
    const tabla = within(screen.getByRole("table"));

    expect(screen.getByText("Total de usuarios: 3")).toBeTruthy();
    expect(tabla.getByText("Ana")).toBeTruthy();
    expect(tabla.getByText("Beto")).toBeTruthy();
    expect(tabla.getByText("Cami")).toBeTruthy();
    expect(screen.queryByText("no-mostrar")).toBeNull();
  });

  it("filtra usuarios según el nombre escrito", () => {
    render(<AdminUsuarios />);
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "ana" } });
    const tabla = within(screen.getByRole("table"));

    expect(screen.getByText("Usuarios encontrados: 1")).toBeTruthy();
    expect(tabla.getByText("Ana")).toBeTruthy();
    expect(tabla.queryByText("Beto")).toBeNull();
  });

  it("filtra usuarios según el rol", () => {
    render(<AdminUsuarios />);
    fireEvent.change(screen.getByLabelText("Filtrar por rol"), { target: { value: "Vendedor" } });
    const tabla = within(screen.getByRole("table"));

    expect(screen.getByText("Usuarios encontrados: 1")).toBeTruthy();
    expect(tabla.getByText("Beto")).toBeTruthy();
    expect(tabla.queryByText("Cami")).toBeNull();
  });

  it("muestra un estado vacío cuando la búsqueda no encuentra resultados", () => {
    render(<AdminUsuarios />);
    fireEvent.change(screen.getByLabelText("Buscar usuario"), { target: { value: "inexistente" } });

    expect(screen.getByText("Usuarios encontrados: 0")).toBeTruthy();
    expect(screen.getByText("No se encontraron usuarios.")).toBeTruthy();
  });
});
