package com.chamados.api.DTO;

import java.util.List;

public record UserUpdateDTO(String name, String email, String phone, String password, Long role_id, Long departmentId, Long cargoId, List<Long> profiles) {

}
