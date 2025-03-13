package com.chamados.api.DTO;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Department department;
    private Cargo cargo;
    private Set<Role> roles;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.department = user.getDepartment();
        this.roles = user.getRoles();
        this.cargo = user.getCargo();
    }

    public UserDTO(Long id, String name, String email, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
