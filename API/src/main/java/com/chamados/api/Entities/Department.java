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

import java.util.Objects;

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

	public static boolean canCreate(User user) {
		return user.hasPermission("CREATE_DEPARTMENT");
	}

	public static boolean canView(User user) {
		return user.hasPermission("VIEW_DEPARTMENT");
	}

	public static boolean canEdit(User user) {
		return user.hasPermission("CREATE_DEPARTMENT");
	}

	public static boolean canDelete(User user) {
		return user.hasPermission("DELETE_DEPARTMENT");
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null || getClass() != obj.getClass()) return false;

		Department department = (Department) obj;
		return Objects.equals(this.id, department.id);
	}
}
