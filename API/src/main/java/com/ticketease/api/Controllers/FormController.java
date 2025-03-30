package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO;
import com.ticketease.api.DTO.FormFieldDTO;
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

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;
    private final UserRepository userRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final FormRepository formRepository;

    @GetMapping
    public ResponseEntity<List<Form>> getAllForms() {
        return ResponseEntity.ok(formService.getAllForms());
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
    public ResponseEntity<Form> getFormById(@PathVariable Long id) {
        return formService.getFormById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody FormDTO formDTO) {
        User user = userRepository.findById(formDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        TicketCategory ticketCategory = ticketCategoryRepository.findById(formDTO.getTicketCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket category not found"));

        List<FormField> fields = new ArrayList<>();
        for (FormFieldDTO dto : formDTO.getFields()) {
            FormField field = new FormField();
            field.setLabel(dto.getLabel());
            field.setName(dto.getName());
            field.setType(FieldTypeEnum.valueOf(dto.getType().toUpperCase()));
            field.setRequired(dto.isRequired());
            field.setPlaceholder(dto.getPlaceholder());
            field.setOptions(dto.getOptions());
            fields.add(field);
        }

        Form form = new Form(ticketCategory, formDTO.getTitle(), formDTO.getDescription(), user, fields);
        Form savedForm = formService.createForm(form);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedForm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteForm(@PathVariable Long id) {
        formService.deleteForm(id);
        return ResponseEntity.noContent().build();
    }
}
