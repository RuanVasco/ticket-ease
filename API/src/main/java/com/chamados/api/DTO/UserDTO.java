package com.chamados.api.DTO;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.User;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Boolean isAdmin;
    private Department department;
    private Cargo cargo;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.department = user.getDepartment();
        this.cargo = user.getCargo();
        this.isAdmin = user.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
