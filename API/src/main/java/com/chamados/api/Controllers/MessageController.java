package com.chamados.api.Controllers;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.Entities.*;
import com.chamados.api.Repositories.MessageRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    MessageRepository messageRepository;

    @GetMapping("/messages/{ticketID}")
    public ResponseEntity<?> getMessages(@PathVariable Long ticketID) {
        List<Message> listMessage = messageRepository.findByTicketId(ticketID);
        if (listMessage.isEmpty()) {
            return ResponseEntity.badRequest().body("No messages found for this ticket ID");
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
