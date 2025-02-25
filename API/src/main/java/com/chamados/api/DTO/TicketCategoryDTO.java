package com.chamados.api.DTO;

import com.chamados.api.Entities.TicketCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCategoryDTO {
    private Long id;
    private String name;
    private Boolean receiveTickets;
    private Long departmentId;
    private Long fatherId;

    public TicketCategoryDTO() {
    }

    public TicketCategoryDTO(Long id, String name, Boolean receiveTickets, Long departmentId, Long fatherId) {
        this.id = id;
        this.name = name;
        this.receiveTickets = receiveTickets;
        this.departmentId = departmentId;
        this.fatherId = fatherId;
    }

    public TicketCategoryDTO(TicketCategory category) {
        this.id = category.getId();
        this.name = category.getName();
        this.receiveTickets = category.getReceiveTickets();
        this.departmentId = (category.getDepartment() != null) ? category.getDepartment().getId() : null;
        this.fatherId = (category.getFather() != null) ? category.getFather().getId() : null;
    }
}
