package com.ticketease.api.DTO.User;

import com.ticketease.api.DTO.RoleDepartmentDTO;
import com.ticketease.api.Entities.Cargo;

import java.util.List;

public record CompleteUserDTO (
        Long id,
        String name,
        String phone,
        String email,
        String password,
        Cargo cargo,
        List<RoleDepartmentDTO> roleDepartments
){}
