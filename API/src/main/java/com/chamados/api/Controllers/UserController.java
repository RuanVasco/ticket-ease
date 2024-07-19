package com.chamados.api.Controllers;

import com.chamados.api.DTO.UserDTO;
import com.chamados.api.Services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chamados.api.Repositories.UserRepository;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService userService;


    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userRepository.findAllWithoutPassword());
    }

    @GetMapping("/{userID}")
    public UserDTO getUser(@PathVariable Long userID) {
        return userService.getUser(userID);
    }

    @DeleteMapping("/{userID}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userID) {
       userRepository.deleteById(userID);
       return ResponseEntity.noContent().build();
    }
}
