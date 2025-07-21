package com.ticketease.api.DTO.TicketDTO;

import com.ticketease.api.DTO.FormDTO.FormFieldAnswerResponseDTO;
import com.ticketease.api.DTO.FormDTO.FormWithoutFieldsDTO;
import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.Ticket;

import java.util.List;

public record TicketResponseDTO(Long id, TicketPropertiesResponseDTO properties, FormWithoutFieldsDTO form,
		List<FormFieldAnswerResponseDTO> responses) {
	public static TicketResponseDTO from(Ticket ticket) {
		FormWithoutFieldsDTO formDTO = FormWithoutFieldsDTO.from(ticket.getForm());

		List<UserResponseDTO> observers = ticket.getObservers().stream().map(UserResponseDTO::from).toList();

		TicketPropertiesResponseDTO ticketProperties = new TicketPropertiesResponseDTO(observers, ticket.getUrgency(),
				ticket.getReceiveEmail(), ticket.getStatus(), ticket.getCreatedAt(), ticket.getUpdatedAt(),
				ticket.getClosedAt(), UserResponseDTO.from(ticket.getUser()));

		List<FormFieldAnswerResponseDTO> fieldAnswers = ticket.getResponses().stream()
				.map(response -> new FormFieldAnswerResponseDTO(response.getField(), response.getValue())).toList();

		return new TicketResponseDTO(ticket.getId(), ticketProperties, formDTO, fieldAnswers);
	}
}
