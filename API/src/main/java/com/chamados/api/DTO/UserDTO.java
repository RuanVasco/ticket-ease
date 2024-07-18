package com.chamados.api.DTO;

import com.chamados.api.Entities.Department;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Department department;

    public UserDTO(Long id, String name, String email, Department department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
    }

}
