package com.chamados.api.Services;

<<<<<<< HEAD
import com.chamados.api.Components.WebSocketTicketHandler;
=======
import com.chamados.api.Components.WebSocketMessageHandler;
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3
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

<<<<<<< HEAD
    private WebSocketTicketHandler webSocketHandler;
=======
    private final WebSocketMessageHandler messagingHandler;

    public MessageService(WebSocketMessageHandler messagingHandler) {
        this.messagingHandler = messagingHandler;
    }
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3

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
        message.setSent_at(new Date());

        Message savedMessage = messageRepository.save(message);
<<<<<<< HEAD

        try {
            WebSocketTicketHandler.sendMessageToUser(ticket.getId(), new MessageDTO(savedMessage));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
=======
        messagingHandler.sendMessageToClients(savedMessage.getText());
>>>>>>> b5de06d61482e6455b86bd94f3b1d169ae095df3

        return message;
    }
}
