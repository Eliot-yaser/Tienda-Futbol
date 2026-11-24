
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.AdminUsuariosService;
import cl.reydelbalon.backend.service.AdminUsuariosService.UsuarioAdmin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/usuarios")
public class AdminUsuariosController {

    private final AdminUsuariosService adminUsuariosService;

    public AdminUsuariosController(
            AdminUsuariosService adminUsuariosService) {
        this.adminUsuariosService = adminUsuariosService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioAdmin>> listarUsuarios() {

        List<UsuarioAdmin> usuarios =
                adminUsuariosService.listarUsuarios();

        return ResponseEntity.ok(usuarios);
    }
}
