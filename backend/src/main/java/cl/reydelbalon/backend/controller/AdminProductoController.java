
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.entity.Producto;
import cl.reydelbalon.backend.service.ProductoService;
import cl.reydelbalon.backend.controller.ProductoController.ProductoRespuesta;

import cl.reydelbalon.backend.dto.ProductoSolicitud;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/productos")
public class AdminProductoController {

    private final ProductoService productoService;

    public AdminProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // Listar todos los productos, incluso los desactivados.
    @GetMapping
    public ResponseEntity<List<ProductoRespuesta>> listarTodos() {

        List<ProductoRespuesta> productos = productoService.listarTodos()
                .stream()
                .map(ProductoRespuesta::desde)
                .toList();

        return ResponseEntity.ok(productos);
    }

    // Consultar un producto por su ID.
    @GetMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> obtenerPorId(
            @PathVariable Long id) {

        Producto producto = productoService.obtenerPorId(id);

        return ResponseEntity.ok(
                ProductoRespuesta.desde(producto));
    }

    // Crear un producto nuevo
    @PostMapping
    public ResponseEntity<ProductoRespuesta> crear(
            @RequestBody ProductoSolicitud solicitud) {

        Producto datos = solicitud.convertirAProducto();

        Producto creado = productoService.crear(datos);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ProductoRespuesta.desde(creado));
    }

    // Actualizar un producto existente
    @PutMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> actualizar(
            @PathVariable Long id,
            @RequestBody ProductoSolicitud solicitud) {

        Producto datos = solicitud.convertirAProducto();

        Producto actualizado = productoService.actualizar(id, datos);

        return ResponseEntity.ok(
                ProductoRespuesta.desde(actualizado));
    }

    // Desactivar un producto sin eliminarlo de MySQL
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> desactivar(
            @PathVariable Long id) {

        Producto desactivado = productoService.desactivar(id);

        return ResponseEntity.ok(
                ProductoRespuesta.desde(desactivado));
    }

    // Reactivar un producto desactivado
    @PatchMapping("/{id}/activar")
    public ResponseEntity<ProductoRespuesta> activar(
            @PathVariable Long id) {

        Producto activado = productoService.activar(id);

        return ResponseEntity.ok(
                ProductoRespuesta.desde(activado));
    }

}
