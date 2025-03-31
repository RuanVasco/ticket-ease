package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.Ticket;

import java.util.Date;
import java.util.List;

public record TicketResponseDTO(
        Long id,
        String status,
        Date createdAt,
        Date updatedAt,
        Date closedAt,
        UserResponseDTO user,
        List<UserResponseDTO> observers,
        Long formId,
        List<TicketAnswerResponseDTO> responses
) {
    public static TicketResponseDTO from(Ticket ticket) {
        return new TicketResponseDTO(
                ticket.getId(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getClosedAt(),
                UserResponseDTO.from(ticket.getUser()),
                ticket.getObservers().stream()
                        .map(UserResponseDTO::from)
                        .toList(),
                ticket.getForm().getId(),
                ticket.getResponses().stream()
                        .map(response -> new TicketAnswerResponseDTO(
                                response.getField().getId(),
                                response.getValue()
                        ))
                        .toList()
        );
    }
}
