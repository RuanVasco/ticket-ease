package com.ticketease.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TicketCategory ticketCategory;

    private String title;

    private String description;

    @ManyToOne
    private User creator;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormField> fields = new ArrayList<>();

    public Form(TicketCategory ticketCategory, String title, String description, User user, List<FormField> fields) {
        this.ticketCategory = ticketCategory;
        this.title = title;
        this.description = description;
        this.creator = user;
        this.fields = fields;
    };
}
