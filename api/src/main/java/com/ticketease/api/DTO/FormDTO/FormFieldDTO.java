package com.ticketease.api.DTO.FormDTO;

import java.util.List;

import com.ticketease.api.Entities.FormField;
import com.ticketease.api.Enums.FieldTypeEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public record FormFieldDTO(
	Long id,
	String label,
	String type,
	boolean required,
	String placeholder,
	List<OptionDTO> options
) {
	public static FormFieldDTO fromEntity(FormField field) {
		return new FormFieldDTO(
			field.getId(),
			field.getLabel(),
			String.valueOf(field.getType()),
			field.isRequired(),
			field.getPlaceholder(),
			field.getOptions().stream()
				.map(OptionDTO::from)
				.toList()
		);
	}
}
