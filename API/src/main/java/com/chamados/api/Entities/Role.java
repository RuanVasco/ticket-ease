package com.chamados.api.Entities;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Setter
@Getter
@Entity(name="Role")
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Getter
    @Column(nullable = false, unique = true, length = 60)
    private String name;

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }
    
    public String getName() {
    	return this.name;
    }

}