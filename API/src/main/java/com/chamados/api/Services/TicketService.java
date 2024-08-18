package com.chamados.api.Services;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.util.*;

@Service
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    FileStorageService fileStorageService;

    public Ticket openTicket(TicketDTO ticketDTO, List<MultipartFile> files, User user) {
        Ticket ticket = new Ticket();

        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(ticketDTO.ticketCategory_id());

        if (optionalTicketCategory.isEmpty()) {
            return null;
        }

        if (ticketDTO.name().isEmpty()) {
            return null;
        }

        if (ticketDTO.description().isEmpty()) {
            return null;
        }

        ticket.setUser(user);
        ticket.setTicketCategory(optionalTicketCategory.get());
        ticket.setName(ticketDTO.name());
        ticket.setDescription(ticketDTO.description());
        ticket.setStatus("Novo");
        ticket.setUrgency(ticketDTO.urgency());
        ticket.setReceiveEmail(ticketDTO.receiveEmail());
        ticket.setCreatedAt(new Date());
        ticket.setUpdatedAt(new Date());

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

    public Page<Ticket> getTicketsByUserId(Long userId, String status, Pageable pageable) {
        return ticketRepository.findByUserIdAndStatus(userId, status, pageable);
    }
}
