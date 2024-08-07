package com.chamados.api.DTO;

public record TicketDTO(Long ticketCategory_id, String name, String description, String observation, String procedure, String status, String urgency, Boolean receiveEmail) {
}
