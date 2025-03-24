package com.chamados.api.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="units")
@Getter
public class Unit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Setter
    private String name;

	@Setter
    private String address;
	
	public Unit() {}
	
	public Unit(String name, String address) {
		this.name = name;
		this.address = address;
    }
}
