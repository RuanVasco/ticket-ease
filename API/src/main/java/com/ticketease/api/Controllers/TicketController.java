package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.InputDTO.TicketInputDTO;
import com.ticketease.api.DTO.TicketDTO;
import com.ticketease.api.DTO.AssemblerDTO.TicketDTOAssembler;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Repositories.DepartmentRepository;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.hateoas.PagedModel;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tickets")
public class TicketController {

    private final TicketService ticketService;
    private final PagedResourcesAssembler<Ticket> pagedResourcesAssembler;
    private final TicketDTOAssembler ticketDTOAssembler;
    private final DepartmentRepository departmentRepository;

    @Autowired
    TicketRepository ticketRepository;

    public TicketController(TicketService ticketService,
                            PagedResourcesAssembler<Ticket> pagedResourcesAssembler,
                            TicketDTOAssembler ticketDTOAssembler,
                            DepartmentRepository departmentRepository) {
        this.ticketService = ticketService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.ticketDTOAssembler = ticketDTOAssembler;
        this.departmentRepository = departmentRepository;
    }

    @PostMapping("/")
    public ResponseEntity<?> openTicket(
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart TicketInputDTO ticketInputDTO
    ) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(userDetails instanceof User user)) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketService.openTicket(ticketInputDTO, files, user);
        return ResponseEntity.ok(ticket.getId());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<PagedModel<TicketDTO>> getAllPageable(
            @PathVariable Long departmentId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir,
            @RequestParam(value = "status", defaultValue = "Novo") String status
    ) {
        Optional<Department> optionalDepartment = departmentRepository.findById(departmentId);
        if (optionalDepartment.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Page<Ticket> tickets = ticketService.getUserManageableTickets(page, size, sortBy, sortDir, status, optionalDepartment.get());
        PagedModel<TicketDTO> pagedModel = pagedResourcesAssembler.toModel(tickets, ticketDTOAssembler);

        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/user")
    public ResponseEntity<PagedModel<TicketDTO>> getAllUser(
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
        PagedModel<TicketDTO> pagedModel = pagedResourcesAssembler.toModel(tickets, ticketDTOAssembler);

        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/{ticketID}")
    public ResponseEntity<?> getTicketById(@PathVariable Long ticketID) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Ticket> optionalTicket = ticketRepository.findById(ticketID);

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();

        if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
            return new ResponseEntity<>("Acesso negado. Você não tem permissão.", HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/search/{mode}")
    public ResponseEntity<PagedModel<TicketDTO>> searchTickets(
            @PathVariable String mode,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir,
            @RequestParam(value = "status", defaultValue = "ALL") String status
    ) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Ticket> tickets;

        if ("user".equalsIgnoreCase(mode)) {
            tickets = ticketService.searchUserTickets(query, status, pageable);
        } else if ("manager".equalsIgnoreCase(mode)) {
            tickets = ticketService.searchUserManageableTickets(query, status, pageable);
        } else {
            return ResponseEntity.badRequest().build();
        }

        PagedModel<TicketDTO> pagedModel = pagedResourcesAssembler.toModel(tickets, ticketDTOAssembler);
        return ResponseEntity.ok(pagedModel);
    }


}
