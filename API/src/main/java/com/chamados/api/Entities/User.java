package com.chamados.api.Entities;

import com.chamados.api.DTO.UserDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Set;

@Getter
@Entity(name = "User")
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    private String phone;

    @Setter
    @Column(unique = true, nullable = false)
    private String email;

    @Setter
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Setter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles;

    @Setter
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Setter
    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    public UserDTO toDTO() {
        return new UserDTO(
                this.id,
                this.name,
                this.email,
                this.phone,
                this.department,
                this.cargo
        );
    }
}
