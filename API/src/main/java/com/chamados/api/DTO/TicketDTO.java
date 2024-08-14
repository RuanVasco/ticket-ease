package com.chamados.api.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

public record TicketDTO(
        @NotNull Long ticketCategory_id,
        @NotEmpty String name,
        @NotBlank String description,
        String observation,
        String procedure,
        @NotNull String status,
        @NotNull String urgency,
        @NotNull Boolean receiveEmail
) {}
