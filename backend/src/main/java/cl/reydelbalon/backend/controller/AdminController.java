
package cl.reydelbalon.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@SecurityRequirement(name = "bearerAuth")

public class AdminController {

    @GetMapping("/verificar")
    public Map<String, String> verificarAcceso() {

        return Map.of(
                "mensaje", "Acceso administrativo autorizado",
                "rol", "ADMINISTRADOR"
        );
    }
}
