package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.FormDTO.FormFieldAnswerDTO;

import java.util.List;

public record TicketAnswerResponseDTO(
        TicketPropertiesDTO ticketPropertiesDTO,
        List<FormFieldAnswerDTO> fieldAnswerDTO
) {}