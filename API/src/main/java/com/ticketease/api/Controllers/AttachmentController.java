package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.FormDTO.FormFieldFileAnswerDTO;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Services.AttachmentService;
import com.ticketease.api.Services.TicketService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("ticket/{ticketId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

  private final TicketService ticketService;
  private final AttachmentService attachmentService;

  @GetMapping("{attachmentName:.+}")
  public ResponseEntity<?> getAttachment(
      @PathVariable Long ticketId, @PathVariable String attachmentName) {
    Ticket ticket =
        ticketService
            .findById(ticketId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

    Resource attachment = attachmentService.getAttachmentsByTicket(ticket, attachmentName);

    String contentType = "application/octet-stream";
    try {
      contentType = Files.probeContentType(Paths.get(attachment.getFile().getAbsolutePath()));
    } catch (IOException ignored) {
    }

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "inline; filename=\"" + attachment.getFilename() + "\"")
        .body(attachment);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> uploadAttachments(
      @PathVariable Long ticketId, MultipartHttpServletRequest request) {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    Ticket ticket =
        ticketService
            .findById(ticketId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

    if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
      return new ResponseEntity<>(
          "Acesso negado. Você não tem permissão para acessar esse ticket.", HttpStatus.FORBIDDEN);
    }

    Map<String, String[]> params = request.getParameterMap();

    params.forEach(
        (key, value) -> {
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
