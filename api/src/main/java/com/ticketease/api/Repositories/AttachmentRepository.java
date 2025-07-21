package com.ticketease.api.Repositories;

import com.ticketease.api.Entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
}
