package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.Attachment;

import java.util.List;

public record FormFieldAttachmentAnswerResponseDTO(
        Long fieldId, String label, List<Attachment> attachments
) {
}
