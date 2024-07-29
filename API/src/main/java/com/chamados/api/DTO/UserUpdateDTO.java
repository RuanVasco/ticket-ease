package com.chamados.api.DTO;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;

public record UserUpdateDTO(String name, String email, String phone, String password, Long role_id, Long department_id, Long cargo_id) {

}
