package com.chamados.api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Repositories.DepartmentRepository;

@RestController
@RequestMapping("departments")
public class DepartmentController {
	
	@Autowired
	DepartmentRepository departmentRepository;
	
	@GetMapping("/")
    public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(departmentRepository.findAll());
	}
	
	@GetMapping("/receiveRequests")
    public ResponseEntity<?> findByReceivesRequests(@RequestParam(name = "receiveRequests") boolean receiveRequests) {
        return ResponseEntity.ok(departmentRepository.findByReceivesRequests(receiveRequests));
    }

}
