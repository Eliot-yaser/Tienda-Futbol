
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ProductoCard from "../components/ProductoCard.jsx";

describe("Pruebas del componente ProductoCard", () => {

  afterEach(() => {
    cleanup();
  });

  // Prueba 9: mostrar información en la página
  it("Debe mostrar el nombre y precio del producto", () => {
    render(
      <ProductoCard
        nombre="Camiseta Chile"
        precio={59990}
        imagen="/camiseta.png"
        onAgregar={() => {}}
      />
    );

    expect(screen.getByText("Camiseta Chile")).toBeTruthy();
    expect(screen.getByText("Precio: $59.990")).toBeTruthy();
  });

  // Prueba 10: comprobar el botón
  it("Debe llamar a onAgregar al presionar el botón", () => {
    const agregarSimulado = jasmine.createSpy("agregarProducto");

    render(
      <ProductoCard
        nombre="Camiseta Chile"
        precio={59990}
        imagen="/camiseta.png"
        onAgregar={agregarSimulado}
      />
    );

    const boton = screen.getByRole("button", {
      name: "Agregar al carrito",
    });

    fireEvent.click(boton);

    expect(agregarSimulado).toHaveBeenCalledTimes(1);
  });

});
