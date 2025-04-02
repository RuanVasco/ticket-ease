package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketPropertiesDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final FormRepository formRepository;
    private final UserRepository userRepository;

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

        TicketPropertiesDTO properties = ticketRequestDTO.properties();

        ticket.setUrgency(properties.urgency());
        ticket.setReceiveEmail(Boolean.TRUE.equals(properties.receiveEmail()));

        Set<User> observers = new HashSet<>();
        for (Long userId : properties.observersId()) {
            if (userId == null) {
                continue;
            }
            Optional<User> optionalUser = userRepository.findById(userId);
            optionalUser.ifPresent(observers::add);
        }
        ticket.setObservers(observers);

        List<TicketResponse> responses = ticketRequestDTO.responses().stream()
                .map(fieldAnswer -> {
                    FormField field = form.getFields().stream()
                            .filter(f -> f.getId().equals(fieldAnswer.fieldId()))
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

    public Set<User> getRelatedUsers(Ticket ticket) {
        Set<User> relatedUsers = new HashSet<>();

        Department department = ticket.getDepartment();

        List<User> users = userRepository.findAllUsersWithRoles();
        for (User user : users) {
            if (user.hasPermission("MANAGE_TICKET", department)) {
                relatedUsers.add(user);
            }
        }

        relatedUsers.addAll(ticket.getObservers());
        relatedUsers.add(ticket.getUser());

        return relatedUsers;
    }

}
