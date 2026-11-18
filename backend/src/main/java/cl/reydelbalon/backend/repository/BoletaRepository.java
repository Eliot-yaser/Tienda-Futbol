
package cl.reydelbalon.backend.repository;

import cl.reydelbalon.backend.entity.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {

    List<Boleta> findByUsuario_IdUsuario(Long idUsuario);

}
