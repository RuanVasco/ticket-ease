package com.chamados.api.Repositories;

import com.chamados.api.Entities.Department;
import com.chamados.api.Tickets.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Ticket save(Ticket ticket);
}
