package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.UserFavoriteForms;
import com.ticketease.api.Entities.UserRecentForms;
import java.time.LocalDateTime;

public record UserFormLinkDTO(FormResponseDTO form, LocalDateTime accessedAt) {
  public static UserFormLinkDTO fromUserRecentForms(UserRecentForms entity) {
    return new UserFormLinkDTO(FormResponseDTO.from(entity.getForm()), entity.getAccessedAt());
  }

  public static UserFormLinkDTO fromUserFavoriteForms(UserFavoriteForms entity) {
    return new UserFormLinkDTO(FormResponseDTO.from(entity.getForm()), null);
  }
}
