package com.chamados.api.DTO;

import com.chamados.api.Entities.Message;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageDTO {
    String text;
    Boolean closeTicket;
    User user;
    Ticket ticket;
    Date sent_at;

    public MessageDTO(String text, Boolean closeTicket) {
        this.text = text;
        this.closeTicket = closeTicket;
    }

    public MessageDTO(Message message) {
        this.text = message.getText();
        this.user = message.getUser();
        this.ticket = message.getTicket();
        this.sent_at = message.getSent_at();
    }
}
