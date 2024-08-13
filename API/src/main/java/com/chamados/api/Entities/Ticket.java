package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Date;

@Getter
@Entity
@Table(name="ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Setter
//    @ManyToOne
//    @JoinColumn(name = "form_id")
//    Form form;

    @Setter
    @ManyToOne
    @JoinColumn(name = "category_id")
    TicketCategory ticketCategory;

    @Setter
    private String name;

    @Setter
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
}
