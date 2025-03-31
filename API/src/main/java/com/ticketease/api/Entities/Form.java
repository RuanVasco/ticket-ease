package com.ticketease.api.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TicketCategory ticketCategory;

    private String title;

    private String description;

    @ManyToOne
    private User creator;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<FormField> fields = new ArrayList<>();

    public Form(TicketCategory ticketCategory, String title, String description, User user, List<FormField> fields) {
        this.ticketCategory = ticketCategory;
        this.title = title;
        this.description = description;
        this.creator = user;
        this.fields = fields;
    };

    public Form() {};

    public Department getDepartment() {
        return this.ticketCategory.getDepartment();
    }
}
