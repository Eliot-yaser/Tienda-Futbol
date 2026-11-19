
package cl.reydelbalon.backend.dto;

public record UsuarioActualResponse(
    Long idUsuario,
    String nombre,
    String apellidos,
    String email,
    String rol
) {
}
