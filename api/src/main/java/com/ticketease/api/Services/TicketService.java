package com.ticketease.api.Services;

import com.ticketease.api.DTO.TicketDTO.TicketPropertiesDTO;
import com.ticketease.api.DTO.TicketDTO.TicketRequestDTO;
import com.ticketease.api.Entities.*;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Repositories.FormRepository;
import com.ticketease.api.Repositories.TicketRepository;
import com.ticketease.api.Repositories.UserRepository;
import java.util.*;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketService {
	private final TicketRepository ticketRepository;
	private final FormRepository formRepository;
	private final UserRepository userRepository;
	private final NotificationService notificationService;
	private final UserLinkFormsService userLinkFormsService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	public Optional<Ticket> findById(Long ticketId) {
		return ticketRepository.findById(ticketId);
	}

	public List<Ticket> getTicketsByRelatedUser(User user) {
		List<Ticket> relatedTickets = ticketRepository.findAll();

		return relatedTickets.stream().filter(ticket -> ticket.canManage(user) || ticket.getUser().equals(user))
				.toList();
	}

	public Ticket create(TicketRequestDTO ticketRequestDTO, User user) {
		Form form = formRepository.findById(ticketRequestDTO.formId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formulário não encontrado"));

		Ticket ticket = new Ticket();
		ticket.setUser(user);
		ticket.setForm(form);
		ticket.setCreatedAt(new Date());
		ticket.setUpdatedAt(new Date());

		if (form.getApprovers().isEmpty()) {
			ticket.setStatus(StatusEnum.NEW);
		} else {
			ticket.setStatus(StatusEnum.PENDING_APPROVAL);
		}

		TicketPropertiesDTO properties = ticketRequestDTO.properties();

		ticket.setUrgency(properties.urgency());
		ticket.setReceiveEmail(Boolean.TRUE.equals(properties.receiveEmail()));

		Set<User> observers = new HashSet<>();
		for (Long userId : properties.observersId()) {
			if (userId == null) {
				continue;
			}
			Optional<User> optionalUser = userRepository.findById(userId);
			optionalUser.ifPresent(observers::add);
		}
		ticket.setObservers(observers);

		List<TicketResponse> responses = ticketRequestDTO.responses().stream().map(fieldAnswer -> {
			FormField field = form.getFields().stream().filter(f -> f.getId().equals(fieldAnswer.fieldId())).findFirst()
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
							"Campo não encontrado no formulário"));

			TicketResponse ticketResponse = new TicketResponse();
			ticketResponse.setField(field);
			ticketResponse.setValue(fieldAnswer.value());
			ticketResponse.setTicket(ticket);
			return ticketResponse;
		}).toList();

		ticket.setResponses(responses);

		Ticket savedTicket = ticketRepository.save(ticket);

		Set<User> relatedUsers = getRelatedUsers(savedTicket);
		String notificationContent = "Ticket criado " + savedTicket.getId();
		for (User targetUser : relatedUsers) {
			simpMessagingTemplate.convertAndSendToUser(targetUser.getUsername(), "/queue/tickets", List.of(savedTicket.getId()));
			if (user.equals(targetUser))
				continue;
			notificationService.createNotification(targetUser, ticket.getId(), "Ticket", notificationContent);
		}
		userLinkFormsService.registerRecentForm(user, form);

		return savedTicket;
	}

	public Page<Ticket> findPendingTicketsForApprover(User approver, Pageable pageable) {
		return ticketRepository.findPendingTicketsByApprover(approver.getId(), StatusEnum.PENDING_APPROVAL, pageable);
	}

	public Set<User> getRelatedUsers(Ticket ticket) {
		Set<User> relatedUsers = new HashSet<>();

		Department department = ticket.getDepartment();

		List<User> users = userRepository.findAllUsersWithRoles();
		for (User user : users) {
			if (user.hasPermission("MANAGE_TICKET", department)) {
				relatedUsers.add(user);
			}
		}

		relatedUsers.addAll(ticket.getObservers());
		relatedUsers.add(ticket.getUser());

		return relatedUsers;
	}

	public Page<Ticket> findByOwnerOrObserver(User user, Pageable pageable) {
		return ticketRepository.findByOwnerOrObserver(user.getId(), pageable);
	}

	public Page<Ticket> findByOwnerOrObserverAndStatus(User user, StatusEnum status, Pageable pageable) {
		return ticketRepository.findByOwnerOrObserverAndStatus(user.getId(), status, pageable);
	}

	public Page<Ticket> findByDepartmentAndStatus(Department department, StatusEnum status, Pageable pageable) {
		return ticketRepository.findByForm_DepartmentAndStatus(department, status, pageable);
	}

	public Page<Ticket> findByDepartment(Department department, Pageable pageable) {
//		Collection<Ticket> tickets = ticketRepository.findAll();
//		return filterAndPaginate(tickets, department, user, pageable);
		return ticketRepository.findByForm_Department(department, pageable);
	}

	public void approveOrReject(Ticket ticket, boolean approved, User approver) {
		if (!ticket.getStatus().equals(StatusEnum.PENDING_APPROVAL)) {
			throw new IllegalStateException("O ticket não está pendente de aprovação.");
		}

		ticket.setStatus(approved ? StatusEnum.NEW : StatusEnum.CANCELED);
		ticket.setApprovalDate(new Date());
		ticket.setApprovedBy(approver);
		ticket.setUpdatedAt(new Date());

		ticketRepository.save(ticket);
		Set<User> relatedUsers = getRelatedUsers(ticket);
		String notificationContent = "Ticket " + ticket.getId() + " " + (approved ? "aprovado" : "negado");

		for (User targetUser : relatedUsers) {
			if (approver.equals(targetUser))
				continue;
			notificationService.createNotification(targetUser, ticket.getId(), "Ticket", notificationContent);
		}
	}

	private Page<Ticket> filterAndPaginate(Collection<Ticket> tickets, Department department, User user,
			Pageable pageable) {

		List<Ticket> filteredList = tickets.stream()
				.filter(t -> t.canManage(user) && t.getDepartment().equals(department)).distinct().toList();

		int start = (int) pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filteredList.size());

		List<Ticket> pageContent = (start >= filteredList.size()) ? List.of() : filteredList.subList(start, end);

		return new PageImpl<>(pageContent, pageable, filteredList.size());
	}

	public List<Ticket> sortInMemory(List<Ticket> tickets, Sort sort) {
		if (sort.isUnsorted()) return tickets;

		Comparator<Ticket> comparator = null;

		for (Sort.Order order : sort) {
			Comparator<Ticket> fieldComparator = switch (order.getProperty()) {
				case "id" -> Comparator.comparing(Ticket::getId);
				case "status" -> Comparator.comparing(Ticket::getStatus);
				case "urgency" -> Comparator.comparing(Ticket::getUrgency);
				case "createdAt" -> Comparator.comparing(Ticket::getCreatedAt, Comparator.nullsLast(Date::compareTo));
				case "updatedAt" -> Comparator.comparing(Ticket::getUpdatedAt, Comparator.nullsLast(Date::compareTo));
				case "user.name" -> Comparator.comparing(t -> t.getUser().getName(), Comparator.nullsLast(String::compareToIgnoreCase));
				case "form.title" -> Comparator.comparing(t -> t.getForm().getTitle(), Comparator.nullsLast(String::compareToIgnoreCase));
				case "form.ticketCategory.name" -> Comparator.comparing(t -> t.getForm().getTicketCategory().getName(), Comparator.nullsLast(String::compareToIgnoreCase));
				default -> null;
			};

			if (fieldComparator != null) {
				if (order.isDescending()) {
					fieldComparator = fieldComparator.reversed();
				}
				comparator = comparator == null ? fieldComparator : comparator.thenComparing(fieldComparator);
			}
		}

		return comparator != null ? tickets.stream().sorted(comparator).toList() : tickets;
	}
}
