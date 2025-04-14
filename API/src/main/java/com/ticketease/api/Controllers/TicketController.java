package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketResponseDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Services.AttachmentService;
import com.ticketease.api.Services.DepartmentService;
import com.ticketease.api.Services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Pageable;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("ticket")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getByStatus(
            @RequestParam(required = false) StatusEnum status
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Ticket> tickets = new ArrayList<>();
        if (status == StatusEnum.PENDING_APPROVAL) {
            tickets = ticketService.findPendingTicketsForApprover(user);
        }

        List<TicketResponseDTO> dto = tickets.stream().map(TicketResponseDTO::from).toList();

        return ResponseEntity.ok(dto);
    }

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

    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestBody TicketRequestDTO ticketRequestDTO
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ticket savedTicket = ticketService.create(ticketRequestDTO, user);

        URI location = URI.create("/ticket/" + savedTicket.getId());
        return ResponseEntity.created(location).body(savedTicket.getId());
    }
}
