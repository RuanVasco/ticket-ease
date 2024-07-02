package com.chamados.api.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chamados.api.Repositories.UserRepository;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userRepository.findAllWithoutPassword());
    }
}
