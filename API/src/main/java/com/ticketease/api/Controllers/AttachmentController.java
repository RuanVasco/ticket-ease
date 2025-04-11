package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO.FormFieldFileAnswerDTO;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ticket/{ticketId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final TicketRepository ticketRepository;
    private final AttachmentService attachmentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAttachments(
            @PathVariable Long ticketId,
            MultipartHttpServletRequest request
    ) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

        Map<String, String[]> params = request.getParameterMap();

        params.forEach((key, value) -> {
            if (key.matches("fileAnswers\\[\\d+\\]\\.fieldId")) {
                int index = Integer.parseInt(key.replaceAll("\\D", ""));
                Long fieldId = Long.valueOf(value[0]);

                List<MultipartFile> files = request.getFiles("fileAnswers[" + index + "].files");

                if (!files.isEmpty()) {
                    FormFieldFileAnswerDTO dto = new FormFieldFileAnswerDTO();
                    dto.setFieldId(fieldId);
                    dto.setFiles(files);

                    attachmentService.saveAttachments(dto, ticket);
                }
            }
        });

        return ResponseEntity.ok().build();
    }
}
