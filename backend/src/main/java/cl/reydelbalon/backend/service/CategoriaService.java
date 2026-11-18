
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Categoria;
import cl.reydelbalon.backend.repository.CategoriaRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    // Inyeccion de dependencias por constructor
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Listar todas las categorias
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // Listar solamente categorias activas
    public List<Categoria> listarActivas() {
        return categoriaRepository.findByActivoTrue();
    }

    // Buscar categoria por ID
    public Categoria obtenerPorId(Long id) {

        validarId(id);

        return categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "No se encontro la categoria con ID: " + id
                        )
                );
    }

    // Registrar una nueva categoria
    @Transactional
    public Categoria crear(Categoria categoria) {

        validarCategoria(categoria);

        categoria.setIdCategoria(null);
        categoria.setNombre(categoria.getNombre().trim());

        validarNombreUnico(categoria.getNombre(), null);

        if (categoria.getActivo() == null) {
            categoria.setActivo(true);
        }

        return categoriaRepository.save(categoria);
    }

    // Actualizar una categoria existente
    @Transactional
    public Categoria actualizar(Long id, Categoria datos) {

        validarCategoria(datos);

        Categoria existente = obtenerPorId(id);

        String nombre = datos.getNombre().trim();

        validarNombreUnico(nombre, id);

        existente.setNombre(nombre);
        existente.setDescripcion(datos.getDescripcion());

        if (datos.getActivo() != null) {
            existente.setActivo(datos.getActivo());
        }

        return categoriaRepository.save(existente);
    }

    // Desactivar categoria sin eliminarla de MySQL
    @Transactional
    public Categoria desactivar(Long id) {

        Categoria categoria = obtenerPorId(id);

        categoria.setActivo(false);

        return categoriaRepository.save(categoria);
    }

    // Reactivar una categoria
    @Transactional
    public Categoria activar(Long id) {

        Categoria categoria = obtenerPorId(id);

        categoria.setActivo(true);

        return categoriaRepository.save(categoria);
    }

    // Validar los datos de entrada
    private void validarCategoria(Categoria categoria) {

        if (categoria == null) {
            throw new IllegalArgumentException(
                    "Los datos de la categoria son obligatorios."
            );
        }

        if (categoria.getNombre() == null ||
                categoria.getNombre().isBlank()) {

            throw new IllegalArgumentException(
                    "El nombre de la categoria es obligatorio."
            );
        }

        if (categoria.getNombre().trim().length() > 80) {
            throw new IllegalArgumentException(
                    "El nombre no puede superar los 80 caracteres."
            );
        }

        if (categoria.getDescripcion() != null &&
                categoria.getDescripcion().length() > 255) {

            throw new IllegalArgumentException(
                    "La descripcion no puede superar los 255 caracteres."
            );
        }
    }

    // Validar el identificador
    private void validarId(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                    "El ID de la categoria no es valido."
            );
        }
    }

    // Validar nombres duplicados directamente en MySQL
    private void validarNombreUnico(String nombre, Long idExcluir) {

        boolean existe;

        if (idExcluir == null) {

            existe = categoriaRepository
                    .existsByNombreIgnoreCase(nombre);

        } else {

            existe = categoriaRepository
                    .existsByNombreIgnoreCaseAndIdCategoriaNot(
                            nombre,
                            idExcluir
                    );
        }

        if (existe) {
            throw new IllegalArgumentException(
                    "Ya existe una categoria con ese nombre."
            );
        }
    }
}
