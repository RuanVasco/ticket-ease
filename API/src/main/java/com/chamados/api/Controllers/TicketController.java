package com.chamados.api.Controllers;

import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.TicketRepository;
import com.chamados.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @Autowired
    TicketRepository ticketRepository;

    @PostMapping("/")
    public ResponseEntity<?> openTicket(
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart TicketDTO ticketDTO
    ) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(userDetails instanceof User user)) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketService.openTicket(ticketDTO, files, user);
        return ResponseEntity.ok(ticket.getId());
    }


//    @GetMapping("/")
//    public ResponseEntity<?> getAll(
//            @RequestParam(value = "sort", defaultValue = "createdAt") String sortBy,
//            @RequestParam(value = "direction", defaultValue = "DESC") String direction) {
//
//        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
//        List<Ticket> tickets = ticketRepository.findAll(sort);
//        return ResponseEntity.ok(tickets);
//    }

//    @GetMapping("/pageable")
//    public ResponseEntity<Page<Ticket>> getAllPageable(
//            @RequestParam(value = "page", defaultValue = "0") Integer page,
//            @RequestParam(value = "size", defaultValue = "10") Integer size,
//            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
//            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir,
//            @RequestParam(value = "status", defaultValue = "Aberto") String status
//    ) {
//
//        Sort.Direction direction = Sort.Direction.fromString(sortDir.toUpperCase());
//        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
//
//        Page<Ticket> tickets;
//        if ("ALL".equalsIgnoreCase(status)) {
//            tickets = ticketRepository.findAll(pageable);
//        } else {
//            tickets = ticketRepository.findByStatus(status, pageable);
//        }
//
//        return ResponseEntity.ok(tickets);
//    }

    @GetMapping("/user")
    public ResponseEntity<Page<Ticket>> getAllUser(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir,
            @RequestParam(value = "status", defaultValue = "ALL") String status
    ) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = ((User) userDetails).getId();

        Sort.Direction direction = Sort.Direction.fromString(sortDir.toUpperCase());

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(direction, sortBy)
        );

        Page<Ticket> tickets = ticketService.getTicketsByUserId(userId, status, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{ticketID}")
    public ResponseEntity<?> getTicket(@PathVariable Long ticketID) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Ticket> optionalTicket = ticketRepository.findById(ticketID);

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTickets(@RequestParam String query) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Ticket> tickets = ticketRepository.findBySearch(query, user);

        return ResponseEntity.ok(tickets);
    }

}
