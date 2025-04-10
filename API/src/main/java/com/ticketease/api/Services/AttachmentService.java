package com.ticketease.api.Services;

import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.Attachment;
import com.ticketease.api.Entities.TicketResponse;
import com.ticketease.api.Repositories.AttachmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachmentRepository attachmentRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @PostConstruct
    public void init() {
        File dir = new File(uploadPath).getAbsoluteFile();
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IllegalStateException("Não foi possível criar a pasta de uploads: " + dir.getAbsolutePath());
        }
        uploadPath = dir.getAbsolutePath();
    }

    public void saveAttachments(Ticket ticket, Map<Long, MultipartFile> filesByResponseId) {
        File ticketDir = new File(uploadPath, String.valueOf(ticket.getId()));
        if (!ticketDir.exists() && !ticketDir.mkdirs()) {
            throw new IllegalStateException("Não foi possível criar o diretório do ticket: " + ticketDir.getAbsolutePath());
        }

        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            String extension = contentType != null && contentType.contains("/")
                    ? contentType.substring(contentType.lastIndexOf('/') + 1)
                    : "bin";

            String fileName = UUID.randomUUID() + "." + extension;
            String filePath = ticketDir + File.separator + fileName;

            try {
                File dest = new File(filePath);
                file.transferTo(dest);

                TicketResponse ticketResponse = new TicketResponse();

                Attachment attachment = new Attachment();
                attachment.setTicketResponse(ticket);
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
