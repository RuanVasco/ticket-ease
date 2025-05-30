package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Entity
@Table(name = "ticket_category")
public class TicketCategory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Setter
	private String name;

	@Setter
	@ManyToOne
	@JoinColumn(name = "department_id", nullable = true)
	private Department department;

	@Setter
	@ManyToOne
	@JoinColumn(name = "father_id", nullable = true)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private TicketCategory father;

	@OneToMany(mappedBy = "ticketCategory")
	@JsonIgnore
	private List<Form> forms;

	public Department getDepartment() {
		if (this.department != null) {
			return this.department;
		}

		TicketCategory current = this;

		while (current != null && current.department == null) {
			current = current.getFather();
		}

		return current != null ? current.department : null;
	}
}
