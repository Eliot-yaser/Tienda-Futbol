
import { useEffect, useState } from "react";
import productosBase from "../data/productos.js";
import { cargarProductos } from "../utils/productos.js";

const API_URL = "http://localhost:8080/api/v1";

// Respaldo temporal del catalogo local
function leerProductosLocales() {
  try {
    return cargarProductos();
  } catch (error) {
    console.error("Error al cargar productos locales:", error);
    return productosBase.map((producto) => ({ ...producto }));
  }
}

// Transformar la respuesta de Spring Boot al formato de React
function adaptarProductos(productosApi, categoriasApi) {
  const nombresCategorias = new Map(
    categoriasApi.map((categoria) => [
      categoria.idCategoria,
      categoria.nombre,
    ])
  );

  const productosLocales = new Map(
    leerProductosLocales().map((producto) => [
      producto.codigo,
      producto,
    ])
  );

  return productosApi.map((producto) => {
    const respaldo = productosLocales.get(producto.codigo);

    return {
      ...producto,
      categoria:
        nombresCategorias.get(producto.idCategoria) ??
        respaldo?.categoria ??
        "Sin categoría",
      imagen: producto.imagenUrl || respaldo?.imagen || "",
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      stockCritico: Number(producto.stockCritico),
      enOferta: producto.enOferta === true,
      precioAnterior:
        producto.precioAnterior == null
          ? null
          : Number(producto.precioAnterior),
    };
  });
}

// Hook centralizado del catalogo
export function useProductos() {
  const [productos, setProductos] = useState(leerProductosLocales);

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarDesdeApi() {
      try {
        const [respuestaProductos, respuestaCategorias] =
          await Promise.all([
            fetch(`${API_URL}/productos`, {
              signal: controlador.signal,
              cache: "no-store",
            }),
            fetch(`${API_URL}/categorias`, {
              signal: controlador.signal,
              cache: "no-store",
            }),
          ]);

        if (!respuestaProductos.ok || !respuestaCategorias.ok) {
          throw new Error("No se pudo consultar la API REST.");
        }

        const [datosProductos, datosCategorias] =
          await Promise.all([
            respuestaProductos.json(),
            respuestaCategorias.json(),
          ]);

        if (!Array.isArray(datosProductos) ||
            !Array.isArray(datosCategorias)) {
          throw new Error("La API devolvio un formato invalido.");
        }

        if (!controlador.signal.aborted) {
          setProductos(
            adaptarProductos(datosProductos, datosCategorias)
          );
          console.info(
            `Catalogo MySQL cargado: ${datosProductos.length} productos.`
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error de conexion con Spring Boot:", error);
          // Se conserva el catalogo local como respaldo temporal.
        }
      }
    }

    // Mantener compatibilidad con cambios locales existentes
    const actualizarLocal = () => {
      setProductos(leerProductosLocales());
    };

    const sincronizarPestana = (evento) => {
      if (
        evento.key === null ||
        evento.key === "rey-balon-productos-v1"
      ) {
        actualizarLocal();
      }
    };

    window.addEventListener(
      "rey-balon-productos-cambiaron",
      actualizarLocal
    );
    window.addEventListener("storage", sincronizarPestana);

    cargarDesdeApi();

    return () => {
      controlador.abort();
      window.removeEventListener(
        "rey-balon-productos-cambiaron",
        actualizarLocal
      );
      window.removeEventListener("storage", sincronizarPestana);
    };
  }, []);

  return productos;
}
