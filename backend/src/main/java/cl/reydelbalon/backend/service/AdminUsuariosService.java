
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminUsuariosService {

    private final UsuarioRepository usuarioRepository;

    public AdminUsuariosService(
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    // Datos permitidos para la pantalla administrativa
    public record UsuarioAdmin(
            Long id,
            String nombre,
            String apellidos,
            String email,
            String rol,
            Boolean activo
    ) {}

    // Consultar usuarios registrados en MySQL
    public List<UsuarioAdmin> listarUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                Usuario::getIdUsuario
                        )
                )
                .map(usuario -> new UsuarioAdmin(
                        usuario.getIdUsuario(),
                        usuario.getNombre(),
                        usuario.getApellidos(),
                        usuario.getEmail(),
                        usuario.getRol().name(),
                        usuario.getActivo()
                ))
                .toList();
    }
}
