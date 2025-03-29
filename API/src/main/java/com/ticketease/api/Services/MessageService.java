package com.ticketease.api.Services;

import com.ticketease.api.DTO.MessageDTO;
import com.ticketease.api.Entities.Message;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepository;

    private final TicketService ticketService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public MessageService(TicketService ticketService, SimpMessagingTemplate simpMessagingTemplate) {
        this.ticketService = ticketService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public List<Message> getByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
    }

    public void sendTicketsId(User user) {
        List<Ticket> tickets = ticketService.getTicketsByRelatedUser(user);
        List<Long> ticketsId = new ArrayList<>();

        for (Ticket ticket : tickets) {
            if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
                continue;
            }

            ticketsId.add(ticket.getId());
        }

        simpMessagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/queue/tickets",
                ticketsId
        );

    }

    public Message addMessage(Ticket ticket, User user, MessageDTO messageDTO) throws IOException {
        String ticketStatus = ticket.getStatus();

        if (ticketStatus.equals("Novo") && (user != ticket.getUser() && ticket.canManage(user))) {
            ticket.setStatus("Em Andamento");
        }

        if (Boolean.TRUE.equals(messageDTO.getCloseTicket()) && ticket.canManage(user)) {
            ticket.setStatus("Fechado");
        }

        Message message = new Message();
        message.setText(messageDTO.getText());
        message.setUser(user);
        message.setTicket(ticket);
        message.setSentAt(new Date());

        Message savedMessage = messageRepository.save(message);

        return message;
    }

    public Page<Message> getByTicketId(Long ticketID, Pageable pageable) {
        return messageRepository.findByTicketId(ticketID, pageable);
    }
}
