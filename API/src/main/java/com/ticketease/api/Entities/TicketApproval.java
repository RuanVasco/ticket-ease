package com.ticketease.api.Entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class TicketApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Ticket ticket;

    @ManyToOne
    private User user;

    private boolean approved;

    private Date validatedAt;
}
