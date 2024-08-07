package com.chamados.api.Services;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    FileStorageService fileStorageService;

    public Ticket openTicket(TicketDTO ticketDTO, List<MultipartFile> files) {
        Ticket ticket = new Ticket();

        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(ticketDTO.ticketCategory_id());

        if (optionalTicketCategory.isEmpty()) {
            return null;
        }

        ticket.setTicketCategory(optionalTicketCategory.get());
        ticket.setName(ticketDTO.name());
        ticket.setDescription(ticketDTO.description());
        ticket.setStatus("Novo");
        ticket.setUrgency(ticketDTO.urgency());
        ticket.setReceiveEmail(ticketDTO.receiveEmail());
        ticket.setCreated_at(new Date());
        ticket.setUpdated_at(new Date());

        if (ticketDTO.observation() != null) {
            ticket.setObservation(ticketDTO.observation());
        }

        List<String> filePaths = new ArrayList<>();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String filePath = fileStorageService.store(file);
                filePaths.add(filePath);
            }
        }

        ticket.setFilePaths(filePaths);

        return ticketRepository.save(ticket);
    }
}
