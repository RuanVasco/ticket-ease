package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketResponseDTO;
import com.ticketease.api.Entities.Form;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("ticket")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;
    private final TicketRepository ticketRepository;

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
    public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ticket savedTicket = ticketService.create(ticketRequestDTO, user);

        return ResponseEntity.ok(savedTicket.getId());
    }
}
