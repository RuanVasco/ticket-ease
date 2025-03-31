package com.ticketease.api.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Date;
import java.util.Set;

@Getter
@Entity
@Table(name="ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @ManyToMany
    @JoinTable(
            name = "ticket_observers",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> observers = new HashSet<>();

    @Setter
    private String status;

    @Setter
    private Boolean receiveEmail;

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
    private List<TicketResponse> responses;

    public boolean canManage(User user) {
        Department department = this.getDepartment();

        if (department == null) {
            return false;
        }

        return user.hasPermission("MANAGE_TICKET", department) || user.hasPermission("MANAGE_TICKET", null);
    }

    public Set<User> getRelatedUsers() {
        Set<User> relatedUsers = new HashSet<>();

        Department department = this.getDepartment();

        for (UserRoleDepartment binding : department.getRoleBindings()) {
            User user = binding.getUser();
            if (user.hasPermission("MANAGE_TICKET", department)) {
                relatedUsers.add(user);
            }
        }

        relatedUsers.addAll(this.getObservers());
        relatedUsers.add(this.user);

        return relatedUsers;
    }


    public Department getDepartment() {
        return this.form.getDepartment();
    }

}
