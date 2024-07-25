package com.chamados.api.DTO;

import com.chamados.api.Entities.Department;
import com.chamados.api.Entities.TicketCategory;

import java.util.Optional;

public record TicketCategoryDTO(String name, Optional<Long> department_id, Optional<Long> father_id) {
}
