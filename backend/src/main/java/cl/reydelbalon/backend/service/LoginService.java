
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.auth.JwtService;
import cl.reydelbalon.backend.dto.LoginRequest;
import cl.reydelbalon.backend.dto.LoginResponse;
import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class LoginService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse iniciarSesion(LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Credenciales incorrectas"
                        )
                );

        if (!Boolean.TRUE.equals(usuario.getActivo())
                || !passwordEncoder.matches(
                        request.password(),
                        usuario.getPasswordHash())) {

            throw new BadCredentialsException(
                    "Credenciales incorrectas"
            );
        }

        String token = jwtService.generarToken(usuario);

        return new LoginResponse(
                token,
                "Bearer",
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().name()
        );
    }
}
