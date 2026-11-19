
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.dto.RegistroRequest;
import cl.reydelbalon.backend.dto.RegistroResponse;
import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.enums.Rol;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class RegistroService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistroService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegistroResponse registrar(RegistroRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "El correo ya esta registrado"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.nombre().trim());
        usuario.setApellidos(request.apellidos().trim());
        usuario.setEmail(email);

        usuario.setPasswordHash(
            passwordEncoder.encode(request.password())
        );

        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);

        Usuario guardado = usuarioRepository.save(usuario);

        return new RegistroResponse(
            guardado.getIdUsuario(),
            guardado.getNombre(),
            guardado.getApellidos(),
            guardado.getEmail(),
            guardado.getRol().name(),
            "Usuario registrado correctamente"
        );
    }
}
