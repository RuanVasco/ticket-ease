package com.ticketease.api.Services;

import com.ticketease.api.Entities.Department;
import com.ticketease.api.Repositories.DepartmentRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentService {
	private final DepartmentRepository departmentRepository;

	public Optional<Department> findById(Long departmentId) {
		return departmentRepository.findById(departmentId);
	}
}
