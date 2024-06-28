package com.chamados.api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.DTO.LoginDTO;
import com.chamados.api.DTO.RegisterDTO;
import com.chamados.api.Entities.Role;
import com.chamados.api.Entities.User;
import com.chamados.api.Repositories.RoleRepository;
import com.chamados.api.Repositories.UserRepository;

import jakarta.validation.Valid;

import java.util.Collections;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDTO data) {		
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(data.email(), data.password()));
		
        SecurityContextHolder.getContext().setAuthentication(authentication);
		return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO signUpDto){       

        // add check for email exists in DB
        if (userRepository.existsByEmail(signUpDto.getEmail())){
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(signUpDto.getName());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));        

        Optional<Role> userRole = roleRepository.findByName(signUpDto.getRole());
        if (userRole.isPresent()) {
            user.setRoles(Collections.singleton(userRole.get()));
        } else {
            return new ResponseEntity<>("Role not found", HttpStatus.BAD_REQUEST);
        } 

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);

    }
}