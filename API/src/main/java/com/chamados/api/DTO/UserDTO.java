package com.chamados.api.DTO;

import com.chamados.api.Entities.Cargo;
import com.chamados.api.Entities.Department;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Department department;
    private Cargo cargo;

    public UserDTO(Long id, String name, String email, String phone, Department department, Cargo cargo) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.cargo = cargo;
    }

}
