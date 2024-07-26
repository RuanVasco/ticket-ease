package com.chamados.api.Controllers;

import com.chamados.api.DTO.FormDTO;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Form;
import com.chamados.api.Repositories.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("forms")
public class FormController {
    @Autowired
    FormRepository formRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(formRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Form>> getAllPageable(Pageable pageable) {
        Page<Form> form = formRepository.findAll(pageable);
        return ResponseEntity.ok(form);
    }

    @PostMapping("/")
    public ResponseEntity<?> createForm(@RequestBody FormDTO formDTO) {
        Form form = new Form(formDTO.name(), formDTO.ticketCategory());
        formRepository.save(form);

        return ResponseEntity.ok().build();
    }
}
