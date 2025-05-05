package com.ticketease.api.DTO;

import com.ticketease.api.Entities.Unit;

public record DepartmentDTO(String name, boolean receivesRequests, Unit unit) {
}
