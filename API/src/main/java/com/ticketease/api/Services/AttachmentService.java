package com.ticketease.api.Services;

import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.TicketAttachment;
import com.ticketease.api.Repositories.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachmentRepository attachmentRepository;

    public void saveAttachments(Ticket ticket, List<MultipartFile> files) {
        for (MultipartFile file : files) {
            String filePath = "/uploads/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            try {
                File dest = new File(filePath);
                file.transferTo(dest);

                TicketAttachment attachment = new TicketAttachment();
                attachment.setTicket(ticket);
                attachment.setFileName(file.getOriginalFilename());
                attachment.setFileType(file.getContentType());
                attachment.setFilePath(filePath);
                attachment.setUploadedAt(new Date());
                attachmentRepository.save(attachment);

            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar arquivo: " + file.getOriginalFilename(), e);
            }
        }
    }
}
