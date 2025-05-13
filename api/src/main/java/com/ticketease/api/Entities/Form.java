package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ticketease.api.Enums.ApprovalModeEnum;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
public class Form {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JoinColumn(nullable = false)
	private TicketCategory ticketCategory;

	@ManyToMany
	@Setter
	@JoinTable(name = "ticket_approvers", joinColumns = @JoinColumn(name = "ticket_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> approvers = new HashSet<>();

	@Enumerated(EnumType.STRING)
	@Column(name = "approval_mode", nullable = false)
	@Setter
	private ApprovalModeEnum approvalMode = ApprovalModeEnum.OR;

	@Column(nullable = false)
	private String title;

	private String description;

	@ManyToOne(optional = false)
	@JoinColumn(nullable = false)
	private User creator;

	@OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	@OnDelete(action = OnDeleteAction.CASCADE)
	private List<FormField> fields = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department_id")
	private Department department;

	public Form(TicketCategory ticketCategory, String title, String description, Set<User> approvers,
			ApprovalModeEnum approvalMode, User user, List<FormField> fields, Department department) {
		this.ticketCategory = ticketCategory;
		this.title = title;
		this.description = description;
		this.approvers = approvers;
		this.approvalMode = approvalMode;
		this.creator = user;
		this.fields = fields;
		this.department = department;
	};

	public Form() {
	};
}
