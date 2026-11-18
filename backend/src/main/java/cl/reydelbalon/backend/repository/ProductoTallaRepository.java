
package cl.reydelbalon.backend.repository;

import cl.reydelbalon.backend.entity.ProductoTalla;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoTallaRepository
        extends JpaRepository<ProductoTalla, Long> {

    // Consultar todas las tallas de un producto
    List<ProductoTalla> findByProducto_IdProductoOrderByTallaAsc(
            Long idProducto
    );

    // Consultar una talla especifica de un producto
    Optional<ProductoTalla> findByProducto_IdProductoAndTalla(
            Long idProducto,
            String talla
    );
}
