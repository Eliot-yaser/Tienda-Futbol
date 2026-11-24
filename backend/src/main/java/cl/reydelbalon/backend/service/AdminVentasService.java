
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Boleta;
import cl.reydelbalon.backend.entity.DetalleBoleta;
import cl.reydelbalon.backend.enums.ResultadoPago;
import cl.reydelbalon.backend.repository.BoletaRepository;
import cl.reydelbalon.backend.repository.DetalleBoletaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminVentasService {

    private final BoletaRepository boletaRepository;
    private final DetalleBoletaRepository detalleBoletaRepository;

    public AdminVentasService(
            BoletaRepository boletaRepository,
            DetalleBoletaRepository detalleBoletaRepository) {

        this.boletaRepository = boletaRepository;
        this.detalleBoletaRepository = detalleBoletaRepository;
    }

    // Producto registrado en una boleta
    public record ProductoVendido(
            String codigo,
            String nombre,
            String talla,
            BigDecimal precio,
            Integer cantidad,
            BigDecimal subtotal
    ) {}

    // Informacion que recibira el historial de React
    public record VentaAdmin(
            Long id,
            LocalDateTime fecha,
            String cliente,
            String email,
            BigDecimal total,
            String estado,
            String resultadoPago,
            List<ProductoVendido> productos
    ) {}

    public List<VentaAdmin> listarVentas() {

        // Consultar los detalles guardados en MySQL
        Map<Long, List<ProductoVendido>> productosPorBoleta =
                detalleBoletaRepository.findAll()
                        .stream()
                        .collect(Collectors.groupingBy(
                                detalle -> detalle.getBoleta()
                                        .getIdBoleta(),

                                Collectors.mapping(
                                        this::convertirProducto,
                                        Collectors.toList()
                                )
                        ));

        // Consultar las boletas con pago simulado aprobado
        return boletaRepository.findAll()
                .stream()
                .filter(boleta ->
                        boleta.getResultadoPago() ==
                                ResultadoPago.APROBADO
                )
                .sorted(
                        Comparator.comparing(
                                Boleta::getIdBoleta
                        ).reversed()
                )
                .map(boleta -> new VentaAdmin(
                        boleta.getIdBoleta(),
                        boleta.getFechaEmision(),
                        boleta.getNombreCliente() + " " +
                                boleta.getApellidosCliente(),
                        boleta.getEmailCliente(),
                        boleta.getTotal(),
                        boleta.getEstado().name(),
                        boleta.getResultadoPago().name(),
                        productosPorBoleta.getOrDefault(
                                boleta.getIdBoleta(),
                                List.of()
                        )
                ))
                .toList();
    }

    private ProductoVendido convertirProducto(
            DetalleBoleta detalle) {

        return new ProductoVendido(
                detalle.getCodigoProducto(),
                detalle.getNombreProducto(),
                detalle.getTalla(),
                detalle.getPrecioUnitario(),
                detalle.getCantidad(),
                detalle.getSubtotal()
        );
    }
}
