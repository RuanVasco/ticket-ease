package com.chamados.api.Tickets;

import com.chamados.api.Entities.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String assunto;

    @Lob
    @Column
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private User user;
}
