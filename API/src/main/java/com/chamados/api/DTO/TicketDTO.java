package com.chamados.api.DTO;

import com.chamados.api.Entities.Form;

public record TicketDTO(Long form_id, String name, String description, String observation, String procedure, String status, String urgency, Boolean receiveEmail) {
}
