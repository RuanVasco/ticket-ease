package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.FormField;

public record FormFieldAnswerResponseDTO (
        FormField field,
        String value
) {}
