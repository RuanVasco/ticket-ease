package com.chamados.api.DTO;

import java.util.List;

public record UserDTO(
        Long id,
        String name,
        String phone,
        String email,
        String password,
        Long cargoId,
        List<RoleDepartmentDTO> roleDepartments
) {}