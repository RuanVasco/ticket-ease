package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Enums.ApprovalModeEnum;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormDTO {
  private String title;
  private String description;
  private Long ticketCategoryId;
  private List<Long> approvers;
  private ApprovalModeEnum approvalMode;
  private List<FormFieldDTO> fields;
}
