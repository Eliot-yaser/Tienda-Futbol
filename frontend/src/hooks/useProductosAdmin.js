import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function useProductosAdmin(token) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    if (!token) {
      setProductos([]);
      setError("Debes iniciar sesión como administrador.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const [respuesta, respuestaCategorias] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/v1/categorias`),
      ]);

      if (!respuesta.ok) {
        throw new Error(
          `No se pudieron cargar los productos (HTTP ${respuesta.status}).`,
        );
      }

      const [datos, categorias] = await Promise.all([
        respuesta.json(),
        respuestaCategorias.json(),
      ]);

      if (!respuestaCategorias.ok) {
        throw new Error(
          `No se pudieron cargar las categorías (HTTP ${respuestaCategorias.status}).`,
        );
      }

      if (!Array.isArray(datos) || !Array.isArray(categorias)) {
        throw new Error("La API devolvió un formato inválido.");
      }

      const nombresCategorias = new Map(
        categorias.map((categoria) => [
          categoria.idCategoria,
          categoria.nombre,
        ]),
      );

      const productosAdaptados = datos.map((producto) => ({
        ...producto,
        categoria:
          nombresCategorias.get(producto.idCategoria) ?? "Sin categoría",
        imagen: producto.imagenUrl ?? "",
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        stockCritico: Number(producto.stockCritico),
        precioAnterior:
          producto.precioAnterior == null
            ? null
            : Number(producto.precioAnterior),
      }));

      setProductos(productosAdaptados);
    } catch (err) {
      setError(err.message || "Error al consultar los productos.");
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { productos, cargando, error, recargar };
}
