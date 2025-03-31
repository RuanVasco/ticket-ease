package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ticketease.api.Enums.FieldTypeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class FormField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @Enumerated(EnumType.STRING)
    private FieldTypeEnum type;

    private boolean required;

    private String placeholder;

    @ElementCollection
    private List<String> options;

    @ManyToOne
    @JsonBackReference
    private Form form;
}
