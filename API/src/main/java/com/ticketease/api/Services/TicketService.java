package com.ticketease.api.Services;

import com.ticketease.api.DTO.InputDTO.TicketInputDTO;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.TicketCategory;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.TicketCategoryRepository;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Repositories.UserRepository;
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

    public List<Ticket> getTicketsByRelatedUser(User user) {
        List<Ticket> relatedTickets = ticketRepository.findAll();

        return relatedTickets
                .stream()
                .filter(ticket -> ticket.canManage(user) || ticket.getUser().equals(user))
                .toList();
    }

    @Transactional
    public Page<Ticket> getUserManageableTickets(Pageable pageable, String status, Department department) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<Ticket> allTickets = ticketRepository.findByStatus(status, pageable);

        List<Ticket> filtered = allTickets
                .stream()
                .filter(t -> t.canManage(user) && t.getDepartment().equals(department))
                .toList();

        return new PageImpl<>(filtered, pageable, filtered.size());
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
                .filter((ticket -> ticket.canManage(user)))
                .toList();

        return new PageImpl<>(filteredTickets, pageable, filteredTickets.size());
    }

    public Optional<Ticket> findById(Long ticketId) {
        return ticketRepository.findById(ticketId);
    }
}
