
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Producto;
import cl.reydelbalon.backend.entity.ProductoTalla;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.LockModeType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminInventarioService {

    private static final long STOCK_MAXIMO = 4294967295L;

    private final EntityManager entityManager;

    public AdminInventarioService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public record TallaInventario(
            Long idProductoTalla,
            String talla,
            Long stock
    ) {}

    public record InventarioProducto(
            Long idProducto,
            String codigo,
            String nombre,
            Long stockTotal,
            Long stockCritico,
            Long stockAsignado,
            Long stockSinAsignar,
            List<TallaInventario> tallas
    ) {}

    // Consultar las existencias reales de MySQL
    public InventarioProducto consultarInventario(Long idProducto) {

        Producto producto = buscarProducto(idProducto, false);

        List<ProductoTalla> tallas =
                buscarTallas(idProducto, false);

        return crearRespuesta(producto, tallas);
    }

    // Redistribuir existencias entre las tallas existentes
    @Transactional
    public InventarioProducto actualizarTallas(
            Long idProducto,
            Map<String, Long> cantidades) {

        // Mantener el mismo orden de bloqueos que las compras:
        // primero producto y luego sus tallas.
        Producto producto = buscarProducto(idProducto, true);

        List<ProductoTalla> tallas =
                buscarTallas(idProducto, true);

        if (tallas.isEmpty()) {
            throw new IllegalArgumentException(
                    "Este producto no tiene tallas configuradas."
            );
        }

        if (cantidades == null ||
                cantidades.size() != tallas.size()) {

            throw new IllegalArgumentException(
                    "Debes enviar todas las tallas del producto."
            );
        }

        long stockTotal = producto.getStock();
        long totalAsignado = 0;

        for (ProductoTalla talla : tallas) {

            String nombreTalla = talla.getTalla();

            if (!cantidades.containsKey(nombreTalla)) {
                throw new IllegalArgumentException(
                        "Falta la talla: " + nombreTalla
                );
            }

            Long cantidad = cantidades.get(nombreTalla);

            if (cantidad == null ||
                    cantidad < 0 ||
                    cantidad > STOCK_MAXIMO) {

                throw new IllegalArgumentException(
                        "Stock invalido para la talla: " + nombreTalla
                );
            }

            // Evitar superar el stock general
            if (cantidad > stockTotal - totalAsignado) {
                throw new IllegalArgumentException(
                        "La suma de las tallas supera el stock disponible."
                );
            }

            totalAsignado += cantidad;
        }

        // Actualizar todas las tallas en la misma transaccion
        for (ProductoTalla talla : tallas) {
            talla.setStock(
                    cantidades.get(talla.getTalla())
            );
        }

        // JPA guardara los cambios al confirmar la transaccion
        return crearRespuesta(producto, tallas);
    }

    // Registrar nuevas unidades recibidas
    @Transactional
    public InventarioProducto reponerStock(
            Long idProducto,
            Long cantidad) {

        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException(
                    "La reposicion debe ser mayor que cero."
            );
        }

        Producto producto = buscarProducto(idProducto, true);

        long stockActual = producto.getStock();

        if (cantidad > STOCK_MAXIMO - stockActual) {
            throw new IllegalArgumentException(
                    "La reposicion supera el stock maximo permitido."
            );
        }

        producto.setStock(stockActual + cantidad);

        // Las unidades nuevas quedan sin asignar.
        // Luego se pueden distribuir entre las tallas.
        List<ProductoTalla> tallas =
                buscarTallas(idProducto, false);

        return crearRespuesta(producto, tallas);
    }

    // Buscar el producto, bloqueandolo cuando se modifica stock
    private Producto buscarProducto(
            Long idProducto,
            boolean bloquear) {

        if (idProducto == null || idProducto <= 0) {
            throw new IllegalArgumentException(
                    "El ID del producto no es valido."
            );
        }

        Producto producto = bloquear
                ? entityManager.find(
                        Producto.class,
                        idProducto,
                        LockModeType.PESSIMISTIC_WRITE
                )
                : entityManager.find(
                        Producto.class,
                        idProducto
                );

        if (producto == null) {
            throw new EntityNotFoundException(
                    "No existe el producto indicado."
            );
        }

        return producto;
    }

    // Consultar tallas, bloqueandolas si se van a modificar
    private List<ProductoTalla> buscarTallas(
            Long idProducto,
            boolean bloquear) {

        var consulta = entityManager.createQuery(
                "SELECT pt FROM ProductoTalla pt " +
                "WHERE pt.producto.idProducto = :id " +
                "ORDER BY pt.talla",
                ProductoTalla.class
        );

        consulta.setParameter("id", idProducto);

        if (bloquear) {
            consulta.setLockMode(LockModeType.PESSIMISTIC_WRITE);
        }

        return consulta.getResultList();
    }

    // Convertir entidades a una respuesta para React
    private InventarioProducto crearRespuesta(
            Producto producto,
            List<ProductoTalla> tallas) {

        long stockTotal = producto.getStock();

        long stockAsignado = tallas.stream()
                .mapToLong(ProductoTalla::getStock)
                .sum();

        List<TallaInventario> detalle = tallas.stream()
                .map(talla -> new TallaInventario(
                        talla.getIdProductoTalla(),
                        talla.getTalla(),
                        talla.getStock()
                ))
                .toList();

        return new InventarioProducto(
                producto.getIdProducto(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getStock(),
                producto.getStockCritico(),
                stockAsignado,
                stockTotal - stockAsignado,
                detalle
        );
    }
}
