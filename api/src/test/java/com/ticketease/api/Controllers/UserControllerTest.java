package com.ticketease.api.Controllers;

import com.ticketease.api.DTO.UserPreferenceDTO.UserPreferenceResponseDTO;
import com.ticketease.api.Exceptions.ResourceNotFoundException;
import com.ticketease.api.Repositories.*;
import com.ticketease.api.Services.CustomUserDetailsService;
import com.ticketease.api.Services.FileStorageService;
import com.ticketease.api.Services.TokenService;
import com.ticketease.api.Services.UserPreferenceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@WithMockUser
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserPreferenceService userPreferenceService;

	@MockBean
	private TokenService tokenService;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private UserRoleDepartmentRepository userRoleDepartmentRepository;

	@MockBean
	private CustomUserDetailsService customUserDetailsService;

	@MockBean
	private CargoRepository cargoRepository;

	@MockBean
	private DepartmentRepository departmentRepository;

	@MockBean
	private RoleRepository roleRepository;

	@MockBean
	private PasswordEncoder passwordEncoder;

	@MockBean
	private FileStorageService fileStorageService;

	@Test
	void should_returnOkAndPreferences_when_gettingPreferencesForExistingUser() throws Exception {
		Long existingUserId = 1L;
		UserPreferenceResponseDTO mockDto = new UserPreferenceResponseDTO(10L, "theme", "dark");
		List<UserPreferenceResponseDTO> mockResponse = List.of(mockDto);

		when(userPreferenceService.getPreferencesByUserId(existingUserId)).thenReturn(mockResponse);

		mockMvc.perform(get("/users/{userId}/preferences", existingUserId)
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isArray())
			.andExpect(jsonPath("$[0].key").value("theme"));
	}

	@Test
	void should_returnNotFound_when_gettingPreferencesForNonExistingUser() throws Exception {
		Long nonExistingUserId = 999L;

		when(userPreferenceService.getPreferencesByUserId(nonExistingUserId))
			.thenThrow(new ResourceNotFoundException("Usuário não encontrado"));

		mockMvc.perform(get("/users/{userId}/preferences", nonExistingUserId)
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isNotFound());
	}
}
