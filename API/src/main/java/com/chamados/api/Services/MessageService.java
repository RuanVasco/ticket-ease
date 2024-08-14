package com.chamados.api.Services;

import com.chamados.api.DTO.MessageDTO;
import com.chamados.api.Entities.Message;
import com.chamados.api.Repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepository;

    public List<Message> getByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
    }
}
