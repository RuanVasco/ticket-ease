package com.chamados.api.Controllers;

import com.chamados.api.Entities.UserThemePreference;
import com.chamados.api.Repositories.UserThemePreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Components.UserDetailsImpl;
import com.chamados.api.DTO.LoginDTO;
import com.chamados.api.DTO.LoginResponseDTO;
import com.chamados.api.DTO.RegisterDTO;
import com.chamados.api.DTO.ValidateDTO;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Repositories.UserRepository;
import com.chamados.api.Services.TokenService;

import jakarta.validation.Valid;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserThemePreferenceRepository userThemePreferenceRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDTO data) {		
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        Authentication auth = authenticationManager.authenticate(usernamePassword);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userDetails.getUser();
        
        if (user == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não encontrado");
        
        var token = tokenService.generateToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        
        return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken));        
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO signUpDto){       

        if (userRepository.existsByEmail(signUpDto.getEmail())){
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(signUpDto.getName());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        
        Optional<Role> defaultRole = roleRepository.findByName("ROLE_USER");
        
        user.setRoles(Collections.singleton(defaultRole.get()));

        userRepository.save(user);

        if (userThemePreferenceRepository.findByUserId(user.getId()).isEmpty()) {
            UserThemePreference preference = new UserThemePreference();
            preference.setUserId(user.getId());
            preference.setTheme("light");
            userThemePreferenceRepository.save(preference);
        }

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);

    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        var refreshToken = request.get("refreshToken");

        if (refreshToken == null || tokenService.validateToken(refreshToken) == "") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
        }
        
        var email = tokenService.validateToken(refreshToken);		
		User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found");
        }

        var newToken = tokenService.generateToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(newToken, refreshToken));
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody @Valid ValidateDTO token) {    	
    	if (tokenService.validateToken(token.token()) != "") {
    		return ResponseEntity.ok().build();
    	} else {
    		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("invalid token");
    	}
    }
}