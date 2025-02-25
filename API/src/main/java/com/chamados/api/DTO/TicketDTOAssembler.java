package com.chamados.api.DTO;

import com.chamados.api.Controllers.TicketController;
import com.chamados.api.Entities.Ticket;
import com.chamados.api.Entities.TicketCategory;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class TicketDTOAssembler implements RepresentationModelAssembler<Ticket, TicketDTO> {

    @Override
    public TicketDTO toModel(Ticket ticket) {
        String categoryPath = getCategoryPath(ticket.getTicketCategory());

        TicketDTO dto = new TicketDTO(
                ticket.getId(),                         // ID do ticket
                ticket.getName(),                       // Assunto do ticket
                ticket.getDescription(),                // Descrição do ticket
                ticket.getObservation(),                // Observação do ticket
                ticket.getStatus(),                     // Status do ticket
                ticket.getUrgency(),                    // Urgência do ticket
                ticket.getReceiveEmail(),               // Receber email
                categoryPath                            // Caminho da categoria
        );

        dto.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(TicketController.class)
                .getTicketById(ticket.getId())).withSelfRel());

        return dto;
    }

    private String getCategoryPath(TicketCategory ticketCategory) {
        return ticketCategory != null ? ticketCategory.getPath() : "";
    }
}
