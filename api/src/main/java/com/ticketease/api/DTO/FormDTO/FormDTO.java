package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Enums.ApprovalModeEnum;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormDTO {
	private String title;
	private String description;
	private Long ticketCategoryId;
	private List<Long> approvers;
	private ApprovalModeEnum approvalMode;
	private List<FormFieldDTO> fields;

	public static FormDTO fromEntity(Form form) {
		FormDTO dto = new FormDTO();
		dto.setTitle(form.getTitle());
		dto.setDescription(form.getDescription());
		dto.setTicketCategoryId(form.getTicketCategory().getId());
		dto.setApprovalMode(form.getApprovalMode());

		dto.setApprovers(form.getApprovers().stream().map(User::getId).toList());

		dto.setFields(form.getFields().stream().map(FormFieldDTO::fromEntity).toList());

		return dto;
	}
}
