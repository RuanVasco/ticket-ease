package com.ticketease.api.DTO.FormDTO;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class FormFieldFileAnswerDTO {
    private Long fieldId;
    private List<MultipartFile> files;
}
