package com.chamados.api.Services;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Form;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Repositories.FormRepository;
import com.chamados.api.Repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    FormRepository formRepository;

    public Ticket openTicket(TicketDTO ticketDTO) {
        Ticket ticket = new Ticket();

        Optional<Form> optionalForm = formRepository.findById(ticketDTO.form_id());

        if (optionalForm.isEmpty()) {
            return null;
        }

        ticket.setForm(optionalForm.get());
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
