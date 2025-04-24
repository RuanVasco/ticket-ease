package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ticketease.api.Enums.StatusEnum;
import com.ticketease.api.Enums.UrgencyEnum;
import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "ticket")
public class Ticket {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Setter
  @ManyToOne
  @JoinColumn(name = "user_id")
  User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Setter
  private UrgencyEnum urgency;

  @ManyToMany
  @Setter
  @JoinTable(
      name = "ticket_observers",
      joinColumns = @JoinColumn(name = "ticket_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id"))
  private Set<User> observers = new HashSet<>();

  @Setter private StatusEnum status;

  @Setter private Boolean receiveEmail;

  @Setter
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "createdAt")
  private Date createdAt;

  @Setter
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "updatedAt", nullable = true)
  private Date updatedAt;

  @Setter
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "closedAt", nullable = true)
  private Date closedAt;

  @Setter
  @ManyToOne
  @JoinColumn(name = "form_id")
  private Form form;

  @Setter
  @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<TicketResponse> responses;

  @Setter
  @ManyToOne
  @JoinColumn(name = "approved_by_id")
  private User approvedBy;

  @Setter
  @Temporal(TemporalType.TIMESTAMP)
  private Date approvalDate;

  public boolean canManage(User user) {
    Department department = this.getDepartment();

    if (department == null) {
      return false;
    }

    return user.hasPermission("MANAGE_TICKET", department)
        || user.hasPermission("MANAGE_TICKET", null);
  }

  public Department getDepartment() {
    return this.form.getDepartment();
  }
}
