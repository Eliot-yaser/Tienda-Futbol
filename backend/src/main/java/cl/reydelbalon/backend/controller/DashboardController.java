
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.DashboardService;
import cl.reydelbalon.backend.service.DashboardService.ResumenDashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


@RestController
@RequestMapping("/api/v1/admin/dashboard")
@SecurityRequirement(name = "bearerAuth")

public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenDashboard> obtenerResumen() {

        ResumenDashboard resumen =
                dashboardService.obtenerResumen();

        return ResponseEntity.ok(resumen);
    }
}
