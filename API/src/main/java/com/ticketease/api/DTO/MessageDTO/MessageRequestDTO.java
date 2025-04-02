package com.ticketease.api.DTO.MessageDTO;

import com.ticketease.api.Entities.Message;
import com.ticketease.api.Entities.Ticket;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageRequestDTO {
    String text;
    Boolean closeTicket;
    Ticket ticket;
    Date sentAt;

    public MessageRequestDTO(String text, Boolean closeTicket) {
        this.text = text;
        this.closeTicket = closeTicket;
    }

    public MessageRequestDTO(Message message) {
        this.text = message.getText();
        this.ticket = message.getTicket();
        this.sentAt = message.getSentAt();
    }
}
