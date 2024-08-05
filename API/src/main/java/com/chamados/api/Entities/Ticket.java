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

    @Setter
    @ManyToOne
    @JoinColumn(name = "form_id")
    Form form;

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
    @Column(nullable = true)
    private String procedure;

    @Setter
    private String status;

    @Setter
    private String urgency;

    @Setter
    private Boolean receiveEmail;

    @Setter
    private Date created_at;

    @Setter
    @Column(nullable = true)
    private Date updated_at;

    @Setter
    @Column(nullable = true)
    private Date closed_at;
}
