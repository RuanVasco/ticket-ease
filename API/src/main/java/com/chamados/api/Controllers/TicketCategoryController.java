package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Entities.User;
import com.chamados.api.Entities.UserRoleDepartment;
import com.chamados.api.Repositories.DepartmentRepository;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Services.TicketCategoryService;
import com.chamados.api.Types.ScopeType;
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

    @GetMapping("/tickets-category/allowed")
    public ResponseEntity<?> getAllowedCategories() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Set<Department> allowedDepartments = user.getRoleBindings().stream()
                .map(UserRoleDepartment::getDepartment)
                .filter(department -> user.hasPermission("MANAGE_TICKET_CATEGORY", department))
                .collect(Collectors.toSet());

        if (allowedDepartments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para visualizar categorias.");
        }

        return ResponseEntity.ok(ticketCategoryRepository.findByDepartmentIn(allowedDepartments));
    }

    @GetMapping("/pageable")
    public ResponseEntity<?> getAllPageable(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<TicketCategory> allCategories = ticketCategoryRepository.findAll(pageable);

        List<TicketCategory> filteredList = allCategories.stream()
                .filter(category -> {
                    Department dept = category.getDepartment();
                    return dept != null && user.hasPermission("MANAGE_TICKET_CATEGORY", dept);
                })
                .toList();

        if (filteredList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você não tem permissão para visualizar categorias.");
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

        if (!user.hasPermission("VIEW_TICKET_CATEGORY", department)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para visualizar essa categoria.");
        }

        return ResponseEntity.ok(ticketCategory);
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
