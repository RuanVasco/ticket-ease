package com.chamados.api.Controllers;

import com.chamados.api.DTO.DepartmentDTO;
import com.chamados.api.DTO.UnitCreateDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.Repositories.DepartmentRepository;

import java.util.Optional;

@RestController
@RequestMapping("departments")
public class DepartmentController {
	
	@Autowired
	DepartmentRepository departmentRepository;
	
	@GetMapping("/")
    public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(departmentRepository.findAll());
	}

	@GetMapping("/{departmentID}")
	public ResponseEntity<?> getDepartment(@PathVariable Long departmentID) {
		Optional<Department> optionalDepartment = departmentRepository.findById(departmentID);

		if (optionalDepartment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Department department = optionalDepartment.get();
		return ResponseEntity.ok(department);
	}
	
	@GetMapping("/receiveRequests")
    public ResponseEntity<?> findByReceivesRequests(@RequestParam(name = "receiveRequests") boolean receiveRequests) {
        return ResponseEntity.ok(departmentRepository.findByReceivesRequests(receiveRequests));
    }

	@PostMapping("/")
	public ResponseEntity<?> createDepartment(@RequestBody DepartmentDTO departmentDTO) {
		Department department = new Department(departmentDTO.name(), departmentDTO.receivesRequests(), departmentDTO.unit());

		departmentRepository.save(department);

		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{departmentID}")
	public ResponseEntity<?> deleteDepartment(@PathVariable Long departmentID) {
		Optional<Department> optionalDepartment = departmentRepository.findById(departmentID);

		if (optionalDepartment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		departmentRepository.deleteById(departmentID);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{departmentID}")
	public ResponseEntity<?> updateDepartment(@PathVariable Long departmentID, @RequestBody DepartmentDTO departmentDTO) {
		Optional<Department> optionalDepartment = departmentRepository.findById(departmentID);

		if (optionalDepartment.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Department department = optionalDepartment.get();
		department.setName(departmentDTO.name());
		department.setReceivesRequests(departmentDTO.receivesRequests());
		department.setUnit(departmentDTO.unit());
		departmentRepository.save(department);

		return ResponseEntity.ok().build();
	}

}
