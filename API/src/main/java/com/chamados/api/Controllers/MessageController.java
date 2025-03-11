package com.chamados.api.Controllers;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.MessageRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.MessageService;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Pageable;
import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("messages")
public class MessageController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    MessageService messageService;

    @Autowired
    MessageRepository messageRepository;

    private final TicketService ticketService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public MessageController(TicketService ticketService, SimpMessagingTemplate simpMessagingTemplate) {
        this.ticketService = ticketService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/user/{userId}/tickets")
    public void receiveTickets(@DestinationVariable Long userId, Principal principal) {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

        if (!user.getId().equals(userId)) {
            System.out.println("Erro de permissão: O usuário não tem permissão para acessar os tickets de outro usuário.");
            return;
        }

        if (!Message.canView(user)) {
            System.out.println("Erro de permissão: O usuário não tem permissão para visualizar mensagens.");
            return;
        }

        List<Ticket> tickets = ticketService.getTicketsByRelatedUser(user);
        List<Long> ticketsId = new ArrayList<>();
        for (Ticket ticket : tickets) {
            if (!ticket.canManage(user) && !ticket.getUser().equals(user)) {
                System.out.println("Erro de permissão: O usuário não tem permissão para acessar o ticket " + ticket.getId());
                continue;
            }

            System.out.println("Usuário com permissão para o ticket: "+ ticket.getId());
            ticketsId.add(ticket.getId());
        }

        simpMessagingTemplate.convertAndSend("/queue/user/" + userId + "/tickets", ticketsId);
    }

    @Transactional
    @MessageMapping("/ticket/{ticketId}")
    public void sendMessage(@DestinationVariable Long ticketId, @Payload MessageDTO messageDTO, Principal principal) throws IOException {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        Ticket ticket = ticketService.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

        if ((!ticket.canManage(user) && !ticket.getUser().equals(user)) || !Message.canCreate(user)) {
            System.out.println("Acesso negado. Usuário não tem permissão.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado. Você não tem permissão.");
        }

        if ("Fechado".equals(ticket.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este ticket está fechado.");
        }

        Message message = messageService.addMessage(ticket, user, messageDTO);

        System.out.println("Enviando mensagem para o tópico /topic/ticket/" + ticketId);
        simpMessagingTemplate.convertAndSend("/topic/ticket/" + ticketId, message);
        System.out.println("Mensagem enviada para o tópico /topic/ticket/" + ticketId);
    }

    @GetMapping("/ticket/{ticketID}")
    public ResponseEntity<Page<Message>> getMessages(
            @PathVariable Long ticketID,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt"));
        Page<Message> messages = messageService.getByTicketId(ticketID, pageable);

        return ResponseEntity.ok(messages);
    }
}
