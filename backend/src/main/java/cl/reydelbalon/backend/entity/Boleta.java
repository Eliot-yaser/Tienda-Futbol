
package cl.reydelbalon.backend.entity;

import cl.reydelbalon.backend.enums.EstadoBoleta;
import cl.reydelbalon.backend.enums.ResultadoPago;
import cl.reydelbalon.backend.enums.TipoEntrega;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "boleta")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Long idBoleta;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "fecha_emision", insertable = false, updatable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "nombre_cliente", nullable = false, length = 80)
    private String nombreCliente;

    @Column(name = "apellidos_cliente", nullable = false, length = 120)
    private String apellidosCliente;

    @Column(name = "email_cliente", nullable = false, length = 150)
    private String emailCliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entrega", nullable = false, length = 10)
    private TipoEntrega tipoEntrega;

    @Column(name = "calle", length = 150)
    private String calle;

    @Column(name = "numero", length = 20)
    private String numero;

    @Column(name = "departamento", length = 50)
    private String departamento;

    @Column(name = "region", length = 100)
    private String region;

    @Column(name = "comuna", length = 100)
    private String comuna;

    @Column(name = "indicaciones", length = 500)
    private String indicaciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_pago", nullable = false, length = 20)
    private ResultadoPago resultadoPago = ResultadoPago.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoBoleta estado = EstadoBoleta.REGISTRADA;

    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    public Boleta() {
    }

    public Long getIdBoleta() {
        return idBoleta;
    }

    public void setIdBoleta(Long idBoleta) {
        this.idBoleta = idBoleta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getApellidosCliente() {
        return apellidosCliente;
    }

    public void setApellidosCliente(String apellidosCliente) {
        this.apellidosCliente = apellidosCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public TipoEntrega getTipoEntrega() {
        return tipoEntrega;
    }

    public void setTipoEntrega(TipoEntrega tipoEntrega) {
        this.tipoEntrega = tipoEntrega;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public ResultadoPago getResultadoPago() {
        return resultadoPago;
    }

    public void setResultadoPago(ResultadoPago resultadoPago) {
        this.resultadoPago = resultadoPago;
    }

    public EstadoBoleta getEstado() {
        return estado;
    }

    public void setEstado(EstadoBoleta estado) {
        this.estado = estado;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
