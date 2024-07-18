package com.chamados.api.Controllers;

import com.chamados.api.Repositories.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("cargos")
public class CargoController {
    @Autowired
    CargoRepository cargoRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(cargoRepository.findAll());
    }
}
