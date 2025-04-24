package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.TicketResponse;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketResponseRepository extends JpaRepository<TicketResponse, Long> {
  Set<TicketResponse> findByTicket(Ticket ticket);
}
