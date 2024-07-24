package com.chamados.api.Controllers;

import com.chamados.api.DTO.CargoDTO;
import com.chamados.api.DTO.UnitCreateDTO;
import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Unit;
import com.chamados.api.Repositories.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("cargos")
public class CargoController {
    @Autowired
    CargoRepository cargoRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(cargoRepository.findAll());
    }

    @GetMapping("/{cargoID}")
    public ResponseEntity<?> getCargo(@PathVariable Long cargoID) {
        Optional<Cargo> optionalCargo = cargoRepository.findById(cargoID);

        if (optionalCargo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cargo cargo = optionalCargo.get();
        return ResponseEntity.ok(cargo);
    }

    @PostMapping("/")
    public ResponseEntity<?> createCargo(@RequestBody CargoDTO cargoDTO) {
        if (Objects.equals(cargoDTO.name(), "")) {
            return ResponseEntity.badRequest().build();
        }

        Cargo cargo = new Cargo(cargoDTO.name());

        cargoRepository.save(cargo);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cargoID}")
    public ResponseEntity<?> deleteCargo(@PathVariable Long cargoID) {
        Optional<Cargo> optionalCargo = cargoRepository.findById(cargoID);

        if (optionalCargo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        cargoRepository.deleteById(cargoID);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cargoID}")
    public ResponseEntity<?> updateCargo(@PathVariable Long cargoID, @RequestBody CargoDTO cargoDTO) {
        Optional<Cargo> optionalCargo = cargoRepository.findById(cargoID);

        if (optionalCargo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cargo cargo = optionalCargo.get();
        cargo.setName(cargoDTO.name());
        cargoRepository.save(cargo);

        return ResponseEntity.ok().build();
    }
}
