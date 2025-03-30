package com.ticketease.api.Entities;

import jakarta.persistence.*;

@Entity
public class FieldResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fieldName;

    private String response;

    @ManyToOne
    private FormSubmission submission;
}
