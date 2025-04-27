package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.DTO.TicketCategoryDTO;
import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.ApprovalModeEnum;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record FormResponseDTO(Long id, String title, String description, TicketCategoryDTO ticketCategory,
		UserResponseDTO creator, Set<UserResponseDTO> approvers, ApprovalModeEnum approvalMode,
		List<FormField> fields) {
	public static FormResponseDTO from(Form form) {
		return new FormResponseDTO(form.getId(), form.getTitle(), form.getDescription(),
				new TicketCategoryDTO(form.getTicketCategory()), UserResponseDTO.from(form.getCreator()),
				form.getApprovers().stream().map(UserResponseDTO::from).collect(Collectors.toSet()),
				form.getApprovalMode(), form.getFields());
	}

	public Form toEntity(TicketCategory category, User creatorUser, Set<User> approvers, List<FormField> formFields) {
		Form form = new Form();
		form.setId(id);
		form.setTitle(title);
		form.setDescription(description);
		form.setTicketCategory(category);
		form.setCreator(creatorUser);
		form.setApprovers(approvers);
		form.setApprovalMode(approvalMode);
		form.getFields().addAll(formFields);
		return form;
	}
}
