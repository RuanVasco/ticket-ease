package com.ticketease.api.Entities;

import jakarta.persistence.*;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "messages")
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Setter
	@Column(nullable = false)
	private String text;

	@Setter
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Setter
	@ManyToOne
	@JoinColumn(name = "ticket_id")
	private Ticket ticket;

	@Setter
	private Date sentAt;
}
