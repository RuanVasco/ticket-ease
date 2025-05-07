package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.MessageDTO.MessageRequestDTO;
import com.ticketease.api.DTO.MessageDTO.MessageResponseDTO;
import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.Message;
import com.ticketease.api.Entities.Ticket;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Services.MessageService;
import com.ticketease.api.Services.NotificationService;
import com.ticketease.api.Services.TicketService;
import java.io.IOException;
import java.security.Principal;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("messages")
public class MessageController {

	@Autowired
	MessageService messageService;

	private final TicketService ticketService;
	private final NotificationService notificationService;
	private final SimpMessagingTemplate simpMessagingTemplate;

	public MessageController(TicketService ticketService, SimpMessagingTemplate simpMessagingTemplate,
			NotificationService notificationService) {
		this.ticketService = ticketService;
		this.simpMessagingTemplate = simpMessagingTemplate;
		this.notificationService = notificationService;
	}

	@MessageMapping("/user/tickets")
	public void receiveTickets(Principal principal) {
		User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

		messageService.sendTicketsId(user);
	}

	@Transactional
	@MessageMapping("/ticket/{ticketId}")
	public void sendMessage(@DestinationVariable Long ticketId, @Payload MessageRequestDTO messageRequestDTO,
			Principal principal) throws IOException {
		User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
		Ticket ticket = ticketService.findById(ticketId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket não encontrado"));

		if (!ticket.getUser().equals(user) && !ticket.canManage(user)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado. Você não tem permissão.");
		}

		if (
			StatusEnum.CLOSED.equals(ticket.getStatus()) ||
			StatusEnum.CANCELED.equals(ticket.getStatus())
		) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este ticket está fechado.");
		}

		if (StatusEnum.PENDING_APPROVAL.equals(ticket.getStatus()) && !ticket.getForm().getApprovers().contains(user)
				&& !ticket.getUser().equals(user)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este ticket está aguardando aprovação.");
		}

		Message message = messageService.addMessage(ticket, user, messageRequestDTO);

		simpMessagingTemplate.convertAndSend("/topic/ticket/" + ticketId, message);

		Set<User> relatedUsers = ticketService.getRelatedUsers(ticket);
		String notificationContent = "Mensagem recebida no ticket " + ticketId;
		for (User targetUser : relatedUsers) {
			if (user.equals(targetUser))
				continue;
			notificationService.createNotification(targetUser, ticket.getId(), "Message", notificationContent);
		}
	}

	@GetMapping("/ticket/{ticketID}")
	public ResponseEntity<Page<MessageResponseDTO>> getMessages(
		@PathVariable Long ticketID,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt"));
		Page<Message> messages = messageService.getByTicketId(ticketID, pageable);

		Page<MessageResponseDTO> messageDTOs = messages.map(message ->
			new MessageResponseDTO(
				message.getId(),
				message.getText(),
				UserResponseDTO.from(message.getUser()),
				message.getSentAt()
			)
		);

		return ResponseEntity.ok(messageDTOs);
	}
}
