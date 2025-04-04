package com.ticketease.api.Services;

import com.ticketease.api.Entities.Department;
import com.ticketease.api.Repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public Optional<Department> findById(Long departmentId) {
        return departmentRepository.findById(departmentId);
    }
}
