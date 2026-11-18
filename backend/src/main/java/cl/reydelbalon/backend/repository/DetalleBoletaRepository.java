
package cl.reydelbalon.backend.repository;

import cl.reydelbalon.backend.entity.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleBoletaRepository extends JpaRepository<DetalleBoleta, Long> {

    List<DetalleBoleta> findByBoleta_IdBoleta(Long idBoleta);

}
