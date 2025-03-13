package com.chamados.api.DTO;

import java.util.List;

public record UserRegisterDTO(String name, String phone, String email, String password, Long cargoId, Long departmentId, List<Long> profiles) {
}
