
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.AdminInventarioService;
import cl.reydelbalon.backend.service.AdminInventarioService.InventarioProducto;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;


import java.util.Map;


@RestController
@RequestMapping("/api/v1/admin/inventario")
@SecurityRequirement(name = "bearerAuth")
public class AdminInventarioController {


    private final AdminInventarioService inventarioService;

    public AdminInventarioController(
            AdminInventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    // Datos enviados para actualizar existencias por talla
    public record SolicitudTallas(
            Map<String, Long> cantidades
    ) {}

    // Datos enviados para registrar una reposicion
    public record SolicitudReposicion(
            Long cantidad
    ) {}

    // GET: consultar el inventario real de un producto
    @GetMapping("/{idProducto}")
    public ResponseEntity<InventarioProducto> consultar(
            @PathVariable Long idProducto) {

        try {
            return ResponseEntity.ok(
                    inventarioService.consultarInventario(idProducto)
            );

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

    // PUT: redistribuir existencias entre las tallas
    @PutMapping("/{idProducto}/tallas")
    public ResponseEntity<InventarioProducto> actualizarTallas(
            @PathVariable Long idProducto,
            @RequestBody SolicitudTallas solicitud) {

        try {
            if (solicitud == null) {
                throw new IllegalArgumentException(
                        "Debes indicar las cantidades por talla."
                );
            }

            return ResponseEntity.ok(
                    inventarioService.actualizarTallas(
                            idProducto,
                            solicitud.cantidades()
                    )
            );

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

    // POST: registrar una reposicion de stock
    @PostMapping("/{idProducto}/reposiciones")
    public ResponseEntity<InventarioProducto> reponerStock(
            @PathVariable Long idProducto,
            @RequestBody SolicitudReposicion solicitud) {

        try {
            if (solicitud == null) {
                throw new IllegalArgumentException(
                        "Debes indicar la cantidad de reposicion."
                );
            }

            return ResponseEntity.ok(
                    inventarioService.reponerStock(
                            idProducto,
                            solicitud.cantidad()
                    )
            );

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
