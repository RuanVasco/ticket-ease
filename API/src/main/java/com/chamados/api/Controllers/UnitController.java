package com.chamados.api.Controllers;

import com.chamados.api.DTO.UnitCreateDTO;
import com.chamados.api.Entities.Unit;
import com.chamados.api.Repositories.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("units")
public class UnitController {

    @Autowired
    private UnitRepository unitRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(unitRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Unit>> getAllPageable(Pageable pageable) {
        Page<Unit> unit = unitRepository.findAll(pageable);
        return ResponseEntity.ok(unit);
    }

    @GetMapping("/{unitID}")
    public ResponseEntity<?> getUnit(@PathVariable Long unitID) {
        Optional<Unit> optionalUnit = unitRepository.findById(unitID);

        if (optionalUnit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Unit unit = optionalUnit.get();
        return ResponseEntity.ok(unit);
    }

    @PostMapping("/")
    public ResponseEntity<?> createUnit(@RequestBody UnitCreateDTO unitCreateDTO) {
        Unit unit = new Unit(unitCreateDTO.name(), unitCreateDTO.address());

        unitRepository.save(unit);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{unitID}")
    public ResponseEntity<?> deleteUnit(@PathVariable Long unitID) {
        Optional<Unit> optionalUnit = unitRepository.findById(unitID);

        if (optionalUnit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        unitRepository.deleteById(unitID);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{unitID}")
    public ResponseEntity<?> updateUnit(@PathVariable Long unitID, @RequestBody UnitCreateDTO unitCreateDTO) {
        Optional<Unit> optionalUnit = unitRepository.findById(unitID);

        if (optionalUnit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Unit unit = optionalUnit.get();
        unit.setName(unitCreateDTO.name());
        unit.setAddress(unitCreateDTO.address());
        unitRepository.save(unit);

        return ResponseEntity.ok().build();
    }

}
