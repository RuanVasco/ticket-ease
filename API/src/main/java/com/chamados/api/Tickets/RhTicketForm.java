package com.chamados.api.Tickets;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "RhTickets")
@Getter
@Setter
public class RhTicketForm extends Ticket {
    @Column(nullable = false)
    private String aaaaa;
}
