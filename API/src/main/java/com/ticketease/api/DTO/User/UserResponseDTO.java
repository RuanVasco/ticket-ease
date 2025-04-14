package com.ticketease.api.DTO.User;

import com.ticketease.api.Entities.User;

public record UserResponseDTO(
        Long id,
        String name,
        String phone,
        String email,
        String cargoName
) {
    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getPhone(),
                user.getEmail(),
                user.getCargo() != null ? user.getCargo().getName() : null
        );
    }
}
