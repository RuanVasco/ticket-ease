package com.chamados.api.DTO;

public record UserRegisterDTO(String name, String phone, Boolean isAdmin, String email, String password, Long cargoId, Long departmentId) {
}
