import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../pages/Checkout.jsx";

describe("Componente React Checkout", () => {
  const carritoPrueba = [
    { codigo: "BAL-T01", nombre: "Balón de prueba", cantidad: 2, precio: 10000, talla: null },
  ];

  const renderCheckout = (props = {}) => {
    const confirmarCompra = jasmine.createSpy("confirmarCompra");
    render(
      <MemoryRouter>
        <Checkout
          carrito={carritoPrueba}
          totalCarrito={20000}
          usuario={null}
          confirmarCompra={confirmarCompra}
          {...props}
        />
      </MemoryRouter>,
    );
    return confirmarCompra;
  };

  afterEach(() => {
    cleanup();
    localStorage.removeItem("usuariosRegistrados");
  });

  it("muestra el aviso cuando no hay artículos en el carrito", () => {
    renderCheckout({ carrito: [], totalCarrito: 0 });
    expect(screen.getByText("Tu carrito está vacío.")).toBeTruthy();
  });

  it("muestra el producto y el total calculado en el resumen", () => {
    renderCheckout();
    expect(screen.getByText("Balón de prueba")).toBeTruthy();
    expect(screen.getAllByText("$20.000").length).toBeGreaterThan(0);
  });

  it("valida datos obligatorios y no confirma compras incompletas", () => {
    const confirmarCompra = renderCheckout();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar compra simulada" }));

    expect(screen.getByText("Ingresa tu nombre.")).toBeTruthy();
    expect(screen.getByText("Ingresa un correo válido.")).toBeTruthy();
    expect(confirmarCompra).not.toHaveBeenCalled();
  });

  it("actualiza el formulario si se selecciona retiro en tienda", () => {
    renderCheckout();
    fireEvent.change(screen.getByLabelText("Forma de entrega"), { target: { value: "Retiro" } });

    expect(screen.getByText(/Coordinación de retiro de demostración/)).toBeTruthy();
    expect(screen.queryByLabelText("Calle / dirección *")).toBeNull();
  });
});
