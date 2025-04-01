package com.ticketease.api.DTO.FormDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FormFieldDTO {
    private Long id;
    private String label;
    private String name;
    private String type;
    private boolean required;
    private String placeholder;
    private List<String> options;
}
