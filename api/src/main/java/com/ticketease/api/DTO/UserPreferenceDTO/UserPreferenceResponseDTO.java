package com.ticketease.api.DTO.UserPreferenceDTO;

import com.ticketease.api.DTO.User.UserResponseDTO;
import com.ticketease.api.Entities.User;

public record UserPreferenceResponseDTO(
	UserResponseDTO userResponseDTO
) {
	public static UserPreferenceResponseDTO from(User user) {
		return new UserPreferenceResponseDTO(UserResponseDTO.from(user));
	}
}
