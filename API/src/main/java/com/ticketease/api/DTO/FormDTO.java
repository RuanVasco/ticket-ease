package com.ticketease.api.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FormDTO {
    private Long id;
    private String title;
    private String description;
    private Long userId;
    private Long ticketCategoryId;
    private List<FormFieldDTO> fields;
}