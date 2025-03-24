package com.chamados.api.Repositories;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    Page<TicketCategory> findByDepartmentIn(Set<Department> departments, Pageable pageable);
    List<TicketCategory> findByDepartmentIdIn(List<Long> departmentIds);

}
