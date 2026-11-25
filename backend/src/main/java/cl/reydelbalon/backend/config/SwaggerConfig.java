
package cl.reydelbalon.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Rey del Balón - API REST",
        version = "v1",
        description = "API REST de la tienda Rey del Balón. " +
                      "Desarrollada con Spring Boot, MySQL " +
                      "y autenticación JWT para la EVA3."
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Autenticación mediante token JWT"
)
public class SwaggerConfig {
}
