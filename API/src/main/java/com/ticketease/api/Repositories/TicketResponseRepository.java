package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface TicketResponseRepository extends JpaRepository<TicketResponse, Long> {
    Set<TicketResponse> findByTicket(Ticket ticket);
}
