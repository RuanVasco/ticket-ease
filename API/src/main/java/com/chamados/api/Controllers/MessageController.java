package com.chamados.api.Controllers;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.MessageRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    @GetMapping("/{ticketID}")
    public ResponseEntity<?> getMessages(@PathVariable Long ticketID) {
        List<Message> listMessage = messageService.getByTicketId(ticketID);
        if (listMessage.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        } else {
            return ResponseEntity.ok(listMessage);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> createMessage(@RequestBody MessageDTO messageDTO) {
        Optional<User> optionalUser = userRepository.findById(messageDTO.user_id());
        Optional<Ticket> optionalTicket = ticketRepository.findById(messageDTO.ticket_id());

        if (optionalUser.isEmpty()) return ResponseEntity.badRequest().build();
        if (optionalTicket.isEmpty()) return ResponseEntity.badRequest().build();

        User user = optionalUser.get();
        Ticket ticket = optionalTicket.get();

        Message message = new Message();
        message.setText(messageDTO.text());
        message.setUser(user);
        message.setTicket(ticket);
        message.setSent_at(new Date());

        messageRepository.save(message);

        return ResponseEntity.ok().build();
    }
}
