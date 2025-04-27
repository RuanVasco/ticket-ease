package com.ticketease.api.DTO.MessageDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import java.util.Date;

public record MessageResponseDTO(Long id, String text, UserResponseDTO user, Date sentAt) {
}
