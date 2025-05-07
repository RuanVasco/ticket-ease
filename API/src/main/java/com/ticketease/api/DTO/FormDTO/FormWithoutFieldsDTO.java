package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.Form;

public record FormWithoutFieldsDTO(
	Long formId,
	String category,
	String title,
	String description,
	UserResponseDTO user,
	String department
) {
	public static FormWithoutFieldsDTO from(Form form) {
		return new FormWithoutFieldsDTO(
			form.getId(),
			form.getTicketCategory().getName(),
			form.getTitle(),
			form.getDescription(),
			UserResponseDTO.from(form.getCreator()),
			form.getDepartment() != null ? form.getDepartment().getName() : null
		);
	}
}
