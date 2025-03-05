package com.chamados.api.Controllers;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.MessageRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.MessageService;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @MessageMapping("/message/{ticketId}")
    @SendTo("/topic/messages/{ticketId}")
    public ResponseEntity<?> sendMessage(@DestinationVariable Long ticketId, @Payload MessageDTO messageDTO, Principal principal) throws IOException {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        Ticket ticket = ticketService.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

        if (!ticket.canManage(user) && !ticket.getUser().equals(user)) {
            return new ResponseEntity<>("Acesso negado. Você não tem permissão.", HttpStatus.FORBIDDEN);
        }

        String ticketStatus = ticket.getStatus();
        if (ticketStatus.equals("Fechado")) {
            return ResponseEntity.badRequest().build();
        }

        System.out.println(messageDTO.getText());
        Message message = messageService.addMessage(ticket, user, messageDTO);

        return ResponseEntity.ok(message);
    }

    @MessageMapping("/tickets")
    public void getUserTickets(@Payload Map<String, String> payload, Principal principal) {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        String userId = payload.get("userId");

        System.out.println("Usuário autenticado: " + user.getName());
        List<Long> tickets = ticketService.getTicketIdsByUserId(user.getId(), "ALL");
        System.out.println("Tickets encontrados: " + tickets);

        simpMessagingTemplate.convertAndSend("/queue/tickets-" + userId, tickets);
    }

    @GetMapping("/ticket/{ticketID}")
    public ResponseEntity<?> getMessages(@PathVariable Long ticketID) {
        List<Message> listMessage = messageService.getByTicketId(ticketID);
        if (listMessage.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        } else {
            return ResponseEntity.ok(listMessage);
        }
    }
}
