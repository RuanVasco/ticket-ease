package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name="cargos")
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(unique = true, nullable = false)
    private String name;

    public Cargo(String name) {
        this.name = name;
    }

    public Cargo() {
    }

    public static boolean canCreate(User user) {
        return user.hasPermission("CREATE_CARGO");
    }

    public static boolean canView(User user) {
        return user.hasPermission("VIEW_CARGO");
    }

    public static boolean canUpdate(User user) {
        return user.hasPermission("CREATE_CARGO");
    }

    public static boolean canDelete(User user) {
        return user.hasPermission("DELETE_CARGO");
    }
}
