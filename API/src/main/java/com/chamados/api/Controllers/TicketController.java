package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
        Ticket ticket = ticketService.openTicket(ticketDTO, files);
        if (ticket != null) {
            return ResponseEntity.ok(ticket.getId());
        } else {
            return ResponseEntity.badRequest().body("Invalid form ID");
        }
    }


    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Ticket>> getAllPageable(Pageable pageable) {
        Page<Ticket> ticket = ticketRepository.findAll(pageable);
        return ResponseEntity.ok(ticket);
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
