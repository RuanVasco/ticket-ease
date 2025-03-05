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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public MessageController(TicketService ticketService) {
        this.ticketService = ticketService;
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
    @SendTo("/topic/tickets")
    public List<Long> getUserTickets(Principal principal) {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        System.out.println(user.getName());
        return ticketService.getTicketIdsByUserId(user.getId(), "ALL");
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
