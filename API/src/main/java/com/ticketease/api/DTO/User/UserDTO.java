package com.ticketease.api.DTO.User;

import com.ticketease.api.DTO.UserRoleDepartmentDTO;
import com.ticketease.api.Entities.Cargo;
import java.util.List;

public record UserDTO(
    String name,
    String phone,
    String email,
    String password,
    Cargo cargo,
    List<UserRoleDepartmentDTO> roleDepartments) {}
