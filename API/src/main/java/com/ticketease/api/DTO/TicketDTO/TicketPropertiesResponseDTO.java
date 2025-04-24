package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Enums.UrgencyEnum;
import java.util.Date;
import java.util.List;

public record TicketPropertiesResponseDTO(
    List<UserResponseDTO> observers,
    UrgencyEnum urgency,
    Boolean receiveEmail,
    StatusEnum status,
    Date createdAt,
    Date updatedAt,
    Date closedAt,
    UserResponseDTO user) {}
