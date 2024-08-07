package com.chamados.api.Repositories;

import com.chamados.api.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTicketId(Long ticketID);
}
