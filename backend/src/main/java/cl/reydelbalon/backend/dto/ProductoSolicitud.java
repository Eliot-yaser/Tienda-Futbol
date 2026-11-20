package cl.reydelbalon.backend.dto;

import cl.reydelbalon.backend.entity.Categoria;
import cl.reydelbalon.backend.entity.Producto;

import java.math.BigDecimal;

public record ProductoSolicitud(
        String codigo,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Long stock,
        Long stockCritico,
        String imagenUrl,
        Boolean enOferta,
        BigDecimal precioAnterior,
        Long idCategoria
) {

    public Producto convertirAProducto() {

        Producto producto = new Producto();

        producto.setCodigo(codigo);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setStockCritico(stockCritico);
        producto.setImagenUrl(imagenUrl);
        producto.setEnOferta(enOferta);
        producto.setPrecioAnterior(precioAnterior);

        if (idCategoria != null) {
            Categoria categoria = new Categoria();
            categoria.setIdCategoria(idCategoria);
            producto.setCategoria(categoria);
        }

        return producto;
    }
}
