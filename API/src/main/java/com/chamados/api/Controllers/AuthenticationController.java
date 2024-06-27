package com.chamados.api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.AuthenticationDTO;
import com.chamados.api.RegisterDTO;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
		var emailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
		var auth = this.authenticationManager.authenticate(emailPassword);
		
		return ResponseEntity.ok().build();
    }
	
	@PostMapping("/register")
	public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
		if (this.userRepository.findByEmail(data.email()) != null) return ResponseEntity.badRequest().build();
		
		String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
		User newUser = new User(data.name(), data.email(), encryptedPassword, data.role());
	}
}
