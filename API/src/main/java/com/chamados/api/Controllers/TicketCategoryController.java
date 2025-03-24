package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Services.TicketCategoryService;
import com.google.googlejavaformat.Op;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> getAllPageable(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (user.hasGlobalPermission("CREATE_TICKET_CATEGORY") || user.hasGlobalPermission("FULL_ACCESS")) {
            return ResponseEntity.ok(ticketCategoryRepository.findAll(pageable));
        }

        Set<Department> allowedDepartments = user.getDepartments().stream()
                .filter(department -> user.hasPermission("CREATE_TICKET_CATEGORY", department))
                .collect(Collectors.toSet());

        if (allowedDepartments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para visualizar categorias.");
        }

        Page<TicketCategory> filtered = ticketCategoryRepository
                .findByDepartmentIn(allowedDepartments, pageable);

        return ResponseEntity.ok(filtered);
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

    @GetMapping("/by-departments")
    public ResponseEntity<?> getByDepartments(@RequestParam List<Long> departmentIds) {
        List<TicketCategory> categories = ticketCategoryRepository.findByDepartmentIdIn(departmentIds);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> createTicketCategory(@RequestBody TicketCategoryDTO ticketCategoryDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = null;
        TicketCategory fatherCategory = null;

        if (ticketCategoryDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(ticketCategoryDTO.getDepartmentId())
                    .orElse(null);

            if (department == null) {
                return ResponseEntity.badRequest().body("Departamento inválido.");
            }

            if (!user.hasPermission("CREATE_TICKET_CATEGORY", department)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você não tem permissão para criar categoria nesse departamento.");
            }
        }

        if (ticketCategoryDTO.getFatherId() != null) {
            fatherCategory = ticketCategoryRepository.findById(ticketCategoryDTO.getFatherId())
                    .orElse(null);

            if (fatherCategory == null) {
                return ResponseEntity.badRequest().body("Categoria pai inválida.");
            }

            Department parentDept = fatherCategory.getDepartment();
            if (!user.hasPermission("CREATE_TICKET_CATEGORY", parentDept)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você não tem permissão para criar categoria nesse departamento.");
            }
        }

        if (department == null && fatherCategory == null) {
            return ResponseEntity.badRequest().body("Você deve informar o departamento ou a categoria pai.");
        }

        ticketCategoryService.addCategory(
                ticketCategoryDTO.getName(),
                ticketCategoryDTO.getReceiveTickets(),
                department,
                fatherCategory
        );

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
