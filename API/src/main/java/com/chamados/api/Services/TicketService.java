package com.chamados.api.Services;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    public Ticket openTicket(TicketDTO ticketDTO) {
        Ticket ticket = new Ticket();

        ticket.setName(ticketDTO.name());
        ticket.setDescription(ticketDTO.description());
        ticket.setStatus("Novo");
        ticket.setUrgency(ticketDTO.urgency());
        ticket.setReceiveEmail(ticketDTO.receiveEmail());
        ticket.setCreated_at(new Date());
        ticket.setUpdated_at(new Date());

        if (ticketDTO.observation() != null) {
            ticket.setObservation(ticketDTO.observation());
        }

        return ticketRepository.save(ticket);
    }
}
