package com.ticketease.api.Entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class TicketAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String fileType;
    private String filePath;

    @ManyToOne
    private Ticket ticket;

    private Date uploadedAt;
}
