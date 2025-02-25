package com.chamados.api.Entities;

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
    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull(message = "Name cannot be null")
    TicketCategory ticketCategory;

    @Setter
    @NotNull(message = "Name cannot be null")
    @Column(nullable = false)
    private String name;

    @Setter
    @NotNull(message = "Name cannot be null")
    @Column(nullable = false)
    private String description;

    @Setter
    @Column(nullable = true)
    private String observation;

    @Setter
    @ElementCollection
    @CollectionTable(name = "ticket_files", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "file_path")
    private List<String> filePaths;

    @Setter
    private String status;

    @Setter
    private String urgency;

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

    public static boolean canView(User user) {
        return user.hasPermission("VIEW_TICKET");
    }

    public static boolean canEdit(User user) {
        return user.hasPermission("EDIT_TICKET");
    }

    public static boolean canDelete(User user) {
        return user.hasPermission("DELETE_TICKET");
    }

    public boolean canManage(User user) {
        Department department = this.getDepartment();

        return this.user.equals(user) ||
                this.observers.contains(user) ||
                (user.getDepartment() != null && user.getDepartment().equals(department) && canEdit(user));
    }

    public Department getDepartment() {
        TicketCategory ticketedCategory = this.getTicketCategory();
        Department department = null;

        while (ticketedCategory != null && ticketedCategory.getDepartment() == null) {
            ticketedCategory = ticketedCategory.getFather();
        }

        if (ticketedCategory != null) {
            department = ticketedCategory.getDepartment();
        }

        return department;
    }

}
