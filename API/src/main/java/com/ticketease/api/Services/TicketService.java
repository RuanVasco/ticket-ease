package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketAnswerResponseDTO;
import com.ticketease.api.DTO.TicketDTO.TicketPropertiesDTO;
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

        TicketAnswerResponseDTO answerDTO = ticketRequestDTO.responses().get(0);
        TicketPropertiesDTO properties = answerDTO.ticketPropertiesDTO();

        ticket.setUrgency(properties.urgency());
        ticket.setReceiveEmail(Boolean.TRUE.equals(properties.receiveEmail()));

        List<TicketResponse> responses = ticketRequestDTO.responses().stream()
                .flatMap(response -> response.fieldAnswerDTO().stream())
                .map(fieldAnswer -> {
                    FormField field = form.getFields().stream()
                            .filter(f -> f.equals(fieldAnswer.field()))
                            .findFirst()
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST, "Campo não encontrado no formulário"));

                    TicketResponse ticketResponse = new TicketResponse();
                    ticketResponse.setField(field);
                    ticketResponse.setValue(fieldAnswer.value());
                    ticketResponse.setTicket(ticket);
                    return ticketResponse;
                })
                .toList();

        ticket.setResponses(responses);

        return ticketRepository.save(ticket);
    }

}
