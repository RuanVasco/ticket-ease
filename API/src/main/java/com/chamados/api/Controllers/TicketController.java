package com.chamados.api.Controllers;

import com.chamados.api.Components.UserDetailsImpl;
import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @Autowired
    TicketRepository ticketRepository;

    @PostMapping("/")
    public ResponseEntity<?> openTicket(
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart TicketDTO ticketDTO
    ) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(userDetails instanceof UserDetailsImpl)) {
            return ResponseEntity.notFound().build();
        }

        User user = ((UserDetailsImpl) userDetails).getUser();

        Ticket ticket = ticketService.openTicket(ticketDTO, files, user);
        return ResponseEntity.ok(ticket.getId());
    }


    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Ticket>> getAllPageable(Pageable pageable) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = ((UserDetailsImpl) userDetails).getUser().getId();

        Page<Ticket> tickets = ticketService.getTicketsByUserId(userId, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{ticketID}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long ticketID) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(ticketID);

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTickets(@RequestParam String query) {
        List<Ticket> tickets = ticketRepository.findBySearch(query);
        return ResponseEntity.ok(tickets);
    }

}
