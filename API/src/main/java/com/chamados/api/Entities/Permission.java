package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Column(nullable = false, unique = true)
    private String name;
}