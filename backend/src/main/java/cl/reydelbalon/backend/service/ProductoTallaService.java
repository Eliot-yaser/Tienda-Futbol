
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.ProductoTalla;
import cl.reydelbalon.backend.repository.ProductoRepository;
import cl.reydelbalon.backend.repository.ProductoTallaRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class ProductoTallaService {

    private final ProductoTallaRepository productoTallaRepository;
    private final ProductoRepository productoRepository;

    // Inyeccion de dependencias por constructor
    public ProductoTallaService(
            ProductoTallaRepository productoTallaRepository,
            ProductoRepository productoRepository) {

        this.productoTallaRepository = productoTallaRepository;
        this.productoRepository = productoRepository;
    }

    // DTO para devolver solo los datos necesarios
    public record TallaStock(
            Long idProductoTalla,
            String talla,
            Long stock
    ) {}

    // Consultar todas las tallas de un producto
    public List<TallaStock> listarPorProducto(Long idProducto) {

        validarProducto(idProducto);

        return productoTallaRepository
                .findByProducto_IdProductoOrderByTallaAsc(idProducto)
                .stream()
                .map(this::convertirRespuesta)
                .toList();
    }

    // Consultar una talla especifica
    public TallaStock obtenerPorProductoYTalla(
            Long idProducto,
            String talla) {

        validarProducto(idProducto);

        if (talla == null || talla.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe indicar una talla valida."
            );
        }

        String tallaNormalizada =
                talla.trim().toUpperCase(Locale.ROOT);

        ProductoTalla productoTalla = productoTallaRepository
                .findByProducto_IdProductoAndTalla(
                        idProducto,
                        tallaNormalizada
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "No existe la talla indicada para este producto."
                        )
                );

        return convertirRespuesta(productoTalla);
    }

    // Verificar que el producto exista
    private void validarProducto(Long idProducto) {

        if (idProducto == null || idProducto <= 0) {
            throw new IllegalArgumentException(
                    "El ID del producto no es valido."
            );
        }

        if (!productoRepository.existsById(idProducto)) {
            throw new EntityNotFoundException(
                    "No existe el producto con ID: " + idProducto
            );
        }
    }

    // Convertir entidad JPA en respuesta segura
    private TallaStock convertirRespuesta(ProductoTalla productoTalla) {

        return new TallaStock(
                productoTalla.getIdProductoTalla(),
                productoTalla.getTalla(),
                productoTalla.getStock()
        );
    }
}
