package com.chamados.api.Services;

import com.chamados.api.Components.WebSocketTicketHandler;
import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.Message;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepository;

    private WebSocketTicketHandler webSocketHandler;

    public List<Message> getByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
    }

    public Message addMessage(Ticket ticket, User user, MessageDTO messageDTO) {
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
        message.setSent_at(new Date());

        Message savedMessage = messageRepository.save(message);

        try {
            WebSocketTicketHandler.sendMessageToUser(ticket.getId(), new MessageDTO(savedMessage));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return message;
    }
}
