
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Boleta;
import cl.reydelbalon.backend.entity.Producto;
import cl.reydelbalon.backend.entity.ProductoTalla;
import cl.reydelbalon.backend.enums.ResultadoPago;

import cl.reydelbalon.backend.repository.BoletaRepository;
import cl.reydelbalon.backend.repository.ProductoRepository;
import cl.reydelbalon.backend.repository.ProductoTallaRepository;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final ProductoTallaRepository productoTallaRepository;
    private final UsuarioRepository usuarioRepository;
    private final BoletaRepository boletaRepository;

    public DashboardService(
            ProductoRepository productoRepository,
            ProductoTallaRepository productoTallaRepository,
            UsuarioRepository usuarioRepository,
            BoletaRepository boletaRepository) {

        this.productoRepository = productoRepository;
        this.productoTallaRepository = productoTallaRepository;
        this.usuarioRepository = usuarioRepository;
        this.boletaRepository = boletaRepository;
    }

    // Informacion de una alerta de stock
    public record AlertaStock(
            String codigo,
            String nombre,
            String talla,
            Long stock,
            Long limite
    ) {}

    // Respuesta que recibira React
    public record ResumenDashboard(
            long productosRegistrados,
            long usuariosRegistrados,
            long ventasRealizadas,
            BigDecimal ingresosTotales,
            long alertasStockCritico,
            List<AlertaStock> alertas
    ) {}

    public ResumenDashboard obtenerResumen() {

        // 1. Consultar productos desde MySQL
        List<Producto> productos = productoRepository.findAll();

        long totalProductos = productos.size();

        // 2. Contar usuarios desde MySQL
        long totalUsuarios = usuarioRepository.count();

        // 3. Consultar ventas aprobadas (simuladas)
        List<Boleta> ventasAprobadas = boletaRepository.findAll()
                .stream()
                .filter(boleta ->
                        boleta.getResultadoPago() ==
                                ResultadoPago.APROBADO
                )
                .toList();

        long totalVentas = ventasAprobadas.size();

        BigDecimal ingresosTotales = ventasAprobadas.stream()
                .map(Boleta::getTotal)
                .filter(total -> total != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Consultar inventario por talla
        Map<Long, List<ProductoTalla>> tallasPorProducto =
                productoTallaRepository.findAll()
                        .stream()
                        .collect(Collectors.groupingBy(
                                talla -> talla.getProducto()
                                        .getIdProducto()
                        ));

        List<AlertaStock> alertas = new ArrayList<>();

        for (Producto producto : productos) {

            // No generar alertas de productos desactivados
            if (!Boolean.TRUE.equals(producto.getActivo())) {
                continue;
            }

            Long limite = producto.getStockCritico();

            if (limite == null || limite < 0) {
                continue;
            }

            List<ProductoTalla> tallas =
                    tallasPorProducto.getOrDefault(
                            producto.getIdProducto(),
                            List.of()
                    );

            if (!tallas.isEmpty()) {

                // Comprobar stock de cada talla configurada
                for (ProductoTalla talla : tallas) {

                    Long stock = talla.getStock();

                    if (stock != null && stock <= limite) {

                        alertas.add(new AlertaStock(
                                producto.getCodigo(),
                                producto.getNombre(),
                                talla.getTalla(),
                                stock,
                                limite
                        ));
                    }
                }

            } else {

                // Productos sin desglose de tallas
                Long stock = producto.getStock();

                if (stock != null && stock <= limite) {

                    alertas.add(new AlertaStock(
                            producto.getCodigo(),
                            producto.getNombre(),
                            "Total",
                            stock,
                            limite
                    ));
                }
            }
        }

        // 5. Construir respuesta administrativa
        return new ResumenDashboard(
                totalProductos,
                totalUsuarios,
                totalVentas,
                ingresosTotales,
                alertas.size(),
                alertas
        );
    }
}
