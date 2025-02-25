package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Services.TicketCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{categoryID}")
    public ResponseEntity<TicketCategory> getTicketCategory(@PathVariable Long categoryID) {
        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

        if (optionalTicketCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TicketCategory ticketCategory = optionalTicketCategory.get();

        return ResponseEntity.ok(ticketCategory);
    }

    @PostMapping("/")
    public ResponseEntity<?> createTicketCategory(@RequestBody TicketCategoryDTO ticketCategoryDTO) {
        Department department = null;

        if (ticketCategoryDTO.getDepartmentId() != null) {
            Optional<Department> optionalDepartment = departmentRepository.findById(ticketCategoryDTO.getDepartmentId());
            if (optionalDepartment.isPresent()) {
                department = optionalDepartment.get();
            }
        }

        TicketCategory ticketCategory = null;

        if (ticketCategoryDTO.getFatherId() != null) {
            Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(ticketCategoryDTO.getFatherId());
            ticketCategory = optionalTicketCategory.orElse(null);
        }

        ticketCategoryService.addCategory(ticketCategoryDTO.getName(), ticketCategoryDTO.getReceiveTickets(), department, ticketCategory);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{categoryID}")
    public ResponseEntity<?> updateTicketCategory(@PathVariable Long categoryID, @RequestBody TicketCategoryDTO ticketCategoryDTO) {
        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

        if (optionalTicketCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TicketCategory ticketCategory = optionalTicketCategory.get();

        ticketCategoryService.updateCategory(ticketCategory, ticketCategoryDTO);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{categoryID}")
    public ResponseEntity<?> deleteTicketCategory(@PathVariable Long categoryID) {
        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

        if (optionalTicketCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            TicketCategory ticketCategory = optionalTicketCategory.get();
            ticketCategoryRepository.delete(ticketCategory);

            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir a categoria de formulário devido a registros associados.");
        }

    }

}
