package com.ticketease.api.Services;

import com.ticketease.api.DTO.UserPreferenceDTO.UserPreferenceResponseDTO;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserPreference;
import com.ticketease.api.Exceptions.ResourceNotFoundException;
import com.ticketease.api.Repositories.UserPreferenceRepository;
import com.ticketease.api.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserPreferenceServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private UserPreferenceRepository preferencesRepository;

	@InjectMocks
	private UserPreferenceService userPreferenceService;

	@Test
	void should_returnPreferences_when_userExists() {
		Long userId = 1L;
		User mockUser = new User();

		UserPreference mockPrefs = new UserPreference();
		mockPrefs.setId(100L);
		mockPrefs.setKey("theme");
		mockPrefs.setValue("dark");
		mockPrefs.setUser(mockUser);

		when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
		when(preferencesRepository.findByUser(mockUser)).thenReturn(List.of(mockPrefs));

		List<UserPreferenceResponseDTO> result = userPreferenceService.getPreferencesByUserId(userId);

		assertNotNull(result);
		assertEquals(1, result.size());

		UserPreferenceResponseDTO resultDTO = result.getFirst();

		assertEquals(100L, resultDTO.id());
		assertEquals("theme", resultDTO.key());
		assertEquals("dark", resultDTO.value());
	}

	@Test
	void should_throwResourceNotFoundException_when_userDoesNotExist() {
		Long userId = 99L;
		when(userRepository.findById(userId)).thenReturn(Optional.empty());

		assertThrows(ResourceNotFoundException.class, () -> {
			userPreferenceService.getPreferencesByUserId(userId);
		});
	}
}
