package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO.FormDTO;
import com.ticketease.api.DTO.FormDTO.FormFieldDTO;
import com.ticketease.api.DTO.FormDTO.FormResponseDTO;
import com.ticketease.api.DTO.FormDTO.OptionDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.FieldTypeEnum;
import com.ticketease.api.Repositories.FormFieldRepository;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import com.ticketease.api.Repositories.UserRepository;
import com.ticketease.api.Services.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<Form>> getAllForms() {
        return ResponseEntity.ok(formService.getAllForms());
    }

    @GetMapping("/field-types")
    public ResponseEntity<List<String>> getFieldTypeNames() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!user.hasPermissionInAnyDepartment("MANAGE_FORM")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of("Você não tem permissão."));
        }

        List<String> names = Arrays.stream(FieldTypeEnum.values())
                .map(Enum::name)
                .toList();

        return ResponseEntity.ok(names);
    }

    @GetMapping("/pageable")
    public ResponseEntity<?> getAllPageable(Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Form> allForms = formRepository.findAll();

        List<Form> filteredList = allForms.stream()
                .filter(form -> {
                    Department dept = form.getTicketCategory().getDepartment();
                    return user.hasPermission("MANAGE_FORM", dept) || user.hasPermission("MANAGE_FORM", null);
                })
                .toList();

        Page<Form> filteredPage = new PageImpl<>(filteredList, pageable, filteredList.size());
        return ResponseEntity.ok(filteredPage);
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

        if (!user.hasPermission("MANAGE_FORM", ticketCategory.getDepartment()) && !user.hasPermission("MANAGE_FORM", null)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        List<FormField> fields = new ArrayList<>();
        for (FormFieldDTO dto : formDTO.getFields()) {
            FieldTypeEnum fieldTypeEnum = FieldTypeEnum.valueOf(dto.getType().toUpperCase());
            FormField field = new FormField();
            field.setLabel(dto.getLabel());
            field.setType(fieldTypeEnum);
            if (fieldTypeEnum != FieldTypeEnum.FILE && fieldTypeEnum != FieldTypeEnum.FILE_MULTIPLE) {
                field.setRequired(dto.isRequired());
            }
            field.setPlaceholder(dto.getPlaceholder());

            if (dto.getOptions() != null) {
                List<Option> options = dto.getOptions().stream()
                        .map(OptionDTO::toEntity)
                        .collect(Collectors.toList()); 
                field.setOptions(options);
            }

            fields.add(field);
        }

        Set<User> validators = new HashSet<>();
        for (Long userId : formDTO.getApprovers()) {
            userRepository.findById(userId).ifPresent(validators::add);
        }

        Form form = new Form(
                ticketCategory,
                formDTO.getTitle(),
                formDTO.getDescription(),
                validators,
                formDTO.getApprovalMode(),
                user,
                fields
        );

        Form savedForm = formService.createForm(form);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedForm);
    }

    @PutMapping("{formId}")
    public ResponseEntity<Form> updateForm(@PathVariable Long formId, @RequestBody FormDTO formDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Form existingForm = formService.getFormById(formId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

        if (!user.hasPermission("MANAGE_FORM", existingForm.getDepartment()) && !user.hasPermission("MANAGE_FORM", null)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TicketCategory ticketCategory = ticketCategoryRepository.findById(formDTO.getTicketCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket category not found"));

        existingForm.setTitle(formDTO.getTitle());
        existingForm.setDescription(formDTO.getDescription());
        existingForm.setTicketCategory(ticketCategory);

        Set<User> approvers = new HashSet<>();
        for (Long userId : formDTO.getApprovers()) {
            userRepository.findById(userId).ifPresent(approvers::add);
        }

        existingForm.setApprovers(approvers);
        existingForm.setApprovalMode(formDTO.getApprovalMode());

        List<FormField> existingFields = existingForm.getFields();
        Map<Long, FormField> existingFieldMap = existingFields.stream()
                .filter(f -> f.getId() != null)
                .collect(Collectors.toMap(FormField::getId, f -> f));

        Set<Long> incomingIds = formDTO.getFields().stream()
                .map(FormFieldDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<FormField> toRemove = existingFields.stream()
                .filter(f -> f.getId() != null && !incomingIds.contains(f.getId()))
                .toList();

        existingFields.removeAll(toRemove);

        for (FormFieldDTO dto : formDTO.getFields()) {
            FormField field;
            if (dto.getId() != null && existingFieldMap.containsKey(dto.getId())) {
                field = existingFieldMap.get(dto.getId());
            } else {
                field = new FormField();
                field.setForm(existingForm);
                existingFields.add(field);
            }

            field.setLabel(dto.getLabel());
            field.setType(FieldTypeEnum.valueOf(dto.getType().toUpperCase()));
            field.setPlaceholder(dto.getPlaceholder());
            field.setRequired(dto.isRequired());

            if (dto.getOptions() != null) {
                field.setOptions(new ArrayList<>(
                        dto.getOptions().stream()
                                .map(OptionDTO::toEntity)
                                .toList()
                ));
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

        if (!user.hasPermission("MANAGE_FORM", existingForm.getDepartment()) && !user.hasPermission("MANAGE_FORM", null)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        formService.deleteForm(id);
        return ResponseEntity.noContent().build();
    }
}
