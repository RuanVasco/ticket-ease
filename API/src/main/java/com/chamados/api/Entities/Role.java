package com.chamados.api.Entities;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

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

    @Getter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    public Role() {}

    public Role(String name) {
        if (!name.startsWith("ROLE_")) {
            name = "ROLE_" + name;
        }
        this.name = name;
    }
}