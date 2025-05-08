package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ticketease.api.Enums.FieldTypeEnum;
import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

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
	@CollectionTable(name = "form_field_option", joinColumns = @JoinColumn(name = "form_field_id"))
	private List<Option> options;

	@ManyToOne
	@JsonBackReference
	private Form form;
}
