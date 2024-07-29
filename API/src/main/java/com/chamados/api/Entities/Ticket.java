package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.awt.*;
import java.util.Date;

@Getter
@Entity
@Table(name="ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @Setter
    private TextArea description;

    @Setter
    @Column(nullable = true)
    private TextArea observation;

    @Setter
    @Column(nullable = true)
    private TextArea procedure;

    @Setter
    private String status;

    @Setter
    private String urgency;

    @Setter
    private Boolean receiveEmail;

    @Setter
    private Date created_at;

    @Setter
    private Date updated_at;

    @Setter
    @Column(nullable = true)
    private Date closed_at;
}
