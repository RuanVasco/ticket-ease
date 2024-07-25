package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Services.TicketCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("tickets-category")
public class TicketCategoryController {

    @Autowired
    TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    TicketCategoryService ticketCategoryService;

    @Autowired
    DepartmentRepository departmentRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ticketCategoryRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<TicketCategory>> getAllPageable(Pageable pageable) {
        Page<TicketCategory> ticketCategories = ticketCategoryRepository.findAll(pageable);
        return ResponseEntity.ok(ticketCategories);
    }

    @PostMapping("/")
    public ResponseEntity<?> createTicketCategory(@RequestBody TicketCategoryDTO ticketCategoryDTO) {
        Department department;

        if (ticketCategoryDTO.department_id().isPresent()) {
            Optional<Department> optionalDepartment = departmentRepository.findById(ticketCategoryDTO.department_id().get());
            department = optionalDepartment.get();
        }


        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(ticketCategoryDTO.father_id());
        TicketCategory ticketCategory;


        ticketCategory = optionalTicketCategory.orElse(null);

        ticketCategoryService.addCategory(ticketCategoryDTO.name(), department, ticketCategory);

        return ResponseEntity.ok().build();
    }
}
