package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketResponseRepository extends JpaRepository<TicketResponse, Long> {
}
