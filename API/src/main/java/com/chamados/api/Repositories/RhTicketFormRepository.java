package com.chamados.api.Repositories;

import com.chamados.api.Tickets.RhTicketForm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RhTicketFormRepository extends JpaRepository<RhTicketForm, Long> {
}
