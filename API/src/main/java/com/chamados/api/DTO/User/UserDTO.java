package com.chamados.api.DTO.User;

import com.chamados.api.DTO.RoleDepartmentDTO;
import com.chamados.api.Entities.Cargo;

import java.util.List;

public record UserDTO(
        String name,
        String phone,
        String email,
        String password,
        Cargo cargo,
        List<RoleDepartmentDTO> roleDepartments
) {}