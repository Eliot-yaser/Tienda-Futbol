
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.entity.Categoria;
import cl.reydelbalon.backend.service.CategoriaService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // GET: listar categorias activas
    @GetMapping
    public ResponseEntity<List<Categoria>> listar() {

        return ResponseEntity.ok(
                categoriaService.listarActivas()
        );
    }

    // GET: buscar categoria por ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    categoriaService.obtenerPorId(id)
            );

        } catch (EntityNotFoundException e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    e.getMessage(),
                    e
            );
        }
    }
}
