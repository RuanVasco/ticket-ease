package com.ticketease.api.Enums;

public enum StatusEnum {
    PENDING_APPROVAL("Aguardando Aprovação"),
    NEW("Novo"),
    IN_PROGRESS("Em Andamento"),
    PENDING("Pendente"),
    RESOLVED("Resolvido"),
    CLOSED("Fechado"),
    CANCELED("Cancelado");

    private final String label;

    StatusEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
