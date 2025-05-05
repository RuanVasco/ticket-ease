package com.ticketease.api.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String message;
	private boolean read = false;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	private Long referenceId;
	private String type;

	private LocalDateTime createdAt = LocalDateTime.now();

	public Notification() {
	}

	public Notification(User user, String message, Long referenceId, String type) {
		this.user = user;
		this.message = message;
		this.referenceId = referenceId;
		this.type = type;
		this.read = false;
	}
}
