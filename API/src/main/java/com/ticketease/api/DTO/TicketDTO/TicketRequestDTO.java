package com.ticketease.api.DTO.TicketDTO;

import java.util.List;

public record TicketRequestDTO (Long formId, List<TicketAnswerResponseDTO> responses) {}

