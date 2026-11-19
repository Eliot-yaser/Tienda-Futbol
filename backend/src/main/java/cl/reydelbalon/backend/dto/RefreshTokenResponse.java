
package cl.reydelbalon.backend.dto;

public record RefreshTokenResponse(
    String token,
    String tipo,
    String refreshToken
) {
}
