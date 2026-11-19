
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.dto.*;
import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import cl.reydelbalon.backend.service.RegistroService;
import cl.reydelbalon.backend.service.LoginService;
import cl.reydelbalon.backend.service.RefreshTokenService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final RegistroService registroService;
    private final LoginService loginService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(
            RegistroService registroService,
            LoginService loginService,
            RefreshTokenService refreshTokenService,
            UsuarioRepository usuarioRepository) {

        this.registroService = registroService;
        this.loginService = loginService;
        this.refreshTokenService = refreshTokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registro")
    public ResponseEntity<RegistroResponse> registrar(
            @Valid @RequestBody RegistroRequest request) {

        RegistroResponse respuesta = registroService.registrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> iniciarSesion(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse respuesta = loginService.iniciarSesion(request);

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> renovarSesion(
            @Valid @RequestBody RefreshTokenRequest request) {

        RefreshTokenResponse respuesta =
                refreshTokenService.renovarToken(
                        request.refreshToken()
                );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioActualResponse> obtenerUsuarioActual(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado"
                ));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario inactivo"
            );
        }

        UsuarioActualResponse respuesta = new UsuarioActualResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getEmail(),
                usuario.getRol().name()
        );

        return ResponseEntity.ok(respuesta);
    }
}
