package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTicketId(Long ticketID);
    Page<Message> findByTicketId(Long ticketID, Pageable pageable);
}
