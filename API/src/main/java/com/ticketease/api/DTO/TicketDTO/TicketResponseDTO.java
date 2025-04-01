package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.Ticket;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public record TicketResponseDTO(
        Long id,
        String status,
        Date createdAt,
        Date updatedAt,
        Date closedAt,
        UserResponseDTO user,
        List<UserResponseDTO> observers,
        Map<Long, String> form,
        List<TicketAnswerResponseDTO> responses
) {
    public static TicketResponseDTO from(Ticket ticket) {
        Map<Long, String> form = new HashMap<>();
        form.put(ticket.getForm().getId(), ticket.getForm().getTitle());

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
                form,
                ticket.getResponses().stream()
                        .map(response -> new TicketAnswerResponseDTO(
                                response.getField().getId(),
                                response.getValue()
                        ))
                        .toList()
        );
    }

}
