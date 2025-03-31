package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final FormRepository formRepository;

    public Optional<Ticket> findById(Long ticketId) {
        return ticketRepository.findById(ticketId);
    }

    public List<Ticket> getTicketsByRelatedUser(User user) {
        List<Ticket> relatedTickets = ticketRepository.findAll();

        return relatedTickets
                .stream()
                .filter(ticket -> ticket.canManage(user) || ticket.getUser().equals(user))
                .toList();
    }

    public Ticket create(TicketRequestDTO ticketRequestDTO, User user) {
        Form form = formRepository.findById(ticketRequestDTO.formId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setForm(form);
        ticket.setStatus("ABERTO");
        ticket.setCreatedAt(new Date());
        ticket.setUpdatedAt(new Date());
        ticket.setReceiveEmail(true);

        List<TicketResponse> responses = ticketRequestDTO.responses().stream()
                .map(dto -> {
                    FormField field = form.getFields().stream()
                            .filter(f -> f.getId().equals(dto.fieldId()))
                            .findFirst()
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campo não encontrado no formulário"));
                    TicketResponse response = new TicketResponse();
                    response.setField(field);
                    response.setValue(dto.value());
                    response.setTicket(ticket);
                    return response;
                })
                .toList();

        ticket.setResponses(responses);

        return ticketRepository.save(ticket);
    }

}
