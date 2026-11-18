
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.ProductoTallaService;
import cl.reydelbalon.backend.service.ProductoTallaService.TallaStock;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos/{idProducto}/tallas")
public class ProductoTallaController {

    private final ProductoTallaService productoTallaService;

    // Inyeccion de dependencias
    public ProductoTallaController(
            ProductoTallaService productoTallaService) {

        this.productoTallaService = productoTallaService;
    }

    // GET: consultar todas las tallas de un producto
    @GetMapping
    public ResponseEntity<List<TallaStock>> listarTallas(
            @PathVariable Long idProducto) {

        try {
            List<TallaStock> tallas =
                    productoTallaService.listarPorProducto(idProducto);

            return ResponseEntity.ok(tallas);

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, e.getMessage(), e
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage(), e
            );
        }
    }

    // GET: consultar el stock de una talla especifica
    @GetMapping("/{talla}")
    public ResponseEntity<TallaStock> obtenerTalla(
            @PathVariable Long idProducto,
            @PathVariable String talla) {

        try {
            TallaStock resultado =
                    productoTallaService.obtenerPorProductoYTalla(
                            idProducto, talla
                    );

            return ResponseEntity.ok(resultado);

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, e.getMessage(), e
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage(), e
            );
        }
    }
}
