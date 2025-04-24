package com.ticketease.api.Entities;

import com.ticketease.api.Entities.Embeddables.UserLinkFormsId;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserRecentForms {

  @EmbeddedId private UserLinkFormsId id = new UserLinkFormsId();

  @MapsId("userId")
  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @MapsId("formId")
  @ManyToOne(optional = false)
  @JoinColumn(name = "form_id")
  private Form form;

  @Column(nullable = false)
  private LocalDateTime accessedAt;
}
