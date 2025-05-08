package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TicketResponse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private FormField field;

	@Column(name = "field_value")
	private String value;

	@ManyToOne
	@JoinColumn(name = "ticket_id")
	@JsonBackReference
	private Ticket ticket;

	@OneToMany(mappedBy = "ticketResponse", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<Attachment> attachments;
}
