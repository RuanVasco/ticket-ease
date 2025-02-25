package com.chamados.api.Services;

import com.chamados.api.DTO.InputDTO.TicketInputDTO;
import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.TicketCategory;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.TicketCategoryRepository;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    public Ticket openTicket(TicketInputDTO ticketInputDTO, List<MultipartFile> files, User user) {
        Ticket ticket = new Ticket();

        Optional<TicketCategory> optionalTicketCategory = ticketCategoryRepository.findById(ticketInputDTO.ticketCategory_id());

        if (optionalTicketCategory.isEmpty()) {
            return null;
        }

        if (ticketInputDTO.name().isEmpty()) {
            return null;
        }

        if (ticketInputDTO.description().isEmpty()) {
            return null;
        }

        ticket.setUser(user);
        ticket.setTicketCategory(optionalTicketCategory.get());
        ticket.setName(ticketInputDTO.name());
        ticket.setDescription(ticketInputDTO.description());
        ticket.setStatus("Novo");
        ticket.setUrgency(ticketInputDTO.urgency());
        ticket.setReceiveEmail(ticketInputDTO.receiveEmail());
        ticket.setCreatedAt(new Date());
        ticket.setUpdatedAt(new Date());

        if (ticketInputDTO.observation() != null) {
            ticket.setObservation(ticketInputDTO.observation());
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

    @Transactional
    public Page<Ticket> getUserManageableTickets(int page, int size, String sortBy, String sortDir, String status) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<Ticket> relatedTickets = ticketRepository.findByStatus(status, pageable);
        List<Ticket> filteredTickets = relatedTickets
                .stream()
                .filter(ticket -> ticket.canManage(user))
                .toList();

        return new PageImpl<>(filteredTickets, pageable, filteredTickets.size());
    }

    @Transactional
    public Page<Ticket> searchUserTickets(String query, String status, Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ticketRepository.findByUserAndStatus(user, status, query, pageable);
    }

    @Transactional
    public Page<Ticket> searchUserManageableTickets(String query, String status, Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<Ticket> relatedTickets = ticketRepository.findByStatusAndQuery(status, query, pageable);
        List<Ticket> filteredTickets = relatedTickets
                .stream()
                .filter(ticket -> ticket.canManage(user))
                .toList();

        return new PageImpl<>(filteredTickets, pageable, filteredTickets.size());
    }
}
