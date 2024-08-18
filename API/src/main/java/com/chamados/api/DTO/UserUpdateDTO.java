package com.chamados.api.DTO;

public record UserUpdateDTO(String name, String email, String phone, Boolean isAdmin, String password, Long role_id, Long departmentId, Long cargoId) {

}
