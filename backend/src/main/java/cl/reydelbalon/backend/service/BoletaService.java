
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.*;
import cl.reydelbalon.backend.enums.*;
import cl.reydelbalon.backend.repository.BoletaRepository;
import cl.reydelbalon.backend.repository.DetalleBoletaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.LockModeType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class BoletaService {

    private final EntityManager entityManager;
    private final BoletaRepository boletaRepository;
    private final DetalleBoletaRepository detalleRepository;

    public BoletaService(
            EntityManager entityManager,
            BoletaRepository boletaRepository,
            DetalleBoletaRepository detalleRepository) {

        this.entityManager = entityManager;
        this.boletaRepository = boletaRepository;
        this.detalleRepository = detalleRepository;
    }

    // Datos que React enviara al backend
    public record ItemCompra(
            String codigo,
            String talla,
            Integer cantidad
    ) {}

    public record SolicitudCompra(
            String nombreCliente,
            String apellidosCliente,
            String emailCliente,
            TipoEntrega tipoEntrega,
            String calle,
            String numero,
            String departamento,
            String region,
            String comuna,
            String indicaciones,
            List<ItemCompra> productos
    ) {}

    // Datos que devolvera la API
    public record DetalleRespuesta(
            String codigo,
            String nombre,
            String talla,
            Integer cantidad,
            BigDecimal precioUnitario,
            BigDecimal subtotal
    ) {}

    public record CompraRespuesta(
            Long idBoleta,
            BigDecimal total,
            EstadoBoleta estado,
            ResultadoPago resultadoPago,
            List<DetalleRespuesta> productos
    ) {}

    // Registro transaccional de una compra simulada
    @Transactional
    public CompraRespuesta registrarCompraSimulada(
            SolicitudCompra solicitud) {

        validarSolicitud(solicitud);

        Boleta boleta = new Boleta();

        boleta.setNombreCliente(
                solicitud.nombreCliente().trim()
        );
        boleta.setApellidosCliente(
                solicitud.apellidosCliente().trim()
        );
        boleta.setEmailCliente(
                solicitud.emailCliente()
                        .trim()
                        .toLowerCase(Locale.ROOT)
        );

        boleta.setTipoEntrega(solicitud.tipoEntrega());
        boleta.setCalle(solicitud.calle());
        boleta.setNumero(solicitud.numero());
        boleta.setDepartamento(solicitud.departamento());
        boleta.setRegion(solicitud.region());
        boleta.setComuna(solicitud.comuna());
        boleta.setIndicaciones(solicitud.indicaciones());

        // Pago simulado: NO existe pasarela de pago real.
        boleta.setResultadoPago(ResultadoPago.APROBADO);
        boleta.setEstado(EstadoBoleta.REGISTRADA);

        List<DetalleBoleta> detalles = new ArrayList<>();
        List<DetalleRespuesta> respuestas = new ArrayList<>();

        BigDecimal total = BigDecimal.ZERO;

        // Ordenar para mantener un orden estable de bloqueos
        List<ItemCompra> items = solicitud.productos()
                .stream()
                .sorted((a, b) ->
                        a.codigo().trim().compareToIgnoreCase(
                                b.codigo().trim()
                        )
                )
                .toList();

        for (ItemCompra item : items) {

            validarItem(item);

            String codigo = item.codigo()
                    .trim()
                    .toUpperCase(Locale.ROOT);

            int cantidad = item.cantidad();

            // Bloquear producto durante la transaccion
            Producto producto = entityManager.createQuery(
                    "SELECT p FROM Producto p WHERE p.codigo = :codigo",
                    Producto.class
            )
            .setParameter("codigo", codigo)
            .setLockMode(LockModeType.PESSIMISTIC_WRITE)
            .getResultStream()
            .findFirst()
            .orElseThrow(() ->
                    new EntityNotFoundException(
                            "Producto no encontrado: " + codigo
                    )
            );

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new IllegalArgumentException(
                        "Producto inactivo: " + codigo
                );
            }

            if (producto.getStock() == null ||
                    producto.getStock() < cantidad) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para: " + codigo
                );
            }

            String talla = item.talla() == null ||
                    item.talla().isBlank()
                    ? null
                    : item.talla().trim().toUpperCase(Locale.ROOT);

            boolean requiereTalla =
                    !"Balones".equalsIgnoreCase(
                            producto.getCategoria().getNombre()
                    );

            if (requiereTalla) {

                if (talla == null) {
                    throw new IllegalArgumentException(
                            "Debe seleccionar talla para: " + codigo
                    );
                }

                ProductoTalla productoTalla =
                        entityManager.createQuery(
                            "SELECT pt FROM ProductoTalla pt " +
                            "WHERE pt.producto.idProducto = :id " +
                            "AND pt.talla = :talla",
                            ProductoTalla.class
                        )
                        .setParameter(
                                "id", producto.getIdProducto()
                        )
                        .setParameter("talla", talla)
                        .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                        .getResultStream()
                        .findFirst()
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                    "Talla no disponible: " +
                                    codigo + " / " + talla
                                )
                        );

                if (productoTalla.getStock() == null ||
                        productoTalla.getStock() < cantidad) {
                    throw new IllegalArgumentException(
                            "Stock insuficiente en talla " + talla
                    );
                }

                productoTalla.setStock(
                        productoTalla.getStock() - cantidad
                );

            } else if (talla != null) {

                throw new IllegalArgumentException(
                        "Este producto no requiere talla: " + codigo
                );
            }

            // Descontar stock general
            producto.setStock(
                    producto.getStock() - cantidad
            );

            // El precio siempre se obtiene desde MySQL
            BigDecimal precio = producto.getPrecio();

            if (precio == null ||
                    precio.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException(
                        "Precio invalido para: " + codigo
                );
            }

            BigDecimal subtotal = precio.multiply(
                    BigDecimal.valueOf(cantidad)
            );

            DetalleBoleta detalle = new DetalleBoleta();

            detalle.setBoleta(boleta);
            detalle.setProducto(producto);
            detalle.setCodigoProducto(producto.getCodigo());
            detalle.setNombreProducto(producto.getNombre());
            detalle.setTalla(talla);
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(precio);
            detalle.setSubtotal(subtotal);

            detalles.add(detalle);

            respuestas.add(new DetalleRespuesta(
                    producto.getCodigo(),
                    producto.getNombre(),
                    talla,
                    cantidad,
                    precio,
                    subtotal
            ));

            total = total.add(subtotal);
        }

        boleta.setTotal(total);

        // Guardar boleta y luego sus detalles
        Boleta guardada = boletaRepository.saveAndFlush(boleta);

        detalleRepository.saveAll(detalles);
        detalleRepository.flush();

        return new CompraRespuesta(
                guardada.getIdBoleta(),
                total,
                guardada.getEstado(),
                guardada.getResultadoPago(),
                respuestas
        );
    }

    // Validar la solicitud de compra
    private void validarSolicitud(SolicitudCompra solicitud) {

        if (solicitud == null) {
            throw new IllegalArgumentException(
                    "La solicitud es obligatoria."
            );
        }

        validarTexto(
                solicitud.nombreCliente(), 80, "Nombre"
        );
        validarTexto(
                solicitud.apellidosCliente(), 120, "Apellidos"
        );
        validarTexto(
                solicitud.emailCliente(), 150, "Email"
        );

        if (!solicitud.emailCliente().trim()
                .matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException(
                    "El correo electronico no es valido."
            );
        }

        if (solicitud.tipoEntrega() == null) {
            throw new IllegalArgumentException(
                    "Debe indicar un tipo de entrega."
            );
        }

        if (solicitud.tipoEntrega() == TipoEntrega.DOMICILIO) {
            validarTexto(solicitud.calle(), 150, "Calle");
            validarTexto(solicitud.numero(), 20, "Numero");
            validarTexto(solicitud.region(), 100, "Region");
            validarTexto(solicitud.comuna(), 100, "Comuna");
        }

        validarLongitud(solicitud.calle(), 150, "Calle");
        validarLongitud(solicitud.numero(), 20, "Numero");
        validarLongitud(solicitud.departamento(), 50, "Departamento");
        validarLongitud(solicitud.region(), 100, "Region");
        validarLongitud(solicitud.comuna(), 100, "Comuna");
        validarLongitud(solicitud.indicaciones(), 500, "Indicaciones");

        if (solicitud.productos() == null ||
                solicitud.productos().isEmpty() ||
                solicitud.productos().size() > 50) {
            throw new IllegalArgumentException(
                    "Debe indicar entre 1 y 50 items."
            );
        }

        solicitud.productos().forEach(this::validarItem);
    }

    private void validarItem(ItemCompra item) {

        if (item == null ||
                item.codigo() == null ||
                item.codigo().isBlank() ||
                item.codigo().trim().length() > 20 ||
                item.cantidad() == null ||
                item.cantidad() <= 0 ||
                item.cantidad() > 100) {

            throw new IllegalArgumentException(
                    "Codigo o cantidad del producto invalida."
            );
        }

        validarLongitud(item.talla(), 10, "Talla");
    }

    private void validarTexto(
            String valor, int maximo, String campo) {

        if (valor == null ||
                valor.isBlank() ||
                valor.trim().length() > maximo) {
            throw new IllegalArgumentException(
                    "Campo invalido: " + campo
            );
        }
    }

    private void validarLongitud(
            String valor, int maximo, String campo) {

        if (valor != null && valor.length() > maximo) {
            throw new IllegalArgumentException(
                    "El campo supera el largo permitido: " + campo
            );
        }
    }
}
