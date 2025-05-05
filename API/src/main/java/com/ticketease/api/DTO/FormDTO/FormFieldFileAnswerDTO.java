package com.ticketease.api.DTO.FormDTO;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class FormFieldFileAnswerDTO {
	private Long fieldId;
	private List<MultipartFile> files;
}
