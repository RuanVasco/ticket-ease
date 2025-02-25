package com.chamados.api.DTO;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

@Getter
@Setter
public class TicketDTO extends RepresentationModel<TicketDTO> {

    private Long ticketCategory_id;
    private String name;
    private String description;
    private String observation;
    private String status;
    private String urgency;
    private Boolean receiveEmail;

    public TicketDTO(Long ticketCategory_id, String name, String description, String observation, String status, String urgency, Boolean receiveEmail, String categoryPath) {
        this.ticketCategory_id = ticketCategory_id;
        this.name = name;
        this.description = description;
        this.observation = observation;
        this.status = status;
        this.urgency = urgency;
        this.receiveEmail = receiveEmail;
    }

}
