package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketCategoryDTO;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.TicketCategory;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import com.ticketease.api.Services.TicketCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/fathers")
    public ResponseEntity<?> getRootCategories() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<TicketCategory> categories = ticketCategoryRepository.findAll().stream()
                .filter(c -> c.getFather() == null)
                .filter(c -> {
                    Department dept = c.getDepartment();
                    return dept != null && user.hasPermission("MANAGE_TICKET_CATEGORY", dept);
                })
                .toList();

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/pageable")
    public ResponseEntity<?> getAllPageable(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<TicketCategory> allCategories = ticketCategoryRepository.findAll();

        List<TicketCategory> filteredList = allCategories.stream()
                .filter(category -> {
                    Department dept = category.getDepartment();
                    return dept != null && user.hasPermission("MANAGE_TICKET_CATEGORY", dept);
                })
                .toList();

        if (filteredList.isEmpty()) {
            return ResponseEntity.ok().build();
        }

        Page<TicketCategory> filteredPage = new PageImpl<>(filteredList, pageable, filteredList.size());
        return ResponseEntity.ok(filteredPage);
    }

    @GetMapping("/{categoryID}")
    public ResponseEntity<?> getTicketCategory(@PathVariable Long categoryID) {
        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

        if (optionalTicketCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TicketCategory ticketCategory = optionalTicketCategory.get();
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = ticketCategory.getDepartment();

        if (!user.hasPermission("MANAGE_TICKET_CATEGORY", department)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para visualizar essa categoria.");
        }

        return ResponseEntity.ok(ticketCategory);
    }

    @GetMapping("/departments/allowed")
    public ResponseEntity<?> getAllowedDepartments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Department> all = departmentRepository.findByReceivesRequests(true);

        List<Department> filtered = all.stream()
                .filter(dept -> user.hasPermission("MANAGE_TICKET_CATEGORY", dept))
                .toList();

        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/by-departments")
    public ResponseEntity<?> getByDepartments(@RequestParam List<Long> departmentIds) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Long> allowedDeptIds = departmentIds.stream()
                .filter(id -> {
                    Department d = departmentRepository.findById(id).orElse(null);
                    return d != null && user.hasPermission("MANAGE_TICKET_CATEGORY", d);
                })
                .toList();

        if (allowedDeptIds.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para esses departamentos.");
        }

        List<TicketCategory> categories = ticketCategoryRepository.findByDepartmentIdIn(allowedDeptIds);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> createTicketCategory(@RequestBody TicketCategoryDTO ticketCategoryDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = null;
        TicketCategory fatherCategory = null;

        if (ticketCategoryDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(ticketCategoryDTO.getDepartmentId()).orElse(null);

            if (department == null) {
                return ResponseEntity.badRequest().body("Departamento inválido.");
            }

            if (!user.hasPermission("MANAGE_TICKET_CATEGORY", department)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Você não tem permissão para criar categoria nesse departamento.");
            }
        }

        if (ticketCategoryDTO.getFatherId() != null) {
            fatherCategory = ticketCategoryRepository.findById(ticketCategoryDTO.getFatherId()).orElse(null);

            if (fatherCategory == null) {
                return ResponseEntity.badRequest().body("Categoria pai inválida.");
            }

            Department parentDept = fatherCategory.getDepartment();
            if (!user.hasPermission("MANAGE_TICKET_CATEGORY", parentDept)) {
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
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = ticketCategory.getDepartment();

        if (!user.hasPermission("MANAGE_TICKET_CATEGORY", department)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar essa categoria.");
        }

        ticketCategoryService.updateCategory(ticketCategory, ticketCategoryDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{categoryID}")
    public ResponseEntity<?> deleteTicketCategory(@PathVariable Long categoryID) {
        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

        if (optionalTicketCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TicketCategory ticketCategory = optionalTicketCategory.get();
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = ticketCategory.getDepartment();

        if (!user.hasPermission("MANAGE_TICKET_CATEGORY", department)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para excluir essa categoria.");
        }

        try {
            ticketCategoryRepository.delete(ticketCategory);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir a categoria de formulário devido a registros associados.");
        }
    }

}
