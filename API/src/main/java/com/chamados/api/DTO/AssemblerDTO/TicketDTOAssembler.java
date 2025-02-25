package com.chamados.api.DTO.AssemblerDTO;

import com.chamados.api.Controllers.TicketController;
import com.chamados.api.DTO.TicketDTO;
import com.chamados.api.DTO.TicketCategoryDTO;
import com.chamados.api.DTO.UserDTO;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.TicketCategory;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TicketDTOAssembler implements RepresentationModelAssembler<Ticket, TicketDTO> {

    @Override
    public TicketDTO toModel(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setName(ticket.getName());
        dto.setDescription(ticket.getDescription());
        dto.setObservation(ticket.getObservation());
        dto.setStatus(ticket.getStatus());
        dto.setUrgency(ticket.getUrgency());
        dto.setReceiveEmail(ticket.getReceiveEmail());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setClosedAt(ticket.getClosedAt());

        if (ticket.getTicketCategory() != null) {
            dto.setTicketCategory(new TicketCategoryDTO(ticket.getTicketCategory()));

            dto.setCategoryPath((ticket.getTicketCategory().getPath()));
        }

        if (ticket.getUser() != null) {
            dto.setUser(new UserDTO(
                    ticket.getUser().getId(),
                    ticket.getUser().getName(),
                    ticket.getUser().getEmail(),
                    ticket.getUser().getPhone()
            ));
        }

        Set<UserDTO> observers = ticket.getObservers().stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getPhone()))
                .collect(Collectors.toSet());
        dto.setObservers(observers);

        dto.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(TicketController.class)
                .getTicketById(ticket.getId())).withSelfRel());

        return dto;
    }
}
