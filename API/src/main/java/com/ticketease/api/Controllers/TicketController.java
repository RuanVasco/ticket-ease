package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketResponseDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.FieldTypeEnum;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Services.AttachmentService;
import com.ticketease.api.Services.DepartmentService;
import com.ticketease.api.Services.FormService;
import com.ticketease.api.Services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("ticket")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final DepartmentService departmentService;
    private final FormRepository formRepository;
    private final AttachmentService attachmentService;

    @GetMapping("/my-tickets")
    public ResponseEntity<Page<TicketResponseDTO>> getUserTickets(
            @RequestParam(value = "status", required = false) StatusEnum status,
            Pageable pageable
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<Ticket> ticketsPage;
        if (status != null) {
            ticketsPage = ticketService.findByOwnerOrObserverAndStatus(user, status, pageable);
        } else {
            ticketsPage = ticketService.findByOwnerOrObserver(user, pageable);
        }

        Page<TicketResponseDTO> ticketsDTOPage = ticketsPage.map(TicketResponseDTO::from);

        return ResponseEntity.ok(ticketsDTOPage);
    }

    @GetMapping("/by-department/{departmentId}")
    public ResponseEntity<?> getDepartmentTickets(
            @PathVariable Long departmentId,
            @RequestParam(value = "status", required = false) StatusEnum status,
            Pageable pageable
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Department department = departmentService.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Setor não encontrado"
                ));

        Page<Ticket> ticketsPage;
        if (status != null) {
            ticketsPage = ticketService.findByDepartmentAndStatus(department, user, status, pageable);
        } else {
            ticketsPage = ticketService.findByDepartment(department, user, pageable);
        }

        Page<TicketResponseDTO> ticketsDTOPage = ticketsPage.map(TicketResponseDTO::from);

        return ResponseEntity.ok(ticketsDTOPage);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicket(@PathVariable Long ticketId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ticket ticket = ticketService.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

        if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
            return new ResponseEntity<>("Acesso negado. Você não tem permissão para acessar esse ticket.", HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(TicketResponseDTO.from(ticket));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            @RequestPart("data") TicketRequestDTO ticketRequestDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Form form = formRepository.findById(ticketRequestDTO.formId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

        List<FormField> fileFields = form.getFields().stream()
                .filter(f -> f.getType() == FieldTypeEnum.FILE || f.getType() == FieldTypeEnum.FILE_MULTIPLE)
                .toList();

        boolean requiresAttachment = fileFields.stream().anyMatch(FormField::isRequired);
        if (requiresAttachment && (files == null || files.isEmpty())) {
            return ResponseEntity.badRequest().body("Anexos obrigatórios não foram enviados.");
        }

        List<String> allowedMimeTypes = fileFields.stream()
                .flatMap(field -> field.getOptions().stream())
                .map(Option::getValue)
                .distinct()
                .toList();

        if (files != null) {
            for (MultipartFile file : files) {
                String contentType = file.getContentType();
                if (!isValidFileType(contentType, allowedMimeTypes)) {
                    return ResponseEntity.badRequest().body("Tipo de arquivo não permitido: " + contentType);
                }
            }
        }

        Ticket savedTicket = ticketService.create(ticketRequestDTO, user);
        if (files != null && !files.isEmpty()) {
            attachmentService.saveAttachments(savedTicket, files);
        }

        return ResponseEntity.ok(savedTicket.getId());
    }

    private boolean isValidFileType(String contentType, List<String> allowedMimeTypes) {
        for (String allowed : allowedMimeTypes) {
            if (allowed.endsWith("/*")) {
                String category = allowed.split("/")[0];
                if (contentType != null && contentType.startsWith(category + "/")) {
                    return true;
                }
            } else if (allowed.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
}
