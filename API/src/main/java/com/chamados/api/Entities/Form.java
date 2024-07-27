package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "forms")
@Getter
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @ManyToOne
    @JoinColumn(name = "ticketCategory")
    @Setter
    private TicketCategory ticketCategory;

    public Form(String name, TicketCategory ticketCategory) {
        this.name = name;
        this.ticketCategory = ticketCategory;
    }

    public Form() {
    }
}
