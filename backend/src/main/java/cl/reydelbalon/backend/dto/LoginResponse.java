
package cl.reydelbalon.backend.dto;

public record LoginResponse(
        String token,
        String tipo,
        Long idUsuario,
        String nombre,
        String email,
        String rol,
        String refreshToken
) {
}
