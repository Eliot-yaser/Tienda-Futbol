
package cl.reydelbalon.backend.repository;

import cl.reydelbalon.backend.entity.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Buscar solamente categorias activas
    List<Categoria> findByActivoTrue();

    // Verificar si existe una categoria con determinado nombre
    boolean existsByNombreIgnoreCase(String nombre);

    // Verificar duplicados excluyendo la categoria que se esta actualizando
    boolean existsByNombreIgnoreCaseAndIdCategoriaNot(
            String nombre,
            Long idCategoria
    );
}
