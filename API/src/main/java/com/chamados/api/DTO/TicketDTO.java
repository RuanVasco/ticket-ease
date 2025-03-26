package com.chamados.api.DTO;

import com.chamados.api.DTO.User.UserDTO;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
public class TicketDTO extends RepresentationModel<TicketDTO> {
    private Long id;
    private String name;
    private String description;
    private String observation;
    private String status;
    private String urgency;
    private String categoryPath;
    private Boolean receiveEmail;
    private Date createdAt;
    private Date updatedAt;
    private Date closedAt;
    private TicketCategoryDTO ticketCategory;
    private UserDTO user;
    private Set<UserDTO> observers;
}