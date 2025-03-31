package com.ticketease.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TicketResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private FormField field;

    @Column(name = "field_value")
    private String value;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
}
