package com.ticketease.api.DTO.FormDTO;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormFieldDTO {
	private Long id;
	private String label;
	private String name;
	private String type;
	private boolean required;
	private String placeholder;
	private List<OptionDTO> options;
}
