package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO.*;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.FieldTypeEnum;
import com.ticketease.api.Repositories.FormFieldRepository;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import com.ticketease.api.Repositories.UserRepository;
import com.ticketease.api.Services.FormService;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("forms")
@RequiredArgsConstructor
public class FormController {

	private final FormService formService;
	private final UserRepository userRepository;
	private final TicketCategoryRepository ticketCategoryRepository;
	private final FormRepository formRepository;
	private final FormFieldRepository formFieldRepository;

	@GetMapping
	public ResponseEntity<?> getAllForms(
		@RequestParam(required = false) String search
	) {
		if (search != null) {
			List<UserFormLinkDTO> formLinkDTOS = formService.findByValue(search)
				.stream()
				.map(UserFormLinkDTO::fromEntity)
				.collect(Collectors.toList());

			return ResponseEntity.ok(formLinkDTOS);
		}
		return ResponseEntity.ok(formService.getAllForms());
	}

	@GetMapping("/field-types")
	public ResponseEntity<List<String>> getFieldTypeNames() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (!user.hasPermissionInAnyDepartment("MANAGE_FORM")) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of("Você não tem permissão."));
		}

		List<String> names = Arrays.stream(FieldTypeEnum.values()).map(Enum::name).toList();

		return ResponseEntity.ok(names);
	}

	@GetMapping("/pageable")
	public ResponseEntity<?> getAllPageable(Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		List<Form> allForms = formRepository.findAll();

		List<Form> filteredList = allForms.stream().filter(form -> {
			Department dept = form.getTicketCategory().getDepartment();
			return user.hasPermission("MANAGE_FORM", dept) || user.hasPermission("MANAGE_FORM", null);
		}).toList();

		List<FormDTO> dtoList = filteredList.stream()
			.map(FormDTO::fromEntity)
			.toList();

		Page<FormDTO> dtoPage = new PageImpl<>(dtoList, pageable, dtoList.size());

		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getFormById(@PathVariable Long id) {
		Form form = formService.getFormById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Form not found"));

		return ResponseEntity.ok(FormResponseDTO.from(form));
	}

	@PostMapping
	public ResponseEntity<Form> createForm(@RequestBody FormDTO formDTO) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		TicketCategory ticketCategory = ticketCategoryRepository.findById(formDTO.getTicketCategoryId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket category not found"));

		if (!user.hasPermission("MANAGE_FORM", ticketCategory.getDepartment())
				&& !user.hasPermission("MANAGE_FORM", null)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		List<FormField> fields = new ArrayList<>();
		for (FormFieldDTO dto : formDTO.getFields()) {
			FieldTypeEnum fieldTypeEnum = FieldTypeEnum.valueOf(dto.type().toUpperCase());
			FormField field = new FormField();
			field.setLabel(dto.label());
			field.setType(fieldTypeEnum);
			if (fieldTypeEnum != FieldTypeEnum.FILE && fieldTypeEnum != FieldTypeEnum.FILE_MULTIPLE) {
				field.setRequired(dto.required());
			}
			field.setPlaceholder(dto.placeholder());

			if (dto.options() != null) {
				List<Option> options = dto.options().stream().map(OptionDTO::toEntity).collect(Collectors.toList());
				field.setOptions(options);
			}

			fields.add(field);
		}

		Set<User> validators = new HashSet<>();
		for (Long userId : formDTO.getApprovers()) {
			userRepository.findById(userId).ifPresent(validators::add);
		}

		Form form = new Form(ticketCategory, formDTO.getTitle(), formDTO.getDescription(), validators,
				formDTO.getApprovalMode(), user, fields, ticketCategory.getDepartment());

		Form savedForm = formService.createForm(form);

		return ResponseEntity.status(HttpStatus.CREATED).body(savedForm);
	}

	@PutMapping("{formId}")
	public ResponseEntity<Form> updateForm(@PathVariable Long formId, @RequestBody FormDTO formDTO) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Form existingForm = formService.getFormById(formId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

		if (!user.hasPermission("MANAGE_FORM", existingForm.getDepartment())
				&& !user.hasPermission("MANAGE_FORM", null)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		TicketCategory ticketCategory = ticketCategoryRepository.findById(formDTO.getTicketCategoryId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket category not found"));

		existingForm.setTitle(formDTO.getTitle());
		existingForm.setDescription(formDTO.getDescription());
		existingForm.setTicketCategory(ticketCategory);
		existingForm.setDepartment(ticketCategory.getDepartment());

		Set<User> approvers = new HashSet<>();
		for (Long userId : formDTO.getApprovers()) {
			userRepository.findById(userId).ifPresent(approvers::add);
		}

		existingForm.setApprovers(approvers);
		existingForm.setApprovalMode(formDTO.getApprovalMode());

		List<FormField> existingFields = existingForm.getFields();
		Map<Long, FormField> existingFieldMap = existingFields.stream().filter(f -> f.getId() != null)
				.collect(Collectors.toMap(FormField::getId, f -> f));

		Set<Long> incomingIds = formDTO.getFields().stream().map(FormFieldDTO::id).filter(Objects::nonNull)
				.collect(Collectors.toSet());

		List<FormField> toRemove = existingFields.stream()
				.filter(f -> f.getId() != null && !incomingIds.contains(f.getId())).toList();

		existingFields.removeAll(toRemove);

		for (FormFieldDTO dto : formDTO.getFields()) {
			FormField field;
			if (dto.id() != null && existingFieldMap.containsKey(dto.id())) {
				field = existingFieldMap.get(dto.id());
			} else {
				field = new FormField();
				field.setForm(existingForm);
				existingFields.add(field);
			}

			field.setLabel(dto.label());
			field.setType(FieldTypeEnum.valueOf(dto.type().toUpperCase()));
			field.setPlaceholder(dto.placeholder());
			field.setRequired(dto.required());

			if (dto.options() != null) {
				field.setOptions(new ArrayList<>(dto.options().stream().map(OptionDTO::toEntity).toList()));
			}
		}

		Form updatedForm = formService.save(existingForm);

		return ResponseEntity.ok(updatedForm);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteForm(@PathVariable Long id) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Optional<Form> optionalForm = formService.getFormById(id);
		if (optionalForm.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Form existingForm = optionalForm.get();

		if (!user.hasPermission("MANAGE_FORM", existingForm.getDepartment())
				&& !user.hasPermission("MANAGE_FORM", null)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		formService.deleteForm(id);
		return ResponseEntity.noContent().build();
	}
}
