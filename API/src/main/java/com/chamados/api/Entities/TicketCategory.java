package com.chamados.api.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name="ticket_category")
public class TicketCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String name;

    @Setter
    private String path;

    @Setter
    private Boolean receiveTickets;

    @Setter
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = true)
    private Department department;

    @Setter
    @ManyToOne
    @JoinColumn(name = "father_id", nullable = true)
    private TicketCategory father;
}
