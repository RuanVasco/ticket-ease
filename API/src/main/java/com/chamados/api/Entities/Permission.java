package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String name;
}