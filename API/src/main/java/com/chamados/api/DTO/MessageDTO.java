package com.chamados.api.DTO;

import java.util.Optional;

public record MessageDTO(Optional<Long> id, String text, Boolean closeTicket, Long user_id, Long ticket_id) {
}
