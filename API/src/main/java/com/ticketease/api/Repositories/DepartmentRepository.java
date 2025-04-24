package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Department;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
  List<Department> findAll();

  List<Department> findByReceivesRequests(boolean receivesRequests);

  Optional<Department> findByName(String name);
}
