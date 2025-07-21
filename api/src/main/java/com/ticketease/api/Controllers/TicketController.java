package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.DTO.TicketDTO.TicketResponseDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Services.DepartmentService;
import com.ticketease.api.Services.TicketService;
import java.net.URI;
import java.util.Objects;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("ticket")
@RequiredArgsConstructor
public class TicketController {

	private final TicketService ticketService;
	private final DepartmentService departmentService;

	@GetMapping
	public ResponseEntity<Page<TicketResponseDTO>> getByStatus(@RequestParam(required = false) StatusEnum status,
			Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Page<Ticket> tickets = Page.empty();
		if (status == StatusEnum.PENDING_APPROVAL) {
			tickets = ticketService.findPendingTicketsForApprover(user, pageable);
		}

		Page<TicketResponseDTO> dtoPage = tickets.map(TicketResponseDTO::from);
		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/my-tickets")
	public ResponseEntity<Page<TicketResponseDTO>> getUserTickets(
			@RequestParam(value = "status", required = false) StatusEnum status, Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Page<Ticket> ticketsPage;
		if (status != null) {
			ticketsPage = ticketService.findByOwnerOrObserverAndStatus(user, status, pageable);
		} else {
			ticketsPage = ticketService.findByOwnerOrObserver(user, pageable);
		}

		Page<TicketResponseDTO> ticketsDTOPage = ticketsPage.map(TicketResponseDTO::from);

		return ResponseEntity.ok(ticketsDTOPage);
	}

	@GetMapping("/by-department/{departmentId}")
	public ResponseEntity<?> getDepartmentTickets(@PathVariable Long departmentId,
			@RequestParam(value = "status", required = false) StatusEnum status, Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Department department = departmentService.findById(departmentId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Setor não encontrado"));

		if (!user.hasPermission("MANAGE_TICKET", department)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para este setor.");
		}

		Page<Ticket> ticketsPage;
		if (status != null) {
			ticketsPage = ticketService.findByDepartmentAndStatus(department, status, pageable);
		} else {
			ticketsPage = ticketService.findByDepartment(department, pageable);
		}

		Page<TicketResponseDTO> ticketsDTOPage = ticketsPage.map(TicketResponseDTO::from);

		return ResponseEntity.ok(ticketsDTOPage);
	}

	@GetMapping("/managed")
	public ResponseEntity<Page<TicketResponseDTO>> getManagedTickets(
			@RequestParam(value = "status", required = false) StatusEnum status, Pageable pageable) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		boolean hasGlobalPermission = user.hasPermission("MANAGE_TICKET", null);

		Set<Department> departments = user.getRoleBindings().stream().map(UserRoleDepartment::getDepartment)
				.filter(Objects::nonNull).filter(dep -> user.hasPermission("MANAGE_TICKET", dep))
				.collect(Collectors.toSet());

		if (!hasGlobalPermission && departments.isEmpty()) {
			return ResponseEntity.ok(Page.empty(pageable));
		}

		List<Ticket> allTickets = ticketService.getTicketsByRelatedUser(user);

		List<Ticket> filtered = allTickets.stream().filter(ticket -> {
			Department ticketDep = ticket.getDepartment();
			return (hasGlobalPermission || departments.contains(ticketDep))
					&& (status == null || ticket.getStatus() == status);
		}).toList();

		List<Ticket> sorted = ticketService.sortInMemory(filtered, pageable.getSort());

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), sorted.size());
		List<Ticket> pageContent = (start >= sorted.size()) ? List.of() : sorted.subList(start, end);

		Page<TicketResponseDTO> resultPage = new PageImpl<>(pageContent.stream().map(TicketResponseDTO::from).toList(),
				pageable, sorted.size());

		return ResponseEntity.ok(resultPage);
	}

	@GetMapping("/{ticketId}")
	public ResponseEntity<?> getTicket(@PathVariable Long ticketId) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Ticket ticket = ticketService.findById(ticketId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

		if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
			return new ResponseEntity<>("Acesso negado. Você não tem permissão para acessar esse ticket.",
					HttpStatus.FORBIDDEN);
		}

		return ResponseEntity.ok(TicketResponseDTO.from(ticket));
	}

	@PostMapping
	public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Ticket savedTicket = ticketService.create(ticketRequestDTO, user);

		URI location = URI.create("/ticket/" + savedTicket.getId());
		return ResponseEntity.created(location).body(savedTicket.getId());
	}

	@PostMapping("/{ticketId}/approval")
	public ResponseEntity<?> approveTicket(@PathVariable Long ticketId, @RequestParam boolean approved) {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Ticket ticket = ticketService.findById(ticketId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

		boolean isApprover = ticket.getForm().getApprovers().contains(user);
		boolean hasPermission = user.hasPermission("APPROVE_TICKET", ticket.getDepartment());

		if (!isApprover || !hasPermission) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Você não tem permissão para aprovar ou rejeitar este ticket.");
		}

		if (!ticket.getStatus().equals(StatusEnum.PENDING_APPROVAL)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ticket não está pendente de aprovação.");
		}

		ticketService.approveOrReject(ticket, approved, user);

		String message = approved ? "Ticket aprovado com sucesso." : "Ticket rejeitado com sucesso.";

		return ResponseEntity.ok(message);
	}
}
