package com.ticketease.api.Services;

import com.ticketease.api.DTO.UserPreferenceDTO.UserPreferenceResponseDTO;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserPreference;
import com.ticketease.api.Exceptions.ResourceNotFoundException;
import com.ticketease.api.Repositories.UserPreferenceRepository;
import com.ticketease.api.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {
	private final UserPreferenceRepository userPreferenceRepository;
	private final UserRepository userRepository;

	public List<UserPreferenceResponseDTO> getPreferencesByUserId(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + userId));

		List<UserPreference> preferences = userPreferenceRepository.findByUser(user);

		return preferences.stream().map(UserPreferenceResponseDTO::from).toList();
	}
}
