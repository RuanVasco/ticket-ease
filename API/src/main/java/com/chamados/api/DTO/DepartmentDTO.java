package com.chamados.api.DTO;

import com.chamados.api.Entities.Unit;

public record DepartmentDTO (String name, boolean receivesRequests, Unit unit) {

}