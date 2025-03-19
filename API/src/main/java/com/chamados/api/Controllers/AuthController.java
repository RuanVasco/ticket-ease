package com.chamados.api.Controllers;

import com.chamados.api.Entities.Permission;
import com.chamados.api.Entities.Role;
import com.chamados.api.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.DTO.LoginDTO;
import com.chamados.api.DTO.LoginResponseDTO;
import com.chamados.api.DTO.ValidateDTO;
import com.chamados.api.Entities.User;
import com.chamados.api.Services.TokenService;

import jakarta.validation.Valid;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    private CargoRepository cargoRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        Authentication auth = authenticationManager.authenticate(usernamePassword);

        User user = (User) auth.getPrincipal();

        if (user == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não encontrado");

        var token = tokenService.generateAccessToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        
        return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken));        
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        var refreshToken = request.get("refreshToken");

        if (refreshToken == null || tokenService.validateToken(refreshToken) == "") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
        }
        
        var email = tokenService.validateToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found");
        }

        var newToken = tokenService.generateAccessToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(newToken, refreshToken));
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody @Valid ValidateDTO token) {
    	if (!Objects.equals(tokenService.validateToken(token.token()), "")) {
    		return ResponseEntity.ok().build();
    	} else {
    		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("invalid token");
    	}
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> getPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(403).build();
        }

        Set<Role> roles = user.getRoles();

        List<Permission> permissions = roles.stream()
                .flatMap(role -> role.getPermissions() != null ? role.getPermissions().stream() : Stream.empty())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(permissions);
    }
}