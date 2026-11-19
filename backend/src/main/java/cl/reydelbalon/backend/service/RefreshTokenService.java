
package cl.reydelbalon.backend.service;

import cl.reydelbalon.backend.auth.JwtService;
import cl.reydelbalon.backend.dto.RefreshTokenResponse;
import cl.reydelbalon.backend.entity.RefreshToken;
import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.repository.RefreshTokenRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService) {

        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public String generarRefreshToken(Usuario usuario) {

        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUsuario(usuario);
        refreshToken.setTokenHash(calcularHash(token));
        refreshToken.setFechaExpiracion(
                LocalDateTime.now(ZoneOffset.UTC).plusDays(7)
        );
        refreshToken.setRevocado(false);

        refreshTokenRepository.save(refreshToken);

        return token;
    }

    @Transactional
    public RefreshTokenResponse renovarToken(String tokenRecibido) {

        if (tokenRecibido == null || tokenRecibido.isBlank()) {
            throw tokenInvalido();
        }

        String hash = calcularHash(tokenRecibido);

        RefreshToken tokenAnterior = refreshTokenRepository
                .findByTokenHashForUpdate(hash)
                .orElseThrow(this::tokenInvalido);

        if (Boolean.TRUE.equals(tokenAnterior.getRevocado())) {
            throw tokenInvalido();
        }

        LocalDateTime ahora = LocalDateTime.now(ZoneOffset.UTC);

        if (!tokenAnterior.getFechaExpiracion().isAfter(ahora)) {
            throw tokenInvalido();
        }

        Usuario usuario = tokenAnterior.getUsuario();

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw tokenInvalido();
        }

        // Invalida el refresh token anterior.
        tokenAnterior.setRevocado(true);
        refreshTokenRepository.save(tokenAnterior);

        // Genera un nuevo JWT de acceso.
        String nuevoJwt = jwtService.generarToken(usuario);

        // Genera y almacena un nuevo refresh token.
        String nuevoRefreshToken = generarRefreshToken(usuario);

        return new RefreshTokenResponse(
                nuevoJwt,
                "Bearer",
                nuevoRefreshToken
        );
    }

    public String calcularHash(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "No se pudo calcular el hash del token",
                    e
            );
        }
    }

    private ResponseStatusException tokenInvalido() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Refresh token invalido o expirado"
        );
    }
}
