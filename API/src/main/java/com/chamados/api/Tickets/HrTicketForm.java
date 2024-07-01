package com.chamados.api.Tickets;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "HrTickets")
@Getter
@Setter
public class HrTicketForm extends Ticket {
    @Column(nullable = false)
    private String aaaaa;
}
