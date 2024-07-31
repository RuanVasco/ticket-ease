package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @PostMapping("/")
    public ResponseEntity<?> openTicket(@RequestBody TicketDTO ticketDTO) {
        Ticket ticket = ticketService.openTicket(ticketDTO);

        return ResponseEntity.ok(ticket.getId());
    }
}
