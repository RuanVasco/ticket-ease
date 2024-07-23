package com.chamados.api.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name="departments")
public class Department {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Setter
    private String name;

	@Setter
	private boolean receivesRequests;
	
	@ManyToOne
	@JoinColumn(name = "unit_id")
	@Setter
    private Unit unit;
	
	public Department() {}
	
	public Department(String name, boolean receivesRequests, Unit unit) {
		this.name = name;
		this.receivesRequests = receivesRequests;
		this.unit = unit;
	}
	
}
