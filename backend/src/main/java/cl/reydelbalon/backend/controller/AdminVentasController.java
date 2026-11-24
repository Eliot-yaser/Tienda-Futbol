
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.AdminVentasService;
import cl.reydelbalon.backend.service.AdminVentasService.VentaAdmin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/ventas")
public class AdminVentasController {

    private final AdminVentasService adminVentasService;

    public AdminVentasController(
            AdminVentasService adminVentasService) {

        this.adminVentasService = adminVentasService;
    }

    @GetMapping
    public ResponseEntity<List<VentaAdmin>> listarVentas() {

        List<VentaAdmin> ventas =
                adminVentasService.listarVentas();

        return ResponseEntity.ok(ventas);
    }
}
