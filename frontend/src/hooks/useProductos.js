import { useEffect, useState } from "react";
import productosBase from "../data/productos.js";
import { cargarProductos } from "../utils/productos.js";

function leerProductos() {
  try {
    return cargarProductos();
  } catch (error) {
    console.error("No se pudo cargar el catálogo:", error);
    return productosBase.map((producto) => ({ ...producto }));
  }
}

// Todos los módulos leen el mismo catálogo y reaccionan a las actualizaciones.
export function useProductos() {
  const [productos, setProductos] = useState(leerProductos);

  useEffect(() => {
    const actualizar = () => setProductos(leerProductos());
    const sincronizarPestana = (evento) => {
      if (evento.key === null || evento.key === "rey-balon-productos-v1") {
        actualizar();
      }
    };
    window.addEventListener("rey-balon-productos-cambiaron", actualizar);
    window.addEventListener("storage", sincronizarPestana);
    return () => {
      window.removeEventListener("rey-balon-productos-cambiaron", actualizar);
      window.removeEventListener("storage", sincronizarPestana);
    };
  }, []);

  return productos;
}
