package com.ticketease.api.Services;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.FormField;
import com.ticketease.api.Repositories.FormFieldRepository;
import com.ticketease.api.Repositories.FormRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FormService {

	private final FormRepository formRepository;

	public List<Form> getAllForms() {
		return formRepository.findAll();
	}

	public Optional<Form> getFormById(Long id) {
		return formRepository.findById(id);
	}

	@Transactional
	public Form createForm(Form form) {
		for (FormField field : form.getFields()) {
			field.setForm(form);
		}

		return formRepository.save(form);
	}

	public void deleteForm(Long id) {
		formRepository.deleteById(id);
	}

	public Form save(Form existingForm) {
		return formRepository.save(existingForm);
	}

	public List<Form> findByTicketCategory(Long categoryId) {
		return formRepository.findByTicketCategoryId(categoryId);
	}

	public List<Form> findByValue(String value) {
		return formRepository.findByValue(value);
	}
}
