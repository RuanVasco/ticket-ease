package com.ticketease.api.DTO.UserPreferenceDTO;

import com.ticketease.api.Entities.UserPreference;

public record UserPreferenceResponseDTO(
	Long id,
	String key,
	String value
) {
	public static UserPreferenceResponseDTO from(UserPreference userPreference) {
		return new UserPreferenceResponseDTO(
			userPreference.getId(),
			userPreference.getKey(),
			userPreference.getValue()
		);
	}
}
