package com.chamados.api.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="departments")
public class Department {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private boolean receivesRequests;
	
	@ManyToOne
	@JoinColumn(name = "unit_id")
    private Unit unit;
	
	public Department() {
		
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isReceivesRequests() {
		return receivesRequests;
	}

	public void setReceivesRequests(boolean receivesRequests) {
		this.receivesRequests = receivesRequests;
	}
	
	
}
