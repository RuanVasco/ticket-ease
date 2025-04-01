package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.FormField;

public record FormFieldAnswerDTO(
        FormField field,
        String value
) {
}
