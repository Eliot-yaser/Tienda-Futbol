
package cl.reydelbalon.backend.dto;

public record RegistroResponse(
    Long idUsuario,
    String nombre,
    String apellidos,
    String email,
    String rol,
    String mensaje
) {
}
