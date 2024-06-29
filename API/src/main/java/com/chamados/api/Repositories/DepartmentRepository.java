package com.chamados.api.Repositories;

import com.chamados.api.Entities.Department;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
	List<Department> findAll();
}