package com.ticketease.api.DTO;

import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Role;

public record UserRoleDepartmentDTO(Department department, Role role) {
}
