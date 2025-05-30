package com.ticketease.api.Controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketease.api.DTO.User.UserDTO;
import com.ticketease.api.Entities.Department;
import com.ticketease.api.Entities.Role;
import com.ticketease.api.Entities.User;
import com.ticketease.api.Entities.UserRoleDepartment;
import com.ticketease.api.Repositories.*;
import com.ticketease.api.Services.CustomUserDetailsService;
import com.ticketease.api.Services.FileStorageService;
import com.ticketease.api.Services.TokenService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
@WithMockUser
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private UserRepository userRepository;
	@MockBean
	private TokenService tokenService;
	@MockBean
	private FileStorageService fileStorageService;
	@MockBean
	private CustomUserDetailsService userService;
	@MockBean
	private CargoRepository cargoRepository;
	@MockBean
	private DepartmentRepository departmentRepository;
	@MockBean
	private RoleRepository roleRepository;
	@MockBean
	private PasswordEncoder passwordEncoder;
	@MockBean
	private UserRoleDepartmentRepository userRoleDepartmentRepository;

	@Test
	void testGetAllUsers() throws Exception {
		mockMvc.perform(get("/users")).andExpect(status().isOk());
	}
}
