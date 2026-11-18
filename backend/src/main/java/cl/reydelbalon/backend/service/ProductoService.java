
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Categoria;
import cl.reydelbalon.backend.entity.Producto;
import cl.reydelbalon.backend.repository.CategoriaRepository;
import cl.reydelbalon.backend.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository) {

        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Listar todos los productos
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // Listar productos activos
    public List<Producto> listarActivos() {
        return productoRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .toList();
    }

    // Buscar producto por ID
    public Producto obtenerPorId(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                    "El ID del producto no es valido."
            );
        }

        return productoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "No se encontro el producto con ID: " + id
                        )
                );
    }

    // Crear producto
    @Transactional
    public Producto crear(Producto datos) {

        validarProducto(datos);

        Categoria categoria = buscarCategoria(
                datos.getCategoria().getIdCategoria()
        );

        Producto producto = new Producto();

        producto.setCodigo(normalizarCodigo(datos.getCodigo()));
        producto.setNombre(datos.getNombre().trim());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(
                datos.getStock() == null ? 0L : datos.getStock()
        );
        producto.setStockCritico(
                datos.getStockCritico() == null
                        ? 0L : datos.getStockCritico()
        );
        producto.setImagenUrl(datos.getImagenUrl());
        producto.setEnOferta(Boolean.TRUE.equals(datos.getEnOferta()));
        producto.setPrecioAnterior(
                Boolean.TRUE.equals(datos.getEnOferta())
                        ? datos.getPrecioAnterior() : null
        );
        producto.setCategoria(categoria);
        producto.setActivo(true);

        return productoRepository.save(producto);
    }

    // Actualizar datos del catalogo
    @Transactional
    public Producto actualizar(Long id, Producto datos) {

        Producto existente = obtenerPorId(id);

        validarProducto(datos);

        Categoria categoria = buscarCategoria(
                datos.getCategoria().getIdCategoria()
        );

        existente.setCodigo(normalizarCodigo(datos.getCodigo()));
        existente.setNombre(datos.getNombre().trim());
        existente.setDescripcion(datos.getDescripcion());
        existente.setPrecio(datos.getPrecio());
        existente.setImagenUrl(datos.getImagenUrl());
        existente.setCategoria(categoria);

        boolean enOferta = Boolean.TRUE.equals(datos.getEnOferta());

        existente.setEnOferta(enOferta);
        existente.setPrecioAnterior(
                enOferta ? datos.getPrecioAnterior() : null
        );

        if (datos.getStockCritico() != null) {
            existente.setStockCritico(datos.getStockCritico());
        }

        // El stock se administrara en el modulo de inventario,
        // evitando inconsistencias con producto_talla.

        return productoRepository.save(existente);
    }

    // Desactivar producto sin eliminarlo
    @Transactional
    public Producto desactivar(Long id) {

        Producto producto = obtenerPorId(id);
        producto.setActivo(false);

        return productoRepository.save(producto);
    }

    // Reactivar producto
    @Transactional
    public Producto activar(Long id) {

        Producto producto = obtenerPorId(id);
        producto.setActivo(true);

        return productoRepository.save(producto);
    }

    // Buscar categoria asociada
    private Categoria buscarCategoria(Long idCategoria) {

        if (idCategoria == null || idCategoria <= 0) {
            throw new IllegalArgumentException(
                    "Debe indicar una categoria valida."
            );
        }

        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "No existe la categoria indicada."
                        )
                );

        if (!Boolean.TRUE.equals(categoria.getActivo())) {
            throw new IllegalArgumentException(
                    "No se pueden asignar categorias inactivas."
            );
        }

        return categoria;
    }

    // Validar datos del producto
    private void validarProducto(Producto producto) {

        if (producto == null) {
            throw new IllegalArgumentException(
                    "Los datos del producto son obligatorios."
            );
        }

        if (producto.getCodigo() == null ||
                producto.getCodigo().isBlank() ||
                producto.getCodigo().trim().length() > 20) {

            throw new IllegalArgumentException(
                    "El codigo es obligatorio y no puede superar 20 caracteres."
            );
        }

        if (producto.getNombre() == null ||
                producto.getNombre().isBlank() ||
                producto.getNombre().trim().length() > 150) {

            throw new IllegalArgumentException(
                    "El nombre es obligatorio y no puede superar 150 caracteres."
            );
        }

        if (producto.getPrecio() == null ||
                producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0 ||
                producto.getPrecio().precision() -
                producto.getPrecio().scale() > 10 ||
                producto.getPrecio().scale() > 2) {

            throw new IllegalArgumentException(
                    "El precio debe ser positivo y tener como maximo dos decimales."
            );
        }

        if (producto.getCategoria() == null ||
                producto.getCategoria().getIdCategoria() == null) {

            throw new IllegalArgumentException(
                    "Debe seleccionar una categoria."
            );
        }

        validarStock(producto.getStock(), "stock");
        validarStock(producto.getStockCritico(), "stock critico");

        if (producto.getImagenUrl() != null &&
                producto.getImagenUrl().length() > 1000) {

            throw new IllegalArgumentException(
                    "La URL de imagen supera 1000 caracteres."
            );
        }

        if (Boolean.TRUE.equals(producto.getEnOferta())) {

            if (producto.getPrecioAnterior() == null ||
                    producto.getPrecioAnterior().compareTo(
                            producto.getPrecio()) <= 0 ||
                    producto.getPrecioAnterior().precision() -
                    producto.getPrecioAnterior().scale() > 10 ||
                    producto.getPrecioAnterior().scale() > 2) {

                throw new IllegalArgumentException(
                        "El precio anterior debe ser mayor al precio de oferta."
                );
            }
        }
    }

    // Verificar stock no negativo y rango de MySQL INT UNSIGNED
    private void validarStock(Long stock, String campo) {

        if (stock != null &&
                (stock < 0 || stock > 4294967295L)) {

            throw new IllegalArgumentException(
                    "El " + campo + " esta fuera del rango permitido."
            );
        }
    }

    // Normalizar codigo del producto
    private String normalizarCodigo(String codigo) {
        return codigo.trim().toUpperCase(Locale.ROOT);
    }
}
