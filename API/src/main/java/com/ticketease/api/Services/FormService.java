package com.ticketease.api.Services;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.FormField;
import com.ticketease.api.Repositories.FormFieldRepository;
import com.ticketease.api.Repositories.FormRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final FormFieldRepository fieldRepository;

    public List<Form> getAllForms() {
        return formRepository.findAll();
    }

    public Optional<Form> getFormById(Long id) {
        return formRepository.findById(id);
    }

    @Transactional
    public Form createForm(Form form) {
        Form savedForm = formRepository.save(form);

        for (FormField field : form.getFields()) {
            field.setForm(savedForm);
            FormField savedField = fieldRepository.save(field);
        }

        return savedForm;
    }

    public void deleteForm(Long id) {
        formRepository.deleteById(id);
    }

    public Form save(Form existingForm) {
        return formRepository.save(existingForm);
    }

    public List<Form> findByTicketCategory(Long categoryId) {
        return  formRepository.findByTicketCategoryId(categoryId);
    }
}
