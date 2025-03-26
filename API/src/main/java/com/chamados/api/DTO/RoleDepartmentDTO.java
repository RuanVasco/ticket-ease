package com.chamados.api.DTO;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.Role;

public record RoleDepartmentDTO(Role role, Department department) {}