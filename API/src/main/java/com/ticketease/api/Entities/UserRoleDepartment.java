package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Entity
public class UserRoleDepartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JsonBackReference
    private User user;

    @ManyToOne(optional = false)
    private Role role;

    @ManyToOne(optional = false)
    private Department department;

    public UserRoleDepartment() {
    }

    public UserRoleDepartment(User user, Role role, Department department) {
        this.user = user;
        this.role = role;
        this.department = department;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserRoleDepartment that)) return false;
        return Objects.equals(user, that.user)
                && Objects.equals(role, that.role)
                && Objects.equals(department, that.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, role, department);
    }
}
