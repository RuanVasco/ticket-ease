package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.FormDTO.FormFieldAnswerRequestDTO;
import java.util.List;

public record TicketRequestDTO(
    Long formId, List<FormFieldAnswerRequestDTO> responses, TicketPropertiesDTO properties) {}
