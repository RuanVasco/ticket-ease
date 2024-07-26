package com.chamados.api.DTO;

import com.chamados.api.Entities.TicketCategory;

public record FormDTO(String name, TicketCategory ticketCategory) {
}
