
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.entity.Producto;
import cl.reydelbalon.backend.service.ProductoService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // GET: listar productos activos
    @GetMapping
    public ResponseEntity<List<ProductoRespuesta>> listar() {

        List<ProductoRespuesta> productos =
                productoService.listarActivos()
                        .stream()
                        .map(ProductoRespuesta::desde)
                        .toList();

        return ResponseEntity.ok(productos);
    }

    // GET: consultar producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> obtenerPorId(
            @PathVariable Long id) {

        try {

            Producto producto = productoService.obtenerPorId(id);

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no disponible."
                );
            }

            return ResponseEntity.ok(
                    ProductoRespuesta.desde(producto)
            );

        } catch (EntityNotFoundException e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    e.getMessage(),
                    e
            );
        }
    }

    // DTO: respuesta publica de productos
    // Evita exponer directamente las entidades JPA
    public record ProductoRespuesta(
            Long idProducto,
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

        public static ProductoRespuesta desde(Producto producto) {

            return new ProductoRespuesta(
                    producto.getIdProducto(),
                    producto.getCodigo(),
                    producto.getNombre(),
                    producto.getDescripcion(),
                    producto.getPrecio(),
                    producto.getStock(),
                    producto.getStockCritico(),
                    producto.getImagenUrl(),
                    producto.getEnOferta(),
                    producto.getPrecioAnterior(),
                    producto.getCategoria().getIdCategoria()
            );
        }
    }
}
