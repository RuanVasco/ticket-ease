package com.chamados.api.DTO;

import java.util.Optional;

public record TicketCategoryDTO(String name, Boolean receiveTickets, Optional<Long> department_id, Optional<Long> father_id) {
}
