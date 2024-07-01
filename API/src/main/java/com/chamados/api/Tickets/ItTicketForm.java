package com.chamados.api.Tickets;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ItTickets")
@Getter
@Setter
public class ItTicketForm extends Ticket {
    @Column(nullable = false)
    private String teste;
}
