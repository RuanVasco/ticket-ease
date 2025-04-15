package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Enums.ApprovalModeEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

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