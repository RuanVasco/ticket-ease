package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Attachment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "ticket_response_id")
	@JsonBackReference
	private TicketResponse ticketResponse;

	private String fileName;
	private String fileType;
	private String filePath;
	private Date uploadedAt;
}
