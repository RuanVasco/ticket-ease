package com.chamados.api.Repositories;

import com.chamados.api.Entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t WHERE " +
            "LOWER(t.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.observation) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
            "LOWER(t.ticketCategory.name) LIKE LOWER(CONCAT('%', :searchText, '%')) ")
    List<Ticket> findBySearch(@Param("searchText") String searchText);
}
