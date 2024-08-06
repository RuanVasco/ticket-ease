package com.chamados.api.DTO;

import org.springframework.web.multipart.MultipartFile;

public record TicketDTO(Long form_id, String name, String description, String observation, String procedure, String status, String urgency, Boolean receiveEmail) {
}
