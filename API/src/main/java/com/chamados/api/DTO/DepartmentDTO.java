package com.chamados.api.DTO;

public class DepartmentDTO {
    private Long id;
    private String name;
    private boolean receivesRequests;

    public DepartmentDTO(Long id, String name, boolean receivesRequests) {
        this.id = id;
        this.name = name;
        this.receivesRequests = receivesRequests;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isReceivesRequests() {
        return receivesRequests;
    }

    public void setReceivesRequests(boolean receivesRequests) {
        this.receivesRequests = receivesRequests;
    }
}