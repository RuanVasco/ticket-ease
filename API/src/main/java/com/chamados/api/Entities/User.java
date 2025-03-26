package com.chamados.api.Entities;

import java.util.*;
import java.util.stream.Collectors;

import com.chamados.api.Types.ScopeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@Entity(name = "User")
@Table(name = "users")
public class User implements UserDetails {

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

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<UserRoleDepartment> roleBindings = new HashSet<>();

    @Setter
    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    public void setPassword(String password, PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(password);
    }

    public boolean hasPermission(String permissionName, Department department) {
        if (permissionName == null || permissionName.isEmpty()) {
            return false;
        }

        for (UserRoleDepartment binding : this.roleBindings) {
            Role role = binding.getRole();

            for (Permission permission : role.getPermissions()) {
                if (!permission.getName().equals(permissionName)) continue;

                if (permission.getScope() == ScopeType.GLOBAL) {
                    return true;
                }

                if (permission.getScope() == ScopeType.DEPARTMENT &&
                        binding.getDepartment().equals(department)) {
                    return true;
                }
            }
        }

        return false;
    }


    public boolean hasGlobalPermission(String permissionName) {
        if (permissionName == null || permissionName.isEmpty()) {
            return false;
        }

        return this.roleBindings.stream()
                .flatMap(binding -> binding.getRole().getPermissions().stream())
                .anyMatch(permission ->
                        permission.getName().equals(permissionName) &&
                                permission.getScope() == ScopeType.GLOBAL);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roleBindings.stream()
                .flatMap(binding -> binding.getRole().getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
