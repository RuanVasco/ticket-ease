package com.ticketease.api.DTO;

import com.ticketease.api.Entities.TicketCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCategoryDTO {
  private Long id;
  private String name;
  private Long departmentId;
  private Long fatherId;

  public TicketCategoryDTO() {}

  public TicketCategoryDTO(Long id, String name, Long departmentId, Long fatherId) {
    this.id = id;
    this.name = name;
    this.departmentId = departmentId;
    this.fatherId = fatherId;
  }

  public TicketCategoryDTO(TicketCategory category) {
    this.id = category.getId();
    this.name = category.getName();
    this.departmentId =
        (category.getDepartment() != null) ? category.getDepartment().getId() : null;
    this.fatherId = (category.getFather() != null) ? category.getFather().getId() : null;
  }
}
