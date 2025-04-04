package com.ticketease.api.Services;

import com.ticketease.api.DTO.MessageDTO.MessageRequestDTO;
import com.ticketease.api.DTO.MessageDTO.MessageResponseDTO;
import com.ticketease.api.Entities.Message;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Enums.StatusEnum;
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

    public Message addMessage(Ticket ticket, User user, MessageRequestDTO messageRequestDTO) throws IOException {
        StatusEnum ticketStatus = ticket.getStatus();

        if (ticketStatus.equals(StatusEnum.NOVO) && (user != ticket.getUser() && ticket.canManage(user))) {
            ticket.setStatus(StatusEnum.EM_ANDAMENTO);
        }

        if (Boolean.TRUE.equals(messageRequestDTO.getCloseTicket()) && ticket.canManage(user)) {
            ticket.setStatus(StatusEnum.RESOLVIDO);
        }

        Message message = new Message();
        message.setText(messageRequestDTO.getText());
        message.setUser(user);
        message.setTicket(ticket);
        message.setSentAt(new Date());

        messageRepository.save(message);

        return message;
    }

    public Page<Message> getByTicketId(Long ticketID, Pageable pageable) {
        return messageRepository.findByTicketId(ticketID, pageable);
    }
}
