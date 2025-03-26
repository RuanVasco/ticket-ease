package com.chamados.api.Controllers;

import com.chamados.api.DTO.DepartmentDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.Repositories.DepartmentRepository;

import java.util.List;
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

	@GetMapping("/pageable")
	public ResponseEntity<Page<Department>> getAllPageable(Pageable pageable) {
		Page<Department> department = departmentRepository.findAll(pageable);
		return ResponseEntity.ok(department);
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
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<Department> departmentList = departmentRepository.findByReceivesRequests(receiveRequests);

		if (user.hasGlobalPermission("CREATE_TICKET_CATEGORY")) {
			return ResponseEntity.ok(departmentList);
		}

		List<Department> filteredDepartments = departmentList.stream()
				.filter(department -> department != null && user.hasPermission("CREATE_TICKET_CATEGORY", department))
				.toList();

		return ResponseEntity.ok(filteredDepartments);
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
