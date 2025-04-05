package com.ticketease.api.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Option {
    private String label;

    @Column(name = "option_value")
    private String value;

    public Option(String label, String value) {
    }

    public Option() {
    }
}
