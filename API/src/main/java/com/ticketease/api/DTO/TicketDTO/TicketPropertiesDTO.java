package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.Enums.UrgencyEnum;

import java.util.List;

public record TicketPropertiesDTO(
        List<Long> observersId,
        UrgencyEnum urgency,
        Boolean receiveEmail
) {
}
