
package cl.reydelbalon.backend.controller;

import cl.reydelbalon.backend.service.BoletaService;
import cl.reydelbalon.backend.service.BoletaService.SolicitudCompra;
import cl.reydelbalon.backend.service.BoletaService.CompraRespuesta;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestBody SolicitudCompra solicitud) {

        CompraRespuesta respuesta =
                boletaService.registrarCompraSimulada(solicitud);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }
}
