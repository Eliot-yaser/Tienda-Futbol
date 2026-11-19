
package cl.reydelbalon.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(

    @NotBlank(message = "El nombre es obligatorio")
    String nombre,

    @NotBlank(message = "Los apellidos son obligatorios")
    String apellidos,

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no es valido")
    String email,

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    String password

) {
}
