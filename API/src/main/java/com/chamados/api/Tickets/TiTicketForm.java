package com.chamados.api.Tickets;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "TiTickets")
@Getter
@Setter
public class TiTicketForm extends Ticket {
    @Column(nullable = false)
    private String teste;
}
