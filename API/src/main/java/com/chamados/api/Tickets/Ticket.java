package com.chamados.api.Tickets;

import com.chamados.api.Entities.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Ticket implements Serializable {
    
    @Id    
    private Long id;
    private String assunto;
    private String descricao; 
    
    @ManyToOne
    private User user;
}
