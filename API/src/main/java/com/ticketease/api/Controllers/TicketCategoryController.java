package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketCategoryDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import com.ticketease.api.Services.FormService;
import com.ticketease.api.Services.TicketCategoryService;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("ticket-category")
@RequiredArgsConstructor
public class TicketCategoryController {

	@Autowired
	TicketCategoryRepository ticketCategoryRepository;

	@Autowired
	TicketCategoryService ticketCategoryService;

	@Autowired
	DepartmentRepository departmentRepository;

	private final FormService formService;

	@GetMapping("/with-form")
	public ResponseEntity<?> getCategoriesWithFormLeaf(@RequestParam(required = false) Long fatherId) {
		return ResponseEntity.ok(ticketCategoryService.findChildrenWithFormDescendants(fatherId));
	}

	@GetMapping("/fathers")
	public ResponseEntity<?> getFathersCategories() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<TicketCategory> allCategories = ticketCategoryRepository.findAll();
		List<TicketCategory> filteredCategories = new ArrayList<>();

		for (TicketCategory tc : allCategories) {
			Department dept = tc.getDepartment();
			if (user.hasPermission("MANAGE_TICKET_CATEGORY", dept)) {
				filteredCategories.add(tc);
			}
		}

		return ResponseEntity.ok(filteredCategories);
	}

	@GetMapping("/pageable")
	public ResponseEntity<?> getAllPageable(Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<TicketCategory> allCategories = ticketCategoryRepository.findAll();

		List<TicketCategory> filteredList = allCategories.stream().filter(category -> {
			Department dept = category.getDepartment();
			return user.hasPermission("MANAGE_TICKET_CATEGORY", dept);
		}).toList();

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
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Você não tem permissão para visualizar essa categoria.");
		}

		return ResponseEntity.ok(ticketCategory);
	}

	@GetMapping("/{categoryId}/approvers")
	public ResponseEntity<?> getValidators(@PathVariable Long categoryId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryId);

		if (optionalTicketCategory.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		TicketCategory ticketCategory = optionalTicketCategory.get();
		Department categoryDepartment = ticketCategory.getDepartment();

		if (!user.hasPermission("MANAGE_FORM", categoryDepartment)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão.");
		}

		List<User> validators = categoryDepartment.getUsers().stream()
				.filter(u -> u.hasPermission("APPROVE_TICKET", categoryDepartment)).toList();

		return ResponseEntity.ok(validators);
	}

	@GetMapping("/departments/allowed")
	public ResponseEntity<?> getAllowedDepartments() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<Department> all = departmentRepository.findByReceivesRequests(true);

		List<Department> filtered = all.stream().filter(dept -> user.hasPermission("MANAGE_TICKET_CATEGORY", dept))
				.toList();

		return ResponseEntity.ok(filtered);
	}

	@GetMapping("/by-departments")
	public ResponseEntity<?> getByDepartments(@RequestParam List<Long> departmentIds) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<Long> allowedDeptIds = departmentIds.stream().filter(id -> {
			Department d = departmentRepository.findById(id).orElse(null);
			return d != null && user.hasPermission("MANAGE_TICKET_CATEGORY", d);
		}).toList();

		if (allowedDeptIds.isEmpty()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para esses departamentos.");
		}

		List<TicketCategory> categories = ticketCategoryRepository.findByDepartmentIdIn(allowedDeptIds);
		return ResponseEntity.ok(categories);
	}

	@GetMapping("/forms/{formId}")
	public ResponseEntity<?> getForms(@PathVariable Long formId) {
		return ResponseEntity.ok(formService.findByTicketCategory(formId));
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

			boolean hasDeptPermission = user.hasPermission("MANAGE_TICKET_CATEGORY", department);
			boolean hasGlobalPermission = user.hasPermission("MANAGE_TICKET_CATEGORY", null);

			if (!hasDeptPermission && !hasGlobalPermission) {
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
			if (!user.hasPermission("MANAGE_TICKET_CATEGORY", parentDept)
					&& !user.hasPermission("MANAGE_TICKET_CATEGORY", null)) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body("Você não tem permissão para criar categoria nesse departamento.");
			}
		}

		if (department == null && fatherCategory == null) {
			return ResponseEntity.badRequest().body("Você deve informar o departamento ou a categoria pai.");
		}

		ticketCategoryService.addCategory(ticketCategoryDTO.getName(), department, fatherCategory);

		return ResponseEntity.ok().build();
	}

	@PutMapping("/{categoryID}")
	public ResponseEntity<?> updateTicketCategory(@PathVariable Long categoryID,
			@RequestBody TicketCategoryDTO ticketCategoryDTO) {
		Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(categoryID);

		if (optionalTicketCategory.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		TicketCategory ticketCategory = optionalTicketCategory.get();

		if (Objects.equals(ticketCategory.getId(), ticketCategoryDTO.getFatherId())) {
			return ResponseEntity.badRequest().body("A própria categoria não pode ser pai dela mesma.");
		}

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Department department = ticketCategory.getDepartment();

		if (!user.hasPermission("MANAGE_TICKET_CATEGORY", department)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Você não tem permissão para editar essa categoria.");
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
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Você não tem permissão para excluir essa categoria.");
		}

		try {
			ticketCategoryService.delete(ticketCategory);
			return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Não é possível excluir a categoria de formulário devido a registros associados.");
		}
	}

	@GetMapping("/path/{categoryId}")
	public ResponseEntity<List<TicketCategoryDTO>> getCategoryPath(@PathVariable Long categoryId) {
		List<TicketCategoryDTO> path = ticketCategoryService.getCategoryPath(categoryId);
		return ResponseEntity.ok(path);
	}
}
