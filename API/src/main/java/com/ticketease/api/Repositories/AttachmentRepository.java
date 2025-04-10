package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<TicketAttachment, Long> {}
