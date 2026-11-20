
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.BoletaService;
import cl.reydelbalon.backend.service.BoletaService.SolicitudCompra;
import cl.reydelbalon.backend.service.BoletaService.CompraRespuesta;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/compras")
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @PostMapping
    public ResponseEntity<CompraRespuesta> registrarCompra(
            @RequestBody SolicitudCompra solicitud,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String emailUsuario = jwt.getSubject();

        CompraRespuesta respuesta =
                boletaService.registrarCompraSimulada(
                        solicitud,
                        emailUsuario
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }
}
