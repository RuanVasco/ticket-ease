package com.chamados.api.DTO.InputDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

public record TicketInputDTO(
        @NotNull Long ticketCategory_id,
        @NotEmpty String name,
        @NotBlank String description,
        String observation,
        @NotNull String status,
        @NotNull String urgency,
        @NotNull Boolean receiveEmail
) {}