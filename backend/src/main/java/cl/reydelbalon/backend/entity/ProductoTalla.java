
package cl.reydelbalon.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "producto_talla",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_producto", "talla"})
    }
)
public class ProductoTalla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_talla")
    private Long idProductoTalla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(name = "talla", nullable = false, length = 10)
    private String talla;

    @Column(
        name = "stock",
        nullable = false,
        columnDefinition = "INT UNSIGNED"
    )
    private Long stock;

    public ProductoTalla() {
    }

    public Long getIdProductoTalla() {
        return idProductoTalla;
    }

    public void setIdProductoTalla(Long idProductoTalla) {
        this.idProductoTalla = idProductoTalla;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }
}
