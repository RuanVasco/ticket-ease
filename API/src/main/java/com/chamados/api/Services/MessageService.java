package com.chamados.api.Services;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.Message;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepository;

    public List<Message> getByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
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
