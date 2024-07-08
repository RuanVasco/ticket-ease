package com.chamados.api.Controllers;

import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Tickets.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping("/")
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket) {
        System.out.println(ticket);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(savedTicket);
    }
}
